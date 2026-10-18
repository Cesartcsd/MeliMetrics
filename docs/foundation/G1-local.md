# G1 — Verificação local

## Resultado

`GO` local para a fundação sintética em 18/10/2026. A decisão formal de G1 permanece pendente do CI remoto e da branch protection.

## Comando

```text
npm run verify
```

## Checks aprovados

- `npm ci` aprovado em checkout isolado.
- TypeScript, ESLint, Vitest, Axe e build aprovados.
- Playwright aprovado em desktop e viewport de 375 px.
- Supabase resetado, seed consultado e dump gravado em `D:\MeliMetrics\supabase-data`.
- `uv sync --frozen`, Ruff, mypy e pytest aprovados.
- `npm audit --audit-level=high` e scanner local de segredos sem achados.

## Bloqueio restante

O workflow `.github/workflows/ci.yml` ainda precisa executar no GitHub e tornar seus checks obrigatórios na branch principal.
