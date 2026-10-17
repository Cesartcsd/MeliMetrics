import { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Store, 
  ChevronDown, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ShoppingBag,
  Search,
  Check,
  Truck,
  RotateCcw,
  Receipt,
  Layers,
  ArrowDownRight,
  FolderTree,
  Package
} from 'lucide-react';
import { AnaliseCategorias } from './AnaliseCategorias';
import { CurvaAbcProdutos } from './CurvaAbcProdutos';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { dashboardData } from '@/lib/mockData';

import { formatCurrency, formatPercentage } from '@/lib/formatUtils';
import { exportToCSV } from '@/lib/exportUtils';

type ClasseABC = 'A' | 'B' | 'C';
type Periodo = 'hoje' | '7dias' | 'mes';

export interface DREDetalhadaItem {
  valor: number;
  percentual: number;
  detalhe: string;
}

export interface DREDetalhada {
  comissoes: DREDetalhadaItem;
  freteGratis: DREDetalhadaItem;
  taxasFixas: DREDetalhadaItem;
  devolucoesImpacto: DREDetalhadaItem;
  lucroLimpo: DREDetalhadaItem;
}

const metricasPorPeriodo: Record<Periodo, {
  label: string;
  kpis: {
    gmv: { value: string; change: string; subtext: string };
    margemReal: { value: string; badge: string; subtext: string };
    custosML: { value: string; badge: string; subtext: string };
    ticketMedio: { value: string; badge: string; subtext: string };
    dreDetalhada: DREDetalhada;
  };
  rentabilidadeEvolucao: Array<{ date: string; gmv: number; margem: number; taxas: number }>;
  chartSubtitle: string;
}> = {
  hoje: {
    label: 'Hoje (Intradiário)',
    kpis: {
      gmv: { value: 'R$ 21.480,00', change: '+18.4% vs ontem', subtext: 'Receita bruta intradiária' },
      margemReal: { value: 'R$ 6.873,60', badge: '32.0%', subtext: 'Após comissões e fretes hoje' },
      custosML: { value: 'R$ 5.799,60', badge: '27.0% GMV', subtext: 'Comissão ML 16.2% • Fretes Full 10.8%' },
      ticketMedio: { value: 'R$ 188,40', badge: '114 pedidos', subtext: '114 pedidos finalizados hoje' },
      dreDetalhada: {
        comissoes: { valor: 3480, percentual: 16.2, detalhe: 'Tarifas e comissões de anúncio' },
        freteGratis: { valor: 2319.60, percentual: 10.8, detalhe: 'Subsídio obrigatório > R$79' },
        taxasFixas: { valor: 627, percentual: 2.9, detalhe: 'R$ 5,50 por unid. vendida' },
        devolucoesImpacto: { valor: 420, percentual: 1.9, detalhe: 'Frete reverso & quebras' },
        lucroLimpo: { valor: 4832.90, percentual: 22.5, detalhe: 'Margem líquida no bolso' }
      }
    },
    rentabilidadeEvolucao: [
      { date: '08:00', gmv: 1800, margem: 576, taxas: 486 },
      { date: '10:00', gmv: 4200, margem: 1344, taxas: 1134 },
      { date: '12:00', gmv: 7900, margem: 2528, taxas: 2133 },
      { date: '14:00', gmv: 12400, margem: 3968, taxas: 3348 },
      { date: '16:00', gmv: 16800, margem: 5376, taxas: 4536 },
      { date: '18:00', gmv: 19500, margem: 6240, taxas: 5265 },
      { date: 'Agora', gmv: 21480, margem: 6873, taxas: 5799 }
    ],
    chartSubtitle: 'Evolução intradiária em tempo real com incidência das taxas e fretes do Mercado Livre'
  },
  '7dias': {
    label: 'Últimos 7 dias operacionais',
    kpis: {
      gmv: { value: 'R$ 124.500,00', change: '+12.4% WoW', subtext: 'Receita bruta últimos 7 dias' },
      margemReal: { value: 'R$ 39.093,00', badge: '31.4%', subtext: 'Após comissões e fretes na semana' },
      custosML: { value: 'R$ 34.362,00', badge: '27.6% GMV', subtext: 'Comissão ML 16.5% • Fretes Full/Flex 11.1%' },
      ticketMedio: { value: 'R$ 186,10', badge: '669 pedidos', subtext: '669 pedidos finalizados na semana' },
      dreDetalhada: {
        comissoes: { valor: 20542.50, percentual: 16.5, detalhe: 'Tarifas e comissões da semana' },
        freteGratis: { valor: 13819.50, percentual: 11.1, detalhe: 'Subsídio obrigatório > R$79' },
        taxasFixas: { valor: 3679.50, percentual: 2.9, detalhe: 'R$ 5,50 por unid. vendida' },
        devolucoesImpacto: { valor: 2490, percentual: 2.0, detalhe: 'Frete reverso & quebras' },
        lucroLimpo: { valor: 28635, percentual: 23.0, detalhe: 'Margem líquida no bolso' }
      }
    },
    rentabilidadeEvolucao: [
      { date: '18 Out', gmv: 16500, margem: 5180, taxas: 4550 },
      { date: '19 Out', gmv: 17200, margem: 5400, taxas: 4740 },
      { date: '20 Out', gmv: 18100, margem: 5680, taxas: 4990 },
      { date: '21 Out', gmv: 17800, margem: 5580, taxas: 4910 },
      { date: '22 Out', gmv: 18400, margem: 5770, taxas: 5070 },
      { date: '23 Out', gmv: 19100, margem: 6000, taxas: 5270 },
      { date: 'Hoje', gmv: 21480, margem: 6873, taxas: 5799 }
    ],
    chartSubtitle: 'Evolução consolidada dos últimos 7 dias operacionais com incidência das taxas do ecossistema ML'
  },
  mes: {
    label: 'Mês Atual MoM',
    kpis: {
      gmv: { value: 'R$ 342.850,00', change: '+14.2% MoM', subtext: 'Receita bruta consolidada do mês' },
      margemReal: { value: 'R$ 107.654,00', badge: '31.4%', subtext: 'Após comissões e fretes acumulados' },
      custosML: { value: 'R$ 94.620,00', badge: '27.6% GMV', subtext: 'Comissão ML 16.5% • Fretes Full/Flex 11.1%' },
      ticketMedio: { value: 'R$ 186,10', badge: '1.842 pedidos', subtext: '1.842 pedidos finalizados no período' },
      dreDetalhada: {
        comissoes: { valor: 56570.25, percentual: 16.5, detalhe: 'Tarifas e comissões do mês' },
        freteGratis: { valor: 38049.75, percentual: 11.1, detalhe: 'Subsídio obrigatório > R$79' },
        taxasFixas: { valor: 10131, percentual: 2.9, detalhe: 'R$ 5,50 por unid. vendida' },
        devolucoesImpacto: { valor: 6857, percentual: 2.0, detalhe: 'Frete reverso & quebras' },
        lucroLimpo: { valor: 78855.50, percentual: 23.0, detalhe: 'Margem líquida no bolso' }
      }
    },
    rentabilidadeEvolucao: [
      { date: '01 Out', gmv: 82000, margem: 25800, taxas: 22100 },
      { date: '05 Out', gmv: 78500, margem: 24200, taxas: 21300 },
      { date: '10 Out', gmv: 94000, margem: 30100, taxas: 25800 },
      { date: '15 Out', gmv: 88200, margem: 27900, taxas: 24200 },
      { date: '20 Out', gmv: 115000, margem: 36800, taxas: 31200 },
      { date: '25 Out', gmv: 142000, margem: 45400, taxas: 38700 },
      { date: 'Hoje (30 Out)', gmv: 148920, margem: 48500, taxas: 40500 }
    ],
    chartSubtitle: 'Evolução acumulada no mês corrente com incidência das taxas e comissões do ecossistema Mercado Livre'
  }
};

