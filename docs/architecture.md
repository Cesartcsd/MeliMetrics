# Arquitetura local da Fase 1

```text
React/Vite ── dados sintéticos ── Supabase local
                                    │
                                    └── pipeline FastAPI local
```

O frontend ainda não usa Auth, RLS ou dados remotos. O pacote Python expõe somente `GET /health`. OAuth, sincronização, jobs, domínio financeiro e integrações reais permanecem fora desta fase.

## Fronteiras

- `src/`, `components/` e `lib/`: interface e utilitários do frontend.
- `supabase/`: configuração, migrações e seed locais.
- `pipeline/`: pacote Python, configuração e testes do pipeline.
- `.github/workflows/`: verificações automatizadas sem credenciais reais.

## Regras de segurança

- Variáveis `VITE_*` são públicas e nunca carregam segredos privilegiados.
- Client Secret, tokens, HMAC e `service_role` não entram no repositório, bundle, logs ou artefatos.
- Toda validação de integração deve falhar antes de qualquer chamada externa quando a configuração estiver incompleta.
