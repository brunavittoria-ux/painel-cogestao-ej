/**
 * Painel de Cogestao da Presidencia - gerador da planilha bonita (tons de mar).
 *
 * COMO USAR (passo a passo):
 *   1. Abra (ou crie) uma planilha no Google Sheets.
 *   2. No menu, va em "Extensoes" > "Apps Script".
 *   3. Apague o conteudo que aparecer no editor e cole TODO este arquivo.
 *   4. Salve (icone de disquete ou Ctrl+S).
 *   5. Na barra de funcoes do topo, selecione "gerarPlanilhaCogestao" e clique em "Executar".
 *   6. Na primeira vez o Google vai pedir autorizacao. Autorize com a sua conta
 *      (e seguro: o script so mexe nesta planilha).
 *   7. Pronto! A planilha sera montada com as 7 abas, os dados de exemplo e as cores.
 *
 * E seguro rodar de novo (idempotente): cada aba e recriada do zero a cada execucao,
 * entao voce nunca fica com linhas duplicadas. Depois e so trocar os dados de exemplo
 * pelos dados reais da sua Empresa Junior.
 *
 * O resultado tem exatamente as mesmas abas e cabecalhos que o painel espera, entao
 * basta compartilhar a planilha como "qualquer pessoa com o link" (Leitor), pegar o ID
 * na URL e conectar ao painel pela variavel VITE_SHEET_ID (veja o README do projeto).
 *
 * Tema visual: tons de mar (azul profundo no cabecalho, aqua claro nas linhas).
 * Todo o conteudo e os comentarios estao em portugues do Brasil.
 */

// ----- Paleta "tons de mar" -----
var CORES = {
  cabecalhoFundo: '#0b3d5c',   // azul profundo do mar (fundo do cabecalho)
  cabecalhoTexto: '#ffffff',   // texto branco do cabecalho
  linhaPar: '#e3f2fb',         // aqua bem claro (linhas pares)
  linhaImpar: '#f4fbfe',       // quase branco azulado (linhas impares)
  borda: '#9cc8df',            // azul claro para as bordas
  // Cores de status das Demandas (dentro da familia de mar/harmonicas).
  statusConcluido: '#cdeccd',  // verde suave
  statusAtrasado: '#f6cfcf',   // vermelho suave
  statusAndamento: '#cfe3f6',  // azul suave
  statusAFazer: '#e0e4e8',     // cinza suave
  // Cores de prioridade das Demandas.
  prioridadeAlta: '#f6cfcf',
  prioridadeMedia: '#fdeecf',
  prioridadeBaixa: '#d8ecd8',
  // Cores do nivel dos avisos na Visao Geral.
  nivelInfo: '#cfe3f6',
  nivelAtencao: '#fdeecf',
  nivelCritico: '#f6cfcf'
};

// Nome da funcao principal para rodar: gerarPlanilhaCogestao

