import type { DashboardData } from '../types';

// Dados de exemplo (fallback) do painel de cogestao.
// ATENCAO: todo o conteudo abaixo e ficticio e serve apenas para demonstracao.
// As credenciais, emails, senhas e telefones NAO sao reais. Substitua tudo
// conectando o painel a sua planilha do Google Sheets (veja o README) ou edite
// este arquivo com os dados verdadeiros da sua Empresa Junior.

export const sampleData: DashboardData = {
  // Secao: Visao Geral
  avisos: [
    {
      titulo: 'Fechamento do trimestre',
      mensagem:
        'Lembrete: o relatorio trimestral da presidencia deve ser enviado ao conselho ate o fim do mes. Alinhem os numeros com a diretoria financeira.',
      nivel: 'atencao',
      data: '2024-06-20',
    },
    {
      titulo: 'Assembleia Geral marcada',
      mensagem:
        'A proxima Assembleia Geral Ordinaria acontecera no auditorio do campus. Confirmem presenca e preparem a pauta.',
      nivel: 'info',
      data: '2024-06-28',
    },
    {
      titulo: 'Renovacao de contrato pendente',
      mensagem:
        'O contrato com o parceiro de contabilidade vence em poucos dias. Priorizar a renovacao para evitar interrupcao do servico.',
      nivel: 'critico',
      data: '2024-06-15',
    },
  ],
  atalhos: [
    { titulo: 'Drive da Presidencia', url: 'https://drive.google.com/exemplo-presidencia', icone: '📁' },
    { titulo: 'Planilha de Cogestao', url: 'https://docs.google.com/spreadsheets/exemplo-cogestao', icone: '📊' },
    { titulo: 'Agenda da Diretoria', url: 'https://calendar.google.com/exemplo-agenda', icone: '📅' },
    { titulo: 'Grupo no WhatsApp', url: 'https://chat.whatsapp.com/exemplo-grupo', icone: '💬' },
  ],

  // Secao: Credenciais & Acessos (dados claramente ficticios)
  credenciais: [
    {
      servico: 'Email da Presidencia',
      loginEmail: 'presidencia@suaej.exemplo.com.br',
      senha: 'exemplo-senha-123',
      link: 'https://mail.google.com',
      observacao: 'Email oficial da presidencia. Trocar a senha a cada gestao.',
    },
    {
      servico: 'Instagram',
      loginEmail: '@suaej',
      senha: 'exemplo-insta-456',
      link: 'https://instagram.com/suaej',
      observacao: 'Acesso compartilhado com o marketing. Ativar verificacao em duas etapas.',
    },
    {
      servico: 'Conta Bancaria (Internet Banking)',
      loginEmail: 'agencia 0001 / conta 12345-6',
      senha: 'exemplo-banco-789',
      link: 'https://banco.exemplo.com.br',
      observacao: 'Acesso restrito a presidencia e diretoria financeira. Nunca compartilhar fora da cogestao.',
    },
    {
      servico: 'Sistema de Gestao (ERP)',
      loginEmail: 'admin@suaej.exemplo.com.br',
      senha: 'exemplo-erp-321',
      link: 'https://erp.exemplo.com.br/login',
      observacao: 'Painel administrativo de projetos e financas.',
    },
    {
      servico: 'Google Workspace (Admin)',
      loginEmail: 'admin@suaej.exemplo.com.br',
      senha: 'exemplo-workspace-654',
      link: 'https://admin.google.com',
      observacao: 'Gerencia emails e permissoes dos membros. Acesso somente da presidencia.',
    },
    {
      servico: 'Site Institucional (Painel)',
      loginEmail: 'editor@suaej.exemplo.com.br',
      senha: 'exemplo-site-987',
      link: 'https://suaej.exemplo.com.br/wp-admin',
      observacao: 'Edicao de conteudo do site. Compartilhado com o time de marketing.',
    },
  ],

  // Secao: Links Uteis (agrupados por categoria)
  links: [
    {
      categoria: 'Gestao',
      titulo: 'Planilha de Cogestao',
      url: 'https://docs.google.com/spreadsheets/exemplo-cogestao',
      descricao: 'Planilha central com demandas, prazos e responsaveis da presidencia.',
    },
    {
      categoria: 'Gestao',
      titulo: 'Repositorio de Documentos',
      url: 'https://drive.google.com/exemplo-documentos',
      descricao: 'Atas, estatuto, regimento interno e documentos oficiais.',
    },
    {
      categoria: 'Marketing',
      titulo: 'Banco de Artes',
      url: 'https://drive.google.com/exemplo-artes',
      descricao: 'Logotipos, templates e materiais visuais da marca.',
    },
    {
      categoria: 'Marketing',
      titulo: 'Calendario de Postagens',
      url: 'https://docs.google.com/spreadsheets/exemplo-postagens',
      descricao: 'Planejamento de conteudo das redes sociais.',
    },
    {
      categoria: 'Financeiro',
      titulo: 'Controle de Fluxo de Caixa',
      url: 'https://docs.google.com/spreadsheets/exemplo-caixa',
      descricao: 'Entradas, saidas e saldo atualizado da EJ.',
    },
    {
      categoria: 'Financeiro',
      titulo: 'Emissao de Notas Fiscais',
      url: 'https://nfe.exemplo.com.br',
      descricao: 'Portal para emissao de notas fiscais de servico.',
    },
    {
      categoria: 'Federacao',
      titulo: 'Portal da Federacao Estadual',
      url: 'https://federacao.exemplo.com.br',
      descricao: 'Comunicados, eventos e recredenciamento junto a federacao.',
    },
    {
      categoria: 'Federacao',
      titulo: 'Inscricoes para Eventos MEJ',
      url: 'https://eventos.exemplo.com.br',
      descricao: 'Inscricoes em eventos do Movimento Empresa Junior.',
    },
  ],

  // Secao: Manuais & SLAs
  manuais: [
    {
      titulo: 'Manual de Abertura de Projeto',
      descricao: 'Passo a passo para iniciar um projeto: proposta, contrato, alocacao e kickoff.',
      slaResposta: 'Analise de proposta em ate 3 dias uteis',
      documentoUrl: 'https://drive.google.com/exemplo-manual-projeto',
    },
    {
      titulo: 'Fluxo de Atendimento ao Cliente',
      descricao: 'Como responder leads e conduzir reunioes comerciais ate o fechamento.',
      slaResposta: 'Primeira resposta ao lead em ate 24 horas',
      documentoUrl: 'https://drive.google.com/exemplo-manual-atendimento',
    },
    {
      titulo: 'Processo de Reembolso',
      descricao: 'Regras e formulario para solicitacao de reembolso de despesas.',
      slaResposta: 'Pagamento em ate 5 dias uteis apos aprovacao',
      documentoUrl: 'https://drive.google.com/exemplo-manual-reembolso',
    },
    {
      titulo: 'Guia de Redes Sociais',
      descricao: 'Tom de voz, identidade visual e aprovacao de postagens.',
      slaResposta: 'Aprovacao de arte em ate 2 dias uteis',
      documentoUrl: 'https://drive.google.com/exemplo-manual-redes',
    },
  ],

  // Secao: Cogestao / Demandas
  demandas: [
    {
      tarefa: 'Enviar relatorio trimestral ao conselho',
      responsavel: 'Presidencia',
      status: 'Em Andamento',
      prazo: '2024-06-30',
      prioridade: 'Alta',
    },
    {
      tarefa: 'Renovar contrato com a contabilidade',
      responsavel: 'Diretoria Financeira',
      status: 'Atrasado',
      prazo: '2024-06-15',
      prioridade: 'Alta',
    },
    {
      tarefa: 'Organizar processo seletivo de novos membros',
      responsavel: 'Diretoria de Gente e Gestao',
      status: 'A Fazer',
      prazo: '2024-07-20',
      prioridade: 'Media',
    },
    {
      tarefa: 'Atualizar site institucional',
      responsavel: 'Diretoria de Marketing',
      status: 'Em Andamento',
      prazo: '2024-07-05',
      prioridade: 'Media',
    },
    {
      tarefa: 'Fechar parceria com a empresa parceira local',
      responsavel: 'Diretoria Comercial',
      status: 'A Fazer',
      prazo: '2024-07-15',
      prioridade: 'Baixa',
    },
    {
      tarefa: 'Entregar prestacao de contas da gestao anterior',
      responsavel: 'Presidencia',
      status: 'Concluido',
      prazo: '2024-05-30',
      prioridade: 'Alta',
    },
  ],

  // Secao: Calendario / Prazos
  eventos: [
    {
      titulo: 'Reuniao semanal da diretoria',
      data: '2024-06-24',
      tipo: 'Reuniao',
      descricao: 'Alinhamento de demandas e status dos projetos em andamento.',
    },
    {
      titulo: 'Entrega do relatorio trimestral',
      data: '2024-06-30',
      tipo: 'Entrega',
      descricao: 'Prazo final para envio do relatorio ao conselho.',
    },
    {
      titulo: 'Assembleia Geral Ordinaria',
      data: '2024-06-28',
      tipo: 'Evento',
      descricao: 'Aprovacao de contas e deliberacoes com os membros.',
    },
    {
      titulo: 'Prazo de recredenciamento na federacao',
      data: '2024-07-10',
      tipo: 'Prazo',
      descricao: 'Envio da documentacao de recredenciamento anual.',
    },
    {
      titulo: 'Reuniao de conselho',
      data: '2024-07-08',
      tipo: 'Reuniao',
      descricao: 'Prestacao de contas e planejamento do proximo trimestre.',
    },
  ],

  // Secao: Contatos
  contatos: [
    {
      nome: 'Ana Souza',
      cargo: 'Presidente',
      grupo: 'Diretoria',
      email: 'presidencia@suaej.exemplo.com.br',
      telefone: '(11) 90000-0001',
    },
    {
      nome: 'Bruno Lima',
      cargo: 'Vice-Presidente',
      grupo: 'Diretoria',
      email: 'vice@suaej.exemplo.com.br',
      telefone: '(11) 90000-0002',
    },
    {
      nome: 'Carla Mendes',
      cargo: 'Diretora Financeira',
      grupo: 'Diretoria',
      email: 'financeiro@suaej.exemplo.com.br',
      telefone: '(11) 90000-0003',
    },
    {
      nome: 'Diego Alves',
      cargo: 'Presidente do Conselho',
      grupo: 'Conselho',
      email: 'conselho@suaej.exemplo.com.br',
      telefone: '(11) 90000-0004',
    },
    {
      nome: 'Escritorio Contabil Exemplo',
      cargo: 'Contabilidade parceira',
      grupo: 'Parceiros',
      email: 'contato@contabilexemplo.com.br',
      telefone: '(11) 3000-0000',
    },
    {
      nome: 'Federacao Estadual de EJs',
      cargo: 'Secretaria',
      grupo: 'Federacao',
      email: 'contato@federacao.exemplo.com.br',
      telefone: '(11) 3000-0001',
    },
  ],
};

export default sampleData;