interface VendasMetricasProps {
  onNavigate?: (view: string) => void;
}

export default function VendasMetricas({ onNavigate }: VendasMetricasProps) {
  const [activeClasse, setActiveClasse] = useState<ClasseABC>('A');
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Todas as Lojas');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'dre' | 'categorias' | 'produtos'>('dre');
  const [selectedCatForProducts, setSelectedCatForProducts] = useState<string | undefined>(undefined);
  const [selectedSubcatForProducts, setSelectedSubcatForProducts] = useState<string | undefined>(undefined);

  const { curvaABC } = dashboardData.vendasMetricas;
  const currentMetricas = metricasPorPeriodo[periodo];
  const { kpis, rentabilidadeEvolucao, chartSubtitle } = currentMetricas;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  const handleExport = () => {
    exportToCSV(
      `DRE_MeliMetrics_${periodo}`,
      ['Data / Período', 'Faturamento GMV (R$)', 'Margem Líquida Real (R$)', 'Custos e Taxas ML (R$)'],
      rentabilidadeEvolucao.map(d => [d.date, d.gmv, d.margem, d.taxas])
    );
    setExportNotice('Relatório DRE exportado em CSV formatado com sucesso!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const currentProducts = (curvaABC[activeClasse] || []).filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-in pb-10">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-text-muted mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
            {onNavigate ? (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="hover:text-accent-blue transition-colors cursor-pointer"
              >
                MeliMetrics
              </button>
            ) : (
              <span>MeliMetrics</span>
            )}
            <span>/</span>
            <span className="text-accent-blue font-semibold">Vendas & Métricas</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-main">
            Inteligência Financeira & Rentabilidade
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('loja')}
              className="px-3 py-2 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-lg text-xs font-medium text-text-muted hover:text-text-main transition-colors cursor-pointer flex items-center gap-1.5"
              title="Comparar individualmente por conta"
            >
              <Store size={14} className="text-accent-blue" />
              <span>Visão por Loja</span>
            </button>
          )}
          {/* Store Selector */}
          <div className="relative">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="appearance-none bg-bg-surface border border-border-subtle text-sm text-text-main rounded-lg pl-9 pr-8 py-2 hover:bg-bg-elevated focus:outline-none focus:border-accent-blue cursor-pointer transition-colors"
            >
              <option value="Todas as Lojas">Todas as Lojas</option>
              <option value="Loja DOCA">Loja DOCA</option>
              <option value="Loja STAR">Loja STAR</option>
              <option value="Loja CASA">Loja CASA</option>
              <option value="Loja THERM">Loja THERM</option>
            </select>
            <Store size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Period Selector Tabs */}
          <div className="bg-bg-surface border border-border-subtle rounded-lg flex p-1 text-xs">
            <button
              onClick={() => {
                setPeriodo('hoje');
                setExportNotice('Visualizando métricas de Hoje (Intradiário)');
                setTimeout(() => setExportNotice(null), 2500);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                periodo === 'hoje'
                  ? 'bg-accent-blue text-white shadow-xs font-semibold'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => {
                setPeriodo('7dias');
                setExportNotice('Visualizando métricas dos Últimos 7 dias');
                setTimeout(() => setExportNotice(null), 2500);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                periodo === '7dias'
                  ? 'bg-accent-blue text-white shadow-xs font-semibold'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              7 dias WoW
            </button>
            <button
              onClick={() => {
                setPeriodo('mes');
                setExportNotice('Visualizando métricas do Mês Atual');
                setTimeout(() => setExportNotice(null), 2500);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                periodo === 'mes'
                  ? 'bg-accent-blue text-white shadow-xs font-semibold'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              Mês Atual MoM
            </button>
          </div>

          {/* Export DRE */}
          <button
            onClick={handleExport}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg px-3.5 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={15} className="text-text-muted" />
            <span>Exportar DRE (CSV)</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-75 cursor-pointer"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-status-green/10 border border-status-green/30 text-status-green px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 fade-in">
          <Check size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-border-subtle gap-2">
        <button
          onClick={() => setSubTab('dre')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
            subTab === 'dre'
              ? 'border-accent-blue text-accent-blue font-semibold'
              : 'border-transparent text-text-muted hover:text-text-main hover:border-border-subtle'
          }`}
        >
          <Receipt size={14} />
          <span>Visão Geral & DRE Consolidada</span>
        </button>

        <button
          onClick={() => setSubTab('categorias')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
            subTab === 'categorias'
              ? 'border-accent-blue text-accent-blue font-semibold'
              : 'border-transparent text-text-muted hover:text-text-main hover:border-border-subtle'
          }`}
        >
          <FolderTree size={14} />
          <span>Desempenho por Categorias ML</span>
        </button>

        <button
          onClick={() => setSubTab('produtos')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
            subTab === 'produtos'
              ? 'border-accent-blue text-accent-blue font-semibold'
              : 'border-transparent text-text-muted hover:text-text-main hover:border-border-subtle'
          }`}
        >
          <Package size={14} />
          <span>Produtos & Curva ABC</span>
        </button>
      </div>

      {subTab === 'dre' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: GMV */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">GMV FATURADO BRUTO</span>
              <div className="p-1.5 rounded-md bg-bg-base text-text-muted border border-border-subtle">
                <DollarSign size={14} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-heading font-bold text-text-main tracking-tight font-mono">
              {kpis.gmv.value}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted">{kpis.gmv.subtext}</span>
            <span className="font-mono font-medium text-status-green bg-status-green/10 px-2 py-0.5 rounded border border-status-green/20">
              {kpis.gmv.change}
            </span>
          </div>
        </div>

        {/* KPI 2: Margem Real & Lucro no Bolso */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">LUCRO LÍQUIDO REAL</span>
              <div className="p-1.5 rounded-md bg-status-green/10 text-status-green border border-status-green/20">
                <Percent size={14} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-heading font-bold text-status-green tracking-tight font-mono">
              {kpis.margemReal.value}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted">{kpis.margemReal.subtext}</span>
            <span className="font-mono font-bold text-status-green bg-status-green/10 px-2 py-0.5 rounded border border-status-green/20">
              {kpis.margemReal.badge} Margem
            </span>
          </div>
        </div>

        {/* KPI 3: Deduções & Custos do Ecossistema ML */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">DEDUÇÕES MERCADO LIVRE</span>
              <div className="p-1.5 rounded-md bg-status-red/10 text-status-red border border-status-red/20">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-heading font-bold text-text-main tracking-tight font-mono">
              {kpis.custosML.value}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted truncate mr-2" title={kpis.custosML.subtext}>
              {kpis.custosML.subtext}
            </span>
            <span className="font-mono font-medium text-status-red bg-status-red/10 px-2 py-0.5 rounded border border-status-red/20 shrink-0">
              {kpis.custosML.badge}
            </span>
          </div>
        </div>

        {/* KPI 4: Impacto de Fretes & Reversões */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">FRETE GRÁTIS OBRIGATÓRIO</span>
              <div className="p-1.5 rounded-md bg-status-amber/10 text-status-amber border border-status-amber/20">
                <Truck size={14} />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-heading font-bold text-text-main tracking-tight font-mono">
              {formatCurrency(kpis.dreDetalhada.freteGratis.valor)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted truncate mr-2">Devoluções: {formatCurrency(kpis.dreDetalhada.devolucoesImpacto.valor)}</span>
            <span className="font-mono font-medium text-status-amber bg-status-amber/10 px-2 py-0.5 rounded border border-status-amber/20 shrink-0">
              {formatPercentage(kpis.dreDetalhada.freteGratis.percentual)} GMV
            </span>
          </div>
        </div>
      </div>

      {/* DRE Sintético Operacional (Raio-X de Custos para o Dono) */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2">
              <Receipt size={16} className="text-accent-blue" />
              <span>DRE Operacional Sintético: Abertura Real dos Descontos ({currentMetricas.label})</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              O que realmente sai da sua conta antes do faturamento chegar ao banco
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-status-green self-start sm:self-auto font-medium">
            Lucro Limpo Consolidado: {formatCurrency(kpis.dreDetalhada.lucroLimpo.valor)} ({formatPercentage(kpis.dreDetalhada.lucroLimpo.percentual)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Comissões ML */}
          <div className="p-3 rounded-lg bg-bg-base/70 border border-border-subtle/60">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Comissões ML ({formatPercentage(kpis.dreDetalhada.comissoes.percentual)})</span>
              <ArrowDownRight size={13} className="text-status-red" />
            </div>
            <div className="text-base font-bold font-mono text-status-red">
              - {formatCurrency(kpis.dreDetalhada.comissoes.valor)}
            </div>
            <div className="text-[11px] text-text-muted mt-1 font-mono">
              {kpis.dreDetalhada.comissoes.detalhe}
            </div>
          </div>

          {/* Frete Grátis Obrigatório */}
          <div className="p-3 rounded-lg bg-bg-base/70 border border-border-subtle/60">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Frete Grátis (&gt;R$79)</span>
              <Truck size={13} className="text-status-amber" />
            </div>
            <div className="text-base font-bold font-mono text-status-amber">
              - {formatCurrency(kpis.dreDetalhada.freteGratis.valor)}
            </div>
            <div className="text-[11px] text-text-muted mt-1 font-mono">
              {formatPercentage(kpis.dreDetalhada.freteGratis.percentual)} • {kpis.dreDetalhada.freteGratis.detalhe}
            </div>
          </div>

          {/* Tarifas Fixas por Venda */}
          <div className="p-3 rounded-lg bg-bg-base/70 border border-border-subtle/60">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Taxas Fixas (&lt;R$79)</span>
              <Layers size={13} className="text-text-muted" />
            </div>
            <div className="text-base font-bold font-mono text-text-main">
              - {formatCurrency(kpis.dreDetalhada.taxasFixas.valor)}
            </div>
            <div className="text-[11px] text-text-muted mt-1 font-mono">
              {kpis.dreDetalhada.taxasFixas.detalhe}
            </div>
          </div>

          {/* Devoluções & Reversões */}
          <div className="p-3 rounded-lg bg-bg-base/70 border border-border-subtle/60">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Perdas por Devolução</span>
              <RotateCcw size={13} className="text-status-red" />
            </div>
            <div className="text-base font-bold font-mono text-status-red">
              - {formatCurrency(kpis.dreDetalhada.devolucoesImpacto.valor)}
            </div>
            <div className="text-[11px] text-text-muted mt-1 font-mono">
              {formatPercentage(kpis.dreDetalhada.devolucoesImpacto.percentual)} • {kpis.dreDetalhada.devolucoesImpacto.detalhe}
            </div>
          </div>

          {/* Lucro Líquido Real */}
          <div className="p-3 rounded-lg bg-status-green/10 border border-status-green/30">
            <div className="flex items-center justify-between text-xs text-status-green mb-1 font-semibold">
              <span>Lucro Líquido Real</span>
              <Check size={13} />
            </div>
            <div className="text-base font-bold font-mono text-status-green">
              {formatCurrency(kpis.dreDetalhada.lucroLimpo.valor)}
            </div>
            <div className="text-[11px] text-status-green/80 mt-1 font-mono">
              {formatPercentage(kpis.dreDetalhada.lucroLimpo.percentual)} margem no bolso
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section: Rentabilidade Diária */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-lg text-text-main">
              Rentabilidade Real: Faturamento Bruto vs. Margem Líquida ({currentMetricas.label})
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              {chartSubtitle}
            </p>
          </div>

          {/* Chart Legends */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-accent-blue rounded"></span>
              <span className="text-text-main">Faturamento Bruto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-status-green rounded"></span>
              <span className="text-text-main">Margem Líquida Real</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-status-red"></span>
              <span className="text-text-muted">Taxas & Deduções ML</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rentabilidadeEvolucao}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293d" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#1e293d' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `R$${val / 1000}k`} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131b2e',
                  borderColor: '#24324f',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  color: '#fff'
                }}
                formatter={(value: any, name: any) => {
                  const label = name === 'gmv' 
                    ? 'Faturamento Bruto' 
                    : name === 'margem' 
                    ? 'Margem Líquida' 
                    : 'Taxas ML';
                  return [formatCurrency(Number(value)), label];
                }}
              />
              {/* Line: Faturamento Bruto (Blue) */}
              <Line 
                type="monotone" 
                dataKey="gmv" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#131b2e', strokeWidth: 2 }}
              />
              {/* Line: Margem Líquida Real (Green) */}
              <Line 
                type="monotone" 
                dataKey="margem" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#131b2e', strokeWidth: 2 }}
              />
              {/* Line: Taxas ML (Dashed Red) */}
              <Line 
                type="monotone" 
                dataKey="taxas" 
                stroke="#ef4444" 
                strokeWidth={1.8} 
                strokeDasharray="4 4" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Curva ABC de Produtos Section */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-xs">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-border-subtle bg-[#0F1524] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-text-main">
              Curva ABC de Produtos & Rentabilidade
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Visão consolidada de contribuição por SKU com custos detalhados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar SKU ou Produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg-base border border-border-subtle text-xs rounded-lg pl-8 pr-3 py-1.5 text-text-main placeholder-text-muted focus:outline-none focus:border-accent-blue w-48 md:w-56"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            </div>

            {/* ABC Filter Tabs */}
            <div className="bg-bg-base border border-border-subtle rounded-lg flex p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveClasse('A')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeClasse === 'A'
                    ? 'bg-accent-blue text-white shadow-xs'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeClasse === 'A' ? 'bg-white' : 'bg-status-green'}`}></span>
                Classe A (80% GMV)
              </button>
              <button
                onClick={() => setActiveClasse('B')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeClasse === 'B'
                    ? 'bg-accent-blue text-white shadow-xs'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeClasse === 'B' ? 'bg-white' : 'bg-status-amber'}`}></span>
                Classe B (15%)
              </button>
              <button
                onClick={() => setActiveClasse('C')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeClasse === 'C'
                    ? 'bg-accent-blue text-white shadow-xs'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeClasse === 'C' ? 'bg-white' : 'bg-status-red'}`}></span>
                Classe C (5%)
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B101D] text-xs text-text-muted uppercase tracking-wider border-b border-border-subtle font-mono">
              <tr>
                <th className="py-3.5 px-4 font-semibold">PRODUTO / SKU</th>
                <th className="py-3.5 px-4 font-semibold text-right">VOLUME VENDIDO</th>
                <th className="py-3.5 px-4 font-semibold text-right">GMV TOTAL</th>
                <th className="py-3.5 px-4 font-semibold text-right">COMISSÃO ML MÉDIA</th>
                <th className="py-3.5 px-4 font-semibold text-right">MARGEM UNITÁRIA</th>
                <th className="py-3.5 px-4 font-semibold text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/80">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-text-muted">
                    Nenhum produto encontrado nesta classificação.
                  </td>
                </tr>
              ) : (
                currentProducts.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-bg-elevated/60 transition-colors">
                      {/* Produto & SKU */}
                      <td className="py-4 px-4 max-w-sm">
                        <div className="font-medium text-text-main line-clamp-1 text-sm">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="font-mono text-text-muted">{item.sku}</span>
                          <span className="text-text-muted">•</span>
                          <span className={`px-1.5 py-0.2 rounded text-[11px] font-mono font-medium ${
                            item.badge === 'Full' 
                              ? 'bg-status-green/15 text-status-green border border-status-green/30' 
                              : item.badge === 'Flex'
                              ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                              : 'bg-text-muted/15 text-text-muted border border-border-subtle'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                      </td>

                      {/* Volume Vendido */}
                      <td className="py-4 px-4 text-right font-mono text-text-main text-sm">
                        {item.volume}
                      </td>

                      {/* GMV Total */}
                      <td className="py-4 px-4 text-right font-mono font-medium text-text-main text-sm">
                        {item.gmv}
                      </td>

                      {/* Comissão ML */}
                      <td className="py-4 px-4 text-right font-mono text-xs text-status-amber">
                        {item.comissao}
                      </td>

                      {/* Margem Unitária */}
                      <td className="py-4 px-4 text-right font-mono font-semibold text-status-green text-sm">
                        {item.margem}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.statusType === 'success'
                            ? 'bg-status-green/10 text-status-green border-status-green/20'
                            : item.statusType === 'warning'
                            ? 'bg-status-amber/10 text-status-amber border-status-amber/20'
                            : item.statusType === 'accent'
                            ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                            : 'bg-text-muted/10 text-text-muted border-border-subtle'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center text-xs text-text-muted bg-[#0B101D] gap-2">
          <span>
            Exibindo <strong className="text-text-main">{currentProducts.length}</strong> produtos da{' '}
            <strong className="text-text-main">Classe {activeClasse}</strong> (ordenados por representatividade)
          </span>
          <div className="flex items-center gap-4">
            <span className="text-status-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-green"></span>
              98.4% da margem líquida preservada
            </span>
          </div>
        </div>
      </div>
      </div>
      )}

      {subTab === 'categorias' && (
        <AnaliseCategorias
          selectedStore={selectedStore}
          onSelectCategoryForProducts={(catId, subcatId) => {
            setSelectedCatForProducts(catId);
            setSelectedSubcatForProducts(subcatId);
            setSubTab('produtos');
          }}
        />
      )}

      {subTab === 'produtos' && (
        <CurvaAbcProdutos
          selectedStore={selectedStore}
          initialCategoriaId={selectedCatForProducts}
          initialSubcategoriaId={selectedSubcatForProducts}
        />
      )}
    </div>
  );
}
