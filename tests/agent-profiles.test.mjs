import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getViteConfig } from 'astro/config';
import { createServer } from 'vite';
import {
  agentProfileSchema,
  AGENT_COLOR_HEX,
  assertAgentTranslationMatches,
  getAgentAvatarIds,
} from '../src/lib/agent-profiles.mjs';

const profile = {
  id: 'profile-fixture',
  display_name: 'Profile fixture',
  role_tagline: 'Role fixture',
  color: 'blue',
};

const detail = { label: 'Label fixture', text: 'Text fixture' };
const job = {
  id: 'job-fixture',
  title: 'Job fixture',
  summary: 'Summary fixture',
  trigger: detail,
  deliverable: detail,
  scope: detail,
  approval_boundary: detail,
  example_request: detail,
};

const legacyProfiles = [
  ['automation-engineer', 'Automation Engineer'],
  ['content', 'Content'],
  ['docs-editor', 'Docs Editor'],
  ['echo', 'Echo'],
  ['librarian', 'Librarian'],
  ['luna', 'Luna'],
  ['recruiter', 'Recruiter'],
  ['research', 'Research'],
  ['security-reviewer', 'Security Reviewer'],
  ['senior-pm', 'Senior PM'],
  ['social', 'Social'],
  ['teaching-prep', 'Professor'],
  ['ux-designer', 'UX Designer'],
];

test('profiles do not require a Discord account, mention, model, or plugin URL', () => {
  const parsed = agentProfileSchema.parse(profile);
  for (const field of ['client_id', 'discord_mention', 'model', 'plugin_file_url']) {
    assert.equal(parsed[field], undefined);
  }
  assert.deepEqual(parsed.jobs, []);
  assert.deepEqual(parsed.tools, []);
  assert.deepEqual(parsed.operating_principles, []);
  assert.equal(parsed.is_orchestrator, false);
});

test('legacy declared metadata remains compatible without changing runtime state', () => {
  const parsed = agentProfileSchema.parse({
    ...profile,
    client_id: '123456789',
    discord_mention: '@profile-fixture',
    model: 'declared-model-fixture',
    plugin_file_url: 'https://example.com/fixture.md',
  });
  assert.equal(parsed.model, 'declared-model-fixture');
  assert.equal(parsed.plugin_file_url, 'https://example.com/fixture.md');
  assert.equal(parsed.runtime, undefined);
});

test('optional metadata must still be nonempty and plugin links must be URLs', () => {
  for (const field of ['description', 'client_id', 'discord_mention', 'model', 'plugin_file_url']) {
    assert.equal(agentProfileSchema.safeParse({ ...profile, [field]: '' }).success, false);
  }
  assert.equal(agentProfileSchema.safeParse({ ...profile, plugin_file_url: 'not-a-url' }).success, false);
  assert.equal(agentProfileSchema.parse({ ...profile, description: 'Description fixture' }).description, 'Description fixture');
});

test('job cards require reviewed details and labels instead of template-generated copy', () => {
  const parsed = agentProfileSchema.parse({ ...profile, jobs: [job] });
  assert.deepEqual(parsed.jobs, [job]);
  for (const field of ['trigger', 'deliverable', 'scope', 'approval_boundary', 'example_request']) {
    const incomplete = { ...job };
    delete incomplete[field];
    assert.equal(agentProfileSchema.safeParse({ ...profile, jobs: [incomplete] }).success, false);
    assert.equal(agentProfileSchema.safeParse({
      ...profile, jobs: [{ ...job, [field]: { label: '', text: 'Text fixture' } }],
    }).success, false);
    assert.equal(agentProfileSchema.safeParse({
      ...profile, jobs: [{ ...job, [field]: { label: 'Label fixture', text: '' } }],
    }).success, false);
  }
});

test('job IDs are stable, unique within a profile, and preserve author ordering', () => {
  const second = { ...job, id: 'second-job-fixture' };
  assert.deepEqual(agentProfileSchema.parse({ ...profile, jobs: [second, job] }).jobs, [second, job]);
  const duplicate = agentProfileSchema.safeParse({ ...profile, jobs: [job, job] });
  assert.equal(duplicate.success, false);
  assert.deepEqual(duplicate.error.issues[0].path, ['jobs', 1, 'id']);
  assert.equal(agentProfileSchema.safeParse({
    ...profile, jobs: [{ ...job, id: '../bad-id' }],
  }).success, false);
  assert.equal(agentProfileSchema.safeParse({ ...profile, id: '../bad-id' }).success, false);
});

