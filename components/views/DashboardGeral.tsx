import { useState } from 'react';
import { 
  RefreshCw, 
  Eye, 
  ShoppingBag, 
  ShieldCheck, 
  Banknote, 
  CheckCircle2, 
  X, 
  ChevronDown,
  TrendingUp,
  Store,
  Target,
  Pencil,
  Percent,
  Megaphone,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import KPICard from '@/components/ui/KPICard';
import AlertBanner from '@/components/ui/AlertBanner';
import ModalMetas from '@/components/modals/ModalMetas';
import { useMetas } from '@/lib/metasStore';

interface DashboardGeralProps {
  onNavigate?: (view: string) => void;
}

type PeriodoType = '7dias' | 'hoje' | 'mes';

const periodDataConfig = {
  hoje: {
    label: 'Hoje (Intradiário)',
    kpis: {
      gmv: { value: 'R$ 21.480,00', trend: '+18.4%', trendDirection: 'up' as const, projecao: 'R$ 28.500,00' },
      lucroLiquido: { value: 'R$ 4.832,90', margemPerc: '22.5%', trend: '+14.8%', trendDirection: 'up' as const, subtext: 'Livre de comissão, frete e imposto' },
      publicidade: { value: 'R$ 1.611,00', acos: '7.5%', roas: '13.3x', shareAds: '31% das vendas' },
      health: { status: 'Platinum', percentage: '99.4%', recl: '0.2%', atrasos: '0.4%', canc: '0.0%', margemSeguranca: '5 recl. até risco' }
    },
    chart: {
      title: 'Evolução Intradiária: Faturamento Bruto vs Lucro Líquido',
      subtitle: 'Rentabilidade e receita em tempo real de hoje consolidado',
      data: [
        { date: '08:00', vendas: 1800, lucro: 405, ads: 135 },
        { date: '10:00', vendas: 4200, lucro: 945, ads: 315 },
        { date: '12:00', vendas: 7900, lucro: 1777, ads: 592 },
        { date: '14:00', vendas: 12400, lucro: 2790, ads: 930 },
        { date: '16:00', vendas: 16800, lucro: 3780, ads: 1260 },
        { date: '18:00', vendas: 19500, lucro: 4387, ads: 1462 },
        { date: 'Agora', vendas: 21480, lucro: 4832, ads: 1611 }
      ]
    },
    share: [
      { account: 'STAR Tech', percentage: 44, value: 'R$ 9.451,20', lucro: 'R$ 2.362,80', margem: '25.0%', color: '#3b82f6' },
      { account: 'DOCA Ferramentas', percentage: 28, value: 'R$ 6.014,40', lucro: 'R$ 1.323,16', margem: '22.0%', color: '#10b981' },
      { account: 'CASA Utilidades', percentage: 17, value: 'R$ 3.651,60', lucro: 'R$ 1.168,51', margem: '32.0%', color: '#f59e0b' },
      { account: 'THERM Medições', percentage: 11, value: 'R$ 2.362,80', lucro: 'R$ 590,70', margem: '25.0%', color: '#8b5cf6' }
    ]
  },
  '7dias': {
    label: 'Últimos 7 dias operacionais',
    kpis: {
      gmv: { value: 'R$ 124.500,00', trend: '+12.4%', trendDirection: 'up' as const, projecao: 'R$ 520.000,00' },
      lucroLiquido: { value: 'R$ 28.635,00', margemPerc: '23.0%', trend: '+11.2%', trendDirection: 'up' as const, subtext: 'Lucro limpo no bolso pós-taxas' },
      publicidade: { value: 'R$ 9.711,00', acos: '7.8%', roas: '12.8x', shareAds: '34% das vendas' },
      health: { status: 'Platinum', percentage: '99.1%', recl: '0.4%', atrasos: '0.8%', canc: '0.2%', margemSeguranca: '14 recl. até risco' }
    },
    chart: {
      title: 'Evolução dos Últimos 7 Dias: Faturamento vs Lucro Líquido Real',
      subtitle: 'Desempenho financeiro líquido e custo de publicidade consolidado',
      data: [
        { date: '18/Out', vendas: 16500, lucro: 3795, ads: 1280 },
        { date: '19/Out', vendas: 17200, lucro: 3956, ads: 1340 },
        { date: '20/Out', vendas: 18100, lucro: 4163, ads: 1410 },
        { date: '21/Out', vendas: 17800, lucro: 4094, ads: 1390 },
        { date: '22/Out', vendas: 18400, lucro: 4232, ads: 1435 },
        { date: '23/Out', vendas: 19100, lucro: 4393, ads: 1490 },
        { date: 'Hoje', vendas: 21480, lucro: 4832, ads: 1611 }
      ]
    },
    share: [
      { account: 'STAR Tech', percentage: 42, value: 'R$ 52.290,00', lucro: 'R$ 13.072,50', margem: '25.0%', color: '#3b82f6' },
      { account: 'DOCA Ferramentas', percentage: 28, value: 'R$ 34.860,00', lucro: 'R$ 7.669,20', margem: '22.0%', color: '#10b981' },
      { account: 'CASA Utilidades', percentage: 19, value: 'R$ 23.655,00', lucro: 'R$ 7.569,60', margem: '32.0%', color: '#f59e0b' },
      { account: 'THERM Medições', percentage: 11, value: 'R$ 13.695,00', lucro: 'R$ 3.423,75', margem: '25.0%', color: '#8b5cf6' }
    ]
  },
  mes: {
    label: 'Mês Atual (Acumulado)',
    kpis: {
      gmv: { value: 'R$ 342.850,00', trend: '+14.2%', trendDirection: 'up' as const, projecao: 'R$ 520.000,00' },
      lucroLiquido: { value: 'R$ 78.855,50', margemPerc: '23.0%', trend: '+16.5%', trendDirection: 'up' as const, subtext: 'Lucro líquido consolidado no bolso' },
      publicidade: { value: 'R$ 27.085,00', acos: '7.9%', roas: '12.6x', shareAds: '36% das vendas' },
      health: { status: 'Platinum', percentage: '99.1%', recl: '0.4%', atrasos: '0.8%', canc: '0.2%', margemSeguranca: '28 recl. até risco' }
    },
    chart: {
      title: 'Evolução Acumulada do Mês: Faturamento vs Lucro Líquido',
      subtitle: 'Margem real de contribuição descontadas comissões, fretes e devoluções',
      data: [
        { date: 'Sem 1 (01-07)', vendas: 76000, lucro: 17480, ads: 6000 },
        { date: 'Sem 2 (08-14)', vendas: 82500, lucro: 18975, ads: 6520 },
        { date: 'Sem 3 (15-21)', vendas: 89300, lucro: 20539, ads: 7050 },
        { date: 'Sem 4 (22-28)', vendas: 95050, lucro: 21861, ads: 7515 },
        { date: 'Fechamento Est.', vendas: 385000, lucro: 88550, ads: 30415 }
      ]
    },
    share: [
      { account: 'STAR Tech', percentage: 42, value: 'R$ 144.000,00', lucro: 'R$ 36.000,00', margem: '25.0%', color: '#3b82f6' },
      { account: 'DOCA Ferramentas', percentage: 28, value: 'R$ 96.000,00', lucro: 'R$ 21.120,00', margem: '22.0%', color: '#10b981' },
      { account: 'CASA Utilidades', percentage: 19, value: 'R$ 65.141,50', lucro: 'R$ 20.845,28', margem: '32.0%', color: '#f59e0b' },
      { account: 'THERM Medições', percentage: 11, value: 'R$ 37.708,50', lucro: 'R$ 9.427,12', margem: '25.0%', color: '#8b5cf6' }
    ]
  }
};

export default function DashboardGeral({ onNavigate }: DashboardGeralProps) {
  const [periodo, setPeriodo] = useState<PeriodoType>('7dias');
  const [selectedStore, setSelectedStore] = useState('Todas as Contas (4)');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);

  const { metas } = useMetas();
  const currentData = periodDataConfig[periodo];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(`Métricas do período "${currentData.label}" sincronizadas com o Mercado Livre!`);
    }, 1000);
  };

  return (
    <div className="space-y-6 fade-in pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-bg-surface border border-accent-blue/40 text-text-main px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 fade-in">
          <CheckCircle2 size={18} className="text-status-green" />
          <span className="text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">
            MeliMetrics / <span className="text-accent-blue font-semibold">Dashboard Geral</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center gap-2">
            Visão Consolidada Multi-Conta
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Store Filter Selector */}
          <div className="relative">
            <select
              value={selectedStore}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedStore(val);
                if (val !== 'Todas as Contas (4)' && onNavigate) {
                  showToast(`Redirecionando para visão individual de ${val}...`);
                  setTimeout(() => onNavigate('loja'), 350);
                } else {
                  showToast(`Exibindo consolidação: ${val}`);
                }
              }}
              className="appearance-none bg-bg-surface border border-border-subtle text-xs text-text-main rounded-lg pl-8 pr-7 py-2 hover:bg-bg-elevated focus:outline-none focus:border-accent-blue cursor-pointer transition-colors font-medium"
            >
              <option value="Todas as Contas (4)">Todas as Contas (4)</option>
              <option value="Conta DOCA">Conta DOCA (Ferramentas)</option>
              <option value="Conta STAR">Conta STAR (Tech)</option>
              <option value="Conta CASA">Conta CASA (Utilidades)</option>
              <option value="Conta THERM">Conta THERM (Medições)</option>
            </select>
            <ShieldCheck size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-accent-blue pointer-events-none" />
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Period Selector: Hoje, Últimos 7 dias, Mês Atual */}
          <div className="bg-bg-surface border border-border-subtle rounded-lg flex p-1 text-xs">
            <button
              onClick={() => {
                setPeriodo('hoje');
                showToast('Exibindo métricas de Hoje (Intradiário)');
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
                showToast('Exibindo métricas dos Últimos 7 dias');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                periodo === '7dias'
                  ? 'bg-accent-blue text-white shadow-xs font-semibold'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              Últimos 7 dias
            </button>
            <button
              onClick={() => {
                setPeriodo('mes');
                showToast('Exibindo métricas do Mês Atual');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                periodo === 'mes'
                  ? 'bg-accent-blue text-white shadow-xs font-semibold'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              Mês Atual
            </button>
          </div>

          {/* Definir/Editar Meta Button */}
          <button
            onClick={() => setIsMetaModalOpen(true)}
            className="bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 text-accent-blue rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Definir e Editar Metas Operacionais de GMV"
          >
            <Target size={13} className="text-accent-blue" />
            <span>Definir / Editar Meta</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            title="Sincronizar com Mercado Livre"
          >
            <RefreshCw size={13} className={`text-accent-blue ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        </div>
      </div>

      <AlertBanner 
        type="warning" 
        title="Atenção Crítica" 
        message="3 anúncios na Conta DOCA com queda brusca de tráfego (-35% WoW) por perda de BuyBox."
        actionText="Ver na Matriz Sobe e Desce"
        onAction={() => onNavigate?.('matriz')}
      />

      {/* KPI Grid - Indicadores Financeiros e Alertas Reais para o Dono */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Bruto (GMV) */}
        <KPICard 
          title="FATURAMENTO BRUTO (GMV)" 
          value={currentData.kpis.gmv.value} 
          icon={Banknote}
          trend={currentData.kpis.gmv.trend}
          trendDirection={currentData.kpis.gmv.trendDirection}
          footer={
            <div className="flex items-center justify-between w-full">
              <span>
                {periodo === 'mes' ? 'Meta do Mês: ' : 'Meta Mensal: '}
                <strong className="text-text-main font-mono">
                  R$ {(Math.max(1, metas.global) / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k
                </strong>
                {periodo === 'mes' && metas.global > 0 && (
                  <span className="text-status-green ml-1.5 font-semibold text-[11px]">
                    ({((342850 / metas.global) * 100).toFixed(1)}%)
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMetaModalOpen(true);
                }}
                className="text-[11px] text-accent-blue hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="Editar meta do mês"
              >
                <Pencil size={10} />
                <span>Editar</span>
              </button>
            </div>
          }
        />

        {/* KPI 2: Lucro Líquido Real (Substituindo Visitas Únicas) */}
        <KPICard 
          title="LUCRO LÍQUIDO REAL" 
          value={currentData.kpis.lucroLiquido.value} 
          icon={Percent}
          trend={currentData.kpis.lucroLiquido.trend}
          trendDirection={currentData.kpis.lucroLiquido.trendDirection}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-status-green font-semibold">Margem: {currentData.kpis.lucroLiquido.margemPerc}</span>
              <span className="text-text-muted text-[11px] truncate max-w-[150px]">{currentData.kpis.lucroLiquido.subtext}</span>
            </div>
          }
        />

        {/* KPI 3: Publicidade e ACOS (Investimento em Ads vs Retorno) */}
        <KPICard 
          title="INVESTIMENTO ADS (ACOS / ROAS)" 
          value={currentData.kpis.publicidade.value} 
          icon={Megaphone}
          footer={
            <div className="flex items-center justify-between w-full text-xs font-mono">
              <span className="text-accent-blue font-semibold">ACOS: {currentData.kpis.publicidade.acos}</span>
              <span className="text-text-muted">ROAS: <strong className="text-text-main">{currentData.kpis.publicidade.roas}</strong></span>
              <span className="text-text-muted">Share: {currentData.kpis.publicidade.shareAds}</span>
            </div>
          }
        />

        {/* KPI 4: Saúde & Margem de Segurança de Reputação */}
        <KPICard 
          title="MARGEM DE SEGURANÇA (REPUTAÇÃO)" 
          value={<div className="flex items-center text-2xl font-bold text-status-green">{currentData.kpis.health.status} <span className="text-text-main ml-2 text-base font-normal">({currentData.kpis.health.percentage})</span></div>}
          icon={ShieldCheck}
          footer={
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between font-mono text-[10px]">
                <div className="flex flex-col"><span className="text-text-muted">Recl:</span><span className="text-status-green">{currentData.kpis.health.recl}</span></div>
                <div className="flex flex-col"><span className="text-text-muted">Atrasos:</span><span className="text-status-green">{currentData.kpis.health.atrasos}</span></div>
                <div className="flex flex-col"><span className="text-text-muted">Canc:</span><span className="text-status-green">{currentData.kpis.health.canc}</span></div>
              </div>
              <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 pt-1 border-t border-border-subtle/50">
                <AlertCircle size={11} />
                <span>{currentData.kpis.health.margemSeguranca}</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Charts Section: GMV vs Lucro Líquido Real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-lg p-5">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-bold text-lg">{currentData.chart.title}</h3>
              <p className="text-sm text-text-muted">{currentData.chart.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                <span className="text-text-muted">GMV</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                <span className="text-text-muted">Lucro Líquido</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-base border border-border-subtle text-accent-blue">
                {currentData.label}
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.chart.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293d" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a243d', borderColor: '#2a3854', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(val: any, name: any) => [
                    `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
                    name === 'vendas' ? 'Faturamento (GMV)' : name === 'lucro' ? 'Lucro Líquido Real' : 'Investimento Ads'
                  ]}
                />
                <Area type="monotone" dataKey="vendas" name="vendas" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVendas)" />
                <Area type="monotone" dataKey="lucro" name="lucro" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLucro)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share per account com Margem Real */}
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-lg">Rentabilidade por Conta</h3>
            <p className="text-sm text-text-muted">GMV e Lucro Líquido no período ({currentData.label})</p>
          </div>
          <div className="flex-1 space-y-4">
            {currentData.share.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-bg-base/50 border border-border-subtle/50">
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-text-main">{item.account}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-status-green">{item.margem} margem</span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-1.5 font-mono">
                  <span>GMV: <strong className="text-text-main">{item.value}</strong> ({item.percentage}%)</span>
                  <span>Lucro: <strong className="text-status-green">{item.lucro}</strong></span>
                </div>
                <div className="w-full bg-[#0a0e18] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 mt-auto border-t border-border-subtle text-xs flex justify-between items-center">
            <span className="text-text-muted">Maior Lucro: <strong className="text-status-green">STAR Tech (R$ 36k)</strong></span>
            <button 
              onClick={() => onNavigate?.('loja')} 
              className="text-accent-blue hover:underline cursor-pointer text-xs font-medium"
            >
              Auditar Contas →
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Configuração de Metas */}
      <ModalMetas
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        onSaved={(newMetas) => {
          showToast(`Meta global consolidada atualizada para R$ ${newMetas.global.toLocaleString('pt-BR')}!`);
        }}
      />
    </div>
  );
}
