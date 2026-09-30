---
title: Project Husky
description: "UW iSchool에서 AI 보안을 가르칠 때 쓰는 로컬 앱입니다. 슬라이드가 노트북 속 소형 모델을 상대로 실제 프롬프트 주입 공격을 실행하고, 각 방어가 얼마나 자주 버티는지 측정하며, 모든 데모 뒤에 녹화 영상을 준비해 둡니다."
status: active
started: 2026-09-18
tagline: "공격이 실시간으로 벌어지는 강의실"
featured: 6
---

Project Husky는 제가 워싱턴대학교(University of Washington) iSchool에서 강의할 때 쓰는 앱입니다. 강의실 앞 노트북 한 대에서 실행되며, 슬라이드와 발표자 노트, 라이브 데모, 수업 중 투표를 앱 세 개 대신 하나로 묶었습니다.

시작은 AI 시스템 보안을 다루는 새 강좌였습니다. 공격 자체가 수업 내용인 강좌거든요. Husky에서는 슬라이드가 실제로 작동하는 패널이 되기도 합니다. 일부러 취약하게 만든 학업 상담 AI인 HuskyAI에 프롬프트 주입을 보내고 방어 계층을 하나씩 켜고 끄면, 강의실 전체가 모델이 계층마다 어떻게 반응하는지 함께 지켜봅니다.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/project-husky/demo-remove-a-leg.webp" class="block" target="_blank" rel="noopener">
<img src="/images/project-husky/demo-remove-a-leg.webp" alt="실제 로컬 모델로 2주 차 Remove a Leg 데모를 실행한 Husky 화면입니다. 빨간 판정에는 EXFILTRATED라고 적혀 있으며, 변조된 정책 문서를 읽은 에이전트가 학생 기록을 records-sync@evil.example로 이메일 발송했다는 내용입니다. 그 아래에는 에이전트의 도구 호출과 시뮬레이션된 발신함이 있고, 오른쪽에는 모델이 본 모든 내용이 신뢰 수준별 색으로 표시되어 있습니다." width="1920" height="1080" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">실제 모델로 실행한 2주 차 Remove a Leg 데모입니다. 변조된 정책 문서가 에이전트에게 학생 기록을 외부로 이메일 발송하라고 지시했고, 에이전트는 그대로 따랐습니다. 오른쪽은 모델이 본 모든 내용이며, 작성자에 따라 색이 다릅니다. <a href="/images/project-husky/demo-remove-a-leg.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">원본 크기로 보기</a></figcaption>
</figure>

## 작동 방식

- **모든 것이 노트북 안에 머뭅니다.** Husky는 `127.0.0.1`에서만 서비스합니다. 일부러 취약하게 만든 내용을 호스팅하기 때문입니다. 데모는 같은 기기의 Ollama에서 `qwen2.5:3b`로 실행되며, API 키도 외부 호출도 없습니다.
- **소스 하나, 덱 두 개.** 강의 내용은 원래 스크립트로 PowerPoint 덱을 만들던 Python 파일에 들어 있습니다. Husky가 같은 파일을 읽으니 슬라이드 하나를 고치면 `.pptx`와 웹 덱에 동시에 반영되죠.
- **일화가 아닌 비율.** 어떤 데모든 10번 시도해 유출 비율을 95% 범위와 함께 보여줍니다. 운 좋은 한 번이나 운 나쁜 한 번이 측정을 대신하는 일은 없습니다.
- **필요할 때 꺼내는 최악의 경우.** `mock`이라는 스크립트 모델은 언제나 공격자를 따릅니다. 결과를 바꿀 수 있는 것은 방어뿐입니다.
- **모든 데모 뒤의 녹화 영상.** 라이브 데모 슬라이드 23장마다 녹화된 대체 영상이 있고, 명령 하나로 전부 다시 녹화합니다. 수업 중 데모가 말을 듣지 않으면 V를 누릅니다.
- **릴레이를 거치는 휴대폰 참여.** 학생들은 네 글자 코드로 참여해 투표에 답하고 질문을 올립니다. 노트북이 Firebase 무료 요금제의 작은 릴레이로 먼저 연결하며, 밖에서 안으로 들어오는 연결은 없습니다.

