'use client';
import { useState } from 'react';
import { Activity } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('melimetrics_auth', 'true');
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-accent-blue mb-4">
          <Activity size={48} />
        </div>
        <h2 className="text-center text-3xl font-heading font-bold text-text-main">
          MeliMetrics <span className="text-xs bg-accent-blue text-white px-2 py-1 rounded ml-1 align-middle">PRO</span>
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Inteligência de Vendas e Analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border-subtle">
          <div className="mb-6 bg-status-amber/10 border-l-4 border-status-amber p-4 rounded-r">
            <p className="text-sm text-status-amber">
              <strong>Modo Local:</strong> O banco de dados em nuvem foi recusado. O acesso é simulado e os dados são voláteis. Digite qualquer e-mail e senha para entrar.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-main">
                Email / Usuário
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border-subtle rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-accent-blue focus:border-accent-blue bg-bg-base text-text-main sm:text-sm"
                  placeholder="admin@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main">
                Senha
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border-subtle rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-accent-blue focus:border-accent-blue bg-bg-base text-text-main sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue"
              >
                Acessar Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
