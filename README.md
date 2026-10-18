# MeliMetrics

MeliMetrics é uma plataforma analítica para operações de Mercado Livre. A Fase 1 mantém o produto em modo local e sintético até os gates de provedores, aplicação Mercado Livre, privacidade e backup serem aprovados.

## Requisitos locais

- Node `24.13.0` e npm `11.6.2`.
- Python `3.12.13` e uv `0.11.14`.
- Docker Desktop para o Supabase local.
- Chromium instalado pelo Playwright para os testes E2E.

## Bootstrap reproduzível

```powershell
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
uv --directory pipeline sync --frozen
```

O frontend aceita somente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, ambas públicas. O pipeline usa variáveis sem prefixo `VITE_`; nenhum segredo de servidor pode ser colocado no bundle.

## Supabase local

```powershell
npm run supabase:start
npm run db:reset
npm run supabase:status
npm run supabase:stop
```

O banco local contém apenas metadado sintético de fundação. Não use credenciais, payloads de seller ou dados reais nesta fase.

No Windows, `npm run supabase:verify` grava o dump sintético em `D:\MeliMetrics\supabase-data`. O diretório é externo ao repositório e não substitui a configuração global de armazenamento do Docker Desktop.

## Verificação

```powershell
npm run verify:frontend
npm run test:e2e
npm run pipeline:lint
npm run pipeline:typecheck
npm run pipeline:test
npm run verify
```

O CI executa os mesmos checks em ambientes efêmeros. A validação de clone limpo deve ocorrer em uma cópia isolada; o worktree principal pode conter alterações preexistentes do usuário.
