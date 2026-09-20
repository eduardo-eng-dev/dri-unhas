// src/pages/Servicos.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';

interface Servico {
  id: string;
  nome: string;
  preco: number;
  periodoRetornoDias: number;
}

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Servico | null>(null);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [periodoRetornoDias, setPeriodoRetornoDias] = useState('15');

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await api.get('/servicos');
      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPreco('');
    setPeriodoRetornoDias('15');
    setEditando(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dados = {
        nome,
        preco: parseFloat(preco),
        periodoRetornoDias: parseInt(periodoRetornoDias),
      };

      if (editando) {
        await api.put(`/servicos/${editando.id}`, dados);
      } else {
        await api.post('/servicos', dados);
      }

      limparFormulario();
      carregarServicos();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço');
    }
  };

  const handleEditar = (servico: Servico) => {
    setEditando(servico);
    setNome(servico.nome);
    setPreco(servico.preco.toString());
    setPeriodoRetornoDias(servico.periodoRetornoDias.toString());
    setMostrarFormulario(true);
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;

    try {
      await api.delete(`/servicos/${id}`);
      carregarServicos();
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      alert('Erro ao deletar serviço');
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
          <h1 className="text-4xl font-bold text-rosa-600">Serviços</h1>
          <p className="text-gray-500 mt-1">
            {servicos.length} serviço{servicos.length !== 1 ? 's' : ''} cadastrado{servicos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            limparFormulario();
            setMostrarFormulario(true);
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          + Novo Serviço
        </button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-rosa-600 mb-4">
            {editando ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome do Serviço *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Unhas, Cabelos, Unhas + Cabelos"
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="80.00"
                  className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Retorno (dias) *
                </label>
                <input
                  type="number"
                  value={periodoRetornoDias}
                  onChange={(e) => setPeriodoRetornoDias(e.target.value)}
                  placeholder="15"
                  className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                  required
                />
              </div>
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

      {/* Lista de Serviços */}
      {servicos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl">💅</span>
          <p className="text-gray-400 mt-4">
            Nenhum serviço cadastrado ainda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-rosa-100 flex items-center justify-center">
                  <span className="text-2xl">💅</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(servico)}
                    className="text-rosa-500 hover:text-rosa-700 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeletar(servico.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Deletar"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {servico.nome}
              </h3>

              <p className="text-2xl font-bold text-rosa-600 mb-2">
                R$ {servico.preco.toFixed(2)}
              </p>

              <p className="text-xs text-gray-400">
                🔄 Retorno a cada {servico.periodoRetornoDias} dias
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}