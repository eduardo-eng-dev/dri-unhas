// src/routes/historico.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// CREATE - Registrar atendimento no histórico
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { clienteId, servicoId, observacoes } = req.body;

    if (!clienteId || !servicoId) {
      return res.status(400).json({ 
        error: 'Cliente e serviço são obrigatórios' 
      });
    }

    const historico = await prisma.historico.create({
      data: {
        clienteId,
        servicoId,
        observacoes: observacoes || null,
      },
      include: {
        cliente: true,
        servico: true,
      },
    });

    res.status(201).json(historico);
  } catch (error) {
    console.error('Erro ao criar histórico:', error);
    res.status(500).json({ error: 'Erro ao criar histórico' });
  }
});

// ==========================================
// READ - Listar todo o histórico
// ==========================================
router.get('/', async (req, res) => {
  try {
    const historico = await prisma.historico.findMany({
      include: {
        cliente: true,
        servico: true,
      },
      orderBy: {
        dataAtendimento: 'desc',
      },
    });

    res.json(historico);
  } catch (error) {
    console.error('Erro ao listar histórico:', error);
    res.status(500).json({ error: 'Erro ao listar histórico' });
  }
});

// ==========================================
// READ - Buscar histórico por cliente
// ==========================================
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;

    const historico = await prisma.historico.findMany({
      where: { clienteId },
      include: {
        servico: true,
      },
      orderBy: {
        dataAtendimento: 'desc',
      },
    });

    res.json(historico);
  } catch (error) {
    console.error('Erro ao buscar histórico do cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico do cliente' });
  }
});

// ==========================================
// DELETE - Deletar registro do histórico
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.historico.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar histórico:', error);
    res.status(500).json({ error: 'Erro ao deletar histórico' });
  }
});

export default router;