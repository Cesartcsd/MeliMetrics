# BASE-003 — Supabase local

## Resultado

`GO` para o ambiente sintético local em 18/10/2026.

## Comandos

```text
npx supabase start --ignore-health-check
npx supabase db reset
docker exec supabase_db_melimetrics-local psql -U postgres -d postgres -Atc "select key || '|' || value::text from private.foundation_metadata order by key;"
npm run supabase:verify
```

## Evidência

- Container local: `supabase_db_melimetrics-local`.
- Seed confirmado: `schema|{"dataset": "synthetic", "version": 1}`.
- Dump sintético: `D:\MeliMetrics\supabase-data\foundation-data.sql`.
- O dump contém somente o schema privado de fundação e permanece fora do repositório.

## Limites

O Docker Desktop mantém suas camadas e volumes internos sob o gerenciamento global dele. O projeto grava o artefato persistente verificável em `D:\MeliMetrics\supabase-data`; nenhuma configuração global do Docker foi alterada.
