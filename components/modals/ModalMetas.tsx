'use client';
import { useState, useEffect } from 'react';
import { 
  Target, 
  X, 
  Check, 
  DollarSign, 
  Sparkles, 
  AlertCircle, 
  Store, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { MetasConfig, DEFAULT_METAS, useMetas } from '@/lib/metasStore';

interface ModalMetasProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (metas: MetasConfig) => void;
  initialStoreFocus?: 'global' | 'DOCA' | 'STAR' | 'CASA' | 'THERM';
}

export default function ModalMetas({ isOpen, onClose, onSaved, initialStoreFocus = 'global' }: ModalMetasProps) {
  const { metas: currentMetas, updateMetas } = useMetas();

  const [formState, setFormState] = useState<MetasConfig>(currentMetas);
  const [activeTab, setActiveTab] = useState<'geral' | 'lojas'>('geral');

  useEffect(() => {
    if (isOpen) {
      setFormState(currentMetas);
      if (initialStoreFocus !== 'global') {
        setActiveTab('lojas');
      } else {
        setActiveTab('geral');
      }
    }
  }, [isOpen, currentMetas, initialStoreFocus]);

  if (!isOpen) return null;

  const somaLojas = formState.DOCA + formState.STAR + formState.CASA + formState.THERM;
  const diferenca = formState.global - somaLojas;
  const bateuExato = Math.abs(diferenca) < 5;

  const handleDistribuirProporcional = () => {
    const total = formState.global;
    setFormState({
      ...formState,
      STAR: Math.round(total * 0.42),
      DOCA: Math.round(total * 0.28),
      CASA: Math.round(total * 0.19),
      THERM: Math.round(total * 0.11),
    });
  };

  const handleIgualarSoma = () => {
    setFormState({
      ...formState,
      global: somaLojas,
    });
  };

  const handlePresetGlobal = (valor: number) => {
    setFormState(prev => ({
      ...prev,
      global: valor,
    }));
  };

  const handlePresetAumento = (percent: number) => {
    const novoValor = Math.round(formState.global * (1 + percent / 100));
    setFormState(prev => ({
      ...prev,
      global: novoValor,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMetas(formState);
    if (onSaved) onSaved(formState);
    onClose();
  };

  const handleResetPadrao = () => {
    setFormState(DEFAULT_METAS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs fade-in">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-xs">
              <Target size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-text-main">
                Definir e Editar Metas do Mês
              </h2>
              <p className="text-xs text-text-muted">
                Metas operacionais de GMV para acompanhamento diário
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 pt-4 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'geral'
                ? 'bg-accent-blue text-white border-accent-blue shadow-xs'
                : 'bg-bg-base text-text-muted border-border-subtle hover:text-text-main'
            }`}
          >
            Meta Global Consolidada
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lojas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'lojas'
                ? 'bg-accent-blue text-white border-accent-blue shadow-xs'
                : 'bg-bg-base text-text-muted border-border-subtle hover:text-text-main'
            }`}
          >
            Metas Individuais por Loja (4)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-3 space-y-5 flex-1 text-sm">
          {activeTab === 'geral' ? (
            <div className="space-y-4">
              {/* Meta Global Input */}
              <div className="p-4 rounded-xl bg-bg-base/80 border border-border-subtle space-y-3">
                <label className="block text-xs font-mono font-semibold text-text-main uppercase tracking-wider">
                  Meta Consolidada do Mês (Todas as 4 Lojas)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-accent-blue font-bold">
                    R$
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={formState.global}
                    onChange={(e) => setFormState({ ...formState, global: Number(e.target.value) || 0 })}
                    className="w-full bg-[#090D17] border border-border-subtle rounded-xl pl-12 pr-4 py-3 text-xl font-heading font-bold text-text-main font-mono focus:outline-none focus:border-accent-blue"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] font-mono text-text-muted block mb-1.5">Atalhos rápidos:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[450000, 500000, 520000, 600000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetGlobal(val)}
                        className={`px-2.5 py-1 rounded-md font-mono text-xs border cursor-pointer transition-colors ${
                          formState.global === val
                            ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/40 font-semibold'
                            : 'bg-bg-surface text-text-muted border-border-subtle hover:bg-bg-elevated hover:text-text-main'
                        }`}
                      >
                        R$ {(val / 1000).toLocaleString('pt-BR')}k
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handlePresetAumento(10)}
                      className="px-2.5 py-1 rounded-md font-mono text-xs bg-status-green/10 text-status-green border border-status-green/30 hover:bg-status-green/20 cursor-pointer"
                    >
                      +10%
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetAumento(20)}
                      className="px-2.5 py-1 rounded-md font-mono text-xs bg-status-green/10 text-status-green border border-status-green/30 hover:bg-status-green/20 cursor-pointer"
                    >
                      +20%
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão de distribuição inteligente */}
              <div className="p-3.5 rounded-xl bg-accent-blue/5 border border-accent-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-main">
                    <Sparkles size={14} className="text-accent-blue" />
                    <span>Distribuir Meta Global entre as 4 Lojas</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Calcula a meta de cada loja proporcionalmente ao histórico (STAR 42%, DOCA 28%, CASA 19%, THERM 11%).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDistribuirProporcional}
                  className="px-3 py-1.5 bg-accent-blue hover:bg-accent-blue-hover text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Distribuir Agora
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">
                Defina o objetivo mensal de faturamento para cada conta individual:
              </p>

              {/* Grid das 4 Lojas */}
              <div className="space-y-2.5">
                {/* DOCA */}
                <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    <div>
                      <h4 className="text-xs font-bold text-text-main">DOCA Ferramentas</h4>
                      <span className="text-[10px] text-text-muted font-mono">Conta DOCA (28% share histórico)</span>
                    </div>
                  </div>
                  <div className="relative w-36 sm:w-44">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={formState.DOCA}
                      onChange={(e) => setFormState({ ...formState, DOCA: Number(e.target.value) || 0 })}
                      className="w-full bg-[#090D17] border border-border-subtle rounded-lg pl-9 pr-2.5 py-1.5 text-sm font-mono text-right font-bold text-text-main focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>

                {/* STAR */}
                <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                    <div>
                      <h4 className="text-xs font-bold text-text-main">STAR Tech & Eletrônicos</h4>
                      <span className="text-[10px] text-text-muted font-mono">Conta STAR (42% share histórico)</span>
                    </div>
                  </div>
                  <div className="relative w-36 sm:w-44">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={formState.STAR}
                      onChange={(e) => setFormState({ ...formState, STAR: Number(e.target.value) || 0 })}
                      className="w-full bg-[#090D17] border border-border-subtle rounded-lg pl-9 pr-2.5 py-1.5 text-sm font-mono text-right font-bold text-text-main focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>

                {/* CASA */}
                <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                    <div>
                      <h4 className="text-xs font-bold text-text-main">CASA Utilidades</h4>
                      <span className="text-[10px] text-text-muted font-mono">Conta CASA (19% share histórico)</span>
                    </div>
                  </div>
                  <div className="relative w-36 sm:w-44">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={formState.CASA}
                      onChange={(e) => setFormState({ ...formState, CASA: Number(e.target.value) || 0 })}
                      className="w-full bg-[#090D17] border border-border-subtle rounded-lg pl-9 pr-2.5 py-1.5 text-sm font-mono text-right font-bold text-text-main focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>

                {/* THERM */}
                <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></span>
                    <div>
                      <h4 className="text-xs font-bold text-text-main">THERM Medições</h4>
                      <span className="text-[10px] text-text-muted font-mono">Conta THERM (11% share histórico)</span>
                    </div>
                  </div>
                  <div className="relative w-36 sm:w-44">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={formState.THERM}
                      onChange={(e) => setFormState({ ...formState, THERM: Number(e.target.value) || 0 })}
                      className="w-full bg-[#090D17] border border-border-subtle rounded-lg pl-9 pr-2.5 py-1.5 text-sm font-mono text-right font-bold text-text-main focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sum vs Global Target Indicator */}
          <div className="p-3 rounded-xl bg-bg-base border border-border-subtle text-xs space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="text-text-muted">Soma das 4 Lojas:</span>
              <span className="font-bold text-text-main">
                R$ {somaLojas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-text-muted">Meta Global Definida:</span>
              <span className="font-bold text-accent-blue">
                R$ {formState.global.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between">
              {bateuExato ? (
                <div className="flex items-center gap-1.5 text-status-green font-medium text-[11px]">
                  <CheckCircle2 size={13} />
                  <span>Metas das lojas batem exatamente com a meta global (100%).</span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-amber-400 text-[11px] flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Diferença: R$ {Math.abs(diferenca).toLocaleString('pt-BR')}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleIgualarSoma}
                    className="text-accent-blue hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Igualar meta global à soma
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleResetPadrao}
              className="text-xs text-text-muted hover:text-text-main flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw size={12} />
              <span>Restaurar Padrão</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-bg-base hover:bg-bg-elevated border border-border-subtle rounded-xl text-text-muted text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Check size={14} />
                <span>Salvar Novas Metas</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
