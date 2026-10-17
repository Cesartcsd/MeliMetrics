import React, { useState, useMemo } from 'react';
import { 
  FolderTree, 
  Search, 
  Download, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CategoriaDesempenho, getCategoriasFiltradas } from '@/lib/categoriesData';
import { formatCurrency, formatPercentage } from '@/lib/formatUtils';
import { exportToCSV } from '@/lib/exportUtils';

interface AnaliseCategoriasProps {
  selectedStore: string;
  onSelectCategoryForProducts?: (categoriaId: string, subcategoriaId?: string) => void;
}

export const AnaliseCategorias: React.FC<AnaliseCategoriasProps> = ({
  selectedStore,
  onSelectCategoryForProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRootCategory, setSelectedRootCategory] = useState<string>('todas');
  const [activeDrilldownId, setActiveDrilldownId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const categorias = useMemo(() => {
    return getCategoriasFiltradas(selectedStore);
  }, [selectedStore]);

  // Unique root categories
  const rootCategories = useMemo(() => {
    const map = new Map<string, string>();
    categorias.forEach(c => map.set(c.id, c.nome));
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }, [categorias]);

  // Filtered categories
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(c => {
      const matchSearch = 
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subcategoriaNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nicho.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRoot = selectedRootCategory === 'todas' || c.id === selectedRootCategory;
      const matchDrilldown = !activeDrilldownId || c.subcategoriaId === activeDrilldownId;

      return matchSearch && matchRoot && matchDrilldown;
    });
  }, [categorias, searchTerm, selectedRootCategory, activeDrilldownId]);

  // Totals & KPIs
  const totais = useMemo(() => {
    const totalGmv = categoriasFiltradas.reduce((acc, c) => acc + c.gmv, 0);
    const totalUnidades = categoriasFiltradas.reduce((acc, c) => acc + c.unidades, 0);
    const totalDeducoes = categoriasFiltradas.reduce((acc, c) => acc + (c.comissoesMl + c.freteMl + c.taxasFixas), 0);
    const totalLucro = categoriasFiltradas.reduce((acc, c) => acc + c.lucroLiquido, 0);
    const margemMedia = totalGmv > 0 ? (totalLucro / totalGmv) * 100 : 0;
    const taxaDevolucaoMedia = categoriasFiltradas.length > 0 
      ? categoriasFiltradas.reduce((acc, c) => acc + c.taxaDevolucao, 0) / categoriasFiltradas.length 
      : 0;

    return {
      totalGmv,
      totalUnidades,
      totalDeducoes,
      totalLucro,
      margemMedia,
      taxaDevolucaoMedia,
    };
  }, [categoriasFiltradas]);

  // Chart data
  const chartData = useMemo(() => {
    return categoriasFiltradas.map(c => ({
      name: c.subcategoriaNome.length > 20 ? `${c.subcategoriaNome.substring(0, 18)}...` : c.subcategoriaNome,
      fullName: c.subcategoriaNome,
      gmv: c.gmv,
      margem: c.margemPercentual,
      lucro: c.lucroLiquido,
    }));
  }, [categoriasFiltradas]);

  const handleExportCSV = () => {
    const headers = [
      'Código Categoria',
      'Categoria Raiz',
      'Subcategoria',
      'Nicho de Mercado',
      'Conta ML',
      'Vendas (Unidades)',
      'Faturamento GMV (R$)',
      'Comissões ML (R$)',
      'Frete ML (R$)',
      'Taxas Fixas (R$)',
      'Lucro Líquido Real (R$)',
      'Margem Real (%)',
      'Taxa Devoluções (%)',
      'Curva ABC'
    ];

    const rows = categoriasFiltradas.map(c => [
      c.id,
      c.nome,
      c.subcategoriaNome,
      c.nicho,
      `Loja ${c.lojaId}`,
      c.unidades,
      c.gmv,
      c.comissoesMl,
      c.freteMl,
      c.taxasFixas,
      c.lucroLiquido,
      c.margemPercentual.toFixed(2),
      c.taxaDevolucao.toFixed(1),
      c.classeAbc
    ]);

    exportToCSV(`Categorias_MeliMetrics_${selectedStore.replace(/\s+/g, '_')}`, headers, rows);
    setExportNotice('Relatório de categorias exportado com sucesso (BOM UTF-8)');
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

      {/* Breadcrumb Hierarchy Navigation Bar */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <FolderTree size={16} className="text-accent-blue" />
          <button 
            onClick={() => {
              setSelectedRootCategory('todas');
              setActiveDrilldownId(null);
            }}
            className={`hover:text-text-main transition-colors ${selectedRootCategory === 'todas' ? 'text-accent-blue font-bold' : ''}`}
          >
            Mercado Livre Brasil (MLB)
          </button>
          
          {selectedRootCategory !== 'todas' && (
            <>
              <ChevronRight size={13} />
              <button
                onClick={() => setActiveDrilldownId(null)}
                className={`hover:text-text-main transition-colors ${!activeDrilldownId ? 'text-accent-blue font-bold' : ''}`}
              >
                {rootCategories.find(r => r.id === selectedRootCategory)?.nome}
              </button>
            </>
          )}

          {activeDrilldownId && (
            <>
              <ChevronRight size={13} />
              <span className="text-text-main font-semibold">
                {categorias.find(c => c.subcategoriaId === activeDrilldownId)?.subcategoriaNome}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Root Category Select */}
          <select
            value={selectedRootCategory}
            onChange={(e) => {
              setSelectedRootCategory(e.target.value);
              setActiveDrilldownId(null);
            }}
            className="bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="todas">Todas as Categorias Raiz</option>
            {rootCategories.map(r => (
              <option key={r.id} value={r.id}>{r.nome}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar categoria, subcategoria ou nicho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-accent-blue transition-colors w-64"
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

      {/* 4 Metric Cards for Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV Faturado */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Faturamento Bruto GMV</span>
            <DollarSign size={16} className="text-accent-blue" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-text-main">
            {formatCurrency(totais.totalGmv)}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            <span className="font-mono text-text-main font-semibold">{totais.totalUnidades} un.</span> faturadas no período
          </div>
        </div>

        {/* Margem de Contribuição Líquida */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Margem Líquida Média</span>
            <Percent size={16} className="text-status-success" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-status-success">
            {formatPercentage(totais.margemMedia)}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Lucro Limpo no Bolso:{' '}
            <span className="font-mono text-status-success font-semibold">
              {formatCurrency(totais.totalLucro)}
            </span>
          </div>
        </div>

        {/* Deduções do Ecossistema ML */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Custos ML Retidos</span>
            <TrendingUp size={16} className="text-status-warning" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-text-main">
            {formatCurrency(totais.totalDeducoes)}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Comissões, Frete Grátis e Taxas Fixas
          </div>
        </div>

        {/* Taxa Média de Devoluções */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
            <span>Taxa Média de Devoluções</span>
            <AlertTriangle size={16} className={totais.taxaDevolucaoMedia > 3 ? 'text-status-danger' : 'text-text-muted'} />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-text-main">
            {totais.taxaDevolucaoMedia.toFixed(2)}%
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Benchmark ML tolerado: <span className="font-mono font-semibold">≤ 3.0%</span>
          </div>
        </div>
      </div>

      {/* Comparative Chart: Margem Real (%) por Subcategoria */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-main">
              Comparativo de Rentabilidade: Margem Real Líquida (%) por Categoria
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Identifique as categorias que geram maior rentabilidade percentual vs. as que apenas consom capital de giro
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.4} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#A0AEC0', fontSize: 11 }} 
                axisLine={{ stroke: '#2D3748' }}
              />
              <YAxis 
                tick={{ fill: '#A0AEC0', fontSize: 11 }} 
                axisLine={{ stroke: '#2D3748' }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-bg-elevated border border-border-subtle p-3 rounded-lg shadow-xl text-xs space-y-1 font-mono">
                        <div className="font-bold text-text-main font-sans">{data.fullName}</div>
                        <div className="text-text-muted">
                          Faturamento GMV: <span className="text-text-main">{formatCurrency(data.gmv)}</span>
                        </div>
                        <div className="text-status-success">
                          Margem Real Líquida: <span className="font-bold">{data.margem.toFixed(2)}%</span>
                        </div>
                        <div className="text-accent-blue">
                          Lucro Limpo: <span className="font-bold">{formatCurrency(data.lucro)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="margem" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.margem >= 30 ? '#10B981' : entry.margem >= 22 ? '#3B82F6' : '#F59E0B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High Density Categories Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-accent-blue" />
            <h3 className="text-sm font-semibold text-text-main">
              Matriz de Contribuição por Categoria & Subcategoria ML
            </h3>
            <span className="text-xs text-text-muted font-mono">
              ({categoriasFiltradas.length} categorias listadas)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-elevated border-b border-border-subtle text-text-muted font-mono">
              <tr>
                <th className="py-3 px-4 font-medium">Categoria / Subcategoria</th>
                <th className="py-3 px-3 font-medium">Conta ML</th>
                <th className="py-3 px-3 font-medium text-right">Vendas</th>
                <th className="py-3 px-4 font-medium text-right">GMV Bruto</th>
                <th className="py-3 px-4 font-medium text-right">Deduções ML</th>
                <th className="py-3 px-4 font-medium text-right">Lucro Líquido</th>
                <th className="py-3 px-3 font-medium text-right">Margem Real</th>
                <th className="py-3 px-3 font-medium text-right">Devoluções</th>
                <th className="py-3 px-3 font-medium text-center">Curva ABC</th>
                <th className="py-3 px-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {categoriasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-text-muted">
                    Nenhuma categoria encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                categoriasFiltradas.map((c) => (
                  <tr 
                    key={c.subcategoriaId} 
                    className="hover:bg-bg-elevated/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-text-main">{c.subcategoriaNome}</div>
                      <div className="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
                        <span>{c.nome}</span>
                        <span>·</span>
                        <span className="font-mono text-accent-blue/80">{c.subcategoriaId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-muted">
                        Loja {c.lojaId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-text-main">
                      {c.unidades} un
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-text-main">
                      {formatCurrency(c.gmv)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-text-muted">
                      {formatCurrency(c.comissoesMl + c.freteMl + c.taxasFixas)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-status-success">
                      {formatCurrency(c.lucroLiquido)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={`font-semibold ${
                        c.margemPercentual >= 30 ? 'text-status-success' : 
                        c.margemPercentual >= 20 ? 'text-accent-blue' : 'text-status-warning'
                      }`}>
                        {c.margemPercentual.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={c.taxaDevolucao > 3 ? 'text-status-danger font-semibold' : 'text-text-muted'}>
                        {c.taxaDevolucao.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        c.classeAbc === 'A' ? 'bg-status-success/15 text-status-success border border-status-success/30' :
                        c.classeAbc === 'B' ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30' :
                        'bg-border-subtle text-text-muted'
                      }`}>
                        {c.classeAbc}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (onSelectCategoryForProducts) {
                            onSelectCategoryForProducts(c.id, c.subcategoriaId);
                          }
                        }}
                        className="px-2.5 py-1 bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-blue text-[11px] font-medium text-text-muted hover:text-text-main rounded transition-all cursor-pointer inline-flex items-center gap-1"
                        title="Explorar produtos nesta categoria"
                      >
                        <span>Ver SKUs</span>
                        <ArrowRight size={12} className="text-accent-blue" />
                      </button>
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
