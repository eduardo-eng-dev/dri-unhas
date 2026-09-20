// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

interface Agendamento {
  id: string;
  dataAgendamento: string;
  horario: string;
  status: string;
  cliente: Cliente;
}

interface Notificacao {
  cliente: Cliente;
  ultimoServico: string;
  dataUltimoAtendimento: string;
  linkWhatsApp: string;
}

export default function Dashboard() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [agendamentosHoje, setAgendamentosHoje] = useState<Agendamento[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Buscar total de clientes
      const clientesRes = await api.get('/clientes');
      setTotalClientes(clientesRes.data.length);

      // Buscar agendamentos
      const agendamentosRes = await api.get('/agendamentos');
      const hoje = new Date().toISOString().split('T')[0];
      const agendamentosDeHoje = agendamentosRes.data.filter(
        (a: Agendamento) => a.dataAgendamento.split('T')[0] === hoje
      );
      setAgendamentosHoje(agendamentosDeHoje);

      // Buscar notificações (clientes para retorno)
      const notificacoesRes = await api.get('/notificacoes');
      setNotificacoes(notificacoesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-rosa-500 text-lg">Carregando... 💅</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-rosa-600">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card: Total de Clientes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-rosa-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Clientes</p>
              <p className="text-4xl font-bold text-rosa-600 mt-2">
                {totalClientes}
              </p>
            </div>
            <span className="text-5xl">👥</span>
          </div>
        </div>

        {/* Card: Agendamentos Hoje */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-rosa-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Agendamentos Hoje</p>
              <p className="text-4xl font-bold text-rosa-500 mt-2">
                {agendamentosHoje.length}
              </p>
            </div>
            <span className="text-5xl">📅</span>
          </div>
        </div>

        {/* Card: Retornos Pendentes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-rosa-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Retornos Pendentes</p>
              <p className="text-4xl font-bold text-rosa-400 mt-2">
                {notificacoes.length}
              </p>
            </div>
            <span className="text-5xl">🔔</span>
          </div>
        </div>

      </div>

      {/* Agendamentos de Hoje */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-rosa-600 mb-4">
          📅 Agendamentos de Hoje
        </h2>
        
        {agendamentosHoje.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Nenhum agendamento para hoje
          </p>
        ) : (
          <div className="space-y-3">
            {agendamentosHoje.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-4 bg-rosa-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">💅</span>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {agendamento.cliente.nome}
                    </p>
                    <p className="text-sm text-gray-500">
                      {agendamento.horario}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-rosa-500 text-white text-xs rounded-full">
                  {agendamento.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clientes para Retorno */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-rosa-600 mb-4">
          🔔 Clientes para Retorno
        </h2>

        {notificacoes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Nenhum cliente para retorno no momento
          </p>
        ) : (
          <div className="space-y-3">
            {notificacoes.map((notif, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-rosa-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    {notif.cliente.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    Último serviço: {notif.ultimoServico}
                  </p>
                </div>
                <a
                  href={notif.linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                >
                  📱 Enviar WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}