---
title: Gemma GRC
description: 맥 미니에서 돌아가는 작은 비공개 컴플라이언스 어시스턴트입니다. 오픈 Gemma 모델이 관리된 노트·강의 자료·공개 규제 원문 라이브러리에서만 답을 찾아 모든 주장에 출처를 달며, 실험 노트로 그 효과를 측정합니다.
status: active
started: 2026-08-02
tagline: 맥 미니에서 돌아가는 비공개 컴플라이언스 어시스턴트, 그리고 그것을 측정하는 실험실.
featured: 1
---

Gemma GRC는 제 책상 위 맥 미니에서 돌아가는 거버넌스·리스크·컴플라이언스(GRC) 어시스턴트입니다. 질문은 전부 로컬에서 처리되며 네트워크 연결은 없습니다. 소형 오픈 Gemma 모델이 제 노트, 강의 자료, 공식 공개 규제 원문으로 구성된 라이브러리를 바탕으로 답을 만들고, 모든 주장에 근거 문단을 인용하며, 라이브러리에 답이 없으면 없다고 말하도록 설정되어 있습니다. 이것은 강제된 검사가 아니라 프롬프트 지시사항입니다. 한 번의 측정에서는 50개 답변 중 48개에서 인용 지시를 따랐습니다.

동시에 실험실이기도 합니다. 모든 변경은 가설을 먼저 적어 두고 한 번에 하나의 변수만 바꾸는 실험으로 진행하며, 고정된 질문 세트를 다른 계열의 모델이 채점합니다.

<figure class="not-prose my-10">
<a href="/images/projects/gemma-grc-lab-loop-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/gemma-grc-lab-loop-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/gemma-grc-lab-loop-light.svg" alt="실험 루프. 가설을 먼저 적고 한 가지만 바꾼 뒤, 고정된 질문 세트를 실행하고, 다른 모델 계열의 채점자가 점수를 매기면, 노이즈 하한 대비 신뢰구간을 확인하고, 실행 노트와 다음 가설로 이어집니다." width="796" height="145" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">실험 루프 · <a href="/images/projects/gemma-grc-lab-loop-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">원본 크기로 보기</a></figcaption>
</figure>

## 작동 방식

<figure class="not-prose my-10 lg:-mx-24">
<a href="/images/projects/gemma-grc-data-flow-light.svg" class="block" target="_blank" rel="noopener">
<picture>
<source srcset="/images/projects/gemma-grc-data-flow-dark.svg" media="(prefers-color-scheme: dark)" />
<img src="/images/projects/gemma-grc-data-flow-light.svg" alt="Gemma GRC의 데이터 흐름. 빌드 단계는 모델 없이 맥에서만 돌아갑니다. 제 노트는 실패 시 차단되는 기밀성 게이트를 통과해야 하며, 등급 라벨이나 플래그, 배너가 붙은 노트는 사유를 기록한 채 보류됩니다. 통과한 노트는 분할과 개인정보 가림 처리를 거쳐, 라이선스를 기록하며 가져온 1차 공개 규제 원문과 함께 출처 정보가 찍힌 인덱스에 들어갑니다. 질문 단계에서는 네트워크 없이 인덱스가 코퍼스와 모델에 맞는지 먼저 확인하고, 밀집 검색과 키워드 검색을 결합한 하이브리드 검색으로 찾은 문단만을 근거로 Gemma 3 4B가 주장마다 출처를 달아 답하거나 무엇이 부족한지 밝힙니다." width="1194" height="673" loading="lazy" decoding="async" class="w-full h-auto" />
</picture>
</a>
<figcaption class="mt-3 font-mono text-[11px] uppercase tracking-wider text-cream-800 dark:text-cream-300">빌드 단계와 질문 단계 · <a href="/images/projects/gemma-grc-data-flow-light.svg" target="_blank" rel="noopener" class="text-rust-500 underline underline-offset-4">원본 크기로 보기</a></figcaption>
</figure>

제 노트는 범위 검사와 페일 클로즈드 기밀성 게이트를 통과한 뒤 청크로 나뉘고, 민감한 내용이 삭제되며, 콘텐츠 해시 ID와 출처 등급이 붙습니다. 출처 등급은 공개(public), 자작(own), 기타(local only) 세 가지입니다. 공개 규제 원문은 별도 경로로 들어오며, 공식 호스트에서 https로만 수신하고 각 문서의 라이선스를 기록합니다. 기본 라이브러리는 7,167개 청크로, 제 노트에서 1,178개, 공개 원문에서 5,989개입니다.

