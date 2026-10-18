# ADR-002 — Runtimes fixados

## Decisão

Node `24.13.0`, npm `11.6.2`, Python `3.12.13` e uv `0.11.14` são os runtimes da fundação. Node e Python são declarados nos arquivos de pinagem e no CI.

## Consequência

Uma atualização de runtime é mudança explícita, com atualização de lockfiles e execução do gate G1.
