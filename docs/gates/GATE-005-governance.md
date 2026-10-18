# GATE-005 — Privacidade, retenção e backup

**Estado:** BLOQUEADO  
**Motivos:** responsável por privacidade/incidentes e destino externo de backup ainda não definidos.

## Inventário a completar

- Dados: conta seller, IDs externos, pedidos, itens, pagamentos, envios, custos, estoque, auditoria e webhooks.
- Finalidade: sincronização, conciliação, indicadores, suporte e auditoria mínima.
- Acesso: organização/member via RLS; pipeline somente por RPC interna; nenhum segredo no frontend.
- Retenção: separar fatos financeiros, logs, webhooks, jobs, auditoria e backups; não apagar evidência necessária.
- Direitos e incidentes: desconexão, exclusão, solicitação do titular, contato, triagem e comunicação.

## Critérios do backup

Destino fora do Supabase principal e GitHub; criptografia antes do envio; chave separada; manifesto/checksum; retenção aprovada; restauração em ambiente isolado; RPO/RTO interno sem promessa de SLA.

## Próximo passo bloqueado

Nomear responsável, contato e destino. Até lá, somente dump sintético pode ser criado e nenhuma entrada de seller real é autorizada.
