import { useState } from 'react';
import { 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Plus, 
  X, 
  Activity, 
  Server, 
  Check, 
  Terminal,
  Clock,
  Zap,
  Lock
} from 'lucide-react';
import { dashboardData } from '@/lib/mockData';

interface ConfiguracoesApiProps {
  onNavigate?: (view: string) => void;
}

export default function ConfiguracoesApi({ onNavigate }: ConfiguracoesApiProps) {
  const { kpis, contas: initialContas, webhook: initialWebhook, logs: initialLogs } = dashboardData.apiConfig;

  const [contas, setContas] = useState(initialContas);
  const [webhookTopics, setWebhookTopics] = useState(initialWebhook.topics);
  const [logs, setLogs] = useState(initialLogs);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Conectar Nova Conta
  const [modalNovaContaOpen, setModalNovaContaOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoUserId, setNovoUserId] = useState('');
  const [novoAppId, setNovoAppId] = useState('APP_USR_8492019482');
  const [novoSecret, setNovoSecret] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      showToast(`${fieldName} copiado para a área de transferência!`);
    } catch {
      showToast(`Não foi possível copiar automaticamente o ${fieldName}.`);
    }
  };

  const handleTestAll = () => {
    setIsTestingAll(true);
    setTimeout(() => {
      setIsTestingAll(false);
      showToast('Todas as 4 contas do Mercado Livre responderam com sucesso! Latência média: 39ms.');
    }, 1200);
  };

  const handleRefreshToken = (contaId: string) => {
    showToast(`Token OAuth da Conta ${contaId} renovado via refresh_token com sucesso!`);
    setContas(prev => prev.map(c => c.id === contaId ? { ...c, tokenExpiresIn: '6h 00m', lastSync: 'Agora mesmo' } : c));
  };

  const handleTestSingle = (contaId: string) => {
    showToast(`Ping na API Mercado Livre para Conta ${contaId}: 200 OK (36ms).`);
  };

  const handleToggleTopic = (topicId: string) => {
    setWebhookTopics(prev => prev.map(t => t.id === topicId ? { ...t, active: !t.active } : t));
    showToast('Preferências de tópico de Webhook atualizadas!');
  };

  const handleSimularWebhook = () => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      account: 'DOCA',
      method: 'POST',
      endpoint: '/webhooks/orders_v2 (Simulação de Venda)',
      status: 200,
      latency: '24ms'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 5)]);
    showToast('Webhook de teste disparado e recebido com sucesso (200 OK)!');
  };

  const handleCreateConta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const novaConta = {
      id: novoNome.toUpperCase().slice(0, 5),
      name: novoNome,
      userId: novoUserId || String(Math.floor(100000000 + Math.random() * 900000000)),
      appId: novoAppId,
      tokenExpiresIn: '6h 00m',
      status: 'Conectado',
      latency: '42ms',
      lastSync: 'Agora mesmo',
      webhooksActive: 5,
      scopes: ['read', 'write', 'offline_access'],
      autoRefresh: true,
    };

    setContas(prev => [...prev, novaConta]);
    setModalNovaContaOpen(false);
    setNovoNome('');
    setNovoUserId('');
    setNovoSecret('');
    showToast(`Conta ${novaConta.name} conectada com sucesso via OAuth 2.0!`);
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

      {/* Header */}
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
            <span className="text-accent-blue font-semibold">Configurações de API</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center gap-2">
            Gerenciamento de Integrações & Conexões API
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-2 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-lg text-xs font-medium text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              ← Voltar ao Dashboard
            </button>
          )}
          <button
            onClick={handleTestAll}
            disabled={isTestingAll}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-main rounded-lg px-3.5 py-2 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={13} className={`text-accent-blue ${isTestingAll ? 'animate-spin' : ''}`} />
            <span>{isTestingAll ? 'Testando Conexões...' : 'Testar Todas as Conexões'}</span>
          </button>

          <button
            onClick={() => setModalNovaContaOpen(true)}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Conectar Nova Conta ML</span>
          </button>
        </div>
      </div>

      {/* 4 Health & Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Geral */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">STATUS DO ECOSSISTEMA</span>
              <div className="p-1.5 rounded-md bg-status-green/10 text-status-green border border-status-green/20">
                <Radio size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold text-status-green tracking-tight">
                {kpis.statusGeral}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span className="font-mono text-text-main">{contas.length} contas conectadas</span>
            <span className="font-mono text-status-green">Ping: {kpis.latenciaMedia}</span>
          </div>
        </div>

        {/* Chamadas à API Hoje */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">RATE LIMIT (CHAMADAS HOJE)</span>
              <div className="p-1.5 rounded-md bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                <Zap size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold text-text-main tracking-tight font-mono">
                {kpis.requisicoesHoje.split(' ')[0]}
              </span>
              <span className="font-mono text-xs text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded border border-accent-blue/20">
                {kpis.requisicoesPerc}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span>Limite: 200k req/dia</span>
            <span className="font-mono text-text-muted">Reset em 11h</span>
          </div>
        </div>

        {/* Webhooks em Tempo Real */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">ENTREGA DE WEBHOOKS</span>
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Server size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold text-text-main tracking-tight font-mono">
                {kpis.webhooksSuccessRate}
              </span>
              <span className="font-mono text-xs text-status-green bg-status-green/10 px-1.5 py-0.5 rounded border border-status-green/20">
                0 falhas
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span>5 tópicos monitorados</span>
            <span className="font-mono text-text-main">Buffer: 0 pendente</span>
          </div>
        </div>

        {/* Renovação OAuth */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-3">
              <span className="uppercase tracking-wider">RENOVAÇÃO DE TOKENS</span>
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold text-text-main tracking-tight">
                Automática
              </span>
              <span className="font-mono text-xs text-status-green bg-status-green/10 px-1.5 py-0.5 rounded border border-status-green/20">
                Ativa
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs text-text-muted">
            <span>Refresh via cron</span>
            <span className="font-mono text-text-main">A cada 5 horas</span>
          </div>
        </div>
      </div>

      {/* Contas Conectadas */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-text-main flex items-center gap-2">
              <Key size={18} className="text-accent-blue" />
              <span>Contas Conectadas ao Mercado Livre ({contas.length})</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Credenciais OAuth 2.0 autenticadas e sincronização de catálogo
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
            <span>Sincronização em tempo real</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contas.map((conta) => (
            <div
              key={conta.id}
              className="bg-bg-base/70 border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-accent-blue/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text-main text-sm">{conta.name}</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-status-green/15 text-status-green border border-status-green/30">
                        {conta.status}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted font-mono mt-0.5">
                      Seller ID: {conta.userId} • App: {conta.appId}
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-surface border border-border-subtle text-accent-blue">
                    {conta.latency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-bg-surface/60 border border-border-subtle/50 text-xs font-mono">
                  <div>
                    <span className="text-text-muted block text-[11px]">Token Expira em:</span>
                    <span className="text-text-main font-semibold flex items-center gap-1 mt-0.5">
                      <Clock size={12} className="text-status-green" />
                      {conta.tokenExpiresIn}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Último Sincronismo:</span>
                    <span className="text-text-muted mt-0.5 block">{conta.lastSync}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                  <span>Permissões:</span>
                  {conta.scopes.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 rounded bg-bg-base border border-border-subtle">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-border-subtle text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestSingle(conta.id)}
                    className="text-accent-blue hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Testar Ping</span>
                  </button>
                  <span className="text-border-subtle">•</span>
                  <button
                    onClick={() => handleRefreshToken(conta.id)}
                    className="text-text-muted hover:text-text-main cursor-pointer"
                  >
                    Renovar Token
                  </button>
                </div>

                <button
                  onClick={() => showToast(`Configurações avançadas da conta ${conta.id} abertas.`)}
                  className="text-text-muted hover:text-white text-xs"
                >
                  Editar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks & Eventos em Tempo Real */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-text-main flex items-center gap-2">
              <Server size={18} className="text-purple-400" />
              <span>Configuração de Webhooks & Eventos Mercado Livre</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Recebimento de notificações push para atualização em tempo real de vendas e BuyBox
            </p>
          </div>

          <button
            onClick={handleSimularWebhook}
            className="bg-bg-base hover:bg-bg-elevated border border-border-subtle text-text-main text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Zap size={13} className="text-status-amber" />
            <span>Disparar Webhook de Teste</span>
          </button>
        </div>

        {/* Callback URL & Secret Key */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-bg-base/80 border border-border-subtle rounded-lg p-3.5">
            <label className="block text-xs font-medium text-text-muted mb-1.5 font-mono">
              URL DE CALLBACK NOTIFICAÇÃO (HTTPS)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={initialWebhook.callbackUrl}
                className="w-full bg-[#0A0E18] border border-border-subtle rounded-md px-3 py-1.5 text-xs text-text-main font-mono focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(initialWebhook.callbackUrl, 'URL de Callback')}
                className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle p-2 rounded-md text-text-muted hover:text-text-main cursor-pointer"
                title="Copiar URL"
              >
                {copiedField === 'URL de Callback' ? <Check size={14} className="text-status-green" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="bg-bg-base/80 border border-border-subtle rounded-lg p-3.5">
            <label className="block text-xs font-medium text-text-muted mb-1.5 font-mono">
              SECRET DE VALIDAÇÃO HMAC-SHA256
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={initialWebhook.secretKey}
                className="w-full bg-[#0A0E18] border border-border-subtle rounded-md px-3 py-1.5 text-xs text-text-main font-mono focus:outline-none"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle p-2 rounded-md text-text-muted hover:text-text-main cursor-pointer"
                title={showSecret ? 'Ocultar' : 'Exibir'}
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => copyToClipboard(initialWebhook.secretKey, 'Secret de Validação')}
                className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle p-2 rounded-md text-text-muted hover:text-text-main cursor-pointer"
                title="Copiar Secret"
              >
                {copiedField === 'Secret de Validação' ? <Check size={14} className="text-status-green" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Tópicos de Webhook Inscritos */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-text-main uppercase tracking-wider font-mono">
            Tópicos Oficiais Inscritos
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {webhookTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-lg bg-bg-base/60 border border-border-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-accent-blue">{topic.name}</span>
                    <button
                      onClick={() => handleToggleTopic(topic.id)}
                      className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        topic.active ? 'bg-status-green' : 'bg-border-subtle'
                      }`}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                          topic.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{topic.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-border-subtle/60 text-[11px] font-mono text-text-muted">
                  Volume: <strong className="text-text-main">{topic.eventsPerDay}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log de Auditoria da API */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border-subtle bg-[#0F1524] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-accent-blue" />
            <h3 className="font-heading font-bold text-base text-text-main">
              Log de Auditoria de Requisições Recentes
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">Streaming ativo (últimos 6 eventos)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B101D] text-text-muted uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">HORÁRIO</th>
                <th className="py-3 px-4">CONTA</th>
                <th className="py-3 px-4">MÉTODO</th>
                <th className="py-3 px-4">ENDPOINT ML</th>
                <th className="py-3 px-4 text-center">STATUS HTTP</th>
                <th className="py-3 px-4 text-right">LATÊNCIA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/80">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-elevated/40 transition-colors">
                  <td className="py-3 px-4 text-text-muted">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="px-1.5 py-0.5 rounded bg-bg-base border border-border-subtle text-text-main font-semibold">
                      {log.account}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      log.method === 'GET' ? 'text-accent-blue bg-accent-blue/10' : 'text-purple-400 bg-purple-500/10'
                    }`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-main">{log.endpoint}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-status-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-green"></span>
                      <span>{log.status} OK</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-text-muted">{log.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Conectar Nova Conta ML */}
      {modalNovaContaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 fade-in">
          <div className="bg-bg-surface border border-border-subtle rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-main">Conectar Nova Conta Mercado Livre</h3>
                  <p className="text-xs text-text-muted">Autenticação oficial via OAuth 2.0</p>
                </div>
              </div>
              <button 
                onClick={() => setModalNovaContaOpen(false)}
                className="text-text-muted hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateConta} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Nome da Loja / Identificador Interno
                </label>
                <input
                  type="text"
                  placeholder="Ex: NOVA LOJA B2B"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    MLB User ID (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 582910492"
                    value={novoUserId}
                    onChange={(e) => setNovoUserId(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    App ID (Client ID)
                  </label>
                  <input
                    type="text"
                    value={novoAppId}
                    onChange={(e) => setNovoAppId(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Client Secret (Dev Center ML)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={novoSecret}
                  onChange={(e) => setNovoSecret(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-accent-blue text-xs font-mono"
                />
              </div>

              <div className="p-3 bg-bg-base rounded-lg border border-border-subtle text-xs text-text-muted space-y-1">
                <div className="flex items-center gap-1.5 text-text-main font-medium">
                  <ShieldCheck size={14} className="text-status-green" />
                  <span>Fluxo Seguro de Autorização OAuth 2.0</span>
                </div>
                <p className="text-[11px]">
                  Ao confirmar, você será conectado ao ambiente oficial do Mercado Livre para consentir o acesso de leitura e escrita de pedidos, estoque e reputação.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setModalNovaContaOpen(false)}
                  className="px-4 py-2 bg-bg-base hover:bg-bg-elevated border border-border-subtle rounded-lg text-text-muted text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Autorizar via Mercado Livre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