// ----- Definicao das 7 abas (nomes e cabecalhos exatos que o painel espera) -----
// A ordem das colunas segue os cabecalhos. Os dados sao os mesmos do painel
// (src/data/sampleData.ts), para a planilha refletir 1:1 o modo de exemplo.
var ABAS = [
  {
    nome: 'Visao Geral',
    cabecalhos: ['Titulo', 'Mensagem', 'Nivel', 'Data', 'URL', 'Icone'],
    // Colunas largas (em pixels) por indice de coluna (base 1).
    larguras: { 1: 220, 2: 420, 3: 100, 4: 110, 5: 300, 6: 80 },
    // Colunas que recebem quebra de texto (texto longo).
    colunasQuebra: [2],
    linhas: [
      // Avisos: preenchem Titulo + Mensagem + Nivel + Data (URL e Icone vazios).
      [
        'Fechamento do trimestre',
        'Lembrete: o relatorio trimestral da presidencia deve ser enviado ao conselho ate o fim do mes. Alinhem os numeros com a diretoria financeira.',
        'atencao',
        '2024-06-20',
        '',
        ''
      ],
      [
        'Assembleia Geral marcada',
        'A proxima Assembleia Geral Ordinaria acontecera no auditorio do campus. Confirmem presenca e preparem a pauta.',
        'info',
        '2024-06-28',
        '',
        ''
      ],
      [
        'Renovacao de contrato pendente',
        'O contrato com o parceiro de contabilidade vence em poucos dias. Priorizar a renovacao para evitar interrupcao do servico.',
        'critico',
        '2024-06-15',
        '',
        ''
      ],
      // Atalhos: preenchem Titulo + URL + Icone (Mensagem, Nivel e Data vazios).
      ['Drive da Presidencia', '', '', '', 'https://drive.google.com/exemplo-presidencia', '\uD83D\uDCC1'],
      ['Planilha de Cogestao', '', '', '', 'https://docs.google.com/spreadsheets/exemplo-cogestao', '\uD83D\uDCCA'],
      ['Agenda da Diretoria', '', '', '', 'https://calendar.google.com/exemplo-agenda', '\uD83D\uDCC5'],
      ['Grupo no WhatsApp', '', '', '', 'https://chat.whatsapp.com/exemplo-grupo', '\uD83D\uDCAC']
    ]
  },
  {
    nome: 'Credenciais',
    cabecalhos: ['Servico', 'Login/Email', 'Senha', 'Link', 'Observacao'],
    larguras: { 1: 260, 2: 260, 3: 170, 4: 240, 5: 420 },
    colunasQuebra: [5],
    linhas: [
      [
        'Email da Presidencia',
        'presidencia@suaej.exemplo.com.br',
        'exemplo-senha-123',
        'https://mail.google.com',
        'Email oficial da presidencia. Trocar a senha a cada gestao.'
      ],
      [
        'Instagram',
        '@suaej',
        'exemplo-insta-456',
        'https://instagram.com/suaej',
        'Acesso compartilhado com o marketing. Ativar verificacao em duas etapas.'
      ],
      [
        'Conta Bancaria (Internet Banking)',
        'agencia 0001 / conta 12345-6',
        'exemplo-banco-789',
        'https://banco.exemplo.com.br',
        'Acesso restrito a presidencia e diretoria financeira. Nunca compartilhar fora da cogestao.'
      ],
      [
        'Sistema de Gestao (ERP)',
        'admin@suaej.exemplo.com.br',
        'exemplo-erp-321',
        'https://erp.exemplo.com.br/login',
        'Painel administrativo de projetos e financas.'
      ],
      [
        'Google Workspace (Admin)',
        'admin@suaej.exemplo.com.br',
        'exemplo-workspace-654',
        'https://admin.google.com',
        'Gerencia emails e permissoes dos membros. Acesso somente da presidencia.'
      ],
      [
        'Site Institucional (Painel)',
        'editor@suaej.exemplo.com.br',
        'exemplo-site-987',
        'https://suaej.exemplo.com.br/wp-admin',
        'Edicao de conteudo do site. Compartilhado com o time de marketing.'
      ]
    ]
  },
  {
    nome: 'Links',
    cabecalhos: ['Categoria', 'Titulo', 'URL', 'Descricao'],
    larguras: { 1: 140, 2: 260, 3: 320, 4: 420 },
    colunasQuebra: [4],
    linhas: [
      [
        'Gestao',
        'Planilha de Cogestao',
        'https://docs.google.com/spreadsheets/exemplo-cogestao',
        'Planilha central com demandas, prazos e responsaveis da presidencia.'
      ],
      [
        'Gestao',
        'Repositorio de Documentos',
        'https://drive.google.com/exemplo-documentos',
        'Atas, estatuto, regimento interno e documentos oficiais.'
      ],
      [
        'Marketing',
        'Banco de Artes',
        'https://drive.google.com/exemplo-artes',
        'Logotipos, templates e materiais visuais da marca.'
      ],
      [
        'Marketing',
        'Calendario de Postagens',
        'https://docs.google.com/spreadsheets/exemplo-postagens',
        'Planejamento de conteudo das redes sociais.'
      ],
      [
        'Financeiro',
        'Controle de Fluxo de Caixa',
        'https://docs.google.com/spreadsheets/exemplo-caixa',
        'Entradas, saidas e saldo atualizado da EJ.'
      ],
      [
        'Financeiro',
        'Emissao de Notas Fiscais',
        'https://nfe.exemplo.com.br',
        'Portal para emissao de notas fiscais de servico.'
      ],
      [
        'Federacao',
        'Portal da Federacao Estadual',
        'https://federacao.exemplo.com.br',
        'Comunicados, eventos e recredenciamento junto a federacao.'
      ],
      [
        'Federacao',
        'Inscricoes para Eventos MEJ',
        'https://eventos.exemplo.com.br',
        'Inscricoes em eventos do Movimento Empresa Junior.'
      ]
    ]
  },
  {
    nome: 'Manuais',
    cabecalhos: ['Titulo', 'Descricao', 'SLA de Resposta', 'Documento URL'],
    larguras: { 1: 280, 2: 420, 3: 300, 4: 320 },
    colunasQuebra: [2, 3],
    linhas: [
      [
        'Manual de Abertura de Projeto',
        'Passo a passo para iniciar um projeto: proposta, contrato, alocacao e kickoff.',
        'Analise de proposta em ate 3 dias uteis',
        'https://drive.google.com/exemplo-manual-projeto'
      ],
      [
        'Fluxo de Atendimento ao Cliente',
        'Como responder leads e conduzir reunioes comerciais ate o fechamento.',
        'Primeira resposta ao lead em ate 24 horas',
        'https://drive.google.com/exemplo-manual-atendimento'
      ],
      [
        'Processo de Reembolso',
        'Regras e formulario para solicitacao de reembolso de despesas.',
        'Pagamento em ate 5 dias uteis apos aprovacao',
        'https://drive.google.com/exemplo-manual-reembolso'
      ],
      [
        'Guia de Redes Sociais',
        'Tom de voz, identidade visual e aprovacao de postagens.',
        'Aprovacao de arte em ate 2 dias uteis',
        'https://drive.google.com/exemplo-manual-redes'
      ]
    ]
  },
  {
    nome: 'Demandas',
    cabecalhos: ['Tarefa', 'Responsavel', 'Status', 'Prazo', 'Prioridade'],
    larguras: { 1: 360, 2: 240, 3: 150, 4: 120, 5: 130 },
    colunasQuebra: [1],
    linhas: [
      ['Enviar relatorio trimestral ao conselho', 'Presidencia', 'Em Andamento', '2024-06-30', 'Alta'],
      ['Renovar contrato com a contabilidade', 'Diretoria Financeira', 'Atrasado', '2024-06-15', 'Alta'],
      ['Organizar processo seletivo de novos membros', 'Diretoria de Gente e Gestao', 'A Fazer', '2024-07-20', 'Media'],
      ['Atualizar site institucional', 'Diretoria de Marketing', 'Em Andamento', '2024-07-05', 'Media'],
      ['Fechar parceria com a empresa parceira local', 'Diretoria Comercial', 'A Fazer', '2024-07-15', 'Baixa'],
      ['Entregar prestacao de contas da gestao anterior', 'Presidencia', 'Concluido', '2024-05-30', 'Alta']
    ]
  },
  {
    nome: 'Calendario',
    cabecalhos: ['Titulo', 'Data', 'Tipo', 'Descricao'],
    larguras: { 1: 300, 2: 120, 3: 130, 4: 420 },
    colunasQuebra: [4],
    linhas: [
      ['Reuniao semanal da diretoria', '2024-06-24', 'Reuniao', 'Alinhamento de demandas e status dos projetos em andamento.'],
      ['Entrega do relatorio trimestral', '2024-06-30', 'Entrega', 'Prazo final para envio do relatorio ao conselho.'],
      ['Assembleia Geral Ordinaria', '2024-06-28', 'Evento', 'Aprovacao de contas e deliberacoes com os membros.'],
      ['Prazo de recredenciamento na federacao', '2024-07-10', 'Prazo', 'Envio da documentacao de recredenciamento anual.'],
      ['Reuniao de conselho', '2024-07-08', 'Reuniao', 'Prestacao de contas e planejamento do proximo trimestre.']
    ]
  },
  {
    nome: 'Contatos',
    cabecalhos: ['Nome', 'Cargo', 'Grupo', 'Email', 'Telefone'],
    larguras: { 1: 260, 2: 220, 3: 140, 4: 300, 5: 160 },
    colunasQuebra: [],
    linhas: [
      ['Ana Souza', 'Presidente', 'Diretoria', 'presidencia@suaej.exemplo.com.br', '(11) 90000-0001'],
      ['Bruno Lima', 'Vice-Presidente', 'Diretoria', 'vice@suaej.exemplo.com.br', '(11) 90000-0002'],
      ['Carla Mendes', 'Diretora Financeira', 'Diretoria', 'financeiro@suaej.exemplo.com.br', '(11) 90000-0003'],
      ['Diego Alves', 'Presidente do Conselho', 'Conselho', 'conselho@suaej.exemplo.com.br', '(11) 90000-0004'],
      ['Escritorio Contabil Exemplo', 'Contabilidade parceira', 'Parceiros', 'contato@contabilexemplo.com.br', '(11) 3000-0000'],
      ['Federacao Estadual de EJs', 'Secretaria', 'Federacao', 'contato@federacao.exemplo.com.br', '(11) 3000-0001']
    ]
  }
];

