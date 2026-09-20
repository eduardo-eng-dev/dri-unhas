// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import driUnhasImg from '../assets/dri-unhas.jpeg';
import driPerfil from '../assets/dri-perfil.png';

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${driUnhasImg})` }}
      />
      
      {/* Overlay rosa translúcido */}
      <div className="absolute inset-0 bg-rosa-500/70" />

      {/* Conteúdo */}
      <div className="relative text-center max-w-2xl w-full">
        
        {/* Logo */}
        <div className="mb-12">
          <span className="text-7xl">💅</span>
          <h1 className="text-6xl font-bold text-white mt-4 drop-shadow-lg">
            Dri Unhas
          </h1>
          <p className="text-white/90 text-xl mt-2 drop-shadow">
            Sistema de Agendamento
          </p>
        </div>

        {/* Cards de Opção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: Admin */}
          <Link
            to="/login"
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform"
          >
          <img
            src={driPerfil}
            alt="Dri"
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-rosa-200 shadow-md"
          />
            <h2 className="text-2xl font-bold text-rosa-600 mt-4">
              Sou a Dri
            </h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              Gerenciar clientes, serviços e agendamentos
            </p>
            <div className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors inline-block shadow-md">
              Entrar
            </div>
          </Link>

          {/* Card: Cliente */}
          <Link
            to="/agendar"
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform"
          >
            <span className="text-7xl inline-block">💁‍♀️</span>
            <h2 className="text-2xl font-bold text-rosa-600 mt-4">
              Quero Agendar
            </h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              Escolha o serviço, data e horário
            </p>
            <div className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors inline-block">
              Agendar
            </div>
          </Link>

        </div>

        {/* Rodapé */}
        <p className="text-white/70 text-sm mt-12">
          💅 Cuidando da sua beleza com carinho
        </p>

      </div>
    </div>
  );
}