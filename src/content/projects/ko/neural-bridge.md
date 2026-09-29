---
title: Neural Bridge
description: 2026-05-08부터 공개적으로 개발 중인 Mac Mini 기반의 개인용 멀티 에이전트 시스템입니다. 열세 명의 전문 에이전트가 서로에게 작업을 넘기고, 제 결정이 필요한 에이전트 출력은 이제 하나의 리뷰 큐에 모입니다.
status: active
repoUrl: https://github.com/andy-herman/neural-bridge
started: 2026-05-08
tagline: Mac Mini 위의 열세 전문 에이전트, 매일 쓰일 가치를 증명하기 위해 만들어졌습니다.
featured: 4
---

Neural Bridge는 2026-05-08부터 공개적으로 개발 중인 개인용 멀티 에이전트 시스템입니다. launchd로 관리되는 Mac Mini에서 로컬로 돌아갑니다. 열세 명의 전문 에이전트가 Discord에서 @-멘션에 응답합니다: luna, research, teaching-prep, content, social, senior-pm, recruiter, automation-engineer, security-reviewer, docs-editor, librarian, echo, ux-designer. 에이전트들은 서로에게 작업을 넘길 수 있으며, 총괄 비서인 Luna는 Telegram으로도 연락할 수 있습니다. 각 에이전트의 페이지는 [에이전트](/agents)에서 확인할 수 있습니다.

2026-08-02에 진행한 심층 리서치에서 이 프로젝트가 '기능 구축' 단계는 넘어섰지만 '매일 쓰이는 시스템'이 되기 전에 멈춰 있다는 진단이 나왔습니다. 에이전트들은 작동했지만, 모두 제가 먼저 대화를 시작하기를 기다렸고 Discord 플릿은 몇 주 동안 사용되지 않았습니다. 문제는 모델이나 기능에 있지 않았습니다. 트리거 소스와 진입 지점에 있었습니다.

거기서 나온 로드맵은 계측을 표면 변경보다 먼저, 표면 변경을 선제성보다 먼저 배치합니다. Phase 0에서는 메모리 스택을 계측하고 저장소를 통합합니다. Phase 1에서는 진입점이 제가 불러야 하는 열세 개의 페르소나에서 벗어나, 에이전트 작업이 결정을 위해 모이는 하나의 리뷰 큐로 바뀝니다. Phase 2에서는 선제적 동작 앞에 저비용 비LLM 게이트를 배치합니다. Phase 3에서는 루프 엔지니어를 강화합니다.

## 작동 방식

각 에이전트는 세션별로 가벼운 일일 로그를 작성합니다. 매일 밤 컴파일 단계가 마크다운 위키에 공유할 개념 문서 후보를 제안합니다. 모든 후보는 PROMOTE, QUARANTINE, REJECT 중 하나로 결정하는 파일링 게이트를 통과합니다. 게이트는 명령형 AI 지시 언어(프롬프트 인젝션), 추적 불가 주장, 개념 적합성을 검사합니다. QUARANTINE된 후보는 사람의 판단을 기다립니다.

Phase 1의 첫 번째 조각인 리뷰 큐가 2026-09-29에 출시되었습니다. 봇들은 Phase 1 동안 온라인을 유지하지만, 제 결정이 필요한 에이전트 출력은 이제 하나의 로컬 큐에 모입니다. Luna의 Telegram 봇이 각 항목을 버튼이 달린 카드로 전달하고, 모든 결정과 그 결과는 추가 전용 이벤트 로그에 기록됩니다.

현재 활성화된 항목은 두 종류입니다:

- **캡처**, 파일링 게이트의 격리 목록에서 나옵니다. 승인하면 위키로 이동하는 풀 리퀘스트가 열리고 병합됩니다. 거부하면 삭제됩니다.
- **알림**, 메모리 카나리아, 배포 감시자, 예약 출력 감시자에서 나옵니다. 1주일의 섀도 기간 동안에는 수집만 되고 카드로 전송되지 않아, 중복 수신이 없습니다.

게시하거나 삭제하는 작업은 두 번 확인을 거칩니다.

<figure class="not-prose my-10 lg:-mx-24">
<a href="/images/projects/neural-bridge-review-queue-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/neural-bridge-review-queue-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/neural-bridge-review-queue-light.svg" alt="리뷰 큐. 생산자(파일링 게이트의 격리된 캡처, 메모리 카나리아, 배포 감시자, 예약 출력 감시자)가 Mac의 큐 하나에 작성합니다. 큐는 항목과 추가 전용 이벤트 로그를 유지하며, 프로브 항목과 푸셔의 하트비트로 매일 자체 점검합니다. 큐가 전달을 멈추면 별도의 감시자가 직접 알립니다. Luna가 각 항목을 버튼이 달린 카드로 Telegram에 전송하면 제가 결정합니다. 게시하거나 삭제하는 작업은 두 번 확인을 거칩니다. 캡처를 승인하면 위키로 이동하는 풀 리퀘스트가 열리고 병합됩니다. 거부하면 삭제됩니다. 알림은 확인 처리됩니다." width="1086" height="356" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">작업이 저에게 닿는 방식 · <a href="/images/projects/neural-bridge-review-queue-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">원본 크기로 보기</a></figcaption>
</figure>