/**
 * Funcao PRINCIPAL. E esta que voce deve selecionar e executar no editor.
 * Monta todas as 7 abas do zero, preenche os dados e aplica o tema de mar.
 */
function gerarPlanilhaCogestao() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  for (var i = 0; i < ABAS.length; i++) {
    montarAba(planilha, ABAS[i]);
  }

  removerAbaPadraoVazia(planilha);

  // Deixa a primeira aba (Visao Geral) selecionada ao terminar.
  var primeira = planilha.getSheetByName(ABAS[0].nome);
  if (primeira) {
    planilha.setActiveSheet(primeira);
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Planilha de cogestao montada com sucesso! Tema: tons de mar.',
    'Concluido',
    5
  );
}

/**
 * Cria (ou recria, se ja existir) uma aba com cabecalho, dados e formatacao.
 * Recriar do zero garante que rodar de novo nao duplica nada (idempotente).
 */
function montarAba(planilha, definicao) {
  // Se a aba ja existe, apaga para recriar limpa.
  var existente = planilha.getSheetByName(definicao.nome);
  if (existente) {
    planilha.deleteSheet(existente);
  }
  var aba = planilha.insertSheet(definicao.nome);

  var cabecalhos = definicao.cabecalhos;
  var linhas = definicao.linhas;
  var totalColunas = cabecalhos.length;
  var totalLinhasDados = linhas.length;

  // ----- Escreve o cabecalho (linha 1) -----
  aba.getRange(1, 1, 1, totalColunas).setValues([cabecalhos]);

  // ----- Escreve os dados (a partir da linha 2) -----
  if (totalLinhasDados > 0) {
    aba.getRange(2, 1, totalLinhasDados, totalColunas).setValues(linhas);
  }

  formatarCabecalho(aba, totalColunas);
  formatarDados(aba, definicao, totalLinhasDados, totalColunas);
  aplicarLarguras(aba, definicao.larguras);
  aplicarBordas(aba, totalLinhasDados, totalColunas);
  colorirCelulasEspeciais(aba, definicao, totalLinhasDados);

  // Congela a linha de cabecalho para ela ficar sempre visivel ao rolar.
  aba.setFrozenRows(1);

  // Remove colunas e linhas sobrando para a aba ficar enxuta.
  enxugarGrade(aba, totalLinhasDados, totalColunas);
}

