// src/pages/Clientes.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  observacoes: string | null;
  dataCadastro: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setTelefone('');
    setObservacoes('');
    setEditando(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editando) {
        // Atualizar cliente existente
        await api.put(`/clientes/${editando.id}`, {
          nome,
          telefone,
          observacoes,
        });
      } else {
        // Criar novo cliente
        await api.post('/clientes', {
          nome,
          telefone,
          observacoes,
        });
      }

      limparFormulario();
      carregarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente');
    }
  };

  const handleEditar = (cliente: Cliente) => {
    setEditando(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setObservacoes(cliente.observacoes || '');
    setMostrarFormulario(true);
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      alert('Erro ao deletar cliente');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
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
          <h1 className="text-4xl font-bold text-rosa-600">Clientes</h1>
          <p className="text-gray-500 mt-1">
            {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} cadastrado{clientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            limparFormulario();
            setMostrarFormulario(true);
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          + Novo Cliente
        </button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-rosa-600 mb-4">
            {editando ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da cliente"
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Telefone (WhatsApp) *
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="11999999999"
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alguma observação sobre a cliente..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {editando ? 'Atualizar' : 'Cadastrar'}
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

      {/* Lista de Clientes */}
      {clientes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl">👥</span>
          <p className="text-gray-400 mt-4">
            Nenhuma cliente cadastrada ainda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-rosa-100 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(cliente)}
                    className="text-rosa-500 hover:text-rosa-700 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeletar(cliente.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Deletar"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-700 mb-1">
                {cliente.nome}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                📱 {cliente.telefone}
              </p>

              {cliente.observacoes && (
                <p className="text-xs text-gray-400 mb-2 italic">
                  {cliente.observacoes}
                </p>
              )}

              <p className="text-xs text-gray-400">
                Cadastrada em {formatarData(cliente.dataCadastro)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}