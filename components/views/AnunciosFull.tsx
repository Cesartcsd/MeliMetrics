'use client';
import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  Layers, 
  RefreshCw, 
  Plus, 
  Search, 
  Download, 
  CheckCircle2, 
  Truck, 
  Warehouse, 
  ArrowRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  DollarSign,
  Flame
} from 'lucide-react';
import { dashboardData } from '@/lib/mockData';

type TabFiltro = 'todos' | 'risco' | 'excesso' | 'pausados';

interface AnunciosFullProps {
  onNavigate?: (view: string) => void;
}

export default function AnunciosFull({ onNavigate }: AnunciosFullProps) {
  const { kpis, coberturaCategorias, centrosDistribuicao, anunciosLista } = dashboardData.anunciosFull;

  const [activeTab, setActiveTab] = useState<TabFiltro>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCD, setSelectedCD] = useState('Todos os CDs');
  const [selectedConta, setSelectedConta] = useState('Todas as Contas (4)');
  const [curvaFilter, setCurvaFilter] = useState('todas');
  const [orderBy, setOrderBy] = useState<'menor_cobertura' | 'maior_estoque' | 'mais_vendidos'>('menor_cobertura');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Envio Full
  const [modalEnvioOpen, setModalEnvioOpen] = useState(false);
  const [envioSku, setEnvioSku] = useState(anunciosLista[0].sku);
  const [envioQtd, setEnvioQtd] = useState(150);
  const [envioCD, setEnvioCD] = useState('Louveira (SP)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Estoque dos 4 CDs sincronizado com o Mercado Livre Full!');
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ['Produto', 'SKU', 'MLB', 'Conta', 'CD', 'Estoque Disp', 'Estoque Transito', 'Vendas/Dia', 'Cobertura (Dias)', 'Status'];
    const rows = filteredAnuncios.map(a => [
      `"${a.name}"`, a.sku, a.mlb, a.conta, a.cd, a.estoqueDisp, a.estoqueTransito, a.vendasDia, a.coberturaDias, a.coberturaStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Estoque_Full_MeliMetrics_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório de estoque Full exportado em CSV!');
  };

  const handleConfirmEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setModalEnvioOpen(false);
    showToast(`Envio de ${envioQtd} un para ${envioCD} gerado com sucesso! Etiqueta disponível.`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAnuncios.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAnuncios.map(a => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtragem
  const filteredAnuncios = anunciosLista
    .filter(item => {
      // Tab filter
      if (activeTab === 'risco' && item.coberturaStatus !== 'Ruptura') return false;
      if (activeTab === 'excesso' && item.coberturaStatus !== 'Excesso') return false;
      if (activeTab === 'pausados' && item.status !== 'Pausado') return false;

      // CD filter
      if (selectedCD !== 'Todos os CDs' && !item.cd.includes(selectedCD)) return false;

      // Conta filter
      if (selectedConta !== 'Todas as Contas (4)' && !selectedConta.includes(item.conta)) return false;

      // Curva filter
      if (curvaFilter !== 'todas' && item.curva !== curvaFilter) return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(term) ||
          item.sku.toLowerCase().includes(term) ||
          item.mlb.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (orderBy === 'menor_cobertura') return a.coberturaDias - b.coberturaDias;
      if (orderBy === 'maior_estoque') return (b.estoqueDisp + b.estoqueTransito) - (a.estoqueDisp + a.estoqueTransito);
      if (orderBy === 'mais_vendidos') return b.vendasDia - a.vendasDia;
      return 0;
    });

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

      {/* Header & Controls */}
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
            <span className="text-accent-blue font-semibold">Anúncios & Full</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center gap-2">
            Gestão de Estoque Full & Fulfillment
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('matriz')}
              className="px-3 py-2 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-lg text-xs font-medium text-text-muted hover:text-text-main transition-colors cursor-pointer flex items-center gap-1.5"
              title="Auditar oscilações e quedas bruscas de visitas"
            >
              <ArrowRight size={13} className="text-status-amber" />
              <span>Matriz Sobe/Desce</span>
            </button>
          )}
          {/* Conta Selector */}
          <div className="relative">
            <select
              value={selectedConta}
              onChange={(e) => setSelectedConta(e.target.value)}
              className="appearance-none bg-bg-surface border border-border-subtle text-sm text-text-main rounded-lg pl-3 pr-8 py-2 hover:bg-bg-elevated focus:outline-none focus:border-accent-blue cursor-pointer transition-colors"
            >
              <option value="Todas as Contas (4)">Todas as Contas (4)</option>
              <option value="Conta DOCA">Conta DOCA</option>
              <option value="Conta STAR">Conta STAR</option>
              <option value="Conta CASA">Conta CASA</option>
              <option value="Conta THERM">Conta THERM</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* CD Selector */}
          <div className="relative">
            <select
              value={selectedCD}
              onChange={(e) => setSelectedCD(e.target.value)}
              className="appearance-none bg-bg-surface border border-border-subtle text-sm text-text-main rounded-lg pl-3 pr-8 py-2 hover:bg-bg-elevated focus:outline-none focus:border-accent-blue cursor-pointer transition-colors"
            >
              <option value="Todos os CDs">Todos os CDs (4)</option>
              <option value="Louveira">CD Louveira (SP)</option>
              <option value="Cajamar">CD Cajamar (SP)</option>
              <option value="Betim">CD Betim (MG)</option>
              <option value="Salvador">CD Salvador (BA)</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Sincronizar Estoque */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg px-3.5 py-2 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={14} className={`text-accent-blue ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Estoque'}</span>
          </button>

          {/* + Criar Envio Full CTA */}
          <button
            onClick={() => setModalEnvioOpen(true)}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Criar Envio Full</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Estoque Total Full */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">ESTOQUE TOTAL FULL</span>
              <div className="p-1.5 rounded-md bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                <Warehouse size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-text-main tracking-tight">
                {kpis.estoqueTotal.value}
              </span>
              <span className="font-mono text-xs text-status-green bg-status-green/10 px-1.5 py-0.5 rounded border border-status-green/20">
                {kpis.estoqueTotal.change}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted">{kpis.estoqueTotal.valor}</span>
            <span className="font-mono text-text-main font-medium">{kpis.estoqueTotal.subtext}</span>
          </div>
        </div>

        {/* KPI 2: Alertas de Ruptura (<7d) */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">ALERTAS DE RUPTURA (&lt;7D)</span>
              <div className="p-1.5 rounded-md bg-status-red/10 text-status-red border border-status-red/20">
                <AlertTriangle size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-status-red tracking-tight">
                {kpis.alertasRuptura.value}
              </span>
              <span className="font-mono text-xs text-status-red bg-status-red/10 px-1.5 py-0.5 rounded border border-status-red/20 font-semibold">
                {kpis.alertasRuptura.badge}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted truncate mr-1">{kpis.alertasRuptura.valor}</span>
            <span className="font-mono text-status-red font-medium shrink-0">{kpis.alertasRuptura.subtext}</span>
          </div>
        </div>

        {/* KPI 3: Custo de Armazenagem Prolongada (>60d) */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">CUSTO ARMAZENAGEM PROLONGADA</span>
              <div className="p-1.5 rounded-md bg-status-red/10 text-status-red border border-status-red/20">
                <Flame size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-status-red tracking-tight font-mono">
                {kpis.armazenagemProlongada.value}
              </span>
              <span className="font-mono text-xs text-status-red bg-status-red/10 px-1.5 py-0.5 rounded border border-status-red/20 font-semibold">
                Sangria Full
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted truncate mr-1">{kpis.armazenagemProlongada.valor}</span>
            <span className="font-mono text-status-red text-[11px] font-semibold shrink-0">18 SKUs penalizados</span>
          </div>
        </div>

        {/* KPI 4: Capital Parado em Estoque sem Giro */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">CAPITAL PARADO EM ESTOQUE</span>
              <div className="p-1.5 rounded-md bg-status-amber/10 text-status-amber border border-status-amber/20">
                <DollarSign size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-status-amber tracking-tight font-mono">
                R$ 87.420,00
              </span>
              <span className="font-mono text-xs text-status-amber bg-status-amber/10 px-1.5 py-0.5 rounded border border-status-amber/20">
                Giro &gt;60d
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs">
            <span className="text-text-muted truncate mr-1">Prejuízo diário em taxas:</span>
            <span className="font-mono text-status-amber font-semibold text-[11px] shrink-0">-R$ 143,00/dia</span>
          </div>
        </div>
      </div>

      {/* Alerta Financeiro de Armazenagem Prolongada (Aviso ao Dono) */}
      <div className="bg-status-red/10 border border-status-red/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-status-red/20 text-status-red shrink-0 mt-0.5">
            <Flame size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-text-main">
                Atenção ao Custo de Armazenagem Prolongada (Taxa ML &gt; 60 dias)
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-status-red/20 text-status-red border border-status-red/30">
                18 SKUs afetados
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Você tem <strong>1.120 unidades</strong> paradas gerando cobrança de <strong>R$ 4.290,50/mês</strong> em taxas de armazenagem no Full. Recomendado: criar queima promocional com desconto ou solicitar retirada para estancar o custo.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab('excesso');
              showToast('Filtrando anúncios em excesso de estoque com custo de armazenagem!');
            }}
            className="px-3.5 py-1.5 bg-status-red hover:bg-status-red/90 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Filtrar SKUs Afetados
          </button>
          <button
            onClick={() => showToast('Simulação de queima com cupom de 15% gerada para estancar taxas!')}
            className="px-3.5 py-1.5 bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            Criar Liquidação de Estoque
          </button>
        </div>
      </div>

      {/* Split Section: Cobertura por Categoria + Ocupação dos CDs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cobertura por Categoria (8 cols) */}
        <div className="lg:col-span-8 bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-heading font-bold text-lg text-text-main">
                  Cobertura de Dias de Estoque por Categoria
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Dias de estoque restante versus velocidade de saída atual
                </p>
              </div>

              {/* Legends */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-status-green"></span>
                  <span className="text-text-muted">Ideal (&gt;15d)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-status-red"></span>
                  <span className="text-text-muted">Crítico (&lt;7d)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-status-amber"></span>
                  <span className="text-text-muted">Excesso (&gt;60d)</span>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {coberturaCategorias.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-bg-base/60 border border-border-subtle/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-main">{cat.name}</span>
                      <span className="text-xs text-text-muted font-mono">
                        ({cat.estoque} • Giro: {cat.giro})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold" style={{ color: cat.color }}>
                        {cat.dias} dias restantes
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded border ${
                        cat.status.includes('Crítico')
                          ? 'bg-status-red/10 text-status-red border-status-red/20'
                          : cat.status.includes('Excesso')
                          ? 'bg-status-amber/10 text-status-amber border-status-amber/20'
                          : 'bg-status-green/10 text-status-green border-status-green/20'
                      }`}>
                        {cat.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#0A0E18] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.progress}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
            <span>Lead time médio de reposição: <strong className="text-text-main">9 dias úteis</strong></span>
            <button 
              onClick={() => showToast('Matriz de Giro ABC atualizada!')}
              className="text-accent-blue hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Matriz de Giro ABC</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right: Ocupação dos CDs (4 cols) */}
        <div className="lg:col-span-4 bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h2 className="font-heading font-bold text-lg text-text-main">
                Ocupação dos CDs
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Capacidade e lead time regional no Fulfillment
              </p>
            </div>

            <div className="space-y-4">
              {centrosDistribuicao.map((cd) => (
                <div key={cd.id} className="p-3 rounded-lg bg-bg-base/60 border border-border-subtle/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Truck size={13} className="text-accent-blue" />
                      <span className="font-medium text-text-main">{cd.name}</span>
                      <span className="text-text-muted font-mono text-[11px]">• {cd.leadTime}</span>
                    </div>
                    <span className="font-mono text-text-muted">{cd.un}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-text-muted">Ocupação</span>
                    <span className={`font-semibold ${cd.ocupacao >= 80 ? 'text-accent-blue' : 'text-status-green'}`}>
                      {cd.ocupacao}%
                    </span>
                  </div>

                  {/* Ocupação Progress Bar */}
                  <div className="w-full bg-[#0A0E18] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cd.ocupacao >= 80 ? 'bg-accent-blue' : 'bg-status-green'
                      }`}
                      style={{ width: `${cd.ocupacao}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle">
            <button
              onClick={() => showToast('Iniciando análise de balanceamento de estoque entre Louveira e Cajamar...')}
              className="w-full bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-main text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal size={13} className="text-text-muted" />
              <span>Redistribuir Estoque Regional</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Main Table: Todos os Anúncios */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-xs">
        {/* Table Filter Tabs and Action Bar */}
        <div className="p-4 sm:p-5 border-b border-border-subtle bg-[#0F1524] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'todos'
                  ? 'bg-accent-blue text-white shadow-xs'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              Todos os Anúncios (361)
            </button>

            <button
              onClick={() => setActiveTab('risco')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'risco'
                  ? 'bg-status-red text-white shadow-xs'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              <span>Risco Iminente</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'risco' ? 'bg-white/25 text-white' : 'bg-status-red/20 text-status-red'
              }`}>
                14
              </span>
            </button>

            <button
              onClick={() => setActiveTab('excesso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'excesso'
                  ? 'bg-status-amber text-black font-semibold shadow-xs'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              <span>Sobre-estoque</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'excesso' ? 'bg-black/20 text-black' : 'bg-status-amber/20 text-status-amber'
              }`}>
                18
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pausados')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pausados'
                  ? 'bg-bg-elevated text-text-main shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-elevated'
              }`}
            >
              <span>Pausados</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-bg-base text-text-muted">
                19
              </span>
            </button>
          </div>

          {/* Right Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar SKU, MLB ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg-base border border-border-subtle text-xs rounded-lg pl-8 pr-3 py-1.5 text-text-main placeholder-text-muted focus:outline-none focus:border-accent-blue w-48 sm:w-56"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            </div>

            {/* Curva ABC filter */}
            <div className="relative">
              <select
                value={curvaFilter}
                onChange={(e) => setCurvaFilter(e.target.value)}
                className="appearance-none bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-accent-blue cursor-pointer"
              >
                <option value="todas">Curva (Todas)</option>
                <option value="A">Curva A</option>
                <option value="B">Curva B</option>
                <option value="C">Curva C</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>

            {/* Order by */}
            <div className="relative">
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as any)}
                className="appearance-none bg-bg-base border border-border-subtle text-xs text-text-main rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-accent-blue cursor-pointer"
              >
                <option value="menor_cobertura">Menor Cobertura</option>
                <option value="maior_estoque">Maior Estoque</option>
                <option value="mais_vendidos">Mais Vendidos</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              title="Exportar CSV de Estoque"
              className="bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-main rounded-lg p-1.5 transition-colors cursor-pointer"
            >
              <Download size={15} />
            </button>
          </div>
        </div>

        {/* Selected Batch Action Banner */}
        {selectedIds.length > 0 && (
          <div className="bg-accent-blue/10 border-b border-accent-blue/20 px-5 py-2.5 flex items-center justify-between text-xs fade-in">
            <span className="text-text-main">
              <strong className="text-accent-blue">{selectedIds.length}</strong> anúncio(s) selecionado(s)
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setModalEnvioOpen(true);
                }}
                className="bg-accent-blue text-white px-3 py-1 rounded text-xs font-medium hover:bg-accent-blue-hover cursor-pointer"
              >
                Criar Envio Consolidado
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-text-muted hover:text-white px-2 py-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B101D] text-xs text-text-muted uppercase tracking-wider border-b border-border-subtle font-mono">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAnuncios.length && filteredAnuncios.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border-subtle bg-bg-base text-accent-blue focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-semibold">ANÚNCIO & SKU / MLB</th>
                <th className="py-3.5 px-4 font-semibold">STATUS CATÁLOGO</th>
                <th className="py-3.5 px-4 font-semibold text-right">ESTOQUE FULL (DISP + TRÂNSITO)</th>
                <th className="py-3.5 px-4 font-semibold text-right">VENDAS / DIA</th>
                <th className="py-3.5 px-4 font-semibold text-center">COBERTURA (DIAS)</th>
                <th className="py-3.5 px-4 font-semibold text-right">AÇÃO RECOMENDADA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/80">
              {filteredAnuncios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    Nenhum anúncio encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAnuncios.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-bg-elevated/60 transition-colors ${
                        isSelected ? 'bg-accent-blue/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded border-border-subtle bg-bg-base text-accent-blue focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Anúncio & SKU */}
                      <td className="py-4 px-4 max-w-sm">
                        <div className="font-medium text-text-main line-clamp-1 text-sm">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="font-mono text-text-muted">{item.sku}</span>
                          <span className="text-text-muted">•</span>
                          <span className="font-mono text-text-muted">{item.mlb}</span>
                          <span className="text-text-muted">•</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-bg-base border border-border-subtle text-text-muted">
                            {item.conta}
                          </span>
                        </div>
                      </td>

                      {/* Status Catálogo */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            item.status === 'Ativo' ? 'bg-status-green' : 'bg-status-red'
                          }`}></span>
                          <span className="text-xs font-medium text-text-main">{item.status}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-status-green/15 text-status-green border border-status-green/30 font-semibold">
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-muted mt-1 font-mono">
                          {item.cd}
                        </div>
                      </td>

                      {/* Estoque Full (Disp + Trânsito) */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-medium text-text-main text-sm">
                          {item.estoqueDisp} un disp.
                        </div>
                        <div className="text-xs text-text-muted font-mono">
                          +{item.estoqueTransito} em trânsito
                        </div>
                      </td>

                      {/* Vendas / Dia */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-medium text-text-main text-sm">
                          {item.vendasDia.toFixed(1)} un/dia
                        </div>
                        <div className={`text-xs font-mono ${
                          item.tendenciaWoW.startsWith('+') ? 'text-status-green' : 'text-status-red'
                        }`}>
                          {item.tendenciaWoW}
                        </div>
                      </td>

                      {/* Cobertura (Dias) */}
                      <td className="py-4 px-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                          item.coberturaStatus === 'Ruptura'
                            ? 'bg-status-red/10 text-status-red border-status-red/30'
                            : item.coberturaStatus === 'Excesso'
                            ? 'bg-status-amber/10 text-status-amber border-status-amber/30'
                            : item.coberturaStatus === 'Esgotado'
                            ? 'bg-text-muted/10 text-text-muted border-border-subtle'
                            : 'bg-status-green/10 text-status-green border-status-green/30'
                        }`}>
                          <span>{item.coberturaDias.toFixed(1)} dias</span>
                          <span className="text-[10px] font-normal">({item.coberturaStatus})</span>
                        </div>
                      </td>

                      {/* Ação Recomendada */}
                      <td className="py-4 px-4 text-right">
                        {item.action === 'Reabastecer Full' ? (
                          <button
                            onClick={() => {
                              setEnvioSku(item.sku);
                              setModalEnvioOpen(true);
                            }}
                            className="bg-accent-blue hover:bg-accent-blue-hover text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                          >
                            <Plus size={13} />
                            <span>{item.action}</span>
                          </button>
                        ) : item.action === 'Reprecificar' || item.action === 'Ativar Desconto' ? (
                          <button
                            onClick={() => showToast(`Sugestão de preço reduzido enviada para o anúncio ${item.sku}!`)}
                            className="bg-status-amber/15 hover:bg-status-amber/25 text-status-amber border border-status-amber/30 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>{item.action}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast(`Auditoria de BuyBox e fotos iniciada para ${item.sku}.`)}
                            className="bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-main text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                          >
                            {item.action}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center text-xs text-text-muted bg-[#0B101D] gap-3">
          <div>
            Mostrando <strong className="text-text-main">{filteredAnuncios.length}</strong> de <strong className="text-text-main">361</strong> anúncios
          </div>

          <div className="flex items-center gap-1 font-mono">
            <button className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-text-muted hover:text-white disabled:opacity-50" disabled>
              &lt;
            </button>
            <button className="px-2.5 py-1 rounded bg-accent-blue text-white font-bold">
              1
            </button>
            <button className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-text-muted hover:text-white">
              2
            </button>
            <button className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-text-muted hover:text-white">
              3
            </button>
            <span className="px-1 text-text-muted">...</span>
            <button className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-text-muted hover:text-white">
              46
            </button>
            <button className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-text-muted hover:text-white">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Criar Envio Full */}
      {modalEnvioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 fade-in">
          <div className="bg-bg-surface border border-border-subtle rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-main">Criar Envio Full</h3>
                  <p className="text-xs text-text-muted">Gerar remessa de reposição para o fulfillment</p>
                </div>
              </div>
              <button 
                onClick={() => setModalEnvioOpen(false)}
                className="text-text-muted hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmEnvio} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  SKU / Produto para Reposição
                </label>
                <select
                  value={envioSku}
                  onChange={(e) => setEnvioSku(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs"
                >
                  {anunciosLista.map(item => (
                    <option key={item.id} value={item.sku}>
                      {item.sku} - {item.name.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Centro de Distribuição Destino
                  </label>
                  <select
                    value={envioCD}
                    onChange={(e) => setEnvioCD(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs"
                  >
                    <option value="Louveira (SP)">Louveira (SP) - Lead 18h</option>
                    <option value="Cajamar (SP)">Cajamar (SP) - Lead 22h</option>
                    <option value="Betim (MG)">Betim (MG) - Lead 48h</option>
                    <option value="Salvador (BA)">Salvador (BA) - Lead 36h</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Quantidade de Unidades
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={envioQtd}
                    onChange={(e) => setEnvioQtd(Number(e.target.value))}
                    className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-bg-base rounded-lg border border-border-subtle text-xs text-text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Previsão de Cobertura adicional:</span>
                  <span className="font-mono text-status-green font-bold">+18.5 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Janela de Agendamento ML:</span>
                  <span className="text-text-main font-mono">Amanhã entre 08:00 - 12:00</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setModalEnvioOpen(false)}
                  className="px-4 py-2 bg-bg-base hover:bg-bg-elevated border border-border-subtle rounded-lg text-text-muted text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Confirmar e Gerar Remessa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