/**
 * Formata a faixa de cabecalho: fundo azul profundo, texto branco e negrito,
 * centralizado verticalmente e com a linha um pouco mais alta.
 */
function formatarCabecalho(aba, totalColunas) {
  var faixa = aba.getRange(1, 1, 1, totalColunas);
  faixa
    .setBackground(CORES.cabecalhoFundo)
    .setFontColor(CORES.cabecalhoTexto)
    .setFontWeight('bold')
    .setFontSize(11)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left')
    .setWrap(true);
  aba.setRowHeight(1, 40);
}

/**
 * Aplica o zebrado (linhas alternadas em tons de aqua), alinhamento ao topo
 * e quebra de texto nas colunas de texto longo.
 */
function formatarDados(aba, definicao, totalLinhasDados, totalColunas) {
  if (totalLinhasDados <= 0) {
    return;
  }

  var dados = aba.getRange(2, 1, totalLinhasDados, totalColunas);
  dados.setVerticalAlignment('top');

  // Zebrado: aplica cor de fundo linha a linha.
  for (var l = 0; l < totalLinhasDados; l++) {
    var cor = (l % 2 === 0) ? CORES.linhaImpar : CORES.linhaPar;
    aba.getRange(2 + l, 1, 1, totalColunas).setBackground(cor);
  }

  // Quebra de texto nas colunas longas definidas; demais sem quebra.
  var colunasQuebra = definicao.colunasQuebra || [];
  for (var c = 1; c <= totalColunas; c++) {
    var quebra = (colunasQuebra.indexOf(c) !== -1);
    aba.getRange(2, c, totalLinhasDados, 1).setWrap(quebra);
  }
}

/**
 * Define larguras de coluna (em pixels) por indice informado na definicao.
 */
function aplicarLarguras(aba, larguras) {
  if (!larguras) {
    return;
  }
  for (var chave in larguras) {
    if (larguras.hasOwnProperty(chave)) {
      aba.setColumnWidth(Number(chave), larguras[chave]);
    }
  }
}

/**
 * Desenha bordas finas em tom de mar ao redor e entre as celulas da tabela
 * (cabecalho + dados).
 */
