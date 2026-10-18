# MeliMetrics PRO — Backlog mestre do MVP 1.0

> **Documento-fonte:** `escopo_mvp.md` v1.1  
> **Data do baseline:** 17/10/2026  
> **Estado:** Fase 1 concluída; integração real P0 não iniciada; PR aguardando revisão  
> **Próxima tarefa desbloqueada:** `F2-001 — Iniciar autenticação, organizações e RLS`  
> **Meta de liberação:** piloto técnico controlado, sem SLA, para uma organização, quatro contas Mercado Livre e até cinco usuários

## 1. Objetivo e limites

[Certo] Este arquivo é a fonte operacional de verdade para transformar o protótipo atual em um MVP real, seguro, multi-tenant e verificável.

### Incluído no MVP P0

- Autenticação real, organizações, membros, papéis e isolamento por RLS.
- OAuth Mercado Livre, armazenamento seguro de credenciais e desconexão.
- Fila persistente, webhooks, agendamento, watchdog, leases e checkpoints.
- Pipeline Python/FastAPI incremental, idempotente e recuperável.
- Pedidos, itens, anúncios, variações, SKUs, kits, custos, estoque e componentes financeiros autorizados.
- Resumo, financeiro gerencial, produtos/estoque, administração, alertas e CSV.
- Observabilidade, limites de uso, modo degradado, backup, privacidade e liberação controlada do piloto.

### Fora do MVP P0

- Reprecificação, Buy Box, criação de remessas, etiquetas e campanhas automáticas.
- Ads completo, concorrência avançada, previsões e machine learning.
- PDFs elaborados, relatórios agendados e promessas de tempo real.
- VPS, Redis, Celery, worker pago, Render Cron Job pago ou GitHub Actions como scheduler operacional.
- Disponibilidade 24/7, SLA rígido de 30 minutos ou importação histórica ilimitada.

## 2. Como usar este backlog

### Estados

- `[ ]`: pendente ou em andamento; consultar o campo **Estado**.
- `[x]`: concluída, com todos os critérios atendidos e evidências registradas.
- `BLOQUEADO`: depende de decisão, credencial, autorização ou estado externo.
- `NO-GO`: falha que impede avanço para o próximo gate ou uso de dados reais.

### Regra de execução

1. Selecionar apenas tarefa cujas dependências estejam concluídas.
2. Alterar o campo **Estado** para `em andamento` antes da implementação.
3. Implementar somente o escopo descrito na tarefa.
4. Executar os testes e critérios de aceite indicados.
5. Registrar comandos, resultados, commit/PR e documentação no campo **Evidência**.
6. Marcar `[x]` somente quando a definição de pronto estiver integralmente atendida.
7. Atualizar **Próxima tarefa desbloqueada** ao encerrar cada tarefa.
8. Se surgir impedimento externo, registrar em **Bloqueios ativos**; não contornar segurança, limites gratuitos ou gates.

### Definição global de pronto

Uma tarefa técnica só está pronta quando:

- o comportamento foi implementado sem segredos, mocks ou ações fictícias em produção;
- erros e estados degradados previstos foram tratados;
- testes automatizados relevantes foram adicionados e passaram;
- typecheck, lint, testes e build das áreas afetadas passaram;
- documentação e contratos afetados foram atualizados;
- logs não contêm tokens, credenciais, PII desnecessária ou payload sensível;
- não houve regressão de RLS, idempotência, acessibilidade ou compatibilidade;
- as evidências reproduzíveis foram registradas na tarefa.

## 3. Baseline verificado

| Área | Estado atual | Evidência |
|---|---|---|
| Frontend | [Certo] React 19, TypeScript, Vite e Tailwind compilam. | `npm run lint` e `npm run build` passaram em 17/10/2026. |
| Bundle | [Certo] O bundle principal possui aproximadamente 852 kB e gera alerta acima de 500 kB. | Saída atual do Vite. |
| Autenticação | [Certo] Simulada por `localStorage`; qualquer e-mail e senha não vazios entram. | `src/App.tsx` e `components/Login.tsx`. |
| Dados | [Certo] Indicadores e entidades vêm de mocks locais. | `lib/mockData.ts` e `lib/categoriesData.ts`. |
| Rotas | [Certo] Navegação usa `window.history` manual, sem roteador e sem guards. | `components/DashboardShell.tsx`. |
| Supabase | [Certo] Não há cliente, migrações, RLS, Edge Functions ou configuração local. | Diretórios e dependências ausentes. |
| Pipeline | [Certo] Não há Python, FastAPI, cliente ML, jobs ou configuração Render. | Diretório `pipeline/` ausente. |
| Testes | [Certo] Não há testes unitários, de integração, banco, Edge ou E2E. | Scripts e arquivos de teste ausentes. |
| CI/CD | [Certo] Não há workflows, deploy reproduzível ou rollback documentado. | Diretório `.github/workflows/` ausente. |
| Configuração | [Certo] `.env.example` está vazio. | Arquivo atual com zero bytes. |
| Segurança funcional | [Certo] A interface ainda pede Client Secret e exibe conceitos de segredo no navegador. | `components/views/ConfiguracoesApi.tsx`. |
| Exportação | [Certo] CSV escapa aspas, mas não neutraliza formula injection. | `lib/exportUtils.ts`. |
| Worktree | [Certo] Existem alterações e arquivos não versionados anteriores a este backlog. | `git status --short` de 17/10/2026. |

### Regra de preservação

[Certo] Nenhuma tarefa autoriza `git reset --hard`, descarte de alterações, sobrescrita indiscriminada ou remoção de arquivos atuais. Qualquer conflito com o baseline deve ser analisado e registrado antes da edição.

## 4. Decisões técnicas bloqueadas no MVP

| Tema | Decisão P0 |
|---|---|
| Hospedagem | Cloudflare Pages Free para o frontend estático; Supabase Free para Auth/PostgreSQL/Edge/Cron; um Render Free Web Service para FastAPI. |
| Pacotes frontend | Padronizar npm e manter um único lockfile após preservar o baseline. |
| Login | Supabase Auth, sem cadastro público; usuários entram por convite. |
| Tenant | Uma organização piloto; `organization_id` validado no servidor e protegido por RLS. |
| Papéis | `admin`, `manager`, `analyst`; a UI reflete capacidades, mas o backend aplica autorização. |
| Rotas P0 | `/resumo`, `/financeiro`, `/produtos`, `/administracao`. |
| Filtros | Contas e período na URL; organização derivada da sessão; timezone fixo `America/Sao_Paulo`. |
| Dinheiro | PostgreSQL `numeric`, Python `Decimal` e decimal como string em JSON; o frontend não calcula totais financeiros. |
| IDs externos | Armazenar como texto para evitar perda de precisão no JavaScript. |
| Datas | UTC no banco e conversão apenas na apresentação. |
| Credenciais OAuth | Supabase Vault com acesso somente por funções privilegiadas; nunca via PostgREST ao navegador. |
| Acesso do pipeline | Role PostgreSQL dedicada, sem `service_role`, com permissão somente para RPCs internas necessárias. |
| Webhook | Aviso persistido e deduplicado; a API autorizada continua sendo a fonte definitiva do recurso. |
| Sincronização | Tentativa agendada, não promessa de tempo real; sucesso somente após persistência. |
| Mocks | Permitidos apenas em testes/fixtures; não podem entrar no bundle de produção. |
| Métrica financeira | Usar “margem de contribuição”; “lucro líquido” é proibido quando faltarem impostos, Ads ou despesas relevantes. |
| Piloto | Uma conta primeiro; ampliar para quatro somente após conciliação, segurança e capacidade medidas. |

### Estados e enums canônicos

- `SyncJobStatus`: `queued | running | retry_wait | succeeded | failed | dead_letter | cancelled`.
- `partial`: progresso derivado; não é estado persistido do job.
- `delayed`: estado derivado de frescor; não é estado persistido do job.
- `already_queued`: resultado do enqueue; não é estado persistido do job.
- Domínios: `orders | finance | inventory | listings`.
- Motivos: `initial_backfill | scheduled | webhook | manual | reconciliation | retry`.
- Conciliação: `reconciled | provisional | incomplete`.
- Frescor: `ok | delayed | error | never_synced`.
- Estado OAuth: `pending | active | refresh_required | revoked | error`.
- Severidade de alerta: `info | warning | critical`.

### Máquina de estados de sincronização

| Origem | Destino permitido | Autoridade | Invariante |
|---|---|---|---|
| criação | `queued` | Edge/RPC de enqueue | Job nasce sem lease e com chave de coalescência. |
| `queued` | `queued` | Edge scheduler/watchdog | Falha antes do claim registra tentativa de despacho, erro e `next_dispatch_at`, sem fingir execução. |
| `queued` | `running` | Pipeline via claim atômico | Define owner, fencing token, heartbeat e vencimento do lease. |
| `queued` | `dead_letter` | Watchdog | Tentativas de despacho ou idade máxima esgotadas sem claim. |
| `queued` | `cancelled` | Edge/RPC autorizada | Cancelamento antes do claim é imediato. |
| `running` | `succeeded` | Pipeline | Somente após persistência e checkpoint final confirmados. |
| `running` | `retry_wait` | Pipeline ou watchdog | Exige erro recuperável, `next_attempt_at` e incremento de tentativa. |
| `running` | `failed` | Pipeline | Erro terminal não recuperável; requer código estável e evidência. |
| `running` | `cancelled` | Pipeline | O executor reconhece `cancel_requested_at` em ponto seguro e libera o lease. |
| `retry_wait` | `queued` | Scheduler/watchdog | Apenas após `next_attempt_at` e dentro do orçamento de tentativas. |
| `retry_wait` | `dead_letter` | Watchdog | Orçamento de tentativas ou idade máxima esgotado. |
| `retry_wait` | `cancelled` | Edge/RPC autorizada | Não volta à fila depois do cancelamento. |

- `succeeded`, `failed`, `dead_letter` e `cancelled` são terminais e imutáveis.
- Retry manual de estado terminal cria novo job com motivo `retry` e referência `parent_job_id`; não reabre o registro anterior.
- Lease existe somente em `running`; toda gravação do worker valida job, owner e fencing token para impedir worker zumbi.
- Tentativas de despacho e de execução possuem contadores separados; scheduler considera `next_dispatch_at`, pipeline considera `next_attempt_at`.
- `GATE-006` fixa numericamente tentativas máximas, idade do job, lease, heartbeat e teto de backoff; nenhum loop pode ser ilimitado.
- Admin/manager podem solicitar cancelamento; o banco realiza cancelamento imediato em espera ou registra `cancel_requested_at` para execução cooperativa.

### Fluxo de dependências

```text
Baseline preservado (GATE-001)
                ↓
Fundação + schema-base + threat model, somente com dados sintéticos
                ↓
Auth + organizações + RLS
                ↓
Schema de domínio + contratos + RPCs
                ↓
OAuth + Edge + fila persistente ← gates externos aplicáveis
                ↓
FastAPI + ingestão incremental
                ↓
Domínio financeiro, SKUs, estoque e alertas ← dicionário aprovado
                ↓
Frontend conectado e sem mocks
                ↓
Segurança final + deploy + backup + operação
                ↓
Gate de dados reais → piloto: 1 conta → 4 contas → catálogo completo
```

---

# Fase 0 — Gates obrigatórios

## [x] GATE-001 — Preservar e registrar o baseline do repositório

