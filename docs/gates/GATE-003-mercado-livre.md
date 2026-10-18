# GATE-003 — Aplicação Mercado Livre

**Estado:** BLOQUEADO  
**Motivo:** não há acesso ao console da aplicação ML nem conta administradora de teste.

## Matriz documental

| Domínio | Endpoints/tópicos a verificar | Classificação atual |
|---|---|---|
| `orders` | pedidos, itens, status, alterações e paginação | pending_pilot |
| `finance` | pagamentos, tarifas, ajustes, reversões e conciliação | pending_pilot |
| `inventory` | estoque próprio, Full, trânsito e indisponível | pending_pilot |
| `listings` | anúncios, variações, catálogo e atributos | pending_pilot |

## Configuração necessária

- Redirect local e remoto devem ser registrados exatamente como cadastrados no console.
- PKCE, state descartável, tópicos de webhook e permissões declaradas devem ser conferidos.
- `/users/me`, refresh, revogação e permissões efetivas serão testados somente no piloto após `G8`.
- Nenhum Client Secret, token, identificador sensível ou payload de seller será salvo neste documento.

## Critério de liberação

Cada domínio será classificado como `viable`, `not_viable` ou `pending_pilot`; indisponibilidade financeira/Full produz estado `incomplete`, não tarifa ou estoque inventado.
