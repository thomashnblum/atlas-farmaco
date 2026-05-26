import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Network, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils/cn';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname;
  const isRestrictedAccess = !!from && from !== '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      setLoading(false);
      // Login bem-sucedido, AuthContext vai reagir e nós redirecionamos
      navigate('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-400/20">
            {isRestrictedAccess ? <Lock className="w-6 h-6 text-zinc-900" /> : <Network className="w-7 h-7 text-zinc-900" />}
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight text-center">
            {isRestrictedAccess ? "Acesso Restrito" : "Bem-vindo de volta"}
          </h2>
          <p className="text-zinc-500 text-sm mt-1 text-center">
            {isRestrictedAccess 
              ? "Esta área é exclusiva para assinantes do Atlas Farmaco Premium." 
              : "Acesse sua conta do Atlas Farmaco"}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-12 text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl py-3 mt-4 transition-all flex items-center justify-center gap-2",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
};