- **Prioridade:** P0
- **Estado:** concluído — 2026-10-17
- **Depende de:** nenhuma
- **Entrega:** inventário das alterações existentes, branch/commit de baseline acordado e proibição explícita de descartes destrutivos.
- **Aceite:** cada arquivo modificado ou não rastreado possui origem conhecida; o trabalho atual pode ser recuperado; nenhuma alteração do usuário foi perdida.
- **Testes:** `git status --short`, diff revisado e build atual registrado.
- **Evidência:** [`docs/gates/GATE-001-baseline.md`](docs/gates/GATE-001-baseline.md); pacote externo e manifesto SHA-256 verificados.
- **Risco:** misturar o protótipo atual com infraestrutura nova e perder trabalho válido.

## [ ] GATE-002 — Validar provedores e política de custo zero

- **Prioridade:** P0
- **Estado:** BLOQUEADO — requer acesso às contas dos provedores
- **Depende de:** `GATE-001`
- **Entrega:** matriz datada de limites, cobrança, suspensão, regiões e recursos disponíveis em Cloudflare, Supabase e Render.
- **Aceite:** contas sem método de pagamento/upgrade; serviços selecionados são gratuitos; stop conditions e responsáveis estão documentados.
- **Testes:** capturas ou exportações das configurações, sem IDs sensíveis; links oficiais e data da verificação.
- **Evidência:** [`docs/gates/GATE-002-providers.md`](docs/gates/GATE-002-providers.md); acesso às contas ainda não fornecido.
- **Risco:** franquias e condições podem mudar ou exigir checkout mesmo com uso gratuito.

## [ ] GATE-003 — Validar configuração e viabilidade da aplicação Mercado Livre

- **Prioridade:** P0
- **Estado:** BLOQUEADO — requer aplicação ML e conta administradora de teste
- **Depende de:** `GATE-001`
- **Entrega:** matriz documental de endpoints, tópicos, redirect URI, PKCE, permissões declaradas e elegibilidade esperada para pedidos, anúncios, variações, envios, estoque e dados financeiros.
- **Aceite:** configuração da aplicação e redirect estão verificadas no console do provedor; cada domínio está classificado como “viável”, “não viável” ou “pendente de validação no piloto”; nenhum dado do seller é coletado nesta fase.
- **Testes:** revisão da configuração, documentação oficial e contratos/fixtures sintéticas; OAuth, refresh, revogação e permissões efetivas serão comprovados em `PILOT-002` a `PILOT-005`, somente após `G8`.
- **Evidência:** [`docs/gates/GATE-003-mercado-livre.md`](docs/gates/GATE-003-mercado-livre.md); console da aplicação e conta de teste ainda não fornecidos.
- **Risco:** financeiro ou estoque Full não estarem disponíveis para o seller/aplicação.

## [ ] GATE-004 — Aprovar o dicionário de métricas

- **Prioridade:** P0
- **Estado:** BLOQUEADO — contrato sintético preparado; requer `GATE-003` para confirmar fontes
- **Depende de:** `GATE-003`
- **Entrega:** definição versionada de pedidos válidos, GMV, vendas líquidas, tarifas, frete, devoluções, CMV, margem, Curva ABC, cobertura, lead time e comparações.
- **Aceite:** cada componente possui fonte planejada, data de referência/vigência, status incluídos/excluídos, tratamento de ausência e regra de arredondamento; fontes ficam classificadas como `confirmed`, `pending_pilot` ou `unavailable`; `pending_pilot`/`unavailable` obrigam estado `incomplete`, mas não bloqueiam a aprovação do contrato; cobertura abaixo do lead time só existe com `lead_time_days` válido.
- **Testes:** fixtures calculadas manualmente para venda normal, cancelamento, devolução parcial, tarifa alterada, frete do vendedor, custo ausente, kit e variação.
- **Evidência:** [`docs/gates/GATE-004-metrics.md`](docs/gates/GATE-004-metrics.md); aprovação final pendente.
- **Risco:** dashboards diferentes apresentarem números incompatíveis ou falsa precisão.

## [ ] GATE-005 — Definir privacidade, retenção e backup

- **Prioridade:** P0
- **Estado:** BLOQUEADO — requer responsável e destino externo
- **Depende de:** `GATE-002`
- **Entrega:** responsável por privacidade/incidentes, mapa de dados, retenção, descarte, RPO/RTO internos, destino externo criptografado e procedimento de restauração.
- **Aceite:** destino não é o mesmo projeto Supabase nem o GitHub; chave de recuperação fica separada; responsável e contato estão preenchidos.
- **Testes:** restauração de dump sintético em ambiente isolado.
- **Evidência:** [`docs/gates/GATE-005-governance.md`](docs/gates/GATE-005-governance.md); responsável e destino externo ainda não definidos.
- **Risco:** perda irreversível ou tratamento de dados reais sem base operacional adequada.

## [ ] GATE-006 — Fixar orçamento de capacidade e stop conditions

- **Prioridade:** P0
- **Estado:** BLOQUEADO — orçamento inicial preparado; requer `GATE-002` e `GATE-003`
- **Depende de:** `GATE-002`, `GATE-003`
- **Entrega:** orçamento para banco, egress, invocações, horas Render, tempo/lote e thresholds de suspensão.
- **Aceite:** publicar, sem `TBD`, valores numéricos, unidades, fonte e data para `MAX_DB_BYTES`, alertas de 60%/70%, `MAX_RSS_MB`, `MAX_BATCH_SECONDS`, `MAX_BATCH_ITEMS`, `MAX_CONCURRENCY`, `MAX_EGRESS_MB_DAY`, `MAX_EDGE_INVOCATIONS_DAY`, `MAX_QUEUE_DEPTH`, `MAX_STALE_MINUTES`, `MAX_DISPATCH_ATTEMPTS`, `MAX_EXECUTION_ATTEMPTS`, `MAX_JOB_AGE_SECONDS`, `LEASE_SECONDS`, `HEARTBEAT_SECONDS`, `MAX_BACKOFF_SECONDS` e perfil de dispositivo/rede do frontend; modo leitura antecede o limite crítico.
- **Testes:** planilha ou relatório reproduzível com carga sintética equivalente ao piloto; valores serão recalibrados com amostras sanitizadas somente após `G8`.
- **Evidência:** [`docs/gates/GATE-006-capacity.md`](docs/gates/GATE-006-capacity.md); valores provisórios não liberam o gate.
- **Risco:** consumir a franquia durante backfill e interromper o piloto.

## [x] G0 — Autorizar implementação local com dados sintéticos

- **Prioridade:** P0
- **Estado:** concluído — GO limitado em 2026-10-17
- **Depende de:** `GATE-001`
- **Entrega:** decisão registrada que libera apenas fundação, segurança, schema e testes locais com fixtures.
- **Aceite:** baseline preservado e bloqueios externos registrados; enquanto `GATE-002` a `GATE-006` estiverem pendentes, somente fundação, segurança, schema e testes com dados sintéticos podem avançar. Integração real respeita as dependências específicas e `G8` continua bloqueando dados do seller.
- **Testes:** revisar o grafo de dependências e provar que nenhum comando local exige credencial ou dado real.
- **Evidência:** [`docs/gates/G0-synthetic-go.md`](docs/gates/G0-synthetic-go.md); `GATE-001` concluído e bloqueios externos preservados.
- **Risco:** confundir autorização para desenvolvimento local com autorização para tratar dados reais.

---

# Fase 1 — Fundação reproduzível

## [x] BASE-001 — Padronizar ferramentas e dependências

- **Prioridade:** P0
- **Estado:** concluído em 17/10/2026
- **Depende de:** `G0`
- **Entrega:** npm como gerenciador único, remoção controlada do lockfile Bun após baseline, `package-lock.json` versionado, runtimes Node/Python fixados, pacote renomeado, scripts separados (`typecheck`, `lint`, testes, `build`, `verify`) e `.gitignore` cobrindo build, cobertura, Playwright, Supabase local e caches Python.
- **Aceite:** clone limpo instala dependências deterministicamente; nomes/scripts refletem MeliMetrics; dependências sem uso são removidas após confirmação; `verify` não deixa artefatos inesperados no worktree.
- **Testes:** instalação limpa com `npm ci`, auditoria de dependências, `verify`, build e `git status --short` antes/depois.
- **Evidência:** `package.json`, `package-lock.json`, `.node-version`, `.python-version`, `.npmrc`, `npm ci` e `npm run verify:frontend` aprovados em checkout isolado.
- **Risco:** diferenças entre ambiente local, CI e provedores.

## [x] BASE-002 — Criar estrutura e contrato de configuração

- **Prioridade:** P0
- **Estado:** concluído em 17/10/2026
- **Depende de:** `BASE-001`
- **Entrega:** estruturas `supabase/` e `pipeline/`, exemplos de variáveis separados por serviço e validação fail-fast.
- **Aceite:** apenas URL e anon key públicas usam `VITE_`; nenhum segredo privilegiado pode entrar no bundle.
- **Testes:** build inspecionado por padrões de segredo; inicialização falha com mensagem segura quando variável obrigatória está ausente.
- **Evidência:** `lib/clientEnv.ts`, `.env.example`, `pipeline/.env.example`, `supabase/.env.example`, scanner local sem achados e inspeção do bundle concluída.
- **Risco:** vazamento de `service_role`, Client Secret, tokens ou HMAC.

## [x] BASE-003 — Preparar Supabase local com dados sintéticos

- **Prioridade:** P0
- **Estado:** concluído em 18/10/2026
- **Depende de:** `BASE-002`
- **Entrega:** configuração Supabase CLI, migração inicial mínima, seed sem dados reais e comandos reproduzíveis de reset.
- **Aceite:** `supabase start` e `supabase db reset` constroem o ambiente sem etapas manuais ocultas.
- **Testes:** reset repetido produz o mesmo schema e seed.
- **Evidência:** `npx supabase start --ignore-health-check`, `npx supabase db reset` e consulta do seed sintético aprovados; dump gravado em `D:\MeliMetrics\supabase-data\foundation-data.sql`.
- **Risco:** desenvolvimento depender do projeto remoto do piloto.

## [x] BASE-004 — Criar fundação de testes frontend

- **Prioridade:** P0
- **Estado:** concluído em 17/10/2026
- **Depende de:** `BASE-001`
- **Entrega:** Vitest, Testing Library, user-event, Axe e configuração Playwright com dados sintéticos.
- **Aceite:** testes unitários e um smoke E2E executam localmente e no CI sem credenciais reais.
- **Testes:** sessão simulada, rota protegida, viewport desktop e 375 px.
- **Evidência:** Vitest/Axe e Playwright configurados; `npm run verify:frontend` aprovado; `npm run test:e2e` aprovado em desktop e 375 px.
- **Risco:** integrar telas sem proteção contra regressão.

## [x] BASE-005 — Criar fundação do pipeline Python

- **Prioridade:** P0
- **Estado:** concluído em 17/10/2026
- **Depende de:** `BASE-002`
- **Entrega:** pacote Python, FastAPI mínimo, configuração tipada, Ruff, análise de tipos, pytest, pytest-asyncio e respx.
- **Aceite:** ambiente reproduzível; configuração é validada; nenhum segredo aparece em exceções.
- **Testes:** lint, tipos, unitário mínimo e import do app.
- **Evidência:** `pipeline/pyproject.toml`, `pipeline/uv.lock`, FastAPI `/health`; `uv sync --frozen`, Ruff, mypy e 3 testes aprovados.
- **Risco:** acoplamento precoce entre framework e regras financeiras.

## [x] BASE-006 — Criar CI obrigatório

