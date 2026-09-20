// src/services/disparoWhatsApp.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
 */
function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

/**
 * Gera o link do WhatsApp com a mensagem personalizada
 */
function gerarLinkWhatsApp(telefone, mensagem) {
  // Remove caracteres não numéricos do telefone
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  // Codifica a mensagem para URL
  const mensagemCodificada = encodeURIComponent(mensagem);
  
  return `https://wa.me/55${telefoneLimpo}?text=${mensagemCodificada}`;
}

/**
 * Verifica quais clientes precisam ser notificados hoje
 * (baseado no período de retorno do último serviço)
 */
export async function verificarClientesParaRetorno() {
  try {
    // Buscar todos os históricos, ordenados por data (mais recente primeiro)
    const historicos = await prisma.historico.findMany({
      include: {
        cliente: true,
        servico: true,
      },
      orderBy: {
        dataAtendimento: 'desc',
      },
    });

    // Agrupar por cliente (pegar apenas o último atendimento de cada)
    const ultimosAtendimentos = new Map();
    
    for (const h of historicos) {
      if (!ultimosAtendimentos.has(h.clienteId)) {
        ultimosAtendimentos.set(h.clienteId, h);
      }
    }

    const hoje = new Date();
    const clientesParaNotificar = [];

    for (const [clienteId, atendimento] of ultimosAtendimentos) {
      const dataAtendimento = new Date(atendimento.dataAtendimento);
      const periodoRetorno = atendimento.servico.periodoRetornoDias;
      
      // Calcular a data de retorno
      const dataRetorno = new Date(dataAtendimento);
      dataRetorno.setDate(dataRetorno.getDate() + periodoRetorno);

      // Verificar se a data de retorno é hoje ou já passou
      if (dataRetorno <= hoje) {
        // Gerar link de agendamento (você pode personalizar isso depois)
        const linkAgendamento = `https://dri-unhas-iota.vercel.app/agendar?cliente=${clienteId}`;

        const mensagem = `Olá ${atendimento.cliente.nome}! 💅

Seus dias para retorno chegaram!
Seu último serviço: ${atendimento.servico.nome} em ${formatarData(dataAtendimento)}.

Agende seu horário clicando aqui:
${linkAgendamento}

Até breve! 🌸`;

        const linkWhatsApp = gerarLinkWhatsApp(atendimento.cliente.telefone, mensagem);

        clientesParaNotificar.push({
          cliente: atendimento.cliente,
          ultimoServico: atendimento.servico.nome,
          dataUltimoAtendimento: dataAtendimento,
          dataRetorno,
          diasParaRetorno: periodoRetorno,
          linkWhatsApp,
        });
      }
    }

    return clientesParaNotificar;
  } catch (error) {
    console.error('Erro ao verificar clientes para retorno:', error);
    throw error;
  }
}

/**
 * Rota que retorna a lista de clientes que precisam ser notificados
 */
export async function listarNotificacoes(req, res) {
  try {
    const notificacoes = await verificarClientesParaRetorno();
    res.json(notificacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar notificações' });
  }
}