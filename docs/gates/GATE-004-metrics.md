# GATE-004 — Dicionário de métricas

**Estado:** BLOQUEADO por `GATE-003`; contrato sintético preparado  
**Timezone operacional:** `America/Sao_Paulo`  
**Datas de armazenamento:** UTC  
**Valores:** PostgreSQL `numeric`, Python `Decimal`, JSON decimal string

## Regras provisórias para aprovação

| Métrica | Regra | Ausência/fonte não confirmada |
|---|---|---|
| GMV | soma de itens de pedidos válidos antes das deduções | `incomplete` |
| Pedidos | contagem distinta de pedido externo no recorte | não definido com zero pedidos |
| Vendas líquidas | GMV menos cancelamentos, devoluções e abatimentos associados | `incomplete` |
| Tarifas/frete | somente lançamentos efetivamente atribuídos pela origem | não fabricar percentual |
| CMV | quantidade × custo histórico vigente do SKU | `incomplete` |
| Margem | receita operacional líquida menos tarifas, frete, CMV e custos variáveis identificados | nunca chamar de lucro líquido |
| Curva ABC | ordenação da métrica aprovada e acumulado documentado | dados insuficientes |
| Cobertura | estoque utilizável ÷ média diária vendida em janela válida | exige `lead_time_days` vigente |

## Fixtures obrigatórias

Venda normal, cancelamento, devolução parcial, tarifa alterada, frete do vendedor, custo ausente, kit, variação, receita zero, atualização tardia e duplicação.

## Bloqueio

As fontes ficam `pending_pilot` até `GATE-003` e só podem virar `confirmed` após conciliação de `PILOT-005`. Valores provisórios nunca são publicados como definitivos.
