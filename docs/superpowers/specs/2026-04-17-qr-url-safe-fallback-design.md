# QR URL Safe Fallback 설계

작성: 2026-04-17

## 문제

`pickPublicUrl`이 Vercel aliases에서 production URL을 찾지 못할 때
`https://${projectName}.vercel.app`으로 폴백 → 해당 URL이 타인 소유일 경우
배포된 카드의 QR이 다른 사람 사이트로 연결됨.

## 해결

예측 URL 폴백을 제거하고 `data.url` (Vercel이 부여한 배포 고유 URL) 사용.
배포 고유 URL은 항상 현재 사용자의 배포에 속하므로 안전함.

## 변경 파일

- `app/api/deploy/route.ts` — `pickPublicUrl` 함수에서 `projectName` 폴백 제거

## 변경 전/후

```ts
// 변경 전
if (projectName) return `https://${projectName}.vercel.app`;
return data.url ? `https://${data.url}` : null;

// 변경 후
return data.url ? `https://${data.url}` : null;
```

## 동작 우선순위

1. aliases에서 production URL (shortest stable) → 깔끔한 URL
2. `data.url` (배포 고유 URL) → 항상 내 배포
3. null → 에러 처리 (기존 동작 유지)

## 범위 외

- Vercel `/v9/projects/{name}/domains` API 연동 (향후 개선 가능)
- Studio QR 미리보기 URL (배포 전 예측 URL 표시 — UX 이슈지만 이번 범위 외)
