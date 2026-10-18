# ADR-001 — npm como gerenciador único

## Decisão

O projeto usa npm `11.6.2`, `package-lock.json` e `npm ci`. O lockfile Bun foi removido para evitar duas fontes de resolução.

## Consequência

CI, documentação e desenvolvimento local executam os mesmos comandos. Atualizações de dependências exigem alteração deliberada do `package-lock.json` e validação completa.
