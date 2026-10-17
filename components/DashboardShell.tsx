import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ArrowUpDown, 
  Package, 
  Store, 
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import DashboardGeral from './views/DashboardGeral';
import VendasMetricas from './views/VendasMetricas';
import MatrizSobeDesce from './views/MatrizSobeDesce';
import AnunciosFull from './views/AnunciosFull';
import VisaoLoja from './views/VisaoLoja';
import ConfiguracoesApi from './views/ConfiguracoesApi';

type ViewType = 'dashboard' | 'vendas' | 'matriz' | 'anuncios' | 'loja' | 'config';
type StoreKey = 'DOCA' | 'STAR' | 'CASA' | 'THERM';

export default function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedStoreKey, setSelectedStoreKey] = useState<StoreKey>('DOCA');
  const [operacaoContext, setOperacaoContext] = useState<string>('todas');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard Geral', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Vendas & Métricas', id: 'vendas', icon: TrendingUp },
    { name: 'Matriz Sobe e Desce', id: 'matriz', icon: ArrowUpDown, badge: '3' },
    { name: 'Anúncios & Full', id: 'anuncios', icon: Package },
    { name: 'Visão por Loja', id: 'loja', icon: Store },
    { name: 'Configurações de API', id: 'config', icon: Settings },
  ];

  const handleNavigate = (view: string, store?: StoreKey) => {
    if (store) {
      setSelectedStoreKey(store);
      setOperacaoContext(store.toLowerCase());
    }
    setCurrentView(view as ViewType);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setOperacaoContext(val);
    if (val === 'todas') {
      if (currentView === 'loja') {
        setCurrentView('dashboard');
      }
    } else {
      setSelectedStoreKey(val.toUpperCase() as StoreKey);
      setCurrentView('loja');
    }
  };

  const currentTabName = navigation.find(n => n.id === currentView)?.name || 'Dashboard';

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': 
        return <DashboardGeral onNavigate={(v) => handleNavigate(v)} />;
      case 'vendas': 
        return <VendasMetricas onNavigate={(v) => handleNavigate(v)} />;
      case 'matriz': 
        return <MatrizSobeDesce onNavigate={(v) => handleNavigate(v)} />;
      case 'anuncios': 
        return <AnunciosFull onNavigate={(v) => handleNavigate(v)} />;
      case 'loja': 
        return <VisaoLoja onNavigate={(v) => handleNavigate(v)} initialStoreKey={selectedStoreKey} />;
      case 'config': 
        return <ConfiguracoesApi onNavigate={(v) => handleNavigate(v)} />;
      default: 
        return <div className="p-8 text-text-muted">Tela em construção.</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base text-text-main">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" aria-hidden="true" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0e18] border-r border-border-subtle transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-64 lg:flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-16 px-4 border-b border-border-subtle shrink-0">
          <Activity className="text-accent-blue mr-2 shrink-0" />
          <span className="font-heading font-bold text-lg tracking-tight">MeliMetrics <span className="text-[10px] bg-border-subtle px-1 rounded ml-1 font-mono text-accent-blue">PRO</span></span>
          <button className="ml-auto lg:hidden text-text-muted hover:text-white p-1 rounded-md" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-border-subtle">
          <div className="text-[11px] font-semibold text-text-muted mb-2 tracking-wider font-mono uppercase">CONTEXTO DA OPERAÇÃO</div>
          <select 
            value={operacaoContext}
            onChange={handleContextChange}
            className="w-full bg-bg-surface border border-border-subtle text-xs rounded-lg p-2.5 text-text-main focus:ring-1 focus:ring-accent-blue focus:border-accent-blue cursor-pointer transition-colors"
          >
            <option value="todas">Todas as Lojas (Consolidado)</option>
            <option value="doca">Loja DOCA (Ferramentas)</option>
            <option value="star">Loja STAR (Tech)</option>
            <option value="casa">Loja CASA (Utilidades)</option>
            <option value="therm">Loja THERM (Medições)</option>
          </select>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-xs font-semibold' 
                    : 'text-text-muted hover:bg-bg-surface hover:text-text-main border border-transparent'
                }`}
              >
                <item.icon className={`mr-3 shrink-0 h-4.5 w-4.5 ${isActive ? 'text-accent-blue' : 'text-text-muted'}`} />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className={`ml-auto inline-block py-0.5 px-2 text-[11px] font-mono font-bold rounded-full ${isActive ? 'bg-status-red/25 text-status-red' : 'bg-status-red/15 text-status-red'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <button 
            onClick={() => {
              setCurrentView('config');
              setMobileMenuOpen(false);
            }}
            className="flex items-center text-xs text-text-muted hover:text-white mb-4 w-full cursor-pointer transition-colors p-1.5 rounded-md hover:bg-bg-surface"
            title="Ir para Configurações de API"
          >
            <div className="w-2 h-2 rounded-full bg-status-green mr-2 shrink-0 animate-pulse"></div>
            <span className="truncate">API Mercado Livre</span>
            <span className="ml-auto text-[11px] font-mono text-status-green font-semibold">42ms</span>
          </button>
          <button 
            onClick={onLogout} 
            className="flex items-center text-xs text-text-muted hover:text-status-red w-full cursor-pointer transition-colors p-1.5 rounded-md hover:bg-status-red/10"
          >
            <LogOut size={15} className="mr-2" />
            <span>Sair do MeliMetrics</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-border-subtle bg-[#0a0e18] shrink-0">
          <div className="flex items-center gap-2.5">
            <button 
              className="text-text-muted hover:text-white p-1 rounded-md cursor-pointer" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-heading font-bold text-sm text-text-main">MeliMetrics</span>
              <ChevronRight size={13} className="text-text-muted" />
              <span className="text-accent-blue font-semibold">{currentTabName}</span>
            </div>
          </div>

          <button
            onClick={() => handleNavigate('config')}
            className="text-[11px] text-accent-blue bg-accent-blue/10 px-2 py-1 rounded border border-accent-blue/25 font-mono cursor-pointer"
          >
            API 42ms
          </button>
        </div>

        {/* Dynamic View Area */}
        <main className="flex-1 overflow-y-auto bg-bg-base p-4 lg:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