test('localized profiles must keep the same identity and job IDs in the same order', () => {
  const primary = agentProfileSchema.parse({
    ...profile, jobs: [job, { ...job, id: 'second-job-fixture' }],
  });
  const translated = agentProfileSchema.parse({
    ...primary,
    role_tagline: 'Translated role fixture',
    jobs: primary.jobs.map(item => ({ ...item, title: 'Translated job fixture' })),
  });
  assert.doesNotThrow(() => assertAgentTranslationMatches(primary, translated));
  assert.doesNotThrow(() => assertAgentTranslationMatches(
    agentProfileSchema.parse(profile), agentProfileSchema.parse(profile),
  ));
  assert.throws(() => assertAgentTranslationMatches(primary, { ...translated, id: 'other-profile' }), /translation ID must match/);
  assert.throws(() => assertAgentTranslationMatches(primary, { ...translated, jobs: [] }), /job IDs and order must match/);
  assert.throws(() => assertAgentTranslationMatches(primary, { ...translated, jobs: [...translated.jobs].reverse() }), /job IDs and order must match/);
  assert.throws(() => assertAgentTranslationMatches(primary, {
    ...translated, jobs: [job, { ...job, id: 'different-job-fixture' }],
  }), /job IDs and order must match/);
});

test('job cards render reviewed labels, escaped text, and separate locale headings', async t => {
  const config = await getViteConfig({
    server: { middlewareMode: true, hmr: false, watch: null },
    logLevel: 'error',
  })({ mode: 'test', command: 'serve' });
  const server = await createServer(config);
  t.after(() => server.close());
  const { default: AgentJobs } = await server.ssrLoadModule('/src/components/AgentJobs.astro');
  const container = await AstroContainer.create();
  const jobs = agentProfileSchema.parse({
    ...profile,
    jobs: [
      { ...job, title: 'Title <script>fixture</script>', trigger: { label: 'Trigger fixture', text: 'Text <strong>fixture</strong>' } },
      { ...job, id: 'second-job-fixture' },
    ],
  }).jobs;

  for (const locale of ['en', 'ko']) {
    const html = await container.renderToString(AgentJobs, { props: { jobs, locale } });
    assert.match(html, new RegExp(`aria-labelledby="job-${locale}-job-fixture"`));
    assert.match(html, new RegExp(`id="job-${locale}-job-fixture"`));
    assert.match(html, /Title &lt;script&gt;fixture&lt;\/script&gt;/);
    assert.match(html, /Text &lt;strong&gt;fixture&lt;\/strong&gt;/);
    assert.match(html, />Trigger fixture<\/dt>/);
    assert.equal((html.match(/<dt\b/g) ?? []).length, jobs.length * 5);
    assert.ok(html.indexOf(`id="job-${locale}-job-fixture"`) < html.indexOf(`id="job-${locale}-second-job-fixture"`));
    assert.doesNotMatch(html, /<script>|<strong>/);
  }

  const empty = await container.renderToString(AgentJobs, { props: { jobs: [], locale: 'en' } });
  assert.doesNotMatch(empty, /<section|<h2|<dl/);
});

