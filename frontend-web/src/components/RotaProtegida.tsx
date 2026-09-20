// src/components/RotaProtegida.tsx
import { Navigate, Outlet } from 'react-router-dom';

export default function RotaProtegida() {
  const logado = localStorage.getItem('dri-unhas-logado') === 'true';

  if (!logado) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}