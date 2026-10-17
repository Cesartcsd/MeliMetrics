# Análise Avançada de Produtos e Categorias (MeliMetrics PRO)

Plano arquitetural e de experiência do usuário para introduzir a análise aprofundada de rentabilidade real, margem de contribuição e Curva ABC por categorias e produtos, integrada diretamente via sub-abas dentro do módulo **Vendas & Métricas**, com suporte à taxonomia multinível nativa do Mercado Livre.

---

## Decisões Críticas e Alinhamento com o Usuário

> [!IMPORTANT]
> As preferências do usuário foram validadas no turno de clarificação e orientam a arquitetura desta solução:
> - **Foco Central**: Rentabilidade real no bolso, margem de contribuição líquida (deduzindo comissões ML, frete grátis, devoluções e taxas fixas) e Curva ABC consolidada por categoria.
> - **Navegação**: Sub-abas integradas na visão de **Vendas & Métricas** (`Visão Geral & DRE` | `Análise por Categorias` | `Produtos & Curva ABC`), preservando a fluidez do fluxo de trabalho sem poluir o menu principal.
> - **Taxonomia de Categorias**: Suporte à hierarquia multinível do Mercado Livre (ex.: *Casa, Móveis e Decoração > Cozinha > Panelas*), permitindo filtro por departamento raiz, navegação breadcrumb de subcategorias e busca instantânea.

---

## 1. Visão Geral & Conceito Principal

### O que a funcionalidade entrega
Permite que o seller do Mercado Livre identifique exatamente quais categorias e famílias de produtos sustentam o lucro líquido real da operação e quais geram volume ilusório com margem corroída por devoluções e frete.

### Persona e Contexto de Uso
Sellers de médio e grande porte e gestores de e-commerce que operam múltiplas contas do Mercado Livre e necessitam tomar decisões de compras, reajuste de precificação e negociação com fornecedores com base no **CMV real** e na **Margem de Contribuição** por nicho de produto.

### Proposta de Valor
- **Visibilidade de Margem por Categoria**: Exposição do GMV faturado vs. Deduções ML vs. Lucro Líquido por cada ramo da árvore do Mercado Livre.
- **Curva ABC Tridimensional**: Classificação não apenas por faturamento bruto, mas por **Volume de Pedidos (Giro)** e **Margem de Contribuição (Lucro Real)**.
- **Detecção de Categorias Problemáticas**: Alertas automáticos para categorias com alta taxa de devolução/reclamação ou concentração perigosa de dependência de poucos SKUs.

---

## 2. Experiência do Usuário & Design Visual

Seguindo as diretrizes do guia de design para *SaaS Dashboards* (anti-slop, sem pills estáticas decorativas, tipografia com números tabulares e 60-30-10 de distribuição de cor):

### A. Fluxo de Navegação & Sub-abas
No topo da visão de **Vendas & Métricas**, logo abaixo do cabeçalho de boas-vindas e seletores de loja/período, haverá um seletor de sub-abas limpo (Segmented Control):
1. **DRE & Rentabilidade Geral**: Visão atual com DRE consolidada, gráficos de evolução e KPIs intradiários/semanais.
2. **Desempenho por Categorias**: Nova tela com matriz de categorias (árvore ML), gráfico comparativo de margem por categoria e tabela de contribuição.
3. **Detalhamento de Produtos (Curva ABC)**: Visão de produtos com filtros combinados de Categoria Raiz + Subcategoria, status ABC, taxa de devolução e margem líquida unitária.

### B. Hierarquia Visual & Componentes
- **Barra de Exploração de Categorias**: Breadcrumbs interativos que permitem subir ou descer níveis na taxonomia do Mercado Livre (`Casa & Decoração > Utensílios de Cozinha > Frigideiras`).
- **Cards de Métricas da Categoria Ativa**:
  - `GMV da Categoria` (com % do faturamento total da conta).
  - `Margem de Contribuição Média (%)` com indicador de rentabilidade saudável vs. crítica.
  - `Deduções Totais ML (Comissão + Frete + Taxas Fixas)`.
  - `Taxa Média de Devoluções / Reclamações`.
- **Tabela de Dados de Alta Densidade (Data Grid)**:
  - Cabeçalhos alinhados (texto à esquerda, valores monetários e percentuais à direita com `font-mono tabular-nums`).
  - Colunas: Categoria / Subcategoria, Vendas (un.), Faturamento GMV (R$), Custos ML (R$), Lucro Líquido (R$), Margem Real (%), Curva ABC e Ação de Drilldown.
  - Exportação direta para CSV formatado com BOM UTF-8 e separadores brasileiros.