- **Prioridade:** P0
- **Estado:** concluído em 18/10/2026; CI remoto verde e branch protection ativa na `main`.
- **Depende de:** `BASE-003`, `BASE-004`, `BASE-005`
- **Entrega:** jobs paralelos para frontend, banco/Edge, Python e segurança; versões das ações fixadas, permissões mínimas e cancelamento de execuções obsoletas.
- **Aceite:** CI usa `npm ci`, ambiente Python travado e Supabase CLI fixada; não exige token ML real; checks obrigatórios protegem a branch principal; artefatos nunca incluem dump, payload ou segredo.
- **Testes:** workflow em branch de teste, inclusive falha intencional controlada.
- **Evidência:** `.github/workflows/ci.yml`; PR [#1](https://github.com/Cesartcsd/MeliMetrics/pull/1); run [39124216298](https://github.com/Cesartcsd/MeliMetrics/actions/runs/39124216298) com `frontend`, `supabase`, `pipeline` e `security` aprovados; proteção da `main` exige os quatro checks e uma aprovação.
- **Risco:** merge de código não verificável ou exposição de artefatos sensíveis.

## [ ] BASE-007 — Documentar setup e decisões arquiteturais

- **Prioridade:** P0
- **Estado:** concluído localmente em 18/10/2026; publicação do CI ainda pendente.
- **Depende de:** `BASE-002`, `BASE-006`
- **Entrega:** README, arquitetura, política de segredos, comandos, ambientes, ADRs das decisões críticas e versionamento de `escopo_mvp.md`/`task.md` como documentos de produto e execução.
- **Aceite:** pessoa sem contexto configura ambiente local somente com a documentação e dados sintéticos.
- **Testes:** walkthrough em clone limpo.
- **Evidência:** `README.md`, `docs/architecture.md`, `docs/adr/001-003`, `docs/security/threat-model.md` e `docs/foundation/G1-local.md`; walkthrough local com reset e dump sintético em `D:\MeliMetrics\supabase-data`.
- **Risco:** conhecimento operacional ficar implícito ou concentrado em uma pessoa.

## [x] SEC-000 — Modelar ameaças antes das integrações

- **Prioridade:** P0
- **Estado:** concluído em 17/10/2026
- **Depende de:** `BASE-002`
- **Entrega:** threat model arquitetural para tenant, Auth, OAuth, Vault, webhook, HMAC, pipeline, CSV, logs, supply chain e abuso de sincronização, com fronteiras de confiança e controles atribuídos a tarefas.
- **Aceite:** cada ameaça crítica possui prevenção, detecção, resposta, proprietário e tarefa de verificação; publicar valores numéricos para `HMAC_CLOCK_SKEW_SECONDS`, `NONCE_TTL_SECONDS` e `KEY_ROTATION_OVERLAP_SECONDS`; risco crítico ou parâmetro de segurança indefinido bloqueia a fase correspondente.
- **Testes:** revisão por abuso de fluxo, STRIDE ou método equivalente; rastreabilidade entre ameaça, controle e teste negativo.
- **Evidência:** `docs/security/threat-model.md` com STRIDE, controles, responsáveis, verificações e parâmetros HMAC/nonce/rotação.
- **Risco:** descobrir tarde que a arquitetura expõe segredo, tenant ou endpoint interno.

## [x] G1 — Aprovar fundação reproduzível

- **Prioridade:** P0
- **Estado:** GO em 18/10/2026; PR aberto para revisão, sem merge automático.
- **Depende de:** `BASE-001` a `BASE-007`, `SEC-000`
- **Entrega:** decisão formal sobre reprodutibilidade, segurança-base e prontidão do ambiente sintético.
- **Aceite:** clone limpo executa verificação completa; worktree permanece limpo; scanner não encontra segredos.
- **Testes:** repetir instalação, reset, suítes mínimas e scanner em clone limpo.
- **Evidência:** `docs/foundation/G1-local.md`; `npm run verify` local aprovado; run remoto [39124216298](https://github.com/Cesartcsd/MeliMetrics/actions/runs/39124216298) verde; branch protection da `main` verificada via API com checks obrigatórios, aprovação obrigatória, resolução de conversas e force-push/deleção bloqueados.
- **Risco:** avançar com ambiente não reproduzível ou controles de segurança sem proprietário.

---

# Fase 2 — Autenticação, organizações e RLS

## [ ] DB-001 — Criar schemas, extensões e enums canônicos

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `BASE-003`, `SEC-000`
- **Entrega:** schemas público/privado, extensões necessárias e enums listados na seção 4, antes das tabelas de identidade e domínio.
- **Aceite:** migração é idempotente e enums não divergem entre banco, Edge, Python e frontend.
- **Testes:** reset local, upgrade e teste de valores inválidos.
- **Evidência:** _a preencher_.
- **Risco:** tabelas de identidade nascerem antes da fundação de schema e dos controles definidos.

## [ ] IAM-001 — Integrar Supabase Auth no frontend

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G1`
- **Entrega:** cliente Supabase, sessão, login, logout, recuperação segura e listener de autenticação.
- **Aceite:** `localStorage` não decide autenticação; sessão expirada remove dados protegidos e redireciona ao login.
- **Testes:** credencial inválida, sessão restaurada, logout, expiração e rede indisponível.
- **Evidência:** _a preencher_.
- **Risco:** flash de conteúdo protegido ou sessão falsa no navegador.

## [ ] IAM-002 — Modelar organizações, membros, convites e limites

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `IAM-001`, `DB-001`
- **Entrega:** `organizations`, `organization_members`, `organization_invitations`, limites de contas/membros e vínculos com `auth.users`.
- **Aceite:** uma pessoa pode pertencer somente às organizações autorizadas; convite expira e não concede papel além do definido.
- **Testes:** convite válido, expirado, reutilizado, membro desativado e limite excedido.
- **Evidência:** _a preencher_.
- **Risco:** escalada de papel ou criação arbitrária de tenant.

## [ ] IAM-003 — Implementar helpers e políticas RLS

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `IAM-002`
- **Entrega:** funções seguras de membership/role, RLS com negação padrão e `search_path` fixo em funções privilegiadas.
- **Aceite:** `anon` não lê dados; usuário A não acessa nenhuma linha, view ou RPC da organização B.
- **Testes:** SELECT, INSERT, UPDATE, DELETE e RPC com IDs adulterados.
- **Evidência:** _a preencher_.
- **Risco:** policy recursiva, view sem barreira ou `SECURITY DEFINER` permissiva.

## [ ] IAM-004 — Criar bootstrap e gestão de equipe por convite

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `IAM-003`
- **Entrega:** bootstrap auditado do primeiro admin, convite de manager/analyst, desativação e mudança de papel por admin.
- **Aceite:** não existe cadastro público; nenhuma pessoa pode elevar o próprio papel.
- **Testes:** matriz completa de papéis e tentativas de autoelevação.
- **Evidência:** _a preencher_.
- **Risco:** bloqueio administrativo ou privilégios excessivos.

## [ ] IAM-005 — Aplicar guards e capacidades na interface

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `IAM-004`
- **Entrega:** rotas protegidas, contexto de membership e ocultação/desabilitação coerente de ações por papel.
- **Aceite:** admin gerencia; manager lê e solicita sync; analyst lê/exporta; backend continua sendo autoridade final.
- **Testes:** deep links, voltar/avançar, role alterada durante sessão e `403` do backend.
- **Evidência:** _a preencher_.
- **Risco:** confundir restrição visual com autorização real.

## [ ] IAM-006 — Provar isolamento multi-tenant

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `IAM-003`, `IAM-005`
- **Entrega:** suíte pgTAP e E2E para tabelas/helpers de identidade e membership, com organizações A/B e os três papéis.
- **Aceite:** zero leitura ou mutação cruzada nas superfícies existentes desta fase; qualquer falha é `NO-GO`; exportações e jobs serão comprovados em `FE-011`, `EDGE-006`, `QA-001` e `G8` quando existirem.
- **Testes:** manipulação de URL, corpo, querystring, JWT e IDs de membership/organização conhecidos de outro tenant.
- **Evidência:** _a preencher_.
- **Risco:** vazamento de dados entre clientes.

## [ ] G2 — Aprovar identidade e isolamento

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001`, `IAM-001` a `IAM-006`
- **Entrega:** decisão formal sobre identidade, autorização e isolamento multi-tenant.
- **Aceite:** autenticação real, convite, papéis e RLS passam em CI; nenhum segredo está no cliente.
- **Testes:** executar matriz A/B de autenticação, membership e leitura/escrita das tabelas de identidade para cada papel; manter cenários de export/job como critérios futuros rastreados.
- **Evidência:** relatório de testes RLS e fluxos E2E.
- **Risco:** qualquer caminho sem RLS ou autorização permitir vazamento entre organizações.

---

# Fase 3 — Banco, contratos e integridade

## [ ] DB-002 — Modelar contas seller e credenciais OAuth

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G2`, `DB-001`
- **Entrega:** `seller_accounts`, `oauth_attempts` e referências a segredos do Vault, sem tokens em tabela pública.
- **Aceite:** navegador vê apenas metadados; `state` é único, descartável e expira; seller externo não duplica na organização.
- **Testes:** replay, estado expirado, seller duplicado e leitura anon.
- **Evidência:** _a preencher_.
- **Risco:** associação OAuth ao tenant errado ou exposição do token.

## [ ] DB-003 — Modelar fila, checkpoints, webhooks e nonces

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001`, `DB-002`
- **Entrega:** `sync_jobs`, `sync_checkpoints`, `webhook_inbox`, nonces antirreplay e RPCs de enqueue/dispatch/claim/heartbeat/checkpoint/finalização/cancelamento, implementando a máquina de estados canônica e contadores separados de despacho/execução.
- **Aceite:** enqueue coalesce jobs equivalentes; falha pré-claim agenda novo despacho com backoff; claim é atômico; lease vencido pode ser retomado; estado terminal é imutável; retry manual cria job filho; evento repetido não duplica trabalho.
- **Testes:** cada transição válida e inválida, falha repetida de despacho, expiração por idade, concorrência, fencing token, cancelamento cooperativo, crash após checkpoint, retry, dead letter e replay.
- **Evidência:** _a preencher_.
- **Risco:** execução dupla entre scheduler, webhook, usuário e watchdog.

## [ ] DB-004 — Modelar pedidos e fatos financeiros

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001`, `GATE-004`
- **Entrega:** `orders`, `order_items`, `payments`, `financial_entries`, `shipments` e `shipping_costs` com fonte e timestamps.
- **Aceite:** chaves idempotentes impedem duplicação; ajustes/reversões são rastreáveis; PII é minimizada.
- **Testes:** pedido repetido, cancelado, carrinho, devolução parcial, tarifa e frete alterados.
- **Evidência:** _a preencher_.
- **Risco:** dupla dedução ou perda da trilha de conciliação.

## [ ] DB-005 — Modelar catálogo, SKUs, kits, custos e estoque

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001`
- **Entrega:** `listings`, `variations`, `skus`, `listing_sku_links`, `kit_components`, `product_cost_history`, `sku_supply_parameter_history` e `inventory_snapshots`.
- **Aceite:** MLB não é tratado como SKU; várias listagens podem apontar ao mesmo SKU; estoque mantém origem logística separada; `lead_time_days` positivo possui vigência, fonte e autor.
- **Testes:** variação sem SKU, SKU compartilhado, kit aninhado inválido, vigências de custo/lead time e origens de estoque.
- **Evidência:** _a preencher_.
- **Risco:** multiplicar estoque ou CMV ao consolidar anúncios.

## [ ] DB-006 — Modelar agregados, frescor, alertas e auditoria

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-003`, `DB-004`, `DB-005`
- **Entrega:** métricas diárias/SKU, frescor por domínio, alertas e `audit_log` sem segredos.
- **Aceite:** todo agregado mantém período, conta, `data_as_of`, `calculated_at`, conciliação e cobertura de custo.
- **Testes:** recálculo de recorte afetado, trilha de alteração de custo e alerta resolvido/reaberto.
- **Evidência:** _a preencher_.
- **Risco:** agregados sem explicabilidade ou auditoria excessivamente volumosa.

## [ ] DB-007 — Criar constraints, índices e retenção

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-002` a `DB-006`
- **Entrega:** constraints de unicidade, FKs, índices por organização/conta/período/SKU e mecanismo de retenção desabilitado por padrão.
- **Aceite:** planos de consulta críticos usam índices; nenhuma exclusão automática é ativada antes de `GATE-005`; a política aprovada será configurada em `OPS-002`.
- **Testes:** `EXPLAIN`, duplicidades intencionais e dry-run de retenção somente com dados sintéticos.
- **Evidência:** _a preencher_.
- **Risco:** exceder 500 MB ou remover evidência financeira necessária.

## [ ] DB-008 — Publicar contratos compartilhados

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001` a `DB-006`
- **Entrega:** tipos Supabase gerados, contratos TypeScript e modelos Pydantic para filtros, frescor, jobs, métricas e erros.
- **Aceite:** dinheiro é string decimal; IDs externos são string; datas são ISO UTC; enums têm fonte única.
- **Testes:** contrato serializado validado nas três camadas.
- **Evidência:** _a preencher_.
- **Risco:** TypeScript aceitar payload que o Python ou banco interpreta de outra forma.

## [ ] DB-009 — Criar APIs de leitura com RLS

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-006`, `DB-007`, `DB-008`
- **Entrega:** views/RPCs paginadas para resumo, financeiro, produtos, estoque, alertas, auditoria e status de jobs.
- **Aceite:** filtros de conta/período são uniformes; organização é revalidada; respostas incluem frescor e conciliação.
- **Testes:** paginação estável, filtros combinados, tenant cruzado, zero resultados e período inválido.
- **Evidência:** _a preencher_.
- **Risco:** consultas amplas consumirem banco e egress.

## [ ] DB-010 — Automatizar testes de schema e invariantes

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001` a `DB-009`
- **Entrega:** pgTAP para schema, constraints, RLS, RPCs, fila e invariantes financeiras.
- **Aceite:** duplicação, divergência de total e acesso cross-tenant bloqueiam CI.
- **Testes:** todos os casos dos gates e entidades desta fase.
- **Evidência:** _a preencher_.
- **Risco:** regressão silenciosa durante novas migrações.

## [ ] G3 — Aprovar banco e contratos

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DB-001` a `DB-010`
- **Entrega:** decisão formal sobre integridade, contratos, isolamento e desempenho básico do banco.
- **Aceite:** reset e migração passam; RLS está ativa; contratos são compatíveis; queries críticas estão paginadas.
- **Testes:** executar pgTAP, geração/verificação de contratos e planos das consultas críticas.
- **Evidência:** CI de banco e relatório de isolamento.
- **Risco:** avançar com schema incompatível, fila inválida ou API de leitura sem isolamento.

---

# Fase 4 — OAuth, Edge Functions e orquestração

## [ ] EDGE-001 — Criar base compartilhada das Edge Functions

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G3`, `SEC-000`
- **Entrega:** validação, CORS restrito, autenticação/autorização, correlation ID, erros tipados, logs sanitizados e contrato service-to-service para cron → Edge, Edge → Render e pipeline → token broker, com chaves segregadas por origem/audiência.
- **Aceite:** método, origem, tamanho e payload inválidos são recusados; respostas não vazam detalhes internos; HMAC canoniza método/path/timestamp/nonce/hash do corpo, identifica a chave por `kid` e aceita somente chave atual ou anterior durante rotação.
- **Testes:** JWT ausente/inválido, tenant divergente, CORS, payload excessivo, relógio fora da tolerância publicada, nonce repetido, corpo alterado e rotação current/previous.
- **Evidência:** _a preencher_.
- **Risco:** regras duplicadas e inconsistentes entre funções.

## [ ] EDGE-002 — Implementar `oauth-start`

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001`, `DB-002`, `GATE-003`
- **Entrega:** autorização por admin, apelido interno, state criptograficamente seguro, TTL, PKCE quando habilitado e redirect allowlist.
- **Aceite:** navegador nunca envia Client Secret/App Secret; URL usa redirect exatamente cadastrada.
- **Testes:** usuário sem papel, state duplicado, redirect não permitido e limite de contas.
- **Evidência:** _a preencher_.
- **Risco:** CSRF ou vínculo ao tenant incorreto.

## [ ] EDGE-003 — Implementar token broker, diagnóstico e desconexão OAuth

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001`, `DB-002`
- **Entrega:** `oauth-token-broker` interno como única autoridade para `provision`, leitura de access token, refresh, rotação, revogação e mutação do Vault, com exclusão mútua por seller; `oauth-status` e `oauth-disconnect` autenticados para diagnóstico e desconexão.
- **Aceite:** callback, Edge e futuro pipeline consomem o mesmo broker; nenhum outro componente persiste ou muta refresh token; access token sai somente por TLS para serviço autenticado, permanece apenas em memória durante o lote e não entra em logs; somente a credencial mais recente permanece ativa; UI recebe apenas metadados.
- **Testes:** nesta fase, concorrência entre Edge e stub service-to-service; token inicial/expirado/revogado, falha após troca parcial, chamada direta pelo navegador, diagnóstico cross-tenant e dupla desconexão; concorrência Edge × Python real ocorre em `PIPE-005`/`G5`.
- **Evidência:** _a preencher_.
- **Risco:** invalidar a conta por reutilizar refresh token.

## [ ] EDGE-004 — Implementar `oauth-callback`

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-002`, `EDGE-003`
- **Entrega:** consumo único do state, troca server-side do code, validação de `/users/me`, provisionamento inicial da credencial exclusivamente pelo token broker e redirect seguro à UI; o callback não grava Vault/tabela diretamente.
- **Aceite:** seller é associado à organização esperada; tokens nunca entram na URL, HTML ou browser storage; antes de `G8`, o fluxo é validado apenas com adapter/fixtures e nenhum seller real.
- **Testes:** adapter/fixtures para state expirado/reutilizado, code inválido, seller já vinculado, broker indisponível e falha do Vault; prova com `/users/me` real ocorre em `PILOT-002`.
- **Evidência:** _a preencher_.
- **Risco:** sequestro de conexão ou vazamento de token.

## [ ] EDGE-005 — Implementar `meli-webhook`

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001`, `DB-003`, `GATE-003`
- **Entrega:** validação estrutural, allowlist de tópico/recurso, persistência antes do `2xx`, fingerprint e enqueue coalescido.
- **Aceite:** três notificações iguais geram um evento lógico; o handler não executa ETL completo.
- **Testes:** payload inválido, tópico desconhecido, recurso malicioso, duplicação e banco indisponível.
- **Evidência:** _a preencher_.
- **Risco:** SSRF por recurso não validado ou perda de evento antes da persistência.

## [ ] EDGE-006 — Implementar `request-sync` e `sync-status`

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001`, `DB-003`, `IAM-005`
- **Entrega:** autorização por papel/conta, cooldown de três minutos, coalescência e leitura segura do job.
- **Aceite:** admin/manager solicitam; analyst é recusado; repetição retorna job existente; sucesso não é comunicado antes da conclusão.
- **Testes:** concorrência, conta de outro tenant, cooldown e job em cada estado.
- **Evidência:** _a preencher_.
- **Risco:** usuários multiplicarem chamadas e rate limit.

## [ ] EDGE-007 — Implementar scheduler e watchdog condicionais

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001`, `EDGE-006`, `DB-003`, `GATE-006`
- **Entrega:** cron de tentativa a cada 30 minutos e watchdog a cada cinco, autenticação cron → Edge e chamada Edge → Render assinada pelo contrato de `EDGE-001`; falha anterior ao claim persiste tentativa/erro e agenda `next_dispatch_at`.
- **Aceite:** fila vazia não acorda Render; somente job elegível é despachado; falha de despacho ou lease vencido aplica backoff; limites/idade de `GATE-006` levam a dead letter; chave pode ser rotacionada sem janela sem autenticação.
- **Testes:** nesta fase, cadeia pg_cron → Edge → stub contratual do Render; falha antes do claim até dead letter, sobreposição scheduler/webhook/manual, relógio divergente, nonce repetido, rotação, timeout e retry futuro; receptor FastAPI real é integrado em `PIPE-002`/`G5`.
- **Evidência:** _a preencher_.
- **Risco:** loop manter Render acordado ou consumir invocações sem trabalho.

## [ ] EDGE-008 — Cobrir Edge Functions com testes automatizados

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001` a `EDGE-007`
- **Entrega:** testes Deno/integrados para autenticação, autorização, OAuth, webhook, sync e cron.
- **Aceite:** casos positivos, negativos, replay e tenant cruzado passam no CI.
- **Testes:** matriz integral desta fase.
- **Evidência:** _a preencher_.
- **Risco:** comportamento diferente entre local e Supabase hospedado.

## [ ] G4 — Aprovar OAuth e orquestração

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-001` a `EDGE-008`
- **Entrega:** decisão formal sobre contratos OAuth, broker de token, webhook, fila e autenticação service-to-service no ambiente sintético, usando stubs para componentes Python ainda inexistentes.
- **Aceite:** fluxos conectam/desconectam contra fixtures controladas sem segredo no cliente; jobs são deduplicados; cron/watchdog não executam trabalho duplicado; prova com seller real permanece bloqueada até `G8`.
- **Testes:** suíte Edge completa, concorrência com stub do broker consumidor e cadeia assinada cron → Edge → stub Render; a integração Python real pertence a `G5`.
- **Evidência:** testes Edge e inspeção do bundle/logs.
- **Risco:** tratar fixture OAuth como prova de permissão real da conta piloto.

---

# Fase 5 — FastAPI e ingestão incremental

## [ ] PIPE-001 — Implementar configuração e composição do pipeline

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G4`, `BASE-005`
- **Entrega:** settings tipados, dependências fixadas, módulos de domínio separados e lifecycle limpo do cliente HTTP/banco.
- **Aceite:** startup valida configuração; shutdown fecha pools; nenhuma regra financeira reside na rota FastAPI.
- **Testes:** configuração válida/inválida e lifecycle.
- **Evidência:** _a preencher_.
- **Risco:** recursos vazarem em instância de 512 MB.

## [ ] PIPE-002 — Implementar `/health` e `/internal/run-batch`

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-001`, `DB-003`
- **Entrega:** health mínimo e execução limitada protegida pelo contrato HMAC versionado de `EDGE-001`.
- **Aceite:** endpoint interno não aceita organização/conta arbitrária; assinatura usa comparação segura; `kid`, método/path/timestamp/nonce/hash do corpo e audiência são validados; nonce não pode repetir.
- **Testes:** assinatura/chave/audiência alterada, timestamp vencido, nonce repetido, body adulterado e rotação current/previous.
- **Evidência:** _a preencher_.
- **Risco:** endpoint público ser tratado como privado apenas por obscuridade.

## [ ] PIPE-003 — Implementar acesso ao banco por role restrita

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-002`, `DB-003`
- **Entrega:** role `melimetrics_pipeline` sem bypass RLS/service role, com acesso apenas às RPCs internas necessárias.
- **Aceite:** pipeline não consulta tabela arbitrária; claim, heartbeat, checkpoint e conclusão são transacionais.
- **Testes:** tentativa de SELECT direto, job de outro worker e lease expirado.
- **Evidência:** _a preencher_.
- **Risco:** credencial ampla transformar comprometimento do Render em comprometimento total.

## [ ] PIPE-004 — Implementar cliente assíncrono Mercado Livre

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-001`, `GATE-003`
- **Entrega:** `httpx.AsyncClient`, modelos Pydantic, timeouts, paginação, `Retry-After`, backoff exponencial com jitter e limite de tentativas.
- **Aceite:** payload externo é validado; erro parcial não avança checkpoint indevidamente; logs ocultam Authorization.
- **Testes:** `401`, `403`, `404`, `429`, `5xx`, timeout, JSON inválido e página parcial.
- **Evidência:** _a preencher_.
- **Risco:** retry agressivo ampliar bloqueio da aplicação.

## [ ] PIPE-005 — Consumir o token broker no pipeline

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-003`, `PIPE-004`, `EDGE-003`
- **Entrega:** cliente interno autenticado para obter access token válido exclusivamente por `oauth-token-broker`, sem acesso direto ao Vault ou ao refresh token.
- **Aceite:** pipeline não implementa refresh nem lê credencial persistida; access token fica somente em memória e nunca é logado; nenhuma chamada usa token de outro seller; concorrência Edge × Python converge pelo broker único.
- **Testes:** expiração, revogação, chamadas simultâneas Edge/Python, falha transitória, audiência inválida e conta desconectada.
- **Evidência:** _a preencher_.
- **Risco:** contornar o broker recriar a corrida de refresh token de uso único.

## [ ] PIPE-006 — Sincronizar anúncios e variações

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-003`, `PIPE-004`, `PIPE-005`, `DB-005`
- **Entrega:** descoberta paginada, detalhes em lotes, normalização de MLB/variação/SKU e checkpoint incremental.
- **Aceite:** reprocessar lote não duplica anúncio; item alterado atualiza somente campos observados; payload bruto integral não é retido.
- **Testes:** 0, 1, 1000+ e 12 mil IDs sintéticos; variações e anúncio encerrado.
- **Evidência:** _a preencher_.
- **Risco:** tentar carregar catálogo completo em memória ou em uma requisição.

## [ ] PIPE-007 — Sincronizar pedidos e itens

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-003` a `PIPE-005`, `DB-004`, `GATE-004`
- **Entrega:** backfill inicial de sete dias por atualização/criação, alterações tardias e upsert idempotente.
- **Aceite:** pedido repetido mantém um fato; cancelamento e devolução alteram os componentes corretos; checkpoint só avança após commit.
- **Testes:** pedido simples, carrinho, cancelado, parcialmente devolvido e atualizado fora de ordem.
- **Evidência:** _a preencher_.
- **Risco:** paginação incompleta ou janela errada distorcer GMV.

## [ ] PIPE-008 — Sincronizar pagamentos, financeiro e envios

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-007`, `GATE-003`, `GATE-004`
- **Entrega:** dados autorizados de pagamentos, tarifas, ajustes, reversões, shipments e custo logístico, com fonte explícita.
- **Aceite:** componente indisponível fica pendente; nenhuma tarifa percentual é fabricada; faturamento fiscal não é fonte operacional indevida.
- **Testes:** tarifa alterada, estorno, frete vendedor/ML, ausência de permissão e divergência temporal.
- **Evidência:** _a preencher_.
- **Risco:** somar custos estimados e conciliados ou deduzir duas vezes.

## [ ] PIPE-009 — Sincronizar estoque por origem

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-006`, `GATE-003`
- **Entrega:** snapshots de estoque por conta, SKU, logística e momento observado.
- **Aceite:** Full, próprio, trânsito e indisponível não são somados indiscriminadamente; ausência de fonte aparece como desconhecida.
- **Testes:** múltiplas origens, snapshot atrasado, item pausado e SKU compartilhado.
- **Evidência:** _a preencher_.
- **Risco:** cobertura falsa induzir reposição incorreta.

## [ ] PIPE-010 — Invalidar recortes e atualizar frescor

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-006` a `PIPE-009`, `DB-006`
- **Entrega:** registro idempotente dos períodos/SKUs afetados, invalidação dos derivados correspondentes e atualização de frescor somente após persistência; nenhum cálculo financeiro ou alerta é implementado nesta fase.
- **Aceite:** execução duplicada não multiplica recortes pendentes; domínio não é marcado fresco após lote parcial com erro; calculadores posteriores recebem uma fila determinística de recálculo.
- **Testes:** mesmo lote duas vezes, alteração histórica, checkpoint intermediário, falha pós-upsert e coalescência de recortes.
- **Evidência:** _a preencher_.
- **Risco:** dashboard parecer atualizado com dados incompletos.

## [ ] PIPE-011 — Implementar observabilidade e parada segura

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-002` a `PIPE-010`
- **Entrega:** logs JSON, correlation ID, códigos seguros, deadline por lote, heartbeat e modo sem novos claims.
- **Aceite:** tokens/PII não aparecem; suspensão deixa dados anteriores legíveis; não existe retry infinito.
- **Testes:** kill durante lote, timeout, banco indisponível, quota e sinal de desligamento.
- **Evidência:** _a preencher_.
- **Risco:** dados parciais ou logs públicos sensíveis.

## [ ] PIPE-012 — Completar testes do pipeline

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-001` a `PIPE-011`
- **Entrega:** unitários, integração com banco local, contratos e testes de falha/carga sintética.
- **Aceite:** cobertura dos fluxos críticos e invariantes; testes não dependem de API ML real.
- **Testes:** toda a matriz desta fase com respx e fixtures versionadas.
- **Evidência:** _a preencher_.
- **Risco:** confiar em sandbox diferente da produção.

## [ ] G5 — Aprovar executor e ingestão

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-001` a `PIPE-012`, `GATE-006`
- **Entrega:** decisão formal sobre segurança, retomada, idempotência, falhas e capacidade do executor.
- **Aceite:** lote pequeno autenticado é retomável e idempotente; 429, timeout e restart são seguros; pico de RSS, duração, itens, concorrência, fila e egress ficam dentro dos valores publicados em `GATE-006`.
- **Testes:** integração real entre Edge local e FastAPI para assinatura/dispatch, concorrência Edge × Python no token broker, além de carga sintética registrando cada métrica do orçamento, kill/restart e limite excedido com parada segura.
- **Evidência:** CI Python e relatório de testes de falha.
- **Risco:** aprovar o executor por sensação de velocidade sem medir o limite da instância.

---

# Fase 6 — Domínio financeiro e operacional

## [ ] DOM-001 — Implementar regras e importação de custos/lead time

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G5`, `DB-005`
- **Entrega:** serviço/RPC e staging de CSV para custo e `lead_time_days`, com validação, preview contratual, vigência, origem, autor, erros por linha e auditoria; interface fica em `FE-007`.
- **Aceite:** autorização de admin é aplicada no servidor; importação parcial exige confirmação explícita; histórico não é sobrescrito; lead time aceita somente inteiro positivo com unidade em dias.
- **Testes:** decimal brasileiro, lead time inválido, SKU inexistente, duplicado, fórmula CSV e vigências sobrepostas.
- **Evidência:** _a preencher_.
- **Risco:** CMV incorreto afetar todas as margens históricas.

## [ ] DOM-002 — Implementar relacionamento SKU–MLB–variação

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-006`, `DOM-001`
- **Entrega:** regras, serviço/RPC e sugestões de vínculo automático/manual com conflitos auditados; interface fica em `FE-007`.
- **Aceite:** um SKU pode ter vários anúncios; uma variação possui vínculo inequívoco por vigência.
- **Testes:** SKU ausente, conflito, alteração e vínculo entre contas da mesma organização.
- **Evidência:** _a preencher_.
- **Risco:** duplicar venda/estoque ao consolidar.

## [ ] DOM-003 — Implementar kits e consumo de componentes

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DOM-001`, `DOM-002`
- **Entrega:** composição versionada, quantidade por componente e explosão de CMV/estoque.
- **Aceite:** ciclo e quantidade inválida são proibidos; venda do kit consome cada componente uma vez.
- **Testes:** kit simples, múltiplas quantidades, alteração histórica e ciclo.
- **Evidência:** _a preencher_.
- **Risco:** duplicar CMV ou estoque físico.

## [ ] DOM-004 — Implementar cálculo financeiro rastreável

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-008`, `DOM-001`, `DOM-003`, `GATE-004`
- **Entrega:** GMV, vendas líquidas, deduções, CMV, margem de contribuição e cobertura de custo por pedido/SKU/período.
- **Aceite:** detalhe soma ao agregado; `incomplete` impede margem definitiva; fórmula e componentes aparecem ao usuário.
- **Testes:** fixtures aprovadas no `GATE-004`, receita zero e arredondamento.
- **Evidência:** _a preencher_.
- **Risco:** falsa precisão financeira.

## [ ] DOM-005 — Implementar Curva ABC, giro e cobertura

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PIPE-009`, `DOM-002`, `DOM-004`
- **Entrega:** ABC pela métrica aprovada, velocidade de venda, dias de cobertura, comparação com lead time vigente e limitação por amostra/frescor.
- **Aceite:** cortes são documentados; sem dados ou lead time suficiente retorna “dados insuficientes”; estoque por origem permanece separado.
- **Testes:** zero venda, janela incompleta, lead time ausente/alterado, SKU compartilhado e estoque desconhecido.
- **Evidência:** _a preencher_.
- **Risco:** recomendação baseada em janela inválida.

## [ ] DOM-006 — Implementar alertas com evidência

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DOM-004`, `DOM-005`
- **Entrega:** margem negativa comprovável, CMV ausente, cobertura abaixo do lead time vigente, queda válida e dados desatualizados.
- **Aceite:** cada alerta contém conta, recurso, causa, evidência, cálculo, severidade, confiança/limitação, timestamp e ação humana.
- **Testes:** criação, coalescência, resolução, reabertura e comparação insuficiente.
- **Evidência:** _a preencher_.
- **Risco:** fabricar “prejuízo diário” ou alarmismo sem causalidade.

## [ ] DOM-007 — Automatizar conciliação e invariantes

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DOM-004`, `DOM-005`, `DOM-006`
- **Entrega:** integração dos calculadores/alertas com os recortes inválidos de `PIPE-010`, persistência transacional dos derivados, relatório de divergências, tolerâncias documentadas e invariantes em CI.
- **Aceite:** lote confirmado agenda/recalcula apenas derivados afetados; frescor do derivado avança após commit; toda divergência é explicável ou bloqueia publicação da métrica; reprocessamento não altera total sem nova fonte.
- **Testes:** recorte coalescido, soma pedido/SKU/período, devolução parcial, atualização tardia, duplicação e falha antes/depois do commit do agregado.
- **Evidência:** _a preencher_.
- **Risco:** publicar agregado não reconciliável.

## [ ] G6 — Aprovar domínio e integridade financeira

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DOM-001` a `DOM-007`
- **Entrega:** decisão formal sobre métricas, custos, parâmetros de reposição, estoque, alertas e conciliação.
- **Aceite:** fixtures batem manualmente; custo faltante é explícito; nenhum indicador usa “lucro líquido” indevidamente.
- **Testes:** executar fixtures aprovadas, invariantes, vigências de custo/lead time e reprocessamento idempotente.
- **Evidência:** relatório de conciliação aprovado.
- **Risco:** liberar indicador financeiro ou operacional que não pode ser explicado por pedido/SKU.

---

# Fase 7 — Frontend conectado

## [ ] FE-001 — Criar arquitetura de rotas e consultas

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G6`, `IAM-005`, `DB-009`
- **Entrega:** React Router, cliente de consultas/cache, lazy loading, error boundaries e política explícita de reset/restauração de scroll por rota.
- **Aceite:** `/resumo`, `/financeiro`, `/produtos` e `/administracao` funcionam por URL direta; rotas antigas redirecionam; uma troca de área não herda scroll inválido da anterior.
- **Testes:** reload, voltar/avançar, scroll, rota desconhecida, sessão ausente e erro de chunk.
- **Evidência:** _a preencher_.
- **Risco:** deploy estático retornar 404 em deep link.

## [ ] FE-002 — Implementar contexto global de operação

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-001`, `IAM-005`
- **Entrega:** organização derivada da membership, um único seletor global de contas, Hoje/7 dias/30 dias/Mês atual e timezone único.
- **Aceite:** contas/período persistem na URL e alimentam todas as queries, exports e syncs; nenhuma tela cria seletor paralelo de loja/conta/período.
- **Testes:** URL compartilhada, conta removida, período inválido e troca rápida de filtros.
- **Evidência:** _a preencher_.
- **Risco:** telas calcularem recortes diferentes.

## [ ] FE-003 — Criar gateway tipado para Supabase

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-001`, `DB-008`, `DB-009`
- **Entrega:** serviços/hooks para PostgREST, RPC e Edge; nenhum componente consulta Mercado Livre ou Render.
- **Aceite:** query keys incluem tenant implícito, contas, período e paginação; respostas antigas são canceladas/ignoradas.
- **Testes:** `401`, `403`, `429`, timeout, resposta parcial e troca de filtro concorrente.
- **Evidência:** _a preencher_.
- **Risco:** cache misturar contas ou organizações.

## [ ] FE-004 — Padronizar estados de dados e frescor

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-003`
- **Entrega:** loading inicial, atualização, sucesso, vazio, stale, parcial, erro e modo leitura.
- **Aceite:** último dado válido permanece visível em falha; cada domínio mostra `data_as_of`, último sucesso e limitação.
- **Testes:** primeiro acesso, vazio legítimo, erro com cache, nunca sincronizado e dados atrasados.
- **Evidência:** _a preencher_.
- **Risco:** zerar dashboard por falha transitória.

## [ ] FE-005 — Conectar a tela Resumo

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-002`, `FE-003`, `FE-004`
- **Entrega:** GMV, pedidos válidos, ticket, vendas líquidas, margem calculável, ranking, evolução, alertas e frescor reais.
- **Aceite:** todos os cards usam o mesmo filtro e informam valor, período, comparação aplicável e fonte/horário; componente incompleto mostra limitação; nenhum valor vem de constante local.
- **Testes:** contas individuais/consolidadas, zero pedidos, custo incompleto e série parcial.
- **Evidência:** _a preencher_.
- **Risco:** manter publicidade/reputação fictícias sem fonte P0.

## [ ] FE-006 — Conectar Financeiro

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-002` a `FE-004`, `DOM-004`, `DOM-007`
- **Entrega:** demonstrativo gerencial, deduções, conciliação, cobertura de custo e drill-down por pedido/SKU.
- **Aceite:** nomenclatura não sugere DRE fiscal; detalhe coincide com resumo; provisório/incompleto são visíveis.
- **Testes:** filtros, devolução parcial, custo ausente, drill-down e divergência.
- **Evidência:** _a preencher_.
- **Risco:** apresentar margem como definitiva sem todos os componentes.

## [ ] FE-007 — Conectar Produtos e Estoque

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-002` a `FE-004`, `DOM-001` a `DOM-005`
- **Entrega:** SKUs, MLBs/variações, kits, custos, lead time, estoque por origem, giro, cobertura e Curva ABC; formulários/importação com preview e resolução de vínculos SKU–MLB–variação.
- **Aceite:** paginação é real; mobile usa cartões; autorização permanece no servidor; “dados insuficientes” substitui estimativa insegura.
- **Testes:** busca/filtros, paginação, importação parcial, vigências, vínculo conflitante, kit, múltiplos anúncios e estoque indisponível.
- **Evidência:** _a preencher_.
- **Risco:** reutilizar tabela mock sem respeitar as cardinalidades reais.

## [ ] FE-008 — Conectar Administração

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `IAM-004`, `EDGE-002` a `EDGE-006`, `FE-003`
- **Entrega:** equipe, papéis, contas OAuth, conexão/desconexão, erros, uso, auditoria e estado por domínio.
- **Aceite:** não há input/cópia de Client Secret, refresh token ou HMAC; tópicos de webhook são informativos quando definidos na aplicação ML.
- **Testes:** matriz de papéis, OAuth callback, desconexão, limite de conta e auditoria.
- **Evidência:** _a preencher_.
- **Risco:** expor controles administrativos sem autorização efetiva.

## [ ] FE-009 — Centralizar solicitação de atualização

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `EDGE-006`, `FE-002`, `FE-003`, `FE-004`
- **Entrega:** único controle no shell, seleção de contas autorizadas, polling moderado somente de job ativo e retomada após reload.
- **Aceite:** UI traduz `queued`, `running`, `retry_wait`, `succeeded`, `failed`, `dead_letter` e `cancelled`, além de progresso parcial e frescor atrasado, sem persistir estados derivados nem exibir sucesso otimista.
- **Testes:** cooldown, job já ativo, cada estado canônico, progresso parcial, cold start, reload, timeout e usuário analyst.
- **Evidência:** _a preencher_.
- **Risco:** duplicar jobs ou confundir aceitação com conclusão.

## [ ] FE-010 — Integrar alertas às telas P0

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DOM-006`, `FE-003`, `FE-004`
- **Entrega:** resumo priorizado e detalhamento contextual em Produtos, sem rota principal duplicada.
- **Aceite:** impacto, causa, evidência, limitação e ação humana aparecem nessa ordem.
- **Testes:** severidades, alerta stale, resolvido, vazio e filtros.
- **Evidência:** _a preencher_.
- **Risco:** alarmismo ou recomendação automática sensível.

## [ ] FE-011 — Implementar exportações CSV seguras

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-002`, `FE-003`, `DB-009`
- **Entrega:** exportação paginada do recorte autorizado, BOM UTF-8, delimitador compatível e neutralização de fórmula.
- **Aceite:** CSV coincide com filtros/totais da tela; campos iniciados por `=`, `+`, `-`, `@`, tab ou CR são texto inerte.
- **Testes:** fórmulas maliciosas, caracteres especiais, paginação, tenant cruzado, volume piloto e paridade do Financeiro com os filtros/totais da tela.
- **Evidência:** _a preencher_.
- **Risco:** execução de fórmula no Excel ou exportação incompleta.

## [ ] FE-012 — Eliminar mocks e ações fora do P0 em produção

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-005` a `FE-011`
- **Entrega:** retirada dos imports de mocks do caminho produtivo; remoção de latência, logs, status e operações simuladas; incorporação de `VisaoLoja`, `MatrizSobeDesce` e `AnunciosFull` às quatro rotas P0 sem telas, breadcrumbs, seletores ou ações duplicadas.
- **Aceite:** bundle de produção não contém contas/valores fictícios; metas, repricing, Buy Box, remessas e campanhas não aparecem habilitados; não existe segunda visão do mesmo contexto nem “Voltar ao Dashboard” redundante no desktop.
- **Testes:** busca no bundle, E2E de produção, matriz de navegação e inspeção de ações/controles duplicados.
- **Evidência:** _a preencher_.
- **Risco:** usuário confiar em dado demonstrativo como real.

## [ ] FE-013 — Concluir WCAG 2.2 AA e responsividade

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-005` a `FE-012`
- **Entrega:** teclado, foco, dialogs com trap/Esc/restauração, tabs semânticas, labels, regiões `aria-live`, tabelas, gráficos equivalentes, contraste, reduced motion e cards móveis.
- **Aceite:** Axe sem violações críticas/sérias; contraste ≥ 4,5:1 para texto normal e ≥ 3:1 para texto grande; alvos ≥ 44×44 px salvo exceção WCAG documentada; nenhum overflow global entre 320 e 1440 px.
- **Testes:** Playwright/Axe desktop/mobile, teclado completo, leitor de tela por amostragem, modal sem acesso ao fundo e preferências de movimento reduzido.
- **Evidência:** _a preencher_.
- **Risco:** fluxos operacionais inacessíveis ou tabelas inutilizáveis no celular.

## [ ] FE-014 — Aplicar orçamento de performance

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-001`, `FE-005` a `FE-013`, `GATE-006`
- **Entrega:** divisão por rota, gráficos sob demanda, paginação server-side e medição de bundle/renderização.
- **Aceite:** nenhum chunk gera alerta acima de 500 kB sem exceção registrada; no perfil de dispositivo/rede publicado em `GATE-006`, p75 medido atende LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 nas rotas P0.
- **Testes:** build report, Lighthouse/telemetria controlada no perfil fixado e tabela de 12 mil registros via paginação sem carregar o conjunto completo no cliente.
- **Evidência:** _a preencher_.
- **Risco:** dashboard lento em dispositivos modestos ou egress excessivo.

## [ ] G7 — Aprovar frontend P0

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `FE-001` a `FE-014`
- **Entrega:** decisão formal sobre dados persistidos pelo backend, navegação, acessibilidade, exportação e performance do frontend P0.
- **Aceite:** nenhuma tela produtiva usa mock; rotas/filtros sobrevivem a reload; ações refletem backend; WCAG e performance passam.
- **Testes:** executar Vitest, Testing Library, Playwright, Axe, inspeção do bundle e orçamento de performance.
- **Evidência:** CI frontend, E2E e relatório Axe.
- **Risco:** interface visualmente pronta continuar simulando operação ou esconder dados incompletos.

---

# Fase 8 — Segurança, entrega e operação

## [ ] SEC-001 — Revalidar threat model e concluir hardening

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G7`, `SEC-000`
- **Entrega:** revisão do threat model arquitetural contra a implementação final, análise dos deltas e hardening dos controles de OAuth, tenant, webhook, HMAC, CSV, logs, supply chain e abuso de sync.
- **Aceite:** todas as ameaças de `SEC-000` possuem controle implementado/testado; nenhum risco crítico permanece aberto; scanner de segredo e dependências roda no CI.
- **Testes:** replay, IDOR, payload malicioso, elevação de papel, rotação de chave, segredo canário e regressão dos controles rastreados.
- **Evidência:** _a preencher_.
- **Risco:** integrar dados financeiros sem modelo de ameaça explícito.

## [ ] QA-001 — Consolidar a pirâmide de testes e contratos

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G7`, `SEC-001`
- **Entrega:** comando único `verify` e matriz de cobertura frontend, banco, Edge, Python, contratos e E2E.
- **Aceite:** PR falha por regressão RLS, contrato, idempotência, acessibilidade ou métrica.
- **Testes:** suíte completa com dados sintéticos e execução repetível.
- **Evidência:** _a preencher_.
- **Risco:** testes isolados passarem enquanto a integração quebra.

## [ ] DEP-001 — Automatizar deploy Supabase compatível

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `QA-001`, `GATE-002`
- **Entrega:** promoção versionada de migrações e Edge Functions, usando expansão/contração para mudanças incompatíveis.
- **Aceite:** schema antigo e novo coexistem durante deploy; nenhuma migração destrutiva sem backup validado.
- **Testes:** deploy em ambiente local/efêmero e smoke após migração.
- **Evidência:** _a preencher_.
- **Risco:** rollback de código contra schema incompatível.

## [ ] DEP-002 — Configurar Render Free

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `QA-001`, `GATE-002`
- **Entrega:** um Web Service FastAPI, runtime/start command fixos, health, secrets e auto-deploy controlado.
- **Aceite:** filesystem não guarda estado; SHA está visível; cold start é medido; nenhum ping artificial mantém o serviço ativo.
- **Testes:** deploy, hibernação, despertar, restart e rollback de imagem/commit.
- **Evidência:** _a preencher_.
- **Risco:** suspensão por horas, bandwidth ou tráfego externo.

## [ ] DEP-003 — Configurar Cloudflare Pages

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `QA-001`, `GATE-002`
- **Entrega:** frontend estático, fallback SPA, headers de segurança, CSP e variáveis públicas mínimas.
- **Aceite:** rotas diretas funcionam; build não contém segredo; CSP permite apenas origens necessárias.
- **Testes:** smoke de todas as rotas, headers, logout e OAuth redirect.
- **Evidência:** _a preencher_.
- **Risco:** deep links 404 ou CSP excessivamente aberta.

## [ ] OPS-001 — Implementar observabilidade, quotas e modo leitura

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DEP-001`, `DEP-002`, `DEP-003`, `GATE-006`
- **Entrega:** visão de fila/falhas/frescor, códigos correlacionáveis, indicadores de uso e chave operacional de leitura.
- **Aceite:** dead letter, OAuth falho, divergência e thresholds 60%/70% ficam visíveis; modo leitura interrompe novos jobs pesados.
- **Testes:** 429, Render suspenso, Edge indisponível, banco próximo do limite e token irrecuperável.
- **Evidência:** _a preencher_.
- **Risco:** falha silenciosa ou retry consumir toda a franquia.

## [ ] OPS-002 — Implementar backup criptografado e restauração

- **Prioridade:** P0
- **Estado:** BLOQUEADO — depende de `GATE-005`
- **Depende de:** `DEP-001`, `GATE-005`
- **Entrega:** dump, manifesto, checksum, criptografia antes do envio, restauração isolada e ativação da retenção de dados aprovada em `GATE-005`.
- **Aceite:** arquivo fora do Supabase/GitHub; chave separada; restauração preserva schema, RLS, contagens e invariantes.
- **Testes:** restauração completa registrada antes de dados reais e repetida na periodicidade definida.
- **Evidência:** _a preencher_.
- **Risco:** backup existir sem ser restaurável.

## [ ] GOV-001 — Formalizar privacidade, piloto e incidentes

- **Prioridade:** P0
- **Estado:** BLOQUEADO — depende de responsável externo
- **Depende de:** `GATE-005`, `SEC-001`
- **Entrega:** aviso de privacidade, consentimento, termos do piloto, direitos do titular, desconexão/exclusão e runbook de incidente.
- **Aceite:** responsável e contato publicados; documentos revisados antes do seller real; limitações Free estão explícitas.
- **Testes:** exercício de solicitação de exclusão e incidente simulado.
- **Evidência:** _a preencher_.
- **Risco:** piloto tratar dados de terceiros sem governança mínima.

## [ ] OPS-003 — Documentar release, smoke e rollback

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `DEP-001` a `DEP-003`, `OPS-001`, `OPS-002`, `GOV-001`
- **Entrega:** ordem Supabase → Edge → Render → smoke → frontend, rollback não destrutivo e runbook operacional.
- **Aceite:** o mesmo SHA é rastreável; rollback é ensaiado; smoke não altera conta ML real.
- **Testes:** release e rollback simulados com falha em cada camada.
- **Evidência:** _a preencher_.
- **Risco:** release parcial incompatível entre contratos.

## [ ] G8 — Autorizar entrada de dados reais

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `SEC-001`, `QA-001`, `DEP-001` a `DEP-003`, `OPS-001` a `OPS-003`, `GOV-001`
- **Entrega:** decisão formal e assinada que autoriza ou proíbe a conexão do primeiro seller.
- **Aceite:** segurança, CI, deploy, observabilidade, backup restaurado e governança estão aprovados; qualquer ausência resulta em `NO-GO`.
- **Testes:** executar checklist de segredos/RLS, restauração, rollback, modo leitura e incidentes antes de usar OAuth real.
- **Evidência:** checklist assinado e data.
- **Risco:** tratar dados reais antes de existir recuperação, responsável ou contenção de incidente.

---

# Fase 9 — Piloto controlado

## [ ] PILOT-001 — Provisionar a organização piloto

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `G8`
- **Entrega:** organização, admin, limites de quatro contas/cinco usuários e modo inicial sem dados.
- **Aceite:** convite e RLS funcionam no ambiente remoto; nenhuma organização adicional pode ser criada pelo público.
- **Testes:** login, papéis e isolamento remoto.
- **Evidência:** _a preencher_.
- **Risco:** configuração manual divergir das migrações.

## [ ] PILOT-002 — Conectar a primeira conta Mercado Livre

- **Prioridade:** P0
- **Estado:** BLOQUEADO — requer autorização do seller
- **Depende de:** `PILOT-001`, `GATE-003`
- **Entrega:** OAuth real, `/users/me`, metadados da conta, revogação testada e credenciais no Vault.
- **Aceite:** nenhum token aparece no browser/log; conta pertence à organização correta.
- **Testes:** conexão, refresh, reconnect e disconnect.
- **Evidência:** _a preencher_.
- **Risco:** autorização por operador em vez de administrador ou redirect divergente.

## [ ] PILOT-003 — Importar amostra de anúncios

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-002`
- **Entrega:** lote pequeno com anúncios, variações, SKUs e medição de bytes/tempo/chamadas.
- **Aceite:** amostra confere com ML; reexecução não duplica; checkpoint e frescor são corretos.
- **Testes:** interrupção durante lote e retomada.
- **Evidência:** _a preencher_.
- **Risco:** modelo de SKU não representar o catálogo real.

## [ ] PILOT-004 — Importar sete dias de pedidos

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-003`
- **Entrega:** pedidos, itens, alterações, pagamentos/envios autorizados e medição de consumo.
- **Aceite:** contagem e valores brutos conferem com amostra da origem; duplicação é zero.
- **Testes:** reconciliação de casos normais e exceções reais sanitizadas.
- **Evidência:** _a preencher_.
- **Risco:** endpoint ou janela omitir pedidos alterados.

## [ ] PILOT-005 — Conciliar métricas da primeira conta

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-004`, `DOM-007`
- **Entrega:** relatório por pedido/SKU e comparação dos totais com fontes do seller.
- **Aceite:** diferenças estão dentro da tolerância aprovada ou explicadas; componentes ausentes continuam incompletos.
- **Testes:** venda, cancelamento, devolução parcial, frete, tarifa, kit, variação e CMV ausente.
- **Evidência:** _a preencher_.
- **Risco:** aprovar médias enquanto casos individuais divergem.

## [ ] PILOT-006 — Executar testes de resiliência no ambiente piloto

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-005`
- **Entrega:** evidência de cold start, restart durante lote, 429, timeout, token expirado, Edge/Render indisponíveis e dead letter.
- **Aceite:** fila não perde trabalho; não duplica fatos; UI preserva dados antigos e informa limitação.
- **Testes:** exercícios intencionais com janela controlada.
- **Evidência:** _a preencher_.
- **Risco:** comportamento real dos provedores divergir do teste local.

## [ ] PILOT-007 — Adicionar contas 2, 3 e 4 sequencialmente

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-005`, `PILOT-006`
- **Entrega:** conexão e validação individual de cada conta antes da seguinte.
- **Aceite:** métricas por conta e consolidadas conferem; nenhuma linha ou job mistura seller accounts.
- **Testes:** RLS, filtros, consolidação e conflitos de SKU entre contas.
- **Evidência:** _a preencher_.
- **Risco:** escalar erros da primeira conta para todo o piloto.

## [ ] PILOT-008 — Importar progressivamente o catálogo completo

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-007`, `GATE-006`
- **Entrega:** até cerca de 12 mil anúncios em lotes ajustados por medição.
- **Aceite:** RSS, duração, itens/lote, concorrência, egress e profundidade da fila permanecem abaixo dos limites numéricos de `GATE-006`; banco fica abaixo de 60%; nenhuma requisição tenta importar tudo.
- **Testes:** duração, memória, egress, índices, rate limit e retomada por checkpoint.
- **Evidência:** _a preencher_.
- **Risco:** exceder banco, horas ou tráfego gratuito.

## [ ] PILOT-009 — Avaliar expansão do histórico para 30 dias

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-008`
- **Entrega:** projeção de capacidade e decisão registrada `GO/NO-GO` para backfill adicional.
- **Aceite:** banco projetado permanece abaixo de 60%; fila e tempos estão estáveis; backup foi atualizado antes da expansão.
- **Testes:** amostra ampliada e nova conciliação.
- **Evidência:** _a preencher_.
- **Risco:** tratar 30 dias como obrigação mesmo sem capacidade.

## [ ] PILOT-010 — Executar soak de sete dias

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-008`; `PILOT-009` pode resultar em aprovação ou rejeição da expansão
- **Entrega:** operação monitorada por sete dias corridos, com scheduler, webhooks, botão manual e watchdog.
- **Aceite:** zero duplicação, vazamento ou retry infinito; atrasos e falhas são explicáveis; quotas permanecem seguras.
- **Testes:** revisão diária de fila, frescor, custos, métricas e logs.
- **Evidência:** _a preencher_.
- **Risco:** estabilidade pontual mascarar crescimento do backlog.

## [ ] PILOT-011 — Realizar decisão final de liberação

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-001` a `PILOT-010`
- **Entrega:** checklist final, limitações comunicadas, aceite técnico e plano de suporte do piloto.
- **Aceite:** todos os itens de `GO/NO-GO` abaixo possuem evidência; nenhuma falha crítica está aceita por exceção informal.
- **Testes:** revisão cruzada de produto, segurança, finanças e operação.
- **Evidência:** _a preencher_.
- **Risco:** chamar piloto de produto pronto para alta disponibilidade.

## [ ] G9 — Liberar MVP 1.0 para piloto controlado

- **Prioridade:** P0
- **Estado:** pendente
- **Depende de:** `PILOT-011`
- **Entrega:** decisão final de liberação do escopo validado, com limitações e responsáveis publicados.
- **Aceite:** decisão formal `GO`; novos sellers continuam bloqueados até análise posterior do piloto.
- **Testes:** revisar evidências do piloto, critérios `NO-GO`, versão implantada e plano de suporte.
- **Evidência:** responsável, data, versão e SHA liberado.
- **Risco:** promover piloto controlado como produto com SLA ou capacidade não comprovada.

---

# Contratos públicos e internos obrigatórios

## Superfícies Edge fixadas

- Chamadas por navegador autenticado: `oauth-start`, `oauth-status`, `oauth-disconnect`, `request-sync` e `sync-status`.
- Callback do provedor: `oauth-callback`.
- Notificação do provedor: `meli-webhook`.
- Chamadas internas autenticadas: `scheduler-tick`, `watchdog-tick` e `oauth-token-broker`.
- O fato de uma URL ser alcançável pela internet não a torna pública: funções internas recusam JWT de usuário e exigem credencial service-to-service com audiência específica.

## Filtros e leitura do frontend

| Contrato | Campos mínimos | Regra |
|---|---|---|
| `DashboardFilters` | `sellerAccountIds`, `from`, `to`, `timezone` | `organizationId` pode ser informativo, mas autorização sempre deriva da sessão/membership. |
| `DataFreshness` | `domain`, `dataAsOf`, `lastSuccessAt`, `syncStatus`, `failureCode?` | Um domínio não herda frescor de outro. |
| `FinancialStatus` | `calculationStatus`, `costCoveragePercent`, `missingComponents[]` | `incomplete` impede margem definitiva. |
| `PaginatedResult<T>` | `items`, `nextCursor`, `hasMore`, `dataFreshness` | Cursor opaco e ordenação estável. |
| `ApiError` | `code`, `message`, `correlationId`, `retryable`, `retryAfter?` | Sem stack, SQL, token ou payload sensível. |

## Sincronização

| Operação | Entrada | Saída mínima | Autorização |
|---|---|---|---|
| `request-sync` | contas autorizadas e domínios permitidos | `jobId`, `enqueueResult`, `acceptedAt` | `admin` ou `manager` |
| `sync-status` | `jobId` | status, progresso, timestamps e erro seguro | membro da organização do job |
| `scheduler-tick` | chamada cron autenticada | quantidade enfileirada/acionada | serviço interno |
| `watchdog-tick` | chamada cron autenticada | leases recuperados/dead letters | serviço interno |
| `POST /internal/run-batch` | apenas metadados internos assinados | job, processados, checkpoint, duração e próximo estado | HMAC + nonce + role restrita |
| `GET /health` | nenhuma | versão, timestamp e saúde básica | público, sem dados internos |

O envelope service-to-service contém `version`, `kid`, `audience`, `method`, `path`, `timestamp`, `nonce` e SHA-256 do corpo. Tolerância de relógio, TTL do nonce e sobreposição de chaves são valores numéricos publicados em `SEC-000`; a rotação aceita chave atual/anterior somente durante essa janela registrada.

## OAuth e webhook

| Operação | Regra obrigatória |
|---|---|
| `oauth-start` | Usuário autenticado, admin, state único/curto, redirect allowlist e PKCE quando disponível. |
| `oauth-callback` | Consome state uma vez, troca code no servidor, valida `/users/me` e entrega a credencial inicial ao broker; não grava Vault diretamente. |
| `oauth-status` | Membro autorizado recebe somente conta, estado, expiração, último sucesso e erro seguro; nunca tokens. |
| `oauth-disconnect` | Admin, confirmação explícita, revogação quando suportada, credencial inacessível e conta marcada como revogada. |
| `oauth-token-broker` | Serviço interno com operações `provision/get_access/refresh/revoke`, job/lease/seller vinculados, exclusão mútua e rotação atômica; é o único proprietário da persistência/mutação da credencial. |
| `meli-webhook` | Valida tamanho/tópico/recurso, persiste antes de responder e consulta a API como fonte definitiva. |

## Códigos de erro estáveis

- `AUTH_REQUIRED`
- `FORBIDDEN`
- `TENANT_MISMATCH`
- `ACCOUNT_NOT_FOUND`
- `OAUTH_STATE_INVALID`
- `OAUTH_REFRESH_FAILED`
- `SYNC_COOLDOWN`
- `JOB_CONFLICT`
- `RATE_LIMITED`
- `UPSTREAM_TIMEOUT`
- `UPSTREAM_UNAVAILABLE`
- `DATA_INCOMPLETE`
- `QUOTA_NEAR_LIMIT`
- `READ_ONLY_MODE`
- `INTERNAL_ERROR`

---

# Referências obrigatórias para revalidação

- [Render Free](https://render.com/docs/free) e [compute plans](https://render.com/docs/compute-plans).
- [Supabase: billing/quotas](https://supabase.com/docs/guides/platform/billing-on-supabase), [database size](https://supabase.com/docs/guides/platform/database-size) e [backups](https://supabase.com/docs/guides/platform/backups).
- [Supabase Cron](https://supabase.com/docs/guides/cron), [agendamento de Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions), [limites das Edge Functions](https://supabase.com/docs/guides/functions/limits) e [Vault](https://supabase.com/docs/guides/database/vault).
- [Cloudflare Pages: limites](https://developers.cloudflare.com/pages/platform/limits/).
- [Mercado Livre: autenticação e autorização](https://developers.mercadolivre.com.br/pt_br/autenticacao-e-autorizacao?nocache=true).
- [Mercado Livre: notificações](https://developers.mercadolivre.com.br/pt_br/produto-consulta-de-usuarios/produto-receba-notificacoes).

[Certo] Limites, disponibilidade de plano, endpoints e permissões são premissas datadas; `GATE-002`, `GATE-003` e `GATE-006` exigem revalidação nas contas reais antes do piloto.

---

# Matriz mínima de testes

| Camada | Ferramentas | Cenários bloqueadores |
|---|---|---|
| Frontend unitário | Vitest, Testing Library, user-event, Axe | Auth, filtros, roles, estados de dados, CSV, teclado e semântica. |
| Frontend E2E | Playwright, Axe | Rotas diretas, reload, mobile, OAuth controlado, sync, exportação e modo leitura. |
| PostgreSQL | pgTAP | Schema, constraints, RLS, tenant cruzado, RPCs, fila e invariantes. |
| Edge Functions | Deno tests + Supabase local | JWT, roles, OAuth state, webhook, cooldown, scheduler e watchdog. |
| Python | pytest, pytest-asyncio, respx | Validação, retry, paginação, refresh, idempotência, lease, checkpoint e cálculo. |
| Contratos | Fixtures/JSON Schema compatíveis | TypeScript ↔ Edge ↔ PostgreSQL ↔ Pydantic. |
| Resiliência | Integração controlada | 429, timeout, cold start, restart, suspensão, dead letter e quota. |
| Segurança | Secret/dependency scan + testes direcionados | IDOR, replay, elevação de papel, vazamento de token e CSV injection. |
| Capacidade | Carga sintética e amostra real sanitizada | 12 mil anúncios, 250 pedidos/dia, memória, banco, egress e tempo/lote. |

---

# Registro de riscos

| ID | Risco | Mitigação obrigatória | Efeito na liberação |
|---|---|---|---|
| R-001 | Render Free hibernar ou ser suspenso | Fila persistente, checkpoints, dados antigos visíveis e modo leitura. | Sem retomada segura: `NO-GO`. |
| R-002 | Banco Supabase atingir limite | Campos mínimos, índices medidos, alertas 60%/70% e stop condition. | Acima do threshold: congelar importação. |
| R-003 | Endpoint financeiro indisponível | Estado incompleto e importação alternativa somente se aprovada. | Proibido fabricar tarifa/margem. |
| R-004 | Refresh token usado concorrentemente | Lock por seller e rotação atômica. | Falha recorrente: desconectar e bloquear sync. |
| R-005 | Vazamento multi-tenant | RLS, RPC segura e testes A/B em CI. | Qualquer ocorrência: `NO-GO`. |
| R-006 | Evento/job duplicado | Chaves idempotentes, coalescência e lease. | Duplicação financeira: `NO-GO`. |
| R-007 | Backup inexistente ou não restaurável | Destino externo, criptografia e teste real de restauração. | Dados reais proibidos. |
| R-008 | Métrica com falsa precisão | Dicionário, cobertura de custo e conciliação visível. | Métrica fica incompleta. |
| R-009 | Mocks permanecerem em produção | Gateway único, busca no bundle e E2E de produção. | Piloto bloqueado. |
| R-010 | Bundle/interface degradarem no mobile | Lazy loading, paginação, cards e orçamento de performance. | Corrigir antes de `G7`. |
| R-011 | Alterações atuais serem perdidas | Baseline e revisão antes de qualquer refactor. | Implementação não inicia. |
| R-012 | Mudança de termos/limites dos provedores | Revalidar antes do provisionamento e de cada liberação. | Replanejar ou `NO-GO`. |

---

# Bloqueios ativos

| ID | Bloqueio | Necessário para desbloquear | Bloqueia |
|---|---|---|---|
| BLK-001 | Destino externo de backup não definido | Escolher storage/runner sem violar custo zero e registrar chave/responsável. | `GATE-005`, `OPS-002`, dados reais. |
| BLK-002 | Responsável legal/privacidade não definido | Informar responsável, contato e aprovação dos documentos. | `GATE-005`, `GOV-001`, dados reais. |
| BLK-003 | Credenciais/contas dos provedores não verificadas | Acesso mínimo a Cloudflare, Supabase, Render e GitHub. | `GATE-002` e deploy. |
| BLK-004 | Aplicação ML e autorização do seller não verificadas | App ID/secret somente no servidor, redirect, tópicos e conta admin de teste. | `GATE-003`, OAuth e piloto. |
| BLK-005 | Fontes financeiras/Full não comprovadas | Classificar documentalmente em `GATE-004`; testar no piloto e guardar amostras sanitizadas. | `PILOT-005` e publicação de margem/estoque como definitivos; enquanto aberto, componentes ficam `incomplete`. |

---

# Backlog posterior ao P0

[Certo] Os itens P1/P2 abaixo são épicos adiados, não tarefas liberadas. Antes de qualquer execução, cada épico deve ser refinado no mesmo formato P0, com dependências, entrega, aceite, testes, evidência, risco e gate próprio.

## P1 — Evolução dentro do MVP

- [ ] **P1-001:** metas mensais simples persistidas por organização/conta, sem distribuição sofisticada.
- [ ] **P1-002:** intervalo personalizado e filtros avançados por SKU, MLB, categoria e situação.
- [ ] **P1-003:** refinamento de alertas e regras configuráveis com auditoria.
- [ ] **P1-004:** relatórios adicionais e otimização de consultas após medir o catálogo real.
- [ ] **P1-005:** melhorias de gestão de equipe e auditoria após uso do piloto.

## P2 — Fora do piloto inicial

- [ ] **P2-001:** Product Ads, ACoS, TACoS e ROAS completos.
- [ ] **P2-002:** Buy Box, concorrência e recomendações avançadas.
- [ ] **P2-003:** reprecificação automática ou manual enviada ao Mercado Livre.
- [ ] **P2-004:** criação de remessas, etiquetas e operações Full.
- [ ] **P2-005:** liquidações e campanhas automáticas.
- [ ] **P2-006:** previsões estatísticas e machine learning.
- [ ] **P2-007:** PDFs elaborados e relatórios agendados.

---

# Checklist final de GO/NO-GO

- [ ] Login usa Supabase Auth e o piloto é somente por convite.
- [ ] RLS impede acesso entre duas organizações em todas as operações.
- [ ] Nenhum segredo aparece no browser, bundle, URL, log, CSV ou artefato de CI.
- [ ] Uma conta ML conecta, renova e desconecta de forma segura.
- [ ] Quatro contas permanecem isoladas e consolidam métricas corretamente.
- [ ] Backfill de sete dias é idempotente e conciliado.
- [ ] Catálogo de aproximadamente 12 mil anúncios é processado em lotes recuperáveis.
- [ ] Expansão para 30 dias ocorreu somente se capacidade e backup permitiram.
- [ ] Dashboard, Financeiro, Produtos/Estoque e Administração usam dados reais.
- [ ] Custos ausentes e componentes não conciliados aparecem como incompletos.
- [ ] Webhooks persistem antes do `2xx` e não executam ETL completo.
- [ ] Scheduler, botão manual e watchdog coalescem trabalho sem duplicação.
- [ ] Cold start, restart, 429, timeout e suspensão foram exercitados.
- [ ] CSV está autorizado, completo e protegido contra formula injection.
- [ ] WCAG 2.2 AA e mobile foram validados nas rotas principais.
- [ ] Quotas, frescor, dead letters e modo leitura estão operacionais.
- [ ] Backup externo criptografado foi restaurado com sucesso.
- [ ] Privacidade, termos do piloto e resposta a incidentes estão aprovados.
- [ ] Soak de sete dias terminou sem vazamento, duplicação ou retry infinito.
- [ ] Limitações de disponibilidade e custo zero foram comunicadas ao seller.

**Regra final:** qualquer falha de RLS, exposição de segredo, duplicação financeira, divergência inexplicada, ausência de backup restaurável ou incapacidade de parar com segurança resulta em `NO-GO`.
