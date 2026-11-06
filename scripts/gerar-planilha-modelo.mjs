// Gerador da planilha modelo do Painel de Cogestao.
//
// Este script cria o arquivo `planilha-modelo-cogestao.xlsx` na raiz do projeto
// com as sete abas (guias) que o painel espera, ja com os cabecalhos corretos
// na primeira linha e os dados de exemplo preenchidos. A ideia e que a Bruna
// (ou qualquer presidencia) possa importar esse arquivo no Google Sheets
// (Arquivo > Importar), compartilhar como "qualquer pessoa com o link" (Leitor)
// e conectar ao painel pela variavel VITE_SHEET_ID.
//
// Os dados abaixo sao os mesmos de src/data/sampleData.ts, para que o arquivo
// gerado reflita exatamente o que o painel exibe no modo de exemplo.
//
// Uso: npm run gerar:planilha
//      (ou: node scripts/gerar-planilha-modelo.mjs)

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raizProjeto = join(__dirname, '..');
const caminhoSaida = join(raizProjeto, 'planilha-modelo-cogestao.xlsx');

// Cada aba e definida pelo nome exato da guia, os cabecalhos (primeira linha)
// e as linhas de dados. Os nomes das abas e dos cabecalhos precisam bater com
// o que o parser do painel aceita (ver README, "Colunas esperadas por secao").
const abas = [
  {
    nome: 'Visao Geral',
    cabecalhos: ['Titulo', 'Mensagem', 'Nivel', 'Data', 'URL', 'Icone'],
    linhas: [
      // Avisos: preenchem Titulo + Mensagem + Nivel + Data (URL e Icone vazios).
      [
        'Fechamento do trimestre',
        'Lembrete: o relatorio trimestral da presidencia deve ser enviado ao conselho ate o fim do mes. Alinhem os numeros com a diretoria financeira.',
        'atencao',
        '2024-06-20',
        '',
        '',
      ],
      [
        'Assembleia Geral marcada',
        'A proxima Assembleia Geral Ordinaria acontecera no auditorio do campus. Confirmem presenca e preparem a pauta.',
        'info',
        '2024-06-28',
        '',
        '',
      ],
      [
        'Renovacao de contrato pendente',
        'O contrato com o parceiro de contabilidade vence em poucos dias. Priorizar a renovacao para evitar interrupcao do servico.',
        'critico',
        '2024-06-15',
        '',
        '',
      ],
      // Atalhos: preenchem Titulo + URL + Icone (Mensagem, Nivel e Data vazios).
      ['Drive da Presidencia', '', '', '', 'https://drive.google.com/exemplo-presidencia', '📁'],
      ['Planilha de Cogestao', '', '', '', 'https://docs.google.com/spreadsheets/exemplo-cogestao', '📊'],
      ['Agenda da Diretoria', '', '', '', 'https://calendar.google.com/exemplo-agenda', '📅'],
      ['Grupo no WhatsApp', '', '', '', 'https://chat.whatsapp.com/exemplo-grupo', '💬'],
    ],
  },
  {
    nome: 'Credenciais',
    cabecalhos: ['Servico', 'Login/Email', 'Senha', 'Link', 'Observacao'],
    linhas: [
      [
        'Email da Presidencia',
        'presidencia@suaej.exemplo.com.br',
        'exemplo-senha-123',
        'https://mail.google.com',
        'Email oficial da presidencia. Trocar a senha a cada gestao.',
      ],
      [
        'Instagram',
        '@suaej',
        'exemplo-insta-456',
        'https://instagram.com/suaej',
        'Acesso compartilhado com o marketing. Ativar verificacao em duas etapas.',
      ],
      [
        'Conta Bancaria (Internet Banking)',
        'agencia 0001 / conta 12345-6',
        'exemplo-banco-789',
        'https://banco.exemplo.com.br',
        'Acesso restrito a presidencia e diretoria financeira. Nunca compartilhar fora da cogestao.',
      ],
      [
        'Sistema de Gestao (ERP)',
        'admin@suaej.exemplo.com.br',
        'exemplo-erp-321',
        'https://erp.exemplo.com.br/login',
        'Painel administrativo de projetos e financas.',
      ],
      [
        'Google Workspace (Admin)',
        'admin@suaej.exemplo.com.br',
        'exemplo-workspace-654',
        'https://admin.google.com',
        'Gerencia emails e permissoes dos membros. Acesso somente da presidencia.',
      ],
      [
        'Site Institucional (Painel)',
        'editor@suaej.exemplo.com.br',
        'exemplo-site-987',
        'https://suaej.exemplo.com.br/wp-admin',
        'Edicao de conteudo do site. Compartilhado com o time de marketing.',
      ],
    ],
  },
  {
    nome: 'Links',
    cabecalhos: ['Categoria', 'Titulo', 'URL', 'Descricao'],
    linhas: [
      [
        'Gestao',
        'Planilha de Cogestao',
        'https://docs.google.com/spreadsheets/exemplo-cogestao',
        'Planilha central com demandas, prazos e responsaveis da presidencia.',
      ],
      [
        'Gestao',
        'Repositorio de Documentos',
        'https://drive.google.com/exemplo-documentos',
        'Atas, estatuto, regimento interno e documentos oficiais.',
      ],
      [
        'Marketing',
        'Banco de Artes',
        'https://drive.google.com/exemplo-artes',
        'Logotipos, templates e materiais visuais da marca.',
      ],
      [
        'Marketing',
        'Calendario de Postagens',
        'https://docs.google.com/spreadsheets/exemplo-postagens',
        'Planejamento de conteudo das redes sociais.',
      ],
      [
        'Financeiro',
        'Controle de Fluxo de Caixa',
        'https://docs.google.com/spreadsheets/exemplo-caixa',
        'Entradas, saidas e saldo atualizado da EJ.',
      ],
      [
        'Financeiro',
        'Emissao de Notas Fiscais',
        'https://nfe.exemplo.com.br',
        'Portal para emissao de notas fiscais de servico.',
      ],
      [
        'Federacao',
        'Portal da Federacao Estadual',
        'https://federacao.exemplo.com.br',
        'Comunicados, eventos e recredenciamento junto a federacao.',
      ],
      [
        'Federacao',
        'Inscricoes para Eventos MEJ',
        'https://eventos.exemplo.com.br',
        'Inscricoes em eventos do Movimento Empresa Junior.',
      ],
    ],
  },
  {
    nome: 'Manuais',
    cabecalhos: ['Titulo', 'Descricao', 'SLA de Resposta', 'Documento URL'],
    linhas: [
      [
        'Manual de Abertura de Projeto',
        'Passo a passo para iniciar um projeto: proposta, contrato, alocacao e kickoff.',
        'Analise de proposta em ate 3 dias uteis',
        'https://drive.google.com/exemplo-manual-projeto',
      ],
      [
        'Fluxo de Atendimento ao Cliente',
        'Como responder leads e conduzir reunioes comerciais ate o fechamento.',
        'Primeira resposta ao lead em ate 24 horas',
        'https://drive.google.com/exemplo-manual-atendimento',
      ],
      [
        'Processo de Reembolso',
        'Regras e formulario para solicitacao de reembolso de despesas.',
        'Pagamento em ate 5 dias uteis apos aprovacao',
        'https://drive.google.com/exemplo-manual-reembolso',
      ],
      [
        'Guia de Redes Sociais',
        'Tom de voz, identidade visual e aprovacao de postagens.',
        'Aprovacao de arte em ate 2 dias uteis',
        'https://drive.google.com/exemplo-manual-redes',
      ],
    ],
  },
  {
    nome: 'Demandas',
    cabecalhos: ['Tarefa', 'Responsavel', 'Status', 'Prazo', 'Prioridade'],
    linhas: [
      ['Enviar relatorio trimestral ao conselho', 'Presidencia', 'Em Andamento', '2024-06-30', 'Alta'],
      ['Renovar contrato com a contabilidade', 'Diretoria Financeira', 'Atrasado', '2024-06-15', 'Alta'],
      [
        'Organizar processo seletivo de novos membros',
        'Diretoria de Gente e Gestao',
        'A Fazer',
        '2024-07-20',
        'Media',
      ],
      ['Atualizar site institucional', 'Diretoria de Marketing', 'Em Andamento', '2024-07-05', 'Media'],
      ['Fechar parceria com a empresa parceira local', 'Diretoria Comercial', 'A Fazer', '2024-07-15', 'Baixa'],
      ['Entregar prestacao de contas da gestao anterior', 'Presidencia', 'Concluido', '2024-05-30', 'Alta'],
    ],
  },
  {
    nome: 'Calendario',
    cabecalhos: ['Titulo', 'Data', 'Tipo', 'Descricao'],
    linhas: [
      [
        'Reuniao semanal da diretoria',
        '2024-06-24',
        'Reuniao',
        'Alinhamento de demandas e status dos projetos em andamento.',
      ],
      [
        'Entrega do relatorio trimestral',
        '2024-06-30',
        'Entrega',
        'Prazo final para envio do relatorio ao conselho.',
      ],
      [
        'Assembleia Geral Ordinaria',
        '2024-06-28',
        'Evento',
        'Aprovacao de contas e deliberacoes com os membros.',
      ],
      [
        'Prazo de recredenciamento na federacao',
        '2024-07-10',
        'Prazo',
        'Envio da documentacao de recredenciamento anual.',
      ],
      [
        'Reuniao de conselho',
        '2024-07-08',
        'Reuniao',
        'Prestacao de contas e planejamento do proximo trimestre.',
      ],
    ],
  },
  {
    nome: 'Contatos',
    cabecalhos: ['Nome', 'Cargo', 'Grupo', 'Email', 'Telefone'],
    linhas: [
      ['Ana Souza', 'Presidente', 'Diretoria', 'presidencia@suaej.exemplo.com.br', '(11) 90000-0001'],
      ['Bruno Lima', 'Vice-Presidente', 'Diretoria', 'vice@suaej.exemplo.com.br', '(11) 90000-0002'],
      ['Carla Mendes', 'Diretora Financeira', 'Diretoria', 'financeiro@suaej.exemplo.com.br', '(11) 90000-0003'],
      ['Diego Alves', 'Presidente do Conselho', 'Conselho', 'conselho@suaej.exemplo.com.br', '(11) 90000-0004'],
      [
        'Escritorio Contabil Exemplo',
        'Contabilidade parceira',
        'Parceiros',
        'contato@contabilexemplo.com.br',
        '(11) 3000-0000',
      ],
      [
        'Federacao Estadual de EJs',
        'Secretaria',
        'Federacao',
        'contato@federacao.exemplo.com.br',
        '(11) 3000-0001',
      ],
    ],
  },
];

function gerarPlanilha() {
  const workbook = XLSX.utils.book_new();

  for (const aba of abas) {
    const matriz = [aba.cabecalhos, ...aba.linhas];
    const worksheet = XLSX.utils.aoa_to_sheet(matriz);
    // Define uma largura de coluna confortavel para leitura.
    worksheet['!cols'] = aba.cabecalhos.map(() => ({ wch: 32 }));
    XLSX.utils.book_append_sheet(workbook, worksheet, aba.nome);
  }

  XLSX.writeFile(workbook, caminhoSaida);
  console.log(`Planilha modelo gerada em: ${caminhoSaida}`);
  console.log(`Abas criadas: ${abas.map((a) => a.nome).join(', ')}`);
}

gerarPlanilha();
