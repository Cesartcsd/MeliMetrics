# GATE-006 — Capacidade e stop conditions

**Estado:** BLOQUEADO para aprovação; orçamento inicial sintético preparado  
**Depende de:** `GATE-002`, `GATE-003`

## Parâmetros iniciais conservadores

| Parâmetro | Valor inicial | Observação |
|---|---:|---|
| `MAX_DB_BYTES` | 524288000 | quota Supabase documentada; revalidar |
| `WARN_DB_PERCENT` / `READONLY_DB_PERCENT` | 60 / 70 | stop condition interna |
| `MAX_RSS_MB` | 384 | margem sobre 512 MB; revalidar Render |
| `MAX_BATCH_SECONDS` | 40 | teto inicial do escopo |
| `MAX_BATCH_ITEMS` | 100 | limite inicial de lote |
| `MAX_CONCURRENCY` | 1 | uma instância Free |
| `MAX_EGRESS_MB_DAY` | 150 | orçamento conservador; revalidar quota |
| `MAX_EDGE_INVOCATIONS_DAY` | 15000 | abaixo da franquia mensal rateada |
| `MAX_QUEUE_DEPTH` | 100 | stop operacional inicial |
| `MAX_STALE_MINUTES` | 120 | quatro tentativas de 30 min |
| `MAX_DISPATCH_ATTEMPTS` / `MAX_EXECUTION_ATTEMPTS` | 3 / 5 | dead letter após limite |
| `MAX_JOB_AGE_SECONDS` | 86400 | idade máxima antes de dead letter |
| `LEASE_SECONDS` / `HEARTBEAT_SECONDS` | 90 / 30 | validar com cold start |
| `MAX_BACKOFF_SECONDS` | 900 | teto de backoff |

## Condição

Os valores são provisórios e não aprovam `GATE-006`. Após os limites dos provedores e a aplicação ML serem verificados, registrar fonte/data, recalcular com carga sintética de 12 mil anúncios e 200–250 pedidos/dia e então emitir `GO` ou `NO-GO`.

## Stop conditions

Modo somente leitura, bloqueio de backfill, redução de lote, suspensão de novos jobs e preservação dos últimos dados válidos quando banco, egress, RSS, fila, token ou serviço Free ultrapassarem os limites.
