# Evidências da Fase 0

Este diretório contém somente evidências sanitizadas e decisões dos gates obrigatórios do MeliMetrics.

| Gate | Estado em 17/10/2026 | Evidência |
|---|---|---|
| `GATE-001` | concluído | [baseline](GATE-001-baseline.md) |
| `G0` | concluído | [decisão sintética](G0-synthetic-go.md) |
| `GATE-002` | bloqueado | [provedores](GATE-002-providers.md) |
| `GATE-003` | bloqueado | [Mercado Livre](GATE-003-mercado-livre.md) |
| `GATE-004` | bloqueado por `GATE-003` | [dicionário](GATE-004-metrics.md) |
| `GATE-005` | bloqueado | [governança e backup](GATE-005-governance.md) |
| `GATE-006` | bloqueado por `GATE-002`/`GATE-003` | [capacidade](GATE-006-capacity.md) |

## Política de evidência

- Nenhum segredo, token, PII, Client Secret, refresh token, HMAC ou captura não redigida pode ser versionado.
- Capturas, dumps, backups e credenciais ficam fora do repositório, em armazenamento controlado pelo responsável do gate.
- Cada alteração deve atualizar o registro correspondente no `task.md` com responsável, data, comando, resultado e decisão.
- `BLOQUEADO` não equivale a `NO-GO` do produto inteiro: bloqueia somente o escopo do gate e qualquer entrada de dados reais dependente dele.
