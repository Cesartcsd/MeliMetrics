'use client';
import { useState } from 'react';
import { Download, Filter, CheckCircle2, X, ExternalLink, ArrowRight, DollarSign, AlertTriangle, TrendingDown } from 'lucide-react';
import { dashboardData } from '@/lib/mockData';

interface MatrizSobeDesceProps {
  onNavigate?: (view: string) => void;
}

export default function MatrizSobeDesce({ onNavigate }: MatrizSobeDesceProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = ['Produto', 'SKU', 'MLB', 'Conta', 'Impacto R$', 'Perda Diária', 'Visitas WoW', 'Visitas Abs', 'Vendas CR', 'Diagnostico', 'Motivo', 'Acao'];
    const rows = dashboardData.matriz.map(m => [
      `"${m.name}"`, m.sku, m.mlb, m.account, `"${m.prejuizoEstimado}"`, `"${m.perdaDiaria}"`, m.visitasWoW, m.visitasValue, `"${m.vendasCR}"`, `"${m.diagnosis}"`, `"${m.reason}"`, `"${m.action}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Matriz_Sobe_Desce_MeliMetrics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório da Matriz Sobe e Desce exportado com sucesso!');
  };

  const handleAction = (item: typeof dashboardData.matriz[0]) => {
    if (item.action.includes('Full')) {
      showToast(`Redirecionando para Anúncios & Full para o produto ${item.sku}...`);
      if (onNavigate) {
        setTimeout(() => onNavigate('anuncios'), 500);
      }
    } else if (item.action.includes('Reprecificar') || item.action.includes('Preço')) {
      showToast(`Preço do anúncio ${item.mlb} ajustado com sucesso para reconquistar a BuyBox! Prejuízo diário estancado.`);
    } else {
      showToast(`Diagnóstico financeiro executado para o anúncio ${item.mlb}.`);
    }
  };

  return (
    <div className="space-y-6 fade-in pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-bg-surface border border-accent-blue/40 text-text-main px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 fade-in">
          <CheckCircle2 size={18} className="text-status-green shrink-0" />
          <span className="text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white cursor-pointer ml-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">
            MeliMetrics / <span className="text-accent-blue font-semibold">Matriz Sobe e Desce</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-text-main flex items-center">
            Matriz Sobe e Desce: Risco Financeiro por Anúncio
            <span className="ml-3 text-xs bg-bg-surface border border-border-subtle px-2 py-1 rounded text-status-red font-semibold font-mono tracking-wide">
              -R$ 14.200/mês em Risco
            </span>
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Auditoria financeira em tempo real: impacto em faturamento e perda diária causada por perda de BuyBox, concorrência e rupturas.
          </p>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-lg text-xs font-medium text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              ← Voltar ao Dashboard
            </button>
            <button
              onClick={() => onNavigate('anuncios')}
              className="px-3 py-1.5 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 rounded-lg text-xs font-semibold text-accent-blue transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Ver Estoque Full</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards with Financial Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-text-muted uppercase tracking-wider">PREJUÍZO FINANCEIRO ESTIMADO</h3>
            <div className="p-2 bg-status-red/10 rounded-md"><TrendingDown size={16} className="text-status-red" /></div>
          </div>
          <div className="text-3xl font-heading font-bold text-status-red font-mono mb-4">-R$ 14.200,00 <span className="text-sm font-sans text-text-muted font-normal">/mês</span></div>
          <div className="flex justify-between text-sm pt-4 border-t border-border-subtle">
            <span className="text-text-muted">Sangria diária no caixa:</span>
            <span className="text-status-red font-mono font-semibold">-R$ 473,20/dia</span>
          </div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-text-muted uppercase tracking-wider">PERDAS DE BUYBOX (CONCORRÊNCIA)</h3>
            <div className="p-2 bg-status-amber/10 rounded-md"><AlertTriangle size={16} className="text-status-amber" /></div>
          </div>
          <div className="text-3xl font-heading font-bold mb-4 font-mono">2 <span className="text-sm font-sans text-text-muted font-normal">anúncios (R$ 12.270/mês)</span></div>
          <div className="flex justify-between text-sm pt-4 border-t border-border-subtle">
            <span className="text-text-muted">Ação imediata:</span>
            <span className="text-status-amber font-medium">Reprecificar centavos para retomar</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate?.('anuncios')}
          className={`bg-bg-surface border border-border-subtle rounded-lg p-5 ${onNavigate ? 'hover:border-accent-blue/50 cursor-pointer transition-all' : ''}`}
          title={onNavigate ? 'Clique para auditar estoque Full' : undefined}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-text-muted uppercase tracking-wider">RISCO DE RUPTURA NO FULL</h3>
            <div className="p-2 bg-accent-blue/10 rounded-md"><DollarSign size={16} className="text-accent-blue" /></div>
          </div>
          <div className="text-3xl font-heading font-bold mb-4 font-mono">1 <span className="text-sm font-sans text-text-muted font-normal">anúncio (R$ 1.930/mês)</span></div>
          <div className="flex justify-between text-sm pt-4 border-t border-border-subtle">
            <span className="text-text-muted">Cobertura crítica:</span>
            <span className="text-status-red font-mono font-semibold">Zera em 31h (Louveira) →</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-[#0F1524]">
          <div>
            <h3 className="font-medium text-sm text-text-main">Anúncios Auditados com Risco Financeiro Direto</h3>
            <p className="text-xs text-text-muted mt-0.5">Ordenados pelo maior valor monetário perdido</p>
          </div>
          <span className="text-xs text-status-red bg-status-red/10 border border-status-red/20 px-2.5 py-1 rounded font-mono font-medium">
            3 SKUs com ação emergencial
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0F1524] text-xs text-text-muted uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="p-4 font-medium">Anúncio & SKU / MLB</th>
                <th className="p-4 font-medium">Conta</th>
                <th className="p-4 font-medium text-right">Prejuízo Estimado</th>
                <th className="p-4 font-medium text-right">Queda Tráfego</th>
                <th className="p-4 font-medium">Diagnóstico Financeiro</th>
                <th className="p-4 font-medium text-right">Ação Corretiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {dashboardData.matriz.map((item) => (
                <tr key={item.id} className="hover:bg-bg-elevated transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-text-main mb-1 line-clamp-1">{item.name}</div>
                    <div className="text-xs text-text-muted font-mono flex items-center gap-1.5">
                      <span>{item.sku}</span>
                      <span>•</span>
                      <span>{item.mlb}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs bg-bg-base border border-border-subtle rounded font-mono">{item.account}</span>
                  </td>
                  {/* Financial Risk in R$ */}
                  <td className="p-4 text-right">
                    <div className="text-status-red font-mono font-bold text-sm">{item.prejuizoEstimado}</div>
                    <div className="text-xs text-text-muted font-mono mt-0.5">{item.perdaDiaria}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-status-red font-mono font-medium">{item.visitasWoW}</div>
                    <div className="text-xs text-text-muted font-mono">{item.visitasValue}</div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 shrink-0 ${item.diagnosis.includes('Buybox') ? 'bg-status-red' : 'bg-status-amber'}`}></div>
                      <div>
                        <div className="font-semibold text-text-main text-xs">{item.diagnosis}</div>
                        <div className="text-xs text-text-muted mt-0.5 leading-snug">{item.reason}</div>
                        <div className="text-[11px] text-accent-blue font-mono mt-1">{item.margemImpactada}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleAction(item)}
                      className="px-3.5 py-1.5 bg-accent-blue/10 hover:bg-accent-blue text-accent-blue hover:text-white border border-accent-blue/30 rounded text-xs font-semibold transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      {item.action === 'Reprecificar' ? 'Recuperar BuyBox' : 'Enviar Estoque Full'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border-subtle flex justify-between items-center text-xs text-text-muted bg-[#0F1524]">
          <span>Exibindo 3 de 3 anúncios com oscilação crítica identificada</span>
          <button 
            onClick={handleExportCSV}
            className="flex items-center hover:text-white transition-colors cursor-pointer text-accent-blue font-medium"
          >
            <Download size={14} className="mr-1.5" />
            Exportar Auditoria Financeira (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
