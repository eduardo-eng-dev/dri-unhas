// src/components/Menu.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import driPerfil from '../assets/dri-perfil.png';

interface MenuProps {
  aberto: boolean;
  onFechar: () => void;
}

export default function Menu({ aberto, onFechar }: MenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/servicos', label: 'Serviços', icon: '💅' },
    { path: '/agendamentos', label: 'Agendamentos', icon: '📅' },
    { path: '/historico', label: 'Histórico', icon: '📋' },
  ];

  const handleSair = () => {
    localStorage.removeItem('dri-unhas-logado');
    navigate('/');
  };

  const handleLinkClick = () => {
    onFechar(); // Fecha o menu ao clicar em um link (mobile)
  };

  return (
    <>
      {/* Overlay escuro no mobile quando o menu está aberto */}
      {aberto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onFechar}
        />
      )}

      {/* Menu */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 min-h-screen bg-white shadow-lg p-6 flex flex-col
          transform transition-transform duration-300
          ${aberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Botão de fechar (mobile) */}
        <button
          onClick={onFechar}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border-4 border-rosa-200 shadow-md">
            <img
              src={driPerfil}
              alt="Dri Unhas"
              className="w-full h-full object-cover scale-150"
            />
          </div>
          <h1 className="text-xl font-bold text-rosa-600">Dri Unhas</h1>
          <p className="text-xs text-gray-400">Sistema de Agendamento</p>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-rosa-500 text-white'
                  : 'text-gray-600 hover:bg-rosa-100 hover:text-rosa-600'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSair}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors mt-4"
        >
          <span>🚪</span>
          <span>Sair</span>
        </button>
      </aside>
    </>
  );
}