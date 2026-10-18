# G0 — Autorização de desenvolvimento sintético

**Decisão:** GO limitado  
**Data:** 2026-10-17 18:54 -03:00  
**Depende de:** `GATE-001` concluído  
**Escopo liberado:** fundação local, schema, segurança, contratos e testes com fixtures sintéticas.

## Permitido

- Instalar e fixar dependências locais.
- Criar Supabase local, migrações, RLS e dados sintéticos.
- Implementar contratos, testes, validações e stubs de provedores.
- Medir build, typecheck, carga sintética e limites locais.

## Proibido

- Conectar seller real ou executar OAuth contra conta produtiva.
- Armazenar Client Secret, access token, refresh token, HMAC ou `service_role`.
- Importar pedidos, anúncios, pagamentos, envios ou estoque reais.
- Provisionar ambiente remoto ou habilitar serviços pagos.

## Aceite

O grafo de dependências mantém `GATE-002` a `GATE-006` fora do caminho da fundação local e `G8` como bloqueio obrigatório para dados reais.
