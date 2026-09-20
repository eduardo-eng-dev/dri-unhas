// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Menu from './Menu';

export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex min-h-screen bg-rosa-50">
      <Menu aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile com botão hambúrguer */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMenuAberto(true)}
            className="text-2xl text-rosa-600"
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-rosa-600">Dri Unhas</h1>
          <div className="w-8" /> {/* Espaçador para centralizar */}
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}