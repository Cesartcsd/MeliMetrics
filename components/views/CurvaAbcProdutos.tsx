import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  Package, 
  DollarSign, 
  Percent, 
  Layers, 
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { 
  ProdutoCategoriaDetalhe, 
  CATEGORIAS_MERCADO_LIVRE, 
  getProdutosFiltrados 
} from '@/lib/categoriesData';
import { formatCurrency, formatPercentage } from '@/lib/formatUtils';
import { exportToCSV } from '@/lib/exportUtils';

interface CurvaAbcProdutosProps {
  selectedStore: string;
  initialCategoriaId?: string;
  initialSubcategoriaId?: string;
}

export const CurvaAbcProdutos: React.FC<CurvaAbcProdutosProps> = ({
  selectedStore,
  initialCategoriaId,
  initialSubcategoriaId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>(initialCategoriaId || 'todas');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>(initialSubcategoriaId || 'todas');
  const [selectedClasseAbc, setSelectedClasseAbc] = useState<'TODOS' | 'A' | 'B' | 'C'>('TODOS');
  const [selectedEnvio, setSelectedEnvio] = useState<'TODOS' | 'Full' | 'Flex' | 'Coleta'>('TODOS');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategoriaId) {
      setSelectedCategoria(initialCategoriaId);
    }
    if (initialSubcategoriaId) {
      setSelectedSubcategoria(initialSubcategoriaId);
    }
  }, [initialCategoriaId, initialSubcategoriaId]);

  // Categories list for select
  const rootCategories = useMemo(() => {
    const map = new Map<string, string>();
    CATEGORIAS_MERCADO_LIVRE.forEach(c => map.set(c.id, c.nome));
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }, []);

  // Subcategories list based on selected root category
  const subcategories = useMemo(() => {
    let list = CATEGORIAS_MERCADO_LIVRE;
    if (selectedCategoria !== 'todas') {
      list = list.filter(c => c.id === selectedCategoria);
    }
    const map = new Map<string, string>();
    list.forEach(c => map.set(c.subcategoriaId, c.subcategoriaNome));
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }, [selectedCategoria]);

  // Filtered Products
  const produtosFiltrados = useMemo(() => {
    let list = getProdutosFiltrados(selectedStore, selectedCategoria, selectedSubcategoria);

    if (selectedClasseAbc !== 'TODOS') {
      list = list.filter(p => p.classeAbc === selectedClasseAbc);
    }

    if (selectedEnvio !== 'TODOS') {
      list = list.filter(p => p.badgeEnvio === selectedEnvio);
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.titulo.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.mlb.toLowerCase().includes(q) ||
        p.subcategoriaNome.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedStore, selectedCategoria, selectedSubcategoria, selectedClasseAbc, selectedEnvio, searchTerm]);

  // Totals & KPIs
  const totais = useMemo(() => {
    const totalGmv = produtosFiltrados.reduce((acc, p) => acc + p.gmv, 0);
    const totalUnidades = produtosFiltrados.reduce((acc, p) => acc + p.unidadesVendidas, 0);
    const totalLucro = produtosFiltrados.reduce((acc, p) => acc + p.lucroLiquidoTotal, 0);
    const totalCustosMl = produtosFiltrados.reduce((acc, p) => acc + (p.comissaoMl + p.freteMl + p.taxaFixa), 0);
    const margemMedia = totalGmv > 0 ? (totalLucro / totalGmv) * 100 : 0;

    return {
      totalGmv,
      totalUnidades,
      totalLucro,
      totalCustosMl,
      margemMedia,
      qtdSkus: produtosFiltrados.length,
    };
  }, [produtosFiltrados]);

  const handleExportCSV = () => {
    const headers = [
      'SKU',
      'Código MLB',
      'Título do Anúncio',
      'Conta ML',
      'Categoria',
      'Subcategoria',
      'Preço Venda (R$)',
      'CMV Estimado (R$)',
      'Unidades Vendidas',
      'GMV Faturado (R$)',
      'Comissão ML (R$)',
      'Frete Grátis ML (R$)',
      'Taxas Fixas (R$)',
      'Lucro Líquido Real (R$)',
      'Margem Líquida (%)',
      'Taxa Devolução (%)',
      'Curva ABC',
      'Modalidade de Envio'
    ];

    const rows = produtosFiltrados.map(p => [
      p.sku,
      p.mlb,
      p.titulo,
      `Loja ${p.lojaId}`,
      p.categoriaNome,
      p.subcategoriaNome,
      p.precoVenda.toFixed(2),
      p.custoProdutoCMV.toFixed(2),
      p.unidadesVendidas,
      p.gmv.toFixed(2),
      p.comissaoMl.toFixed(2),
      p.freteMl.toFixed(2),
      p.taxaFixa.toFixed(2),
      p.lucroLiquidoTotal.toFixed(2),
      p.margemLiquidaPercentual.toFixed(2),
      p.taxaDevolucao.toFixed(1),
      p.classeAbc,
      p.badgeEnvio
    ]);

    exportToCSV(`CurvaABC_Produtos_${selectedStore.replace(/\s+/g, '_')}`, headers, rows);
    setExportNotice('Relatório de produtos exportado com sucesso (BOM UTF-8)');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed top-5 right-5 z-50 bg-bg-elevated border border-accent-blue/30 text-text-main px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-accent-blue" />
          {exportNotice}
        </div>
      )}

      {/* Control Bar & Filters */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Categoria Raiz */}
          <select
            value={selectedCategoria}
            onChange={(e) => {
              setSelectedCategoria(e.target.value);
              setSelectedSubcategoria('todas');
            }}
            className="bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="todas">Todas as Categorias</option>
            {rootCategories.map(r => (
              <option key={r.id} value={r.id}>{r.nome}</option>
            ))}
          </select>

          {/* Subcategoria */}
          <select
            value={selectedSubcategoria}
            onChange={(e) => setSelectedSubcategoria(e.target.value)}
            className="bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="todas">Todas as Subcategorias</option>
            {subcategories.map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>

          {/* Classe ABC Filter Buttons */}
          <div className="bg-bg-base border border-border-subtle rounded-lg flex p-0.5 text-xs">
            {(['TODOS', 'A', 'B', 'C'] as const).map(classe => (
              <button
                key={classe}
                onClick={() => setSelectedClasseAbc(classe)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-all cursor-pointer ${
                  selectedClasseAbc === classe
                    ? 'bg-accent-blue text-white shadow-xs font-bold'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {classe === 'TODOS' ? 'Curva ABC (Todos)' : `Classe ${classe}`}
              </button>
            ))}
          </div>

          {/* Envio Filter */}
          <div className="bg-bg-base border border-border-subtle rounded-lg flex p-0.5 text-xs">
            {(['TODOS', 'Full', 'Flex', 'Coleta'] as const).map(envio => (
              <button
                key={envio}
                onClick={() => setSelectedEnvio(envio)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  selectedEnvio === envio
                    ? 'bg-bg-elevated text-text-main font-bold border border-border-subtle'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {envio}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por SKU, MLB ou título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-accent-blue transition-colors w-60"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-xs font-medium text-text-main rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SKUs Analisados */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>SKUs Ativos Filtrados</span>
            <Package size={16} className="text-accent-blue" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-text-main">
            {totais.qtdSkus} <span className="text-sm font-normal text-text-muted">anúncios</span>
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Total de <span className="font-mono text-text-main font-semibold">{totais.totalUnidades} un.</span> faturadas
          </div>
        </div>

        {/* Faturamento GMV */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Faturamento GMV</span>
            <DollarSign size={16} className="text-accent-blue" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-text-main">
            {formatCurrency(totais.totalGmv)}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Ticket médio:{' '}
            <span className="font-mono text-text-main font-semibold">
              {totais.totalUnidades > 0 ? formatCurrency(totais.totalGmv / totais.totalUnidades) : 'R$ 0,00'}
            </span>
          </div>
        </div>

        {/* Lucro Líquido Real */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Lucro Líquido Total</span>
            <DollarSign size={16} className="text-status-success" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-status-success">
            {formatCurrency(totais.totalLucro)}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Margem Real:{' '}
            <span className="font-mono text-status-success font-semibold">
              {formatPercentage(totais.margemMedia)}
            </span>
          </div>
        </div>

        {/* Custos ML */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Deduções ML (Comissões/Frete)</span>
            <Percent size={16} className="text-status-warning" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-text-main">
            {formatCurrency(totais.totalCustosMl)}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Taxa média retida:{' '}
            <span className="font-mono text-text-main font-semibold">
              {totais.totalGmv > 0 ? `${((totais.totalCustosMl / totais.totalGmv) * 100).toFixed(1)}%` : '0.0%'}
            </span>
          </div>
        </div>
      </div>

      {/* High Density Products Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-accent-blue" />
            <h3 className="text-sm font-semibold text-text-main">
              Detalhamento de Rentabilidade e Curva ABC por Produto
            </h3>
            <span className="text-xs text-text-muted font-mono">
              ({produtosFiltrados.length} produtos correspondentes)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-elevated border-b border-border-subtle text-text-muted font-mono">
              <tr>
                <th className="py-3 px-4 font-medium">Produto & Identificadores</th>
                <th className="py-3 px-3 font-medium">Loja & Envio</th>
                <th className="py-3 px-3 font-medium">Subcategoria</th>
                <th className="py-3 px-3 font-medium text-right">Preço / CMV</th>
                <th className="py-3 px-3 font-medium text-right">Vendas</th>
                <th className="py-3 px-4 font-medium text-right">GMV Bruto</th>
                <th className="py-3 px-4 font-medium text-right">Custos ML</th>
                <th className="py-3 px-4 font-medium text-right">Lucro Limpo</th>
                <th className="py-3 px-3 font-medium text-right">Margem %</th>
                <th className="py-3 px-3 font-medium text-center">Curva ABC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-text-muted">
                    Nenhum produto encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-elevated/50 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-text-main truncate" title={p.titulo}>
                        {p.titulo}
                      </div>
                      <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5 font-mono">
                        <span className="text-accent-blue">{p.sku}</span>
                        <span>·</span>
                        <span>{p.mlb}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] text-text-muted">
                          Loja {p.lojaId}
                        </span>
                        <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded w-fit ${
                          p.badgeEnvio === 'Full' ? 'bg-status-success/15 text-status-success' :
                          p.badgeEnvio === 'Flex' ? 'bg-accent-blue/15 text-accent-blue' :
                          'bg-border-subtle text-text-muted'
                        }`}>
                          <Truck size={10} />
                          {p.badgeEnvio}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-text-muted text-[11px]">
                        {p.subcategoriaNome}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <div className="text-text-main font-semibold">{formatCurrency(p.precoVenda)}</div>
                      <div className="text-[10px] text-text-muted">CMV: {formatCurrency(p.custoProdutoCMV)}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-text-main">
                      {p.unidadesVendidas} un
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-text-main">
                      {formatCurrency(p.gmv)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-text-muted">
                      {formatCurrency(p.comissaoMl + p.freteMl + p.taxaFixa)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-status-success">
                      {formatCurrency(p.lucroLiquidoTotal)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={`font-semibold ${
                        p.margemLiquidaPercentual >= 30 ? 'text-status-success' :
                        p.margemLiquidaPercentual >= 20 ? 'text-accent-blue' : 'text-status-warning'
                      }`}>
                        {p.margemLiquidaPercentual.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        p.classeAbc === 'A' ? 'bg-status-success/15 text-status-success border border-status-success/30' :
                        p.classeAbc === 'B' ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30' :
                        'bg-border-subtle text-text-muted'
                      }`}>
                        {p.classeAbc}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
