# QR URL Safe Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `pickPublicUrl`의 예측 URL 폴백을 제거해 배포된 카드 QR이 항상 현재 사용자의 배포를 가리키도록 한다.

**Architecture:** `app/api/deploy/route.ts`의 `pickPublicUrl` 함수에서 `projectName` 기반 폴백(`https://${projectName}.vercel.app`) 2줄을 제거한다. aliases가 없으면 `data.url`(배포 고유 URL)을 사용하고, 그것도 없으면 null을 반환한다.

**Tech Stack:** Next.js 15 App Router, TypeScript, Vercel Deployments API

---

## 파일 구조

| 파일 | 변경 |
|------|------|
| `app/api/deploy/route.ts` | `pickPublicUrl` 함수 2줄 삭제 |

---

### Task 1: pickPublicUrl 예측 URL 폴백 제거

**Files:**
- Modify: `app/api/deploy/route.ts` — `pickPublicUrl` 함수

현재 `pickPublicUrl` 함수 (route.ts 내 위치):

```ts
function pickPublicUrl(data: DeploymentResponse, projectName?: string): string | null {
  const aliases = (data.alias ?? []).filter((a) => typeof a === "string" && a.length > 0);
  const looksLikeDeploymentUrl = (a: string) => /-[a-z0-9]{9,}-/i.test(a);
  const stable = aliases.filter((a) => !looksLikeDeploymentUrl(a));
  const pool = stable.length > 0 ? stable : aliases;
  if (pool.length > 0) {
    const shortest = pool.slice().sort((a, b) => a.length - b.length)[0];
    return `https://${shortest}`;
  }
  if (projectName) return `https://${projectName}.vercel.app`;  // ← 위험: 타인 소유일 수 있음
  return data.url ? `https://${data.url}` : null;
}
```

- [ ] **Step 1: `pickPublicUrl` 함수 수정**

`app/api/deploy/route.ts`의 `pickPublicUrl` 함수를 아래와 같이 변경한다:

```ts
function pickPublicUrl(data: DeploymentResponse): string | null {
  const aliases = (data.alias ?? []).filter((a) => typeof a === "string" && a.length > 0);
  const looksLikeDeploymentUrl = (a: string) => /-[a-z0-9]{9,}-/i.test(a);
  const stable = aliases.filter((a) => !looksLikeDeploymentUrl(a));
  const pool = stable.length > 0 ? stable : aliases;
  if (pool.length > 0) {
    const shortest = pool.slice().sort((a, b) => a.length - b.length)[0];
    return `https://${shortest}`;
  }
  return data.url ? `https://${data.url}` : null;
}
```

변경 사항:
1. `projectName` 파라미터 제거
2. `if (projectName) return \`https://${projectName}.vercel.app\`` 라인 삭제

- [ ] **Step 2: `pickPublicUrl` 호출부 파라미터 제거**

같은 파일에서 `pickPublicUrl` 호출 2곳을 수정한다.

호출 1 (Phase 1 결과 처리):
```ts
// 변경 전
const realUrl = pickPublicUrl(merged, name);

// 변경 후
const realUrl = pickPublicUrl(merged);
```

호출 2 (Phase 2 결과 처리):
```ts
// 변경 전
const finalUrl = pickPublicUrl(second.data, name) ?? realUrl;

// 변경 후
const finalUrl = pickPublicUrl(second.data) ?? realUrl;
```

- [ ] **Step 3: TypeScript 타입 체크**

```bash
cd /Users/stpark/99.personal/01.laboratory/card-portfolio
npx tsc --noEmit
```

Expected: 에러 없음 (exit code 0). 에러 있으면 `pickPublicUrl` 호출부 중 누락된 곳 수정.

- [ ] **Step 4: 커밋**

```bash
git add app/api/deploy/route.ts
git commit -m "fix(deploy): remove predicted URL fallback in pickPublicUrl to prevent QR pointing to wrong site"
```

- [ ] **Step 5: 푸시**

```bash
git push
```

---

## 성공 기준

- `pickPublicUrl` 함수에 `projectName` 파라미터가 없음
- `https://${projectName}.vercel.app` 문자열이 함수 내에 없음
- `npx tsc --noEmit` 에러 없음
- aliases가 비어 있을 때 `data.url` 기반 배포 고유 URL 반환 (항상 현재 사용자의 배포)
