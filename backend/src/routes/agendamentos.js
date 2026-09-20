// src/routes/agendamentos.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// CREATE - Criar novo agendamento
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { clienteId, servicoId, dataAgendamento, horario } = req.body;

    if (!clienteId || !servicoId || !dataAgendamento || !horario) {
      return res.status(400).json({ 
        error: 'Cliente, serviço, data e horário são obrigatórios' 
      });
    }

    // CORREÇÃO 1: Criar a data no fuso horário local (Brasil, UTC-3)
    // Adiciona T12:00:00 para evitar problemas de fuso horário
    const dataAgendamentoLocal = new Date(`${dataAgendamento}T12:00:00`);

    // CORREÇÃO 2: Validar se a data/hora já passou
    const [hora, minuto] = horario.split(':').map(Number);
    const dataHoraAgendamento = new Date(dataAgendamentoLocal);
    dataHoraAgendamento.setHours(hora, minuto, 0, 0);

    const agora = new Date();
    if (dataHoraAgendamento <= agora) {
      return res.status(400).json({ 
        error: 'Não é possível agendar em data/horário no passado' 
      });
    }

    // Verificar se o horário já está ocupado
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        dataAgendamento: dataAgendamentoLocal,
        horario: horario,
        status: {
          not: 'cancelado',
        },
      },
    });

    if (agendamentoExistente) {
      return res.status(409).json({ 
        error: 'Este horário já está ocupado' 
      });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId,
        servicoId,
        dataAgendamento: dataAgendamentoLocal,
        horario,
        status: 'agendado',
      },
      include: {
        cliente: true,
        servico: true,
      },
    });

    res.status(201).json(agendamento);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// ==========================================
// READ - Listar todos os agendamentos
// ==========================================
router.get('/', async (req, res) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: true,
        servico: true,
      },
      orderBy: {
        dataAgendamento: 'asc',
      },
    });

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

// ==========================================
// READ - Buscar agendamento por ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: {
        cliente: true,
        servico: true,
      },
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json(agendamento);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
});

// ==========================================
// READ - Listar horários disponíveis em uma data
// ==========================================
router.get('/disponiveis/:data', async (req, res) => {
  try {
    const { data } = req.params;

    // Horários de funcionamento:
    // Manhã: 08:00, 10:00
    // Pausa: 12:00 às 13:00
    // Tarde: 13:00, 15:00, 17:00, 19:00
    const horariosFuncionamento = [
      '08:00',
      '13:00', '15:00', '17:00'
    ];

    const dataLocal = new Date(`${data}T12:00:00`);
    const agendamentosOcupados = await prisma.agendamento.findMany({
      where: {
        dataAgendamento: dataLocal,
        status: {
          not: 'cancelado',
        },
      },
      select: {
        horario: true,
      },
    });

    const horariosOcupados = agendamentosOcupados.map(a => a.horario);

    // Filtrar horários disponíveis (não ocupados)
let horariosDisponiveis = horariosFuncionamento.filter(
  h => !horariosOcupados.includes(h)
);

// Se a data for HOJE, remover horários que já passaram
const hoje = new Date();
const dataSelecionada = new Date(`${data}T12:00:00`);
const isHoje = 
  dataSelecionada.getDate() === hoje.getDate() &&
  dataSelecionada.getMonth() === hoje.getMonth() &&
  dataSelecionada.getFullYear() === hoje.getFullYear();

if (isHoje) {
  const horaAtual = hoje.getHours();
  const minutoAtual = hoje.getMinutes();
  
  horariosDisponiveis = horariosDisponiveis.filter(h => {
    const [hora, minuto] = h.split(':').map(Number);
    // Mantém apenas horários que ainda não passaram
    return hora > horaAtual || (hora === horaAtual && minuto > minutoAtual);
  });
}

res.json({
  data,
  horariosDisponiveis,
  horariosOcupados,
});
  } catch (error) {
    console.error('Erro ao listar horários disponíveis:', error);
    res.status(500).json({ error: 'Erro ao listar horários disponíveis' });
  }
});

// ==========================================
// UPDATE - Atualizar agendamento
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { dataAgendamento, horario, status } = req.body;

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: {
        dataAgendamento: dataAgendamento ? new Date(dataAgendamento) : undefined,
        horario,
        status,
      },
      include: {
        cliente: true,
        servico: true,
      },
    });

    res.json(agendamento);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

// ==========================================
// DELETE - Deletar agendamento
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.agendamento.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
});

// ==========================================
// CREATE - Agendamento público (sem autenticação)
// ==========================================
router.post('/publico', async (req, res) => {
  try {
    const { nome, telefone, servicoId, dataAgendamento, horario } = req.body;

    // Validação básica
    if (!nome || !telefone || !servicoId || !dataAgendamento || !horario) {
      return res.status(400).json({ 
        error: 'Nome, telefone, serviço, data e horário são obrigatórios' 
      });
    }

    // Validar se a data/hora já passou
    const dataAgendamentoLocal = new Date(`${dataAgendamento}T12:00:00`);
    const [hora, minuto] = horario.split(':').map(Number);
    const dataHoraAgendamento = new Date(dataAgendamentoLocal);
    dataHoraAgendamento.setHours(hora, minuto, 0, 0);

    const agora = new Date();
    if (dataHoraAgendamento <= agora) {
      return res.status(400).json({ 
        error: 'Não é possível agendar em data/horário no passado' 
      });
    }

    // Verificar se o horário já está ocupado
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        dataAgendamento: dataAgendamentoLocal,
        horario: horario,
        status: {
          not: 'cancelado',
        },
      },
    });

    if (agendamentoExistente) {
      return res.status(409).json({ 
        error: 'Este horário já está ocupado' 
      });
    }

    // Verificar se a cliente já existe (pelo telefone)
    let cliente = await prisma.cliente.findFirst({
      where: { telefone },
    });

    // Se não existir, criar automaticamente
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome,
          telefone,
          observacoes: 'Cadastrada automaticamente via agendamento público',
        },
      });
    }

    // Criar o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId: cliente.id,
        servicoId,
        dataAgendamento: dataAgendamentoLocal,
        horario,
        status: 'agendado',
      },
      include: {
        cliente: true,
        servico: true,
      },
    });

    res.status(201).json({
      message: 'Agendamento realizado com sucesso!',
      agendamento,
    });
  } catch (error) {
    console.error('Erro ao criar agendamento público:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

export default router;