---

## 3. Decisões de Produto & Arquitetura de Dados

### Decisão 1: Modelo de Dados da Árvore de Categorias
- **Abordagem**: Criar um mock estruturado e normalizado que espelha fielmente a API de Categorias do Mercado Livre (`/categories/{category_id}` e `/sites/MLB/categories`), onde cada SKU referencia sua `categoriaId`, `categoriaPath` (árvore completa) e métricas de margem calculadas.
- **Racional**: Prepara a arquitetura para plugar diretamente a API oficial do Mercado Livre ou o futuro pipeline em Python sem precisar refatorar as interfaces ou componentes.

### Decisão 2: Sub-abas integradas com Preservação de Filtros
- **Abordagem**: Os filtros globais existentes (seleção de loja `Todas as Lojas | DOCA | STAR...` e período `Hoje | 7 dias | Mês`) são compartilhados por todas as sub-abas.
- **Racional**: Evita que o usuário precise reconfigurar contexto de loja ao alternar entre o DRE global e o diagnóstico da categoria.

---

## 4. Arquitetura Técnica & Estratégia de Estado

### Diagrama de Componentes e Fluxo de Dados

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DashboardShell.tsx                              │
│         (Filtro de Loja Ativa + Metas Compartilhadas)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        VendasMetricas.tsx                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navegação de Sub-abas:                                           │  │
│  │ [ DRE Geral & Rentabilidade ] [ Categorias ML ] [ Produtos ABC ] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│           │                               │                            │
│           ▼                               ▼                            │
│  ┌─────────────────────────┐   ┌─────────────────────────────────────┐ │
│  │ Aba 1: DRE & Visão      │   │ Aba 2: AnaliseCategorias.tsx        │ │
│  │ Consolidada (Existente) │   │ - Breadcrumb da Árvore ML           │ │
│  │                         │   │ - Tabela de Margem por Categoria    │ │
│  │                         │   │ - Gráfico de Dispersão / Barras     │ │
│  └─────────────────────────┘   └──────────────────┬──────────────────┘ │
│                                                   │                    │
│                                                   ▼                    │
│                                ┌─────────────────────────────────────┐ │
│                                │ Aba 3: CurvaAbcProdutos.tsx         │ │
│                                │ - Filtro hierárquico por Categoria  │ │
│                                │ - Tabela ABC (A, B, C) por Rentab.  │ │
│                                │ - Exportação CSV dedicada           │ │
│                                └─────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Entidades de Dados
- **`CategoriaDesempenho`**:
  - `id`: Código identificador (ex.: `MLB1574`).
  - `nome`: Nome da categoria (ex.: `Casa, Móveis e Decoração`).
  - `subcategoria`: Nome do nicho imediato (ex.: `Cozinha e Panelas`).
  - `caminho`: Array com a linhagem completa.
  - `gmv`: Faturamento total bruto.
  - `unidades`: Unidades faturadas no período.
  - `comissoesMl`: Valor retido de comissão pelo ML.
  - `freteMl`: Custo de envios subsidiados e frete grátis.
  - `taxasFixas`: Taxas de R$ 6,00/R$ 6,50 de anúncios de baixo valor.
  - `lucroLiquido`: GMV menos deduções e CMV estimado.
  - `margemPercentual`: % real no bolso.
  - `taxaDevolucao`: % de devoluções no nicho.
  - `participacaoGmv`: % sobre o faturamento total da conta.
  - `classeAbc`: Classificação na Curva ABC da categoria.

### Próximos Passos de Execução (após aprovação do plano):
1. **Mock Data Enriquecido**: Adicionar dataset normalizado de categorias do Mercado Livre em `lib/mockData.ts` cobrindo as 4 lojas do seller.
2. **Subcomponente `AnaliseCategorias`**: Tabela de alta densidade, KPIs de margem da categoria e drilldown interativo.
3. **Subcomponente `CurvaAbcProdutos`**: Visualização detalhada de SKUs com seleção multinível de categorias e ranking de rentabilidade.
4. **Integração em `VendasMetricas`**: Barra de sub-abas, sincronização de filtros e exportadores CSV especializados para categorias e produtos.