첫날 밤, 큐는 2026-05-10부터 격리 상태로 머물러 있던 개념들에 대한 캡처 카드 여덟 개를 전송했습니다. 그것들을 결정해 달라고 요청하는 것은 아무것도 없었습니다.

큐는 매일 스스로를 점검합니다. 프로브 항목이 전체 수명 주기를 거치고, 푸셔의 하트비트가 최신이어야 합니다. 큐가 전달을 멈추면 별도의 감시자가 직접 알립니다. 멈춘 큐는 자신의 실패를 스스로 보고할 수 없기 때문입니다.

4주 후에는 세 가지 수치로 평가할 것입니다. 주당 결정 수, 결정까지의 중간값 시간, 읽히지 않은 채 만료되는 항목 수. 로드맵의 리서치 자체가 평가 방법을 확립하지 못했기 때문에, 이것이 변화가 실제로 효과를 내는지 측정하는 첫 번째 방법입니다. ([REVIEW_QUEUE.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/REVIEW_QUEUE.md))

루프 엔지니어 데몬은 agent-ready 레이블이 붙은 GitHub 이슈를 가져와 각각 격리된 git 워크트리에서 구현하고, 검토를 위한 드래프트 풀 리퀘스트를 엽니다. ([LOOP_ENGINEER.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/LOOP_ENGINEER.md))

2026-09-25부터 2026-09-28 사이에 구축된 아웃바운드 가드는 에이전트 출력이 GitHub이나 공개 위키에 도달하는 모든 경로를 검사합니다. 개인 노트의 텍스트가 에이전트에 의해 공개되는 일을 막기 위해서입니다. git pre-push 훅이 포괄적인 보호막으로 모든 푸시를 검사합니다. ([OUTBOUND_GUARD.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/OUTBOUND_GUARD.md))

## 조용히 망가진 것들

지금까지 이 프로젝트에서 배운 교훈: 정상적인 컴포넌트와 죽은 컴포넌트가 같은 출력, 즉 아무것도 내놓지 않았습니다.

- **대화 캡처 경로가 2026-05-27부터 2026-08-02까지 죽어 있었습니다.** 로그는 정상으로 보였습니다.
- **Luna의 노트 파일이 운영 규칙이 담긴 절반을 소리 없이 버리고 있었습니다.** 글: [내 어시스턴트는 변경 이력을 위해 자신의 규칙을 지우고 있었습니다](/posts/tuned-for-a-model-that-no-longer-exists).
- **병합된 코드를 Mac으로 가져오는 배포 감시자가 2분마다 오류로 종료되었습니다.** 2026-05-13부터 2026-09-25까지, 로그 한 줄 남기지 않았습니다. 2026-09-25에 수정되었습니다.

Phase 0에서는 단계별 메모리 텔레메트리와 일일 읽기 카나리아가 2026-08-15에 출시되었습니다. 카나리아는 오류를 기다리는 대신, 각 메모리 레이어가 여전히 정상 동작하고 있음을 능동적으로 검증합니다. 메모리 저장소는 2026년 9월에 통합되었습니다. ([MEMORY_CONSOLIDATION.md](https://github.com/andy-herman/neural-bridge/blob/main/docs/MEMORY_CONSOLIDATION.md))

## 글

- [Neural Bridge를 만드는 이유](/posts/2026-05-08-why-im-building-neural-bridge): 처음의 동기.
- [V2 출시: 기반 시스템이 스스로 돌아간다](/posts/2026-05-10-v2-ships): 세션 종료 캡처, 일일 로그, 컴파일 단계.
- [내 어시스턴트는 변경 이력을 위해 자신의 규칙을 지우고 있었습니다](/posts/tuned-for-a-model-that-no-longer-exists): 위에서 다룬 침묵의 실패 중 하나.
- [개인 에이전틱 AI 기반 시스템의 메모리 오염 공격](/research/memory-poisoning-in-personal-agentic-ai-substrates): 파일링 게이트 뒤의 위협 모델.
- [AI가 자체 메모리를 오염시키지 못하도록 게이트 검증을 구축했습니다. 그리고 게이트는 제 주입 시도도 잡아냈습니다.](/research/memory-poisoning-sequel-filing-gate): 게이트의 작동 방식과 검사 항목.

## 다음 단계

- 섀도 주가 끝나면 알림이 카드로 전달됩니다.
- Slice B: 에이전트가 세션 종료 시 남기는 질문이 카드가 되어 Telegram에서 답변하면, 그 답변이 해당 에이전트의 다음 세션 진행 로그에 들어갑니다.
- Slice C: 루프 엔지니어의 드래프트 풀 리퀘스트가 리뷰 카드가 됩니다.
- 그다음 Phase 2: 선제적 동작 앞에 저비용 비LLM 게이트.
