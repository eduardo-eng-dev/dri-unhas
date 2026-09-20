// src/routes/servicos.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// CREATE - Cadastrar novo serviço
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { nome, preco, periodoRetornoDias } = req.body;

    if (!nome || !preco || !periodoRetornoDias) {
      return res.status(400).json({ 
        error: 'Nome, preço e período de retorno são obrigatórios' 
      });
    }

    const servico = await prisma.servico.create({
      data: {
        nome,
        preco: parseFloat(preco),
        periodoRetornoDias: parseInt(periodoRetornoDias),
      },
    });

    res.status(201).json(servico);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
});

// ==========================================
// READ - Listar todos os serviços
// ==========================================
router.get('/', async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: {
        nome: 'asc',
      },
    });

    res.json(servicos);
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res.status(500).json({ error: 'Erro ao listar serviços' });
  }
});

// ==========================================
// READ - Buscar serviço por ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const servico = await prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.json(servico);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
});

// ==========================================
// UPDATE - Atualizar serviço
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, periodoRetornoDias } = req.body;

    const servico = await prisma.servico.update({
      where: { id },
      data: {
        nome,
        preco: parseFloat(preco),
        periodoRetornoDias: parseInt(periodoRetornoDias),
      },
    });

    res.json(servico);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

// ==========================================
// DELETE - Deletar serviço
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Deletar em cascata: primeiro os dependentes, depois o serviço
    await prisma.agendamento.deleteMany({
      where: { servicoId: id },
    });

    await prisma.historico.deleteMany({
      where: { servicoId: id },
    });

    await prisma.servico.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
});

export default router;