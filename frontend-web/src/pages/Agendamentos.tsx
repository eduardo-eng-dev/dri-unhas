// src/pages/Agendamentos.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

interface Servico {
  id: string;
  nome: string;
  preco: number;
}

interface Agendamento {
  id: string;
  clienteId: string;
  servicoId: string;
  dataAgendamento: string;
  horario: string;
  status: string;
  cliente: Cliente;
  servico: Servico;
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horario, setHorario] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [agendamentosRes, clientesRes, servicosRes] = await Promise.all([
        api.get('/agendamentos'),
        api.get('/clientes'),
        api.get('/servicos'),
      ]);
      setAgendamentos(agendamentosRes.data);
      setClientes(clientesRes.data);
      setServicos(servicosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const carregarHorariosDisponiveis = async (data: string) => {
    if (!data) return;
    try {
      const response = await api.get(`/agendamentos/disponiveis/${data}`);
      setHorariosDisponiveis(response.data.horariosDisponiveis);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
  };

  const handleDataChange = (data: string) => {
    // Verificar se a data selecionada é domingo (0 = domingo)
    const dataObj = new Date(data + 'T00:00:00');
    if (dataObj.getDay() === 0) {
      alert('⚠️ Não atendemos aos domingos. Por favor, escolha outra data.');
      setDataAgendamento('');
      setHorario('');
      setHorariosDisponiveis([]);
      return;
    }

    setDataAgendamento(data);
    setHorario('');
    carregarHorariosDisponiveis(data);
  };

  const limparFormulario = () => {
    setClienteId('');
    setServicoId('');
    setDataAgendamento('');
    setHorario('');
    setHorariosDisponiveis([]);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/agendamentos', {
        clienteId,
        servicoId,
        dataAgendamento,
        horario,
      });

      limparFormulario();
      carregarDados();
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      alert(error.response?.data?.error || 'Erro ao criar agendamento');
    }
  };

  const handleAtualizarStatus = async (id: string, novoStatus: string) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este agendamento?')) return;

    try {
      await api.delete(`/agendamentos/${id}`);
      carregarDados();
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-700';
      case 'concluido': return 'bg-green-100 text-green-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-rosa-600">Agendamentos</h1>
          <p className="text-gray-500 mt-1">
            {agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            limparFormulario();
            setMostrarFormulario(true);
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          + Novo Agendamento
        </button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-rosa-600 mb-4">
            Novo Agendamento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cliente *
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Selecione uma cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Serviço *
                </label>
                <select
                  value={servicoId}
                  onChange={(e) => setServicoId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco.toFixed(2)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data * <span className="text-xs text-gray-400">(não atendemos aos domingos)</span>
                </label>
                <input
                  type="date"
                  value={dataAgendamento}
                  onChange={(e) => handleDataChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Horário *
                </label>
                {dataAgendamento ? (
                  horariosDisponiveis.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {horariosDisponiveis.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHorario(h)}
                          className={`py-2 px-3 rounded-lg border-2 transition-colors text-sm ${
                            horario === h
                              ? 'bg-rosa-500 text-white border-rosa-500'
                              : 'bg-white text-gray-600 border-rosa-200 hover:border-rosa-400'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 py-3">
                      Nenhum horário disponível nesta data
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-400 py-3">
                    Selecione uma data primeiro
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cadastrar
              </button>
              <button
                type="button"
                onClick={limparFormulario}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Agendamentos */}
      {agendamentos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl">📅</span>
          <p className="text-gray-400 mt-4">
            Nenhum agendamento cadastrado ainda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rosa-100 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    {agendamento.cliente.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    {agendamento.servico.nome} • {formatarData(agendamento.dataAgendamento)} às {agendamento.horario}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agendamento.status)}`}>
                  {agendamento.status}
                </span>

                {agendamento.status === 'agendado' && (
                  <>
                    <button
                      onClick={() => handleAtualizarStatus(agendamento.id, 'concluido')}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Marcar como concluído"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => handleAtualizarStatus(agendamento.id, 'cancelado')}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Cancelar"
                    >
                      ⏸️
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDeletar(agendamento.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}