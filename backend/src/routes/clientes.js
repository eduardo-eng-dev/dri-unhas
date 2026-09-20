// src/routes/clientes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// CREATE - Cadastrar novo cliente
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { nome, telefone, observacoes } = req.body;

    // Validação básica
    if (!nome || !telefone) {
      return res.status(400).json({ 
        error: 'Nome e telefone são obrigatórios' 
      });
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        observacoes: observacoes || null,
      },
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// ==========================================
// READ - Listar todos os clientes
// ==========================================
router.get('/', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        dataCadastro: 'desc',
      },
    });

    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

// ==========================================
// READ - Buscar cliente por ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        agendamentos: true,
        historico: true,
      },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// ==========================================
// UPDATE - Atualizar cliente
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, observacoes } = req.body;

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nome,
        telefone,
        observacoes,
      },
    });

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// ==========================================
// DELETE - Deletar cliente
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Deletar em cascata: primeiro os dependentes, depois a cliente
    await prisma.agendamento.deleteMany({
      where: { clienteId: id },
    });

    await prisma.historico.deleteMany({
      where: { clienteId: id },
    });

    await prisma.cliente.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

export default router;