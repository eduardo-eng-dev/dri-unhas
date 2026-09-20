// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import driUnhasImg from '../assets/dri-unhas.jpeg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'dri@driunhas.com' && senha === 'driunhas2026') {
      localStorage.setItem('dri-unhas-logado', 'true');
      navigate('/dashboard');
    } else {
      setErro('E-mail ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${driUnhasImg})` }}
      />
      
      {/* Overlay rosa translúcido */}
      <div className="absolute inset-0 bg-rosa-500/60" />

      {/* Card de Login */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-6xl">💅</span>
          <h1 className="text-4xl font-bold text-rosa-600 mt-4">
            Dri Unhas
          </h1>
          <p className="text-rosa-400 text-sm mt-1">
            Sistema de Agendamento
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}