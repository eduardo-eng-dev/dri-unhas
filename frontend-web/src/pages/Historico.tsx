// src/pages/Historico.tsx
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

interface Historico {
  id: string;
  clienteId: string;
  servicoId: string;
  dataAtendimento: string;
  observacoes: string | null;
  cliente: Cliente;
  servico: Servico;
}

export default function Historico() {
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroCliente, setFiltroCliente] = useState('');

  // Campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [historicosRes, clientesRes, servicosRes] = await Promise.all([
        api.get('/historico'),
        api.get('/clientes'),
        api.get('/servicos'),
      ]);
      setHistoricos(historicosRes.data);
      setClientes(clientesRes.data);
      setServicos(servicosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setClienteId('');
    setServicoId('');
    setObservacoes('');
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/historico', {
        clienteId,
        servicoId,
        observacoes,
      });

      limparFormulario();
      carregarDados();
    } catch (error) {
      console.error('Erro ao registrar atendimento:', error);
      alert('Erro ao registrar atendimento');
    }
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este registro do histórico?')) return;

    try {
      await api.delete(`/historico/${id}`);
      carregarDados();
    } catch (error) {
      console.error('Erro ao deletar histórico:', error);
    }
  };
  
  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  // Filtrar histórico por cliente
  const historicosFiltrados = filtroCliente
    ? historicos.filter(h => h.clienteId === filtroCliente)
    : historicos;

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
          <h1 className="text-4xl font-bold text-rosa-600">Histórico</h1>
          <p className="text-gray-500 mt-1">
            {historicos.length} atendimento{historicos.length !== 1 ? 's' : ''} registrado{historicos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            limparFormulario();
            setMostrarFormulario(true);
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          + Registrar Atendimento
        </button>
      </div>

      {/* Filtro por Cliente */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          🔍 Filtrar por cliente
        </label>
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
        >
          <option value="">Todas as clientes</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-rosa-600 mb-4">
            Registrar Atendimento
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

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alguma observação sobre o atendimento..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Registrar
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

      {/* Lista de Histórico */}
      {historicosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl">📋</span>
          <p className="text-gray-400 mt-4">
            {filtroCliente
              ? 'Nenhum atendimento encontrado para esta cliente'
              : 'Nenhum atendimento registrado ainda'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historicosFiltrados.map((historico) => (
            <div
              key={historico.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rosa-100 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    {historico.cliente.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    {historico.servico.nome} • {formatarDataHora(historico.dataAtendimento)}
                  </p>
                  {historico.observacoes && (
                    <p className="text-xs text-gray-400 italic mt-1">
                      💬 {historico.observacoes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-rosa-100 text-rosa-700 rounded-full text-xs font-semibold">
                  R$ {historico.servico.preco.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDeletar(historico.id)}
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