<figure class="not-prose my-10 lg:-mx-24" data-evidence="runtime-capture">
<a href="/images/project-husky/projector-and-phone.webp" class="block" target="_blank" rel="noopener">
<img src="/images/project-husky/projector-and-phone.webp" alt="왼쪽은 프로젝터 화면으로, 실시간 투표 아래의 슬라이드, 공지 하나, 이름 없이 표시된 학생 질문 네 개, 참여 코드가 담긴 QR 코드가 보입니다. 오른쪽은 가상의 학생으로 참여한 휴대폰으로, 답 하나가 선택되어 있고 같은 질문들이 추천할 수 있게 나열되어 있습니다." width="1920" height="1080" loading="lazy" decoding="async" class="w-full h-auto" />
</a>
<figcaption class="mt-3 text-sm leading-relaxed text-cream-800 dark:text-cream-300">리허설 중인 프로젝터 화면과 학생의 휴대폰입니다. 질문은 이름 없이 강의실에 표시되며, 학생은 가상 인물입니다. <a href="/images/project-husky/projector-and-phone.webp" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">원본 크기로 보기</a></figcaption>
</figure>

## 구성

- 기본 탑재된 AI 시스템 보안(AI Systems Security) 강좌: 10주, 강의 슬라이드 570장, 실습 슬라이드 94장, 라이브 데모 슬라이드 23장, 데모 엔진 11개.
- 가져온 PowerPoint 덱으로 구성한 정보 보증 및 사이버보안(INFO 310)과 전사적 위험 관리(INFO 312). 가져오는 덱은 모두 UW가 강의 자료에 요구하는 기준에 따라 접근성 검사를 받습니다.
- 발표 대본, 투표, 검토를 거치는 질문 대기열을 갖춘 발표자 콘솔. 가상 학생으로 수업을 리허설하는 Simulate class 기능도 있습니다.
- Canvas의 수강생 명단과 참여 기록을 대조하는 Results 페이지.
- 더블클릭으로 실행하는 Windows 앱. PR마다 Windows와 Linux에서 테스트 394개를 돌리고, 앱을 빌드해 실행한 뒤 모든 데모 엔진을 호출해 봅니다.

## 학생 데이터

수업 기록은 노트북에 남습니다. 세션마다 누가 참여했는지, 각 투표 답변, 각 질문과 추천이 일반 로그 파일에 기록됩니다. 학생이 휴대폰으로 참여하면 수업 중에는 릴레이가 답변과 질문을 전달하고, 수업이 끝나면 클라우드 사본은 삭제됩니다. 수업을 종료하지 않았더라도 릴레이는 수업 시작 12시간 뒤부터 쓰기를 받지 않으며, 남은 데이터는 Firestore가 대략 하루 안에 지웁니다. 성적과 과제는 Canvas에 그대로 둡니다.

## 사용 기술

- `127.0.0.1`에만 바인딩하는 Python과 Flask.
- 빌드 단계 없는 순수 JavaScript와 Jinja 템플릿.
- `qwen2.5:3b`를 실행하는 Ollama, 또는 스크립트 기반 `mock` 모델.
- 휴대폰 릴레이를 위한 무료 Spark 요금제의 Firestore와 Firebase Hosting.
- 자체 Edge 창으로 열리는 Windows 앱을 만드는 PyInstaller.
- Edge를 구동해 대체 영상을 녹화하는 Playwright.

## Husky가 아닌 것

Husky는 학습 관리 시스템(LMS)이 아니며 Canvas를 대체하지도 않습니다. 호스팅 서비스도 아닙니다. 제 노트북에서만 돌아가고, 소스 레포지토리는 비공개입니다.

데모는 30억 파라미터 모델에서 실행되므로, 데모의 공격 성공률을 프런티어 모델에 그대로 적용할 수는 없습니다. 옮겨 갈 수 있는 것은 방법입니다. 컨텍스트 전체를 보고, 한 번의 실행을 믿는 대신 측정하고, 문구보다 아키텍처를 바꾸는 쪽을 택하는 것이죠.

이름은 UW 마스코트에서 따왔습니다. 로고는 대학 체육부 로고가 아니라 제가 직접 그린 허스키이며, Husky는 UW가 발행하는 것이 아닌 개인 프로젝트입니다.
