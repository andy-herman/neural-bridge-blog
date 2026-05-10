// i18n helper module — Korean translations of UI strings + path helpers.
//
// Pattern: every page that wants to be locale-aware passes a `locale` prop
// down to BaseLayout / Nav / Footer. Components read strings via `t(locale, key)`.
// Body content (article prose) is NOT translated here — that comes from
// sidecar .mdx files in `src/content/<collection>/ko/<slug>.mdx`.
//
// Voice rule baked in: no em dashes in any Korean string. Use commas, periods,
// or parentheses instead. Korean punctuation conventions are slightly different
// (Korean uses 「」 quotes, but for web we keep "ASCII quotes" for compatibility).

export type Locale = 'en' | 'ko';

export const LOCALES: Locale[] = ['en', 'ko'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface UIStrings {
  // Nav
  nav: {
    home: string;
    writing: string;
    buildlog: string;
    agents: string;
    about: string;
  };
  // Generic
  read_more: string;
  view_profile: string;
  view_charter: string;
  all_x_arrow: (label: string, count?: number) => string;
  no_x_yet: (label: string) => string;
  back_to_x: (label: string) => string;
  // Page titles + hero copy
  pages: {
    home_kicker: string;
    home_title_pre: string;
    home_title_em: string;
    home_blurb_html: string;     // contains <a> link to projects
    writing_kicker: string;
    writing_title: string;
    writing_blurb_html: string;  // contains <strong> emphasis on Posts/Research/Projects
    posts_kicker: string;
    posts_title: string;
    research_kicker: string;
    research_title: string;
    research_blurb: string;
    projects_kicker: string;
    projects_title: string;
    buildlog_kicker: string;
    buildlog_title: string;
    buildlog_blurb: string;
    agents_kicker: string;
    agents_title: string;
    agents_blurb: string;
    about_title: string;
  };
  // Section labels within Writing hub
  sections: {
    posts_kicker: string;
    posts_tagline: string;
    research_kicker: string;
    research_tagline: string;
    projects_kicker: string;
    projects_tagline: string;
  };
  // Agent detail page
  agent_detail: {
    system_kicker: string;
    character_kicker: string;
    color_label: (color: string) => string;
    orchestrator_badge: string;
    discord_mention_label: string;
    model_label: string;
    role_section: string;
    principles_section: string;
    scope_section: string;
    does_not_own_label: string;
    tools_label: string;
    view_charter_external: string;
    no_avatar: string;
    canonical_footer: string;
  };
  // Buildlog
  buildlog: {
    one_entry: string;
    n_entries: (n: number) => string;
    latest_badge: string;
    footer_kicker: string;
    footer_body_html: string;
  };
  // Toggle + footer
  toggle: {
    aria_label: string;
    en_label: string;
    ko_label: string;
  };
  footer: {
    rss: string;
    github: string;
    neural_bridge: string;
    support: string;
  };
  // Translation-not-ready notice
  translation_pending: {
    title: string;
    body: string;
    cta: string;
  };
}

export const STRINGS: Record<Locale, UIStrings> = {
  en: {
    nav: {
      home: 'Home',
      writing: 'Writing',
      buildlog: 'Build log',
      agents: 'Agents',
      about: 'About',
    },
    read_more: 'Read more',
    view_profile: 'View profile',
    view_charter: 'View charter',
    all_x_arrow: (label, count) => count !== undefined ? `All ${label} (${count}) →` : `All ${label} →`,
    no_x_yet: (label) => `No ${label} yet.`,
    back_to_x: (label) => `← All ${label}`,
    pages: {
      home_kicker: '// Build journal',
      home_title_pre: 'Building',
      home_title_em: 'in public.',
      home_blurb_html: 'Notes, decisions, and code from <a href="/projects/neural-bridge" class="text-rust-500 underline underline-offset-4 decoration-1 hover:decoration-2">Neural Bridge</a> and the other things I\'m building. Cross-posted to LinkedIn where they fit.',
      writing_kicker: '// The catalog',
      writing_title: 'Writing',
      writing_blurb_html: 'Three flavors of work end up here. <strong class="not-italic font-semibold text-cream-900 dark:text-cream-50">Posts</strong> are short, opinionated, build-in-public. <strong class="not-italic font-semibold text-cream-900 dark:text-cream-50">Research</strong> are working papers with citations. <strong class="not-italic font-semibold text-cream-900 dark:text-cream-50">Projects</strong> are the things being built.',
      posts_kicker: '// All posts',
      posts_title: 'Posts',
      research_kicker: '// Research',
      research_title: 'Research',
      research_blurb: 'Working papers and notes on AI security, agentic AI security, development playbooks, and compliance and risk topics worth thinking through carefully.',
      projects_kicker: '// All projects',
      projects_title: 'Projects',
      buildlog_kicker: '// Live feed',
      buildlog_title: 'Build log',
      buildlog_blurb: 'Chronological feed of work across my projects. Milestones, releases, hardening, posts. Hand-curated for now; auto-sync from merged PRs lands later.',
      agents_kicker: '// The roster',
      agents_title: 'Agents',
      agents_blurb: 'Thirteen specialists sharing a markdown wiki memory, reachable from Discord. Each one owns a narrow scope; the orchestrator routes work; the wiki compounds across sessions.',
      about_title: 'About',
    },
    sections: {
      posts_kicker: '// Posts',
      posts_tagline: 'Tight, opinionated, build-in-public. Lessons learned and milestones hit.',
      research_kicker: '// Research',
      research_tagline: 'Working papers on AI security, agentic systems, compliance, and development playbooks. Cited.',
      projects_kicker: '// Projects',
      projects_tagline: 'The things being built. Personal AI substrate, the blog you\'re reading, and what comes next.',
    },
    agent_detail: {
      system_kicker: '// System: agent collective',
      character_kicker: '// Character card',
      color_label: (color) => `// ${color}`,
      orchestrator_badge: '· orchestrator',
      discord_mention_label: '// Discord mention',
      model_label: '// Model',
      role_section: 'Role & Purpose',
      principles_section: 'Operating Principles',
      scope_section: 'Scope & Tools',
      does_not_own_label: '// Does NOT own',
      tools_label: '// Tools',
      view_charter_external: 'View canonical charter on GitHub →',
      no_avatar: '// no avatar',
      canonical_footer: 'The canonical source for this agent\'s charter lives in the plugin file. This page is a public-facing summary.',
    },
    buildlog: {
      one_entry: '1 entry',
      n_entries: (n) => `${n} entries`,
      latest_badge: '· latest',
      footer_kicker: '// adding to the feed',
      footer_body_html: 'Manual entries land in <code class="font-mono text-xs not-italic text-rust-600 dark:text-rust-400">src/content/buildlog/&lt;YYYY-MM-DD&gt;-&lt;slug&gt;.md</code>. Auto-sync from merged PRs across <code class="font-mono text-xs not-italic text-rust-600 dark:text-rust-400">neural-bridge</code> and <code class="font-mono text-xs not-italic text-rust-600 dark:text-rust-400">neural-bridge-blog</code> ships in a follow-on PR.',
    },
    toggle: {
      aria_label: 'Language',
      en_label: 'EN',
      ko_label: '한국어',
    },
    footer: {
      rss: 'RSS',
      github: 'GITHUB',
      neural_bridge: 'NEURAL-BRIDGE',
      support: 'SUPPORT',
    },
    translation_pending: {
      title: 'Korean translation pending',
      body: 'This page hasn\'t been translated into Korean yet. We\'re working through the archive.',
      cta: 'Read the English version',
    },
  },
  ko: {
    nav: {
      home: '홈',
      writing: '글',
      buildlog: '빌드 로그',
      agents: '에이전트',
      about: '소개',
    },
    read_more: '더 읽기',
    view_profile: '프로필 보기',
    view_charter: '차터 보기',
    all_x_arrow: (label, count) => count !== undefined ? `${label} 전체 (${count}) →` : `${label} 전체 →`,
    no_x_yet: (label) => `아직 ${label}이 없습니다.`,
    back_to_x: (label) => `← ${label} 전체`,
    pages: {
      home_kicker: '// 빌드 저널',
      home_title_pre: '공개적으로',
      home_title_em: '만들고 있습니다.',
      home_blurb_html: '<a href="/ko/projects/neural-bridge" class="text-rust-500 underline underline-offset-4 decoration-1 hover:decoration-2">Neural Bridge</a>와 제가 만들고 있는 다른 것들에 대한 노트, 결정, 코드. 어울리는 글은 LinkedIn에도 함께 올립니다.',
      writing_kicker: '// 카탈로그',
      writing_title: '글',
      writing_blurb_html: '여기에는 세 가지 유형의 작업이 모입니다. <strong class="not-italic font-semibold text-cream-900 dark:text-cream-50">포스트</strong>는 짧고 단호하며 공개적으로 만드는 과정을 담습니다. <strong class="not-italic font-semibold text-cream-900 dark:text-cream-50">리서치</strong>는 인용 출처가 있는 워킹 페이퍼입니다. <strong class="not-italic font-semibold text-cream-900 dark:text-cream-50">프로젝트</strong>는 실제로 만들고 있는 것들입니다.',
      posts_kicker: '// 모든 포스트',
      posts_title: '포스트',
      research_kicker: '// 리서치',
      research_title: '리서치',
      research_blurb: 'AI 보안, 에이전틱 AI 보안, 개발 플레이북, 컴플라이언스와 리스크 주제에 대한 워킹 페이퍼와 노트. 신중하게 생각해 볼 가치가 있는 주제들입니다.',
      projects_kicker: '// 모든 프로젝트',
      projects_title: '프로젝트',
      buildlog_kicker: '// 라이브 피드',
      buildlog_title: '빌드 로그',
      buildlog_blurb: '여러 프로젝트의 작업을 시간 순으로 보여주는 피드. 마일스톤, 릴리스, 하드닝, 포스트. 현재는 직접 큐레이션, 머지된 PR에서 자동 동기화는 다음 단계에 추가 예정입니다.',
      agents_kicker: '// 로스터',
      agents_title: '에이전트',
      agents_blurb: '마크다운 위키 메모리를 공유하며 Discord에서 호출할 수 있는 열세 명의 스페셜리스트. 각자 좁은 스코프를 책임지고, 오케스트레이터가 작업을 라우팅하며, 위키는 세션을 거듭할수록 쌓입니다.',
      about_title: '소개',
    },
    sections: {
      posts_kicker: '// 포스트',
      posts_tagline: '짧고 단호하며 공개적으로 만드는 과정. 배운 것과 이정표.',
      research_kicker: '// 리서치',
      research_tagline: 'AI 보안, 에이전틱 시스템, 컴플라이언스, 개발 플레이북에 관한 워킹 페이퍼. 인용 출처 포함.',
      projects_kicker: '// 프로젝트',
      projects_tagline: '실제로 만들고 있는 것들. 개인 AI 서브스트레이트, 지금 보고 계신 블로그, 그리고 그다음.',
    },
    agent_detail: {
      system_kicker: '// 시스템: 에이전트 컬렉티브',
      character_kicker: '// 캐릭터 카드',
      color_label: (color) => `// ${color}`,
      orchestrator_badge: '· 오케스트레이터',
      discord_mention_label: '// Discord 멘션',
      model_label: '// 모델',
      role_section: '역할과 목적',
      principles_section: '운영 원칙',
      scope_section: '범위와 도구',
      does_not_own_label: '// 담당하지 않는 영역',
      tools_label: '// 도구',
      view_charter_external: 'GitHub에서 정식 차터 보기 →',
      no_avatar: '// 아바타 없음',
      canonical_footer: '이 에이전트 차터의 정식 출처는 플러그인 파일에 있습니다. 이 페이지는 공개용 요약입니다.',
    },
    buildlog: {
      one_entry: '1개 항목',
      n_entries: (n) => `${n}개 항목`,
      latest_badge: '· 최신',
      footer_kicker: '// 피드에 추가하기',
      footer_body_html: '수동 항목은 <code class="font-mono text-xs not-italic text-rust-600 dark:text-rust-400">src/content/buildlog/&lt;YYYY-MM-DD&gt;-&lt;slug&gt;.md</code>에 저장됩니다. <code class="font-mono text-xs not-italic text-rust-600 dark:text-rust-400">neural-bridge</code>와 <code class="font-mono text-xs not-italic text-rust-600 dark:text-rust-400">neural-bridge-blog</code>의 머지된 PR에서 자동 동기화는 다음 PR에서 추가됩니다.',
    },
    toggle: {
      aria_label: '언어',
      en_label: 'EN',
      ko_label: '한국어',
    },
    footer: {
      rss: 'RSS',
      github: 'GITHUB',
      neural_bridge: 'NEURAL-BRIDGE',
      support: '서포트',
    },
    translation_pending: {
      title: '한국어 번역 준비 중',
      body: '이 페이지는 아직 한국어로 번역되지 않았습니다. 아카이브를 차례대로 번역하고 있습니다.',
      cta: '영어 버전 읽기',
    },
  },
};

/** Get the locale string table. */
export function t(locale: Locale): UIStrings {
  return STRINGS[locale] || STRINGS[DEFAULT_LOCALE];
}

/** Resolve a path for the given locale.
 *
 * - `localePath('en', '/posts/foo')` → `/posts/foo`
 * - `localePath('ko', '/posts/foo')` → `/ko/posts/foo`
 * - `localePath('ko', '/')` → `/ko`
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}

/** Strip the locale prefix from a path. Inverse of localePath. */
export function stripLocale(path: string): string {
  for (const loc of LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    if (path === `/${loc}`) return '/';
    if (path.startsWith(`/${loc}/`)) return path.slice(`/${loc}`.length);
  }
  return path;
}

/** Toggle a path between locales. Useful for the language toggle button. */
export function toggleLocale(path: string, from: Locale, to: Locale): string {
  return localePath(to, stripLocale(path));
}
