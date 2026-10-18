# GATE-002 — Provedores e custo zero

**Estado:** BLOQUEADO  
**Motivo:** não há acesso confirmado às contas Cloudflare, Supabase e Render.

## Matriz a preencher com acesso autorizado

| Provedor | Itens obrigatórios | Evidência exigida | Estado |
|---|---|---|---|
| Cloudflare Pages | plano, região, Pages estático, limites, Functions desativadas | captura redigida + URL oficial + data | pending_access |
| Supabase | plano, região, banco, egress, Edge invocations, Cron, backup e modo read-only | configuração redigida + quota exportada | pending_access |
| Render | Web Service Free, CPU/RAM, horas, hibernação, bandwidth, build e ausência de cartão | configuração redigida + plano + data | pending_access |

## Critério de liberação

Nenhum upgrade, cartão, add-on, worker, cron pago ou serviço paralelo pode estar ativo. Cada limite deve possuir responsável, stop condition e fonte datada. Enquanto isso, `G0` continua sendo a única autorização operacional.
