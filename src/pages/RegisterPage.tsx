import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Network, Mail, Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils/cn';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Se não houver confirmação de email ativa, o Supabase já loga o usuário automaticamente.
      // O AuthContext vai capturar o evento de login.
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">Conta Criada!</h2>
          <p className="text-zinc-400 mb-8">
            Seu cadastro no Atlas Farmaco foi realizado com sucesso. 
            Verifique seu e-mail caso seja necessário confirmar a conta, ou continue para o dashboard.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl py-3 transition-all"
          >
            Acessar o Atlas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-400/20">
            <Network className="w-7 h-7 text-zinc-900" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Criar Conta</h2>
          <p className="text-zinc-500 text-sm mt-1">Junte-se ao Atlas Farmaco</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
              E-mail Profissional
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                placeholder="dr.nome@exemplo.com"
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
                minLength={6}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-12 text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                placeholder="Mínimo 6 caracteres"
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

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-12 text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                placeholder="Repita a senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl py-3 mt-6 transition-all flex items-center justify-center gap-2",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Criar minha conta'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Já possui uma conta?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
};