질문이 들어오면 하이브리드 검색이 BGE 임베딩과 BM25를 결합해 상위 8개 문단을 뽑습니다. 리랭커는 없습니다. 실험해 봤더니 결과가 오히려 나빠졌습니다. 고정 예산 안에 들어가는 만큼의 문단이 로컬에서 실행 중인 Gemma 3 4B에 전달되면, 모델은 주장마다 대괄호 인용을 붙여 답하거나 빠진 내용을 밝힙니다.

## 실험에서 알게 된 것

- **제 노트로 모델을 파인튜닝하자 오히려 나빠졌습니다.** 1B 모델 기준으로, 내용을 지어낸 답변의 비율이 다섯 개 중 하나에서 거의 절반으로 올랐습니다. 말투는 배웠지만 사실은 배우지 못한 것입니다.
- **가장 큰 성과는 검색에서 나왔습니다.** 답변 품질이 5점 척도에서 거의 1점 올랐습니다. 이 수치는 이전 구성에서 측정한 것이고, 현재 구성은 아직 전체 측정을 마치지 않았습니다.
- **효과가 있었던 파인튜닝은 검색 모델에서였습니다.** 언어 모델보다 약 120배 작은 이 모델을 9분간 파인튜닝하자, 정답 문단이 상위 4개 안에 드는 비율이 71%에서 79%로 올랐습니다. 현재 사용 중인 버전은 이후에 더 긴 시간 동안 재훈련한 것입니다.
- **가장 어려운 문제는 측정이었습니다.** 한 채점 모델은 거의 모든 것을 통과시켰습니다. 다른 하나는 수리하기 전까지 정답이 그대로 담긴 원문 문단의 62%에서 답을 찾지 못했습니다. 수리 후에도 다섯 개 중 하나 정도는 놓칩니다.

## 거버넌스

수집 파이프라인은 페일 클로즈드 방식입니다. 다음 중 하나라도 있는 노트는 코퍼스에 들어오지 못합니다.

- 공개 외의 분류·민감도·표시·취급·TLP 라벨
- 노트 상단의 분류 표시 줄
- 비공개 또는 기밀 플래그나 태그
- 취급 배너

줄바꿈 형식이나 프런트매터의 예외로 게이트가 뚫리지 않습니다. 출처 등급이 청크가 갈 수 있는 곳을 결정합니다. 라이선스가 허용하는 공개 원문과 제가 직접 쓴 게시물만 기기 밖으로 나가거나 그럴 가능성이 있는 모델 훈련에 쓰일 수 있습니다. 8월에 튜닝한 검색 모델은 게이트 적용 이전의 것으로, 이 기기에만 있습니다.

청크 ID는 콘텐츠 해시입니다. 검색 인덱스에는 그것을 만든 코퍼스와 모델의 지문이 찍혀 있어, 다른 것과는 함께 로드되지 않습니다.

첫 번째 게이트는 비공개 플래그는 읽었지만 분류 라벨은 읽지 않았습니다. 셀프 오딧을 통해 로컬 라이브러리와 테스트 세트에 라벨이 붙은 노트가 있다는 것을 발견했습니다. 외부에 공개된 것은 없었으며, 페일 클로즈드 게이트가 그 수정 방법입니다.

## 글

- [It Learned How I Sound, Not What I Know](/posts/it-learned-how-i-sound): 작은 비공개 모델이 컴플라이언스 업무에서 실제로 어디에 쓸모 있는지.
- [When the Instrument Is the Bottleneck](/research/when-the-instrument-is-the-bottleneck): 모든 실험과 신뢰구간, 실패한 측정 도구까지 담은 전체 실험 보고서.

## 다음 단계

공개 원문 경로는 2026-09-25에 완성되었습니다. 58개 공식 소스가 포함되어 있으며, CELLAR를 통한 EU 법령(EUR-Lex는 스크립트를 차단함), legislation.gov.uk의 영국 법령, NIST OSCAL 카탈로그가 여기에 해당합니다. 아직 남은 작업:

- 현재 제작 중인 새 평가 세트: 360개 이상의 질문, 질문당 여러 정답 문단, 4개 리트리버에서 풀링한 후보를 2인 심사위원단이 채점하며 저는 블라인드로 조정합니다. 주장 단위 채점은 이후 단계로, 아직 제작하지 않았습니다.
- 현재 출시 상태 기준으로 스택 전체의 재베이스라인 측정.
- Granite을 대조군으로 한 Gemma 4 E4B와의 A/B 비교.
- 날짜 질문 수정. 첫 카나리아 점검에서 리트리버는 8개 질문 중 5개에서 정답 문단을 찾았지만, AI Act 날짜 질문 2개 모두 법령 적용 시점을 정하는 조항을 놓쳤습니다. 모델은 오래된 날짜를 제공했으며, 한 경우에는 날짜가 없는 문단을 인용했습니다.