function aplicarBordas(aba, totalLinhasDados, totalColunas) {
  var totalLinhas = totalLinhasDados + 1; // inclui o cabecalho
  var faixa = aba.getRange(1, 1, totalLinhas, totalColunas);
  // setBorder(topo, esquerda, base, direita, vertical, horizontal, cor, estilo)
  faixa.setBorder(true, true, true, true, true, true, CORES.borda, SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Colore celulas especiais dentro da familia de mar/harmonicas:
 * - Demandas: pinta Status e Prioridade conforme o valor.
 * - Visao Geral: pinta o Nivel (info/atencao/critico).
 * Nas demais abas nao faz nada.
 */
function colorirCelulasEspeciais(aba, definicao, totalLinhasDados) {
  if (totalLinhasDados <= 0) {
    return;
  }

  if (definicao.nome === 'Demandas') {
    // Status na coluna 3, Prioridade na coluna 5 (base 1).
    for (var i = 0; i < definicao.linhas.length; i++) {
      var linhaPlanilha = 2 + i;
      var status = definicao.linhas[i][2];
      var prioridade = definicao.linhas[i][4];
      var corStatus = corDoStatus(status);
      if (corStatus) {
        aba.getRange(linhaPlanilha, 3).setBackground(corStatus).setFontWeight('bold');
      }
      var corPrioridade = corDaPrioridade(prioridade);
      if (corPrioridade) {
        aba.getRange(linhaPlanilha, 5).setBackground(corPrioridade).setFontWeight('bold');
      }
    }
  } else if (definicao.nome === 'Visao Geral') {
    // Nivel na coluna 3 (base 1), apenas nas linhas de aviso (que tem valor).
    for (var j = 0; j < definicao.linhas.length; j++) {
      var nivel = definicao.linhas[j][2];
      var corNivel = corDoNivel(nivel);
      if (corNivel) {
        aba.getRange(2 + j, 3).setBackground(corNivel).setFontWeight('bold');
      }
    }
  }
}

function corDoStatus(status) {
  switch (status) {
    case 'Concluido': return CORES.statusConcluido;
    case 'Atrasado': return CORES.statusAtrasado;
    case 'Em Andamento': return CORES.statusAndamento;
    case 'A Fazer': return CORES.statusAFazer;
    default: return null;
  }
}

function corDaPrioridade(prioridade) {
  switch (prioridade) {
    case 'Alta': return CORES.prioridadeAlta;
    case 'Media': return CORES.prioridadeMedia;
    case 'Baixa': return CORES.prioridadeBaixa;
    default: return null;
  }
}

function corDoNivel(nivel) {
  switch (nivel) {
    case 'info': return CORES.nivelInfo;
    case 'atencao': return CORES.nivelAtencao;
    case 'critico': return CORES.nivelCritico;
    default: return null;
  }
}

/**
 * Remove colunas e linhas em excesso para a aba ficar com o tamanho exato
 * da tabela, deixando o visual mais limpo.
 */
function enxugarGrade(aba, totalLinhasDados, totalColunas) {
  var totalLinhasUsadas = totalLinhasDados + 1; // cabecalho + dados

  var maxColunas = aba.getMaxColumns();
  if (maxColunas > totalColunas) {
    aba.deleteColumns(totalColunas + 1, maxColunas - totalColunas);
  }

  var maxLinhas = aba.getMaxRows();
  if (maxLinhas > totalLinhasUsadas) {
    aba.deleteRows(totalLinhasUsadas + 1, maxLinhas - totalLinhasUsadas);
  }
}

/**
 * Remove a aba padrao ("Sheet1" / "Pagina1" / "Planilha1") quando ela estiver
 * vazia e nao for uma das abas do painel. Nunca apaga a ultima aba restante.
 */
function removerAbaPadraoVazia(planilha) {
  var nomesPainel = {};
  for (var i = 0; i < ABAS.length; i++) {
    nomesPainel[ABAS[i].nome] = true;
  }

  var abas = planilha.getSheets();
  for (var j = 0; j < abas.length; j++) {
    var aba = abas[j];
    var nome = aba.getName();
    if (nomesPainel[nome]) {
      continue; // nao mexe nas abas do painel
    }
    // Considera vazia quando nao ha intervalo de dados preenchido.
    var vazia = (aba.getLastRow() === 0 && aba.getLastColumn() === 0);
    if (vazia && planilha.getSheets().length > 1) {
      planilha.deleteSheet(aba);
    }
  }
}
