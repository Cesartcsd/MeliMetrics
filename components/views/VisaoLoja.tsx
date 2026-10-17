import { useState, useEffect } from 'react';
import { 
  Store, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  RefreshCw, 
  Download, 
  ExternalLink,
  ChevronDown,
  Percent,
  X,
  Target,
  ArrowRight,
  Package
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { dashboardData } from '@/lib/mockData';
import ModalMetas from '@/components/modals/ModalMetas';
import { useMetas } from '@/lib/metasStore';
import { exportToCSV } from '@/lib/exportUtils';
import { getMesCalendarioInfo } from '@/lib/formatUtils';

type StoreKey = 'DOCA' | 'STAR' | 'CASA' | 'THERM';

interface VisaoLojaProps {
  onNavigate?: (view: string) => void;
  initialStoreKey?: StoreKey;
}

export default function VisaoLoja({ onNavigate, initialStoreKey = 'DOCA' }: VisaoLojaProps) {
  const [currentStoreKey, setCurrentStoreKey] = useState<StoreKey>(initialStoreKey);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 30 dias');
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);

  useEffect(() => {
    if (initialStoreKey) {
      setCurrentStoreKey(initialStoreKey);
    }
  }, [initialStoreKey]);

  const { metas } = useMetas();
  const store = dashboardData.visaoLoja[currentStoreKey];

  const storeGMVValues: Record<StoreKey, number> = {
    DOCA: 96000,
    STAR: 144000,
    CASA: 65141.50,
    THERM: 37708.50,
  };

  const { diasNoMes, diaAtual } = getMesCalendarioInfo();
  const storeMeta = metas[currentStoreKey] || 104000;
  const metaDiaria = Math.round(storeMeta / diasNoMes);
  const currentGMVNum = storeGMVValues[currentStoreKey] || 96000;
  const percentAtingido = storeMeta > 0 ? ((currentGMVNum / storeMeta) * 100).toFixed(1) : '0.0';
  
  // Projeção baseada em Run-Rate real dos dias transcorridos no mês
  const projecaoFechamento = Math.round((currentGMVNum / Math.max(1, diaAtual)) * diasNoMes).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const vendasDiariasAjustadas = store.vendasDiarias.map(d => ({ ...d, meta: metaDiaria }));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(`Métricas e reputação da conta ${store.id} sincronizadas com a API do Mercado Livre!`);
    }, 1200);
  };

  const handleExportRelatorio = () => {
    const headers = ['Métrica / Item', 'Valor'];
    const rows = [
      ['Loja', store.name],
      ['CNPJ', store.cnpj],
      ['Reputação', store.reputacao],
      ['GMV Faturado', store.kpis.gmv],
      ['Pedidos Realizados', store.kpis.vendasQtd],
      ['Margem Líquida Real', store.kpis.margemLiquida],
      ['Score de Saúde', `${store.kpis.scoreSaude}/100`],
      ['Reclamações', store.termometro.reclamacoes.value],
      ['Mediações', store.termometro.mediacoes.value],
      ['Cancelamentos Vendedor', store.termometro.cancelamentosVendedor.value],
      ['Despachos com Atraso', store.termometro.despachosAtraso.value],
    ];
    exportToCSV(`Relatorio_Loja_${store.id}_${new Date().toISOString().slice(0, 10)}`, headers, rows);
    showToast(`Relatório da conta ${store.id} exportado com sucesso!`);
  };

  return (
    <div className="space-y-6 fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-bg-surface border border-accent-blue/40 text-text-main px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 fade-in">
          <CheckCircle2 size={18} className="text-status-green" />
          <span className="text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header with Store Switcher */}
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
            <span>Visão por Loja</span>
            <span>/</span>
            <span className="text-accent-blue font-semibold">{store.id}</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center gap-2">
            Visão Geral da Conta & Reputação
          </h1>
        </div>

        {/* Store Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {(['DOCA', 'STAR', 'CASA', 'THERM'] as StoreKey[]).map((key) => {
            const isSelected = currentStoreKey === key;
            return (
              <button
                key={key}
                onClick={() => setCurrentStoreKey(key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-accent-blue text-white border-accent-blue shadow-sm'
                    : 'bg-bg-surface text-text-muted border-border-subtle hover:bg-bg-elevated hover:text-text-main'
                }`}
              >
                <Store size={13} />
                <span>Conta {key}</span>
              </button>
            );
          })}

          <div className="h-5 w-px bg-border-subtle mx-1 hidden sm:block"></div>

          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-bg-surface border border-border-subtle text-xs text-text-main rounded-lg pl-3 pr-7 py-2 hover:bg-bg-elevated focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              <option value="Últimos 7 dias">Últimos 7 dias</option>
              <option value="Últimos 30 dias">Últimos 30 dias</option>
              <option value="Mês Atual MoM">Mês Atual MoM</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Definir / Editar Meta */}
          <button
            onClick={() => setIsMetaModalOpen(true)}
            className="bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 text-accent-blue rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Definir e Editar Metas Operacionais de GMV"
          >
            <Target size={13} className="text-accent-blue" />
            <span className="hidden sm:inline">Definir / Editar Meta</span>
            <span className="sm:hidden">Meta</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            title="Sincronizar Conta"
          >
            <RefreshCw size={13} className={`text-accent-blue ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportRelatorio}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Exportar Relatório"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Store Identity & ML Reputation Card */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-subtle/80">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-heading font-bold text-text-main">{store.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Award size={12} />
                <span>{store.badge}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-status-green/15 text-status-green border border-status-green/30">
                <ShieldCheck size={12} />
                <span>{store.reputacao}</span>
              </span>
            </div>
            <div className="text-xs text-text-muted flex flex-wrap items-center gap-2 font-mono">
              <span>{store.razaoSocial}</span>
              <span>•</span>
              <span>CNPJ: {store.cnpj}</span>
              <span>•</span>
              <span className="text-status-green">Full Ativo</span>
              {store.flexAtivo && (
                <>
                  <span>•</span>
                  <span className="text-status-green">Flex Ativo</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast(`Auditoria oficial do termômetro da loja ${store.id} concluída. 100% de conformidade.`)}
              className="bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue border border-accent-blue/30 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>Auditar Termômetro ML</span>
            </button>
            <button
              onClick={() => showToast(`Redirecionando para as credenciais da API Mercado Livre da ${store.id}...`)}
              className="bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-main text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span>Painel ML</span>
            </button>
          </div>
        </div>

        {/* Termômetro Oficial do Mercado Livre */}
        <div className="mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-semibold text-text-main uppercase tracking-wider font-mono">
                Termômetro de Reputação & Indicadores Oficiais Mercado Livre
              </span>
              <p className="text-xs text-text-muted">Calculado sobre os últimos 60 dias de vendas concluídas</p>
            </div>

            {/* Visual 5-color bar */}
            <div className="flex items-center gap-1">
              <span className="w-6 h-2 rounded bg-red-600 opacity-40"></span>
              <span className="w-6 h-2 rounded bg-orange-500 opacity-40"></span>
              <span className="w-6 h-2 rounded bg-yellow-500 opacity-40"></span>
              <span className="w-6 h-2 rounded bg-emerald-400 opacity-40"></span>
              <span className="w-8 h-2.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-emerald-300"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Reclamações */}
            <div className="bg-bg-base/70 border border-border-subtle/80 rounded-lg p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Reclamações</span>
                  <span className="text-status-green font-semibold">{store.termometro.reclamacoes.status}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-heading font-bold text-status-green font-mono">
                    {store.termometro.reclamacoes.value}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono">
                    (máx {store.termometro.reclamacoes.max})
                  </span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-1 mt-2">
                  <div className="bg-status-green h-1 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
                🛡️ <span className="text-status-green font-medium">{store.termometro.reclamacoes.margemSeguranca || 'Margem segura'}</span>
              </div>
            </div>

            {/* Mediações */}
            <div className="bg-bg-base/70 border border-border-subtle/80 rounded-lg p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Mediações</span>
                  <span className="text-status-green font-semibold">{store.termometro.mediacoes.status}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-heading font-bold text-status-green font-mono">
                    {store.termometro.mediacoes.value}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono">
                    (máx {store.termometro.mediacoes.max})
                  </span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-1 mt-2">
                  <div className="bg-status-green h-1 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
                🛡️ <span className="text-status-green font-medium">{store.termometro.mediacoes.margemSeguranca || 'Margem segura'}</span>
              </div>
            </div>

            {/* Cancelamentos Vendedor */}
            <div className="bg-bg-base/70 border border-border-subtle/80 rounded-lg p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Cancelamentos Vendedor</span>
                  <span className="text-status-green font-semibold">{store.termometro.cancelamentosVendedor.status}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-heading font-bold text-status-green font-mono">
                    {store.termometro.cancelamentosVendedor.value}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono">
                    (máx {store.termometro.cancelamentosVendedor.max})
                  </span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-1 mt-2">
                  <div className="bg-status-green h-1 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
                🛡️ <span className="text-status-green font-medium">{store.termometro.cancelamentosVendedor.margemSeguranca || 'Margem segura'}</span>
              </div>
            </div>

            {/* Despachos com Atraso */}
            <div className="bg-bg-base/70 border border-border-subtle/80 rounded-lg p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Despachos c/ Atraso</span>
                  <span className="text-status-green font-semibold">{store.termometro.despachosAtraso.status}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-heading font-bold text-status-green font-mono">
                    {store.termometro.despachosAtraso.value}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono">
                    (máx {store.termometro.despachosAtraso.max})
                  </span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-1 mt-2">
                  <div className="bg-status-green h-1 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
                🛡️ <span className="text-status-green font-medium">{store.termometro.despachosAtraso.margemSeguranca || 'Margem segura'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPIs Cards of the Store */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">GMV DA CONTA</span>
              <div className="p-1.5 rounded-md bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                <DollarSign size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-text-main tracking-tight">
                {store.kpis.gmv}
              </span>
              <span className="font-mono text-xs text-status-green bg-status-green/10 px-1.5 py-0.5 rounded border border-status-green/20">
                {store.kpis.gmvGrowth}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span>{store.kpis.shareGlobal}</span>
            <span className="font-mono text-text-main font-medium">Ticket: {store.kpis.ticketMedio}</span>
          </div>
        </div>

        {/* Vendas Realizadas */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">VENDAS CONCLUÍDAS</span>
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShoppingBag size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-text-main tracking-tight">
                {store.kpis.vendasQtd}
              </span>
              <span className="font-mono text-xs text-status-green bg-status-green/10 px-1.5 py-0.5 rounded border border-status-green/20">
                {store.kpis.vendasGrowth}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span>Conversão: <strong className="text-text-main font-mono">{store.kpis.conversao}</strong></span>
            <span className="font-mono text-text-muted">Canc: {store.kpis.cancelamentos}</span>
          </div>
        </div>

        {/* Margem Líquida Real */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">MARGEM LÍQUIDA REAL</span>
              <div className="p-1.5 rounded-md bg-status-green/10 text-status-green border border-status-green/20">
                <TrendingUp size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-status-green tracking-tight">
                {store.kpis.margemLiquida}
              </span>
              <span className="font-mono text-xs text-status-green bg-status-green/10 px-1.5 py-0.5 rounded border border-status-green/20 font-bold">
                {store.kpis.margemPerc}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span className="truncate mr-1">{store.kpis.taxasPagas}</span>
          </div>
        </div>

        {/* Score de Saúde da Conta */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">SCORE DE SAÚDE DA CONTA</span>
              <div className="p-1.5 rounded-md bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                <Clock size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-accent-blue tracking-tight">
                {store.kpis.scoreSaude} <span className="text-lg text-text-muted font-normal">/ 100</span>
              </span>
              <span className="font-mono text-xs text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded border border-accent-blue/20">
                {store.kpis.scoreStatus}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span>Recertificação oficial:</span>
            <span className="font-mono text-text-main font-semibold">em {store.kpis.recertificacao}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Gráfico de Vendas vs Meta + DRE da Loja */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Vendas Diárias vs Meta (7 cols) */}
        <div className="lg:col-span-7 bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-text-main">
                  Vendas Diárias vs Meta Operacional
                </h3>
                <p className="text-xs text-text-muted">Ritmo diário de faturamento na conta {store.id}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-accent-blue"></span>
                  <span className="text-text-muted">Faturado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#94a3b8]"></span>
                  <span className="text-text-muted">Meta Diária (R$ {metaDiaria.toLocaleString('pt-BR')})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMetaModalOpen(true)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/25 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                  title="Ajustar meta desta conta"
                >
                  <Target size={11} />
                  <span>Ajustar Meta</span>
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vendasDiariasAjustadas}>
                  <defs>
                    <linearGradient id={`gradStore_${store.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293d" />
                  <XAxis dataKey="dia" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$${v/1000}k`} 
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131B2E', borderColor: '#2A3854', borderRadius: '8px' }}
                    itemStyle={{ color: '#ffffff' }}
                    formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#gradStore_${store.id})`}
                  />
                  <Line
                    type="monotone"
                    dataKey="meta"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
            <span>
              Meta mensal atingida: <strong className="text-status-green font-mono">{percentAtingido}% (R$ {(currentGMVNum / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k de R$ {(storeMeta / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k)</strong>
            </span>
            <span className="font-mono text-text-muted">Projeção de fechamento: R$ {projecaoFechamento}</span>
          </div>
        </div>

        {/* Right: DRE Direto da Loja (5 cols) */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-text-main">
                  DRE Direto da Loja
                </h3>
                <p className="text-xs text-text-muted">Composição de receitas e custos</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-bg-base border border-border-subtle text-text-muted">
                DRE Mensal
              </span>
            </div>

            <div className="space-y-3">
              {store.dre.map((row, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-bg-base/60 border border-border-subtle/50 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium ${row.tipo === 'lucro' ? 'text-status-green font-bold' : 'text-text-main'}`}>
                      {row.item}
                    </span>
                    <span className={`font-mono font-semibold ${
                      row.tipo === 'lucro'
                        ? 'text-status-green'
                        : row.tipo === 'receita'
                        ? 'text-accent-blue'
                        : 'text-status-red'
                    }`}>
                      {row.valor > 0 ? '+' : ''}R$ {Math.abs(row.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
                    <span>{row.percentual}% do GMV</span>
                    <div className="w-24 bg-[#0a0e18] rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          row.tipo === 'lucro'
                            ? 'bg-status-green'
                            : row.tipo === 'receita'
                            ? 'bg-accent-blue'
                            : 'bg-status-red'
                        }`}
                        style={{ width: `${Math.min(row.percentual, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle text-xs text-text-muted flex justify-between">
            <span>Retenção líquida:</span>
            <span className="font-mono text-status-green font-bold">22.0% de margem no caixa</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Anúncios da Conta */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border-subtle bg-[#0F1524] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2">
              Top Anúncios da Conta {store.id}
            </h3>
            <p className="text-xs text-text-muted">Performance de tráfego, BuyBox e receita dos principais SKUs</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-mono hidden md:inline">
              {store.topAnuncios.length} anúncios monitorados em alta prioridade
            </span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('anuncios')}
                className="text-xs font-semibold text-accent-blue hover:text-white hover:bg-accent-blue/20 bg-accent-blue/10 border border-accent-blue/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Ver catálogo Full completo"
              >
                <Package size={13} />
                <span>Ver Estoque Full</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B101D] text-xs text-text-muted uppercase tracking-wider border-b border-border-subtle font-mono">
              <tr>
                <th className="py-3.5 px-4 font-semibold">ANÚNCIO & SKU / MLB</th>
                <th className="py-3.5 px-4 font-semibold">MODALIDADE & CD</th>
                <th className="py-3.5 px-4 font-semibold text-right">ESTOQUE DISP.</th>
                <th className="py-3.5 px-4 font-semibold text-right">FATURAMENTO (SHARE)</th>
                <th className="py-3.5 px-4 font-semibold text-center">CONVERSÃO</th>
                <th className="py-3.5 px-4 font-semibold text-center">STATUS BUYBOX</th>
                <th className="py-3.5 px-4 font-semibold text-right">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/80">
              {store.topAnuncios.map((item) => (
                <tr key={item.id} className="hover:bg-bg-elevated/60 transition-colors">
                  {/* Anúncio & SKU */}
                  <td className="py-4 px-4 max-w-sm">
                    <div className="font-medium text-text-main line-clamp-1 text-sm">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-text-muted">
                      <span>{item.sku}</span>
                      <span>•</span>
                      <span>{item.mlb}</span>
                    </div>
                  </td>

                  {/* Modalidade & CD */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        item.tipoEnvio === 'Full'
                          ? 'bg-status-green/15 text-status-green border border-status-green/30'
                          : 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                      }`}>
                        {item.tipoEnvio}
                      </span>
                      <span className="text-xs text-text-muted font-mono">{item.cd}</span>
                    </div>
                  </td>

                  {/* Estoque */}
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-text-main font-semibold text-sm">
                      {item.estoque} un
                    </span>
                  </td>

                  {/* Faturamento (Share) */}
                  <td className="py-4 px-4 text-right">
                    <div className="font-mono font-bold text-text-main text-sm">
                      {item.faturamento}
                    </div>
                    <div className="text-xs font-mono text-text-muted">
                      {item.shareLoja} da loja
                    </div>
                  </td>

                  {/* Conversão */}
                  <td className="py-4 px-4 text-center">
                    <span className="font-mono text-xs px-2 py-1 rounded bg-bg-base border border-border-subtle text-text-main">
                      {item.conversao}
                    </span>
                  </td>

                  {/* BuyBox */}
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                      item.buyboxStatus === 'ok'
                        ? 'bg-status-green/10 text-status-green border-status-green/30'
                        : 'bg-status-red/10 text-status-red border-status-red/30'
                    }`}>
                      {item.buybox}
                    </span>
                  </td>

                  {/* Ação */}
                  <td className="py-4 px-4 text-right">
                    {item.buyboxStatus === 'alerta' ? (
                      <button
                        onClick={() => showToast(`Simulador de BuyBox aberto para ${item.sku}. Sugestão: reduzir R$ 4,00.`)}
                        className="bg-accent-blue hover:bg-accent-blue-hover text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-xs"
                      >
                        Reprecificar
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Análise completa de tráfego do anúncio ${item.sku} carregada.`)}
                        className="bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-main text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                      >
                        Auditar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Configuração de Metas */}
      <ModalMetas
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        initialStoreFocus={currentStoreKey}
        onSaved={(newMetas) => {
          showToast(`Meta da conta ${currentStoreKey} atualizada para R$ ${newMetas[currentStoreKey].toLocaleString('pt-BR')}!`);
        }}
      />
    </div>
  );
}
