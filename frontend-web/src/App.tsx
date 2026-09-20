// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RotaProtegida from './components/RotaProtegida';
import Home from './pages/Home';
import Login from './pages/Login';
import AgendamentoPublico from './pages/AgendamentoPublico';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Agendamentos from './pages/Agendamentos';
import Historico from './pages/Historico';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendar" element={<AgendamentoPublico />} />

        {/* Rotas privadas (exigem login) */}
        <Route element={<RotaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/historico" element={<Historico />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;