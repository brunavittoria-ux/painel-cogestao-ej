# Painel de Cogestao da Presidencia

Painel web (dashboard) centralizado para a cogestao da presidencia de uma Empresa Junior.
Reune, em um unico lugar, as informacoes que a gestao precisa acessar no dia a dia:
credenciais e acessos, links uteis, manuais e SLAs, demandas, calendario de prazos e contatos.

O painel pode funcionar de duas formas:

1. Com os **dados de exemplo** empacotados (padrao): basta rodar o projeto, sem configurar nada.
2. Conectado a uma **planilha do Google Sheets**, que vira a fonte de dados. Voce edita a planilha
   e o painel reflete as alteracoes ao recarregar, sem precisar de backend nem chave de API.

Enquanto nenhuma planilha estiver conectada, o painel mostra um aviso de que esta usando dados de exemplo.

## Como rodar

Pre-requisitos: Node.js 18+ e npm.

```bash
npm install      # instala as dependencias
npm run dev      # inicia o servidor de desenvolvimento (Vite)
npm run build    # gera a versao de producao em dist/
npm run preview  # serve localmente a versao de producao gerada
npm test         # roda os testes automatizados (Vitest)
```

Ao abrir o painel pela primeira vez, voce vera a tela de login (frase-senha). A frase-senha
padrao e `presidencia2024`.

## Login (frase-senha)

O acesso ao painel e protegido por uma frase-senha simples. Para trocar a frase-senha, defina a
variavel de ambiente `VITE_APP_PASSPHRASE` no arquivo `.env` (copie o `.env.example` para `.env`):

```bash
VITE_APP_PASSPHRASE=minha-frase-secreta
```

Se a variavel nao for definida, o painel usa a frase-senha padrao `presidencia2024`.

> **Aviso importante sobre seguranca.** O login deste painel e uma protecao **leve**, feita
> inteiramente no lado do cliente (no navegador). Ele serve apenas para evitar acesso casual e
> **NAO e um armazenamento seguro de segredos**. A frase-senha e os dados ficam acessiveis a quem
> tiver o codigo ou a frase-senha, e qualquer pessoa com conhecimento tecnico consegue inspecionar
> o conteudo carregado no navegador. **Nao armazene aqui senhas realmente criticas** (por exemplo,
> acesso a conta bancaria ou dados sensiveis) enquanto nao houver uma autenticacao mais forte
> (login real com servidor, controle de permissoes e armazenamento protegido). Trate este painel
> como um organizador de conveniencia, nao como um cofre de senhas.

## Conectando uma planilha do Google Sheets (opcional)

Quando quiser usar seus dados reais, conecte uma planilha do Google Sheets. O painel le a planilha
pelo endpoint publico `gviz` do Google (JSON), entao **nenhuma chave de API ou backend e necessario**.
Em troca, a planilha precisa estar compartilhada como "qualquer pessoa com o link pode ver".

Passo a passo:

1. **Crie uma planilha** no Google Sheets.
2. **Crie uma aba (guia) para cada secao** do painel. Os nomes padrao das abas sao:
   `Visao Geral`, `Credenciais`, `Links`, `Manuais`, `Demandas`, `Calendario` e `Contatos`.
   (Voce pode usar outros nomes, desde que ajuste as variaveis `VITE_TAB_*` no `.env`.)
3. **Em cada aba, use a primeira linha como cabecalho** com os nomes de coluna EXATOS da tabela
   abaixo. A partir da segunda linha, preencha os dados (uma linha por item). Linhas totalmente
   vazias sao ignoradas.
4. **Compartilhe a planilha** em "Compartilhar" > "Acesso geral" > "Qualquer pessoa com o link" com
   permissao de **Leitor**.
5. **Pegue o ID da planilha** na URL. Em
   `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`, o ID e o trecho `SEU_ID_AQUI`.
6. **Configure o `.env`** (copie o `.env.example` para `.env`) com o ID e, se precisar, os nomes das abas:

   ```bash
   VITE_SHEET_ID=SEU_ID_AQUI
   # Ajuste os nomes abaixo apenas se as suas abas tiverem nomes diferentes dos padroes.
   VITE_TAB_VISAO_GERAL=Visao Geral
   VITE_TAB_CREDENCIAIS=Credenciais
   VITE_TAB_LINKS=Links
   VITE_TAB_MANUAIS=Manuais
   VITE_TAB_DEMANDAS=Demandas
   VITE_TAB_CALENDARIO=Calendario
   VITE_TAB_CONTATOS=Contatos
   ```

