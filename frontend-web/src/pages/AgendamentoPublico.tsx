// src/pages/AgendamentoPublico.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import driPerfil from '../assets/dri-perfil.png';

interface Servico {
  id: string;
  nome: string;
  preco: number;
}

export default function AgendamentoPublico() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horario, setHorario] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await api.post('/agendamentos/publico', {
        nome,
        telefone,
        servicoId,
        dataAgendamento,
        horario,
      });

      setSucesso(true);
    } catch (error: any) {
      console.error('Erro ao agendar:', error);
      alert(error.response?.data?.error || 'Erro ao agendar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setTelefone('');
    setServicoId('');
    setDataAgendamento('');
    setHorario('');
    setHorariosDisponiveis([]);
    setSucesso(false);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-rosa-50 flex items-center justify-center">
        <p className="text-rosa-500 text-lg">Carregando... 💅</p>
      </div>
    );
  }

  // Tela de sucesso
  if (sucesso) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${driPerfil})` }}
        />
        <div className="absolute inset-0 bg-rosa-500/80" />

        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <span className="text-7xl">✅</span>
          <h1 className="text-3xl font-bold text-rosa-600 mt-4">
            Agendamento Confirmado!
          </h1>
          <p className="text-gray-500 mt-4">
            Olá <strong>{nome}</strong>! Seu agendamento foi realizado com sucesso.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Em breve você receberá uma confirmação pelo WhatsApp.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={limparFormulario}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Fazer novo agendamento
            </button>
            <Link
              to="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${driPerfil})` }}
      />
      <div className="absolute inset-0 bg-rosa-500/80" />

      {/* Card de Agendamento */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <img
            src={driPerfil}
            alt="Dri Unhas"
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-rosa-200 shadow-md"
          />
          <h1 className="text-3xl font-bold text-rosa-600">
            Agende seu Horário
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Dri Unhas 💅
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Seu Nome *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como podemos te chamar?"
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                WhatsApp *
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="11999999999"
                className="w-full px-4 py-3 rounded-lg border-2 border-rosa-200 focus:border-rosa-500 focus:outline-none transition-colors"
                required
              />
            </div>
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
              <option value="">Escolha um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} - R$ {s.preco.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Data *
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
                        className={`py-2 px-2 rounded-lg border-2 transition-colors text-sm ${
                          horario === h
                            ? 'bg-rosa-600 text-white border-rosa-600'
                            : 'bg-white text-gray-600 border-rosa-200 hover:border-rosa-400'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-3">
                    Nenhum horário disponível
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-400 py-3">
                  Escolha uma data primeiro
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={enviando || !horario}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
            <Link
              to="/"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Voltar
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}