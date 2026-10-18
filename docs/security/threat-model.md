# Threat model — Fase 1

## Escopo

O modelo cobre tenant, Auth futuro, OAuth, Vault, webhook, HMAC, pipeline, exportação CSV, logs, supply chain e abuso de sincronização. A aplicação ainda não processa dados reais.

## Controles e parâmetros

| Ameaça | Prevenção | Detecção | Resposta | Dono | Verificação |
|---|---|---|---|---|---|
| Segredo no bundle | contrato sem segredos `VITE_*` | scanner e inspeção de `dist/` | revogar e remover artefato | engenharia | BASE-002/006 |
| Tenant cruzado | RLS deny-by-default na Fase 2 | testes de isolamento | bloquear release | engenharia | Fase 2 |
| Replay de HMAC | nonce, TTL e janela de relógio | log de rejeição sem payload | descartar solicitação | plataforma | Fase 5 |
| Webhook falsificado | assinatura e segredo rotacionável | métrica de falhas | quarentena | plataforma | Fase 4 |
| Dependência comprometida | lockfile, audit e ações por SHA | CI | atualizar/reverter | engenharia | BASE-001/006 |
| CSV com fórmula | neutralização antes da exportação | teste de células | bloquear exportação | frontend | Fase 7 |
| Abuso de sincronização | cooldown e limites | idade/frequência de jobs | suspender novos jobs | plataforma | Fase 5 |

## Parâmetros fixados

- `HMAC_CLOCK_SKEW_SECONDS=300`.
- `NONCE_TTL_SECONDS=900`.
- `KEY_ROTATION_OVERLAP_SECONDS=86400`.

Qualquer integração que não consiga aplicar esses controles permanece bloqueada.