7. **Reinicie o `npm run dev`** (ou gere um novo `npm run build`) para que o Vite leia o novo `.env`.

Se qualquer aba estiver vazia, mal configurada ou se o acesso a planilha falhar, o painel cai
automaticamente para os dados de exemplo e mostra o aviso de "dados de exemplo", sem quebrar.

### Colunas esperadas por secao

Use exatamente estes cabecalhos na primeira linha de cada aba.

#### Visao Geral (`Visao Geral`)

Esta aba guarda tanto os **avisos** quanto os **atalhos rapidos**. Preencha as colunas de aviso
(`Titulo`, `Mensagem`, `Nivel`, `Data`) nas linhas de aviso e as colunas de atalho
(`Titulo`, `URL`, `Icone`) nas linhas de atalho.

| Coluna    | Descricao                                             |
| --------- | ----------------------------------------------------- |
| `Titulo`  | Titulo do aviso ou do atalho                          |
| `Mensagem`| Texto do aviso (preenche uma linha de **aviso**)      |
| `Nivel`   | `info`, `atencao` ou `critico` (nivel do aviso)       |
| `Data`    | Data do aviso (ex.: `2024-06-20`)                     |
| `URL`     | Link do atalho (preenche uma linha de **atalho**)     |
| `Icone`   | Emoji/icone do atalho (ex.: `📁`)                      |

#### Credenciais (`Credenciais`)

| Coluna        | Descricao                           |
| ------------- | ----------------------------------- |
| `Servico`     | Nome do servico/sistema             |
| `Login/Email` | Login ou email de acesso            |
| `Senha`       | Senha (exibida mascarada no painel) |
| `Link`        | Link para acessar o servico         |
| `Observacao`  | Observacoes/instrucoes de uso       |

#### Links (`Links`)

| Coluna      | Descricao                         |
| ----------- | --------------------------------- |
| `Categoria` | Categoria para agrupar os links   |
| `Titulo`    | Titulo do link                    |
| `URL`       | Endereco do link                  |
| `Descricao` | Breve descricao do link           |

#### Manuais (`Manuais`)

| Coluna            | Descricao                                  |
| ----------------- | ------------------------------------------ |
| `Titulo`          | Titulo do manual/procedimento              |
| `Descricao`       | Resumo do procedimento                     |
| `SLA de Resposta` | Prazo de resposta/atendimento (SLA)        |
| `Documento URL`   | Link para o documento completo             |

#### Demandas (`Demandas`)

| Coluna        | Descricao                                                      |
| ------------- | -------------------------------------------------------------- |
| `Tarefa`      | Descricao da tarefa/demanda                                    |
| `Responsavel` | Responsavel pela demanda                                       |
| `Status`      | `A Fazer`, `Em Andamento`, `Concluido` ou `Atrasado`           |
| `Prazo`       | Data limite (ex.: `2024-06-30`)                                |
| `Prioridade`  | `Baixa`, `Media` ou `Alta`                                     |

#### Calendario (`Calendario`)

| Coluna      | Descricao                                        |
| ----------- | ------------------------------------------------ |
| `Titulo`    | Titulo do compromisso                            |
| `Data`      | Data do compromisso (ex.: `2024-06-24`)          |
| `Tipo`      | `Reuniao`, `Entrega`, `Evento` ou `Prazo`        |
| `Descricao` | Detalhes do compromisso                          |

#### Contatos (`Contatos`)

| Coluna     | Descricao                                                 |
| ---------- | --------------------------------------------------------- |
| `Nome`     | Nome do contato ou da organizacao                         |
| `Cargo`    | Cargo ou funcao                                           |
| `Grupo`    | `Diretoria`, `Conselho`, `Parceiros` ou `Federacao`       |
| `Email`    | Email de contato                                          |
| `Telefone` | Telefone de contato                                       |

## Sem configuracao

Sem nenhuma configuracao (sem `VITE_SHEET_ID`), o painel roda normalmente usando os **dados de
exemplo** empacotados, em portugues. Eles sao ficticios e servem apenas para demonstracao: substitua
pelos dados reais conectando a planilha ou editando `src/data/sampleData.ts`.

## Tecnologias

- Vite + React + TypeScript (aplicacao de pagina unica, sem backend)
- Vitest + Testing Library para os testes
- Google Sheets (endpoint `gviz` publico) como fonte de dados opcional
