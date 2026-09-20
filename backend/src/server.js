// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientesRoutes from './routes/clientes.js';
import servicosRoutes from './routes/servicos.js';
import agendamentosRoutes from './routes/agendamentos.js';
import historicoRoutes from './routes/historico.js';
import { listarNotificacoes } from './services/disparoWhatsApp.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'Servidor Dri Unhas está rodando! 💅' });
});

app.use('/api/clientes', clientesRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/historico', historicoRoutes);
app.get('/api/notificacoes', listarNotificacoes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/ping`);
  console.log(`📍 http://localhost:${PORT}/api/clientes`);
  console.log(`📍 http://localhost:${PORT}/api/servicos`);
  console.log(`📍 http://localhost:${PORT}/api/agendamentos`);
  console.log(`📍 http://localhost:${PORT}/api/historico`);
  console.log(`📍 http://localhost:${PORT}/api/notificacoes`);
});