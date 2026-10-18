# ADR-003 — Dados sintéticos até a aprovação dos gates

## Decisão

O desenvolvimento da Fase 1 usa somente fixtures locais. Não haverá seller, token OAuth, importação ou provisionamento remoto.

## Consequência

Os testes podem executar em CI sem credenciais. Qualquer entrada real exige os gates de provedores, Mercado Livre, privacidade, backup e capacidade.