test('every supported profile color has a shared directory and profile accent', () => {
  for (const color of Object.keys(AGENT_COLOR_HEX)) {
    assert.equal(agentProfileSchema.safeParse({ ...profile, color }).success, true);
    assert.match(AGENT_COLOR_HEX[color], /^#[0-9a-f]{6}$/);
  }
  assert.equal(agentProfileSchema.safeParse({ ...profile, color: 'invalid' }).success, false);
});

test('missing portrait directories are expected, but other filesystem failures surface', async t => {
  await fs.mkdir('.astro', { recursive: true });
  const directory = await fs.mkdtemp(path.resolve('.astro/agent-avatar-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  assert.deepEqual(await getAgentAvatarIds(path.join(directory, 'missing')), new Set());
  await fs.writeFile(path.join(directory, 'profile-fixture.png'), '');
  await fs.writeFile(path.join(directory, 'ignore.txt'), '');
  await fs.mkdir(path.join(directory, 'not-a-file.png'));
  assert.deepEqual(await getAgentAvatarIds(directory), new Set(['profile-fixture']));
  await assert.rejects(getAgentAvatarIds(path.join(directory, 'ignore.txt')), { code: 'ENOTDIR' });
});

test('avatar refresh skips transportless profiles without altering portraits or reading job IDs as profile IDs', async t => {
  await fs.mkdir('.astro', { recursive: true });
  const directory = await fs.mkdtemp(path.resolve('.astro/agent-avatar-script-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const agentsDir = path.join(directory, 'src/content/agents');
  const portraitsDir = path.join(directory, 'public/agents');
  const scriptsDir = path.join(directory, 'scripts');
  await Promise.all([agentsDir, portraitsDir, scriptsDir].map(dir => fs.mkdir(dir, { recursive: true })));
  const script = path.join(scriptsDir, 'fetch-agent-avatars.mjs');
  await fs.copyFile('scripts/fetch-agent-avatars.mjs', script);
  await fs.writeFile(path.join(agentsDir, 'profile-fixture.md'), [
    '---',
    'id: profile-fixture',
    'display_name: Profile fixture',
    'jobs:',
    '  - title: Job fixture',
    '    id: nested-job-fixture',
    '---',
    '',
  ].join('\n'));
  const portrait = path.join(portraitsDir, 'profile-fixture.png');
  const cache = path.join(portraitsDir, '.avatar-hashes.json');
  await fs.writeFile(portrait, 'Portrait fixture');
  await fs.writeFile(cache, '{"profile-fixture":"hash-fixture"}\n');
  const networkBlocker = path.join(directory, 'block-network.mjs');
  await fs.writeFile(networkBlocker, "globalThis.fetch = () => { throw new Error('Unexpected network request in avatar fixture'); };\n");
  const run = promisify(execFile);
  const args = ['--import', pathToFileURL(networkBlocker).href, script, '--only'];
  const options = { env: { DISCORD_BOT_TOKEN: 'fixture-token' } };
  const { stderr } = await run(process.execPath, [...args, 'profile-fixture'], options);
  assert.match(stderr, /profile-fixture: no Discord account metadata/);
  assert.match(stderr, /Existing portraits are unchanged/);
  assert.equal(await fs.readFile(portrait, 'utf8'), 'Portrait fixture');
  assert.equal(await fs.readFile(cache, 'utf8'), '{"profile-fixture":"hash-fixture"}\n');
  await assert.rejects(run(process.execPath, [...args, 'missing-profile-fixture'], options), error => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /No agents to fetch/);
    return true;
  });
});

test('the built directory preserves legacy profiles and leads with role text, not portraits', async () => {
  const html = await fs.readFile('dist/agents/index.html', 'utf8');
  const allProfiles = [...legacyProfiles, ['loid', 'Loid']].sort((a, b) => a[1].localeCompare(b[1]));
  const ids = [...html.matchAll(/<a\b[^>]*href="\/agents\/([^"]+)"[^>]*class="group block[^"]*"[^>]*>/g)].map(match => match[1]);
  assert.deepEqual(ids, allProfiles.map(([id]) => id));
  for (const [id] of allProfiles) {
    const card = html.match(new RegExp(`<a\\b[^>]*href="/agents/${id}"[^>]*>([\\s\\S]*?)</a>`));
    assert.ok(card, `Missing directory link for ${id}`);
    assert.match(card[1], /data-lang="en"/);
    assert.match(card[1], /data-lang="ko" hidden aria-hidden="true" lang="ko"/);
    if (id === 'loid') {
      assert.doesNotMatch(card[1], /<img\b/);
      assert.match(card[1], /aria-hidden="true">\s*L\s*<\/span>/);
    } else {
      assert.ok(card[1].indexOf('<h2') < card[1].indexOf('<img'), `Portrait precedes role for ${id}`);
      assert.match(card[1], new RegExp(`src="/agents/${id}\\.png"`));
    }
  }
  assert.match(html, /data-translate-target="en"/);
  assert.match(html, /data-translate-target="ko"/);
  assert.match(html, /My agent team, organized around the work we do together/);
  assert.match(html, /함께 하는 일을 중심으로 소개하는 제 AI 동료들입니다/);
  assert.match(html, /designing an agent is not the same as granting permissions or putting it into service/);
  assert.match(html, /에이전트를 설계하는 일과 권한을 부여하거나 운영을 시작하는 일은 서로 다릅니다/);
  assert.doesNotMatch(html, /reachable from Discord|ships the new agent end-to-end|most recent addition/);
});

test('all thirteen legacy profile URLs retain English, Korean, names, and unchanged portraits', async () => {
  for (const [id, name] of legacyProfiles) {
    const html = await fs.readFile(`dist/agents/${id}/index.html`, 'utf8');
    assert.ok(/data-lang="en"/.test(html), `Missing English content for ${id}`);
    assert.ok(/data-lang="ko" hidden aria-hidden="true"/.test(html), `Missing hidden Korean content for ${id}`);
    assert.ok(/data-translate-target="en"/.test(html), `Missing English toggle for ${id}`);
    assert.ok(/data-translate-target="ko"/.test(html), `Missing Korean toggle for ${id}`);
    assert.ok(html.includes(name), `Missing name for ${id}`);
    assert.match(html, new RegExp(`src="/agents/${id}\\.png"`));
    assert.ok(html.indexOf('data-lang="en"') < html.indexOf('<aside'), `Portrait precedes job copy for ${id}`);
    assert.doesNotMatch(html, /\/\/ Model|claude-sonnet-4-6/);
    const originalPortrait = await fs.readFile(`public/agents/${id}.png`);
    const builtPortrait = await fs.readFile(`dist/agents/${id}.png`);
    assert.deepEqual(builtPortrait, originalPortrait);
  }
});

test('the three companion profiles render paired jobs, reviewed descriptions, and no superseded inventories', async () => {
  const companions = [
    {
      id: 'luna', jobId: 'daily-operations',
      title: 'Make the day workable', koTitle: '실행 가능한 하루 만들기',
      description: 'A warm, observant colleague who helps turn a crowded day into a clear next move, without confusing a plan with an action already taken.',
    },
    {
      id: 'loid', jobId: 'career-narrative',
      title: 'Find the story in the experience', koTitle: '경험에서 이야기 찾기',
      description: 'A composed, precise collaborator for turning experience into an honest career story and preparing for the conversation ahead.',
    },
    {
      id: 'teaching-prep', jobId: 'teaching-review',
      title: 'Stress-test the learning path', koTitle: '학습 흐름 점검하기',
      description: 'A collegial reviewer who asks what a novice will understand, where the explanation breaks, and whether the lab teaches the same idea.',
    },
  ];
  for (const companion of companions) {
    const html = await fs.readFile(`dist/agents/${companion.id}/index.html`, 'utf8');
    assert.ok(html.includes(`<meta name="description" content="${companion.description}">`), `Missing reviewed metadata for ${companion.id}`);
    assert.ok(html.includes(companion.title), `Missing English job for ${companion.id}`);
    assert.ok(html.includes(companion.koTitle), `Missing Korean job for ${companion.id}`);
    assert.match(html, new RegExp(`aria-labelledby="job-en-${companion.jobId}"`));
    assert.match(html, new RegExp(`aria-labelledby="job-ko-${companion.jobId}"`));
    assert.equal((html.match(/<dt\b/g) ?? []).length, 10);
    for (const label of ['A useful result', 'Working scope', 'Before anything changes', 'Try asking', '기대할 결과', '함께 할 일', '변경하기 전에', '이렇게 말해 보세요']) {
      assert.ok(html.includes(label), `Missing reviewed job label "${label}" for ${companion.id}`);
    }
    assert.doesNotMatch(html, /Operating Principles|운영 원칙|Scope &amp; Tools|범위와 도구|\/\/ Does NOT own|claude-sonnet-4-6/);
    if (companion.id === 'loid') {
      assert.match(html, /aria-hidden="true">L<\/span>/);
      assert.doesNotMatch(html, /src="\/agents\/loid\.png"|Discord mention|canonical charter|plugin file|@Loid|Telegram/);
    } else {
      assert.match(html, /View canonical charter on GitHub/);
      assert.match(html, /GitHub에서 정식 차터 보기/);
    }
  }
});

test('unchanged roles retain legacy panels and a compatible description fallback', async () => {
  const html = await fs.readFile('dist/agents/echo/index.html', 'utf8');
  const source = await fs.readFile('src/content/agents/echo.md', 'utf8');
  const tagline = source.match(/^role_tagline: (.+)$/m)?.[1].replace(/^"|"$/g, '');
  assert.ok(tagline);
  assert.ok(html.includes(`<meta name="description" content="${tagline}">`));
  assert.match(html, /Operating Principles/);
  assert.match(html, /Scope &amp; Tools/);
});
