# Alimenta+

Projeto acadêmico da Global Solution FIAP que conecta estabelecimentos com alimentos para doar a instituições que precisam recebê-los. Não há compras, pagamentos ou chat: as partes combinam a retirada fora da plataforma.

## Tecnologias e estrutura

- React, Vite e TypeScript; React Router para navegação e Tailwind CSS para estilos.
- `src/pages`: telas da aplicação.
- `src/components`: partes reutilizáveis, como cabeçalho e cartões.
- `src/data`: modelos e exemplos de alimentos.
- `src/services`: dados fictícios e preparação para acessar a API Java.

## Executar

Use Node.js 20.19 ou superior na versão 20, ou 22.12 ou superior.

```bash
npm install
npm run dev
```

Abra no navegador o endereço apresentado pelo Vite. Para verificar o projeto:

```bash
npm run build
npm run lint
```

## Demonstração do fluxo

A aplicação usa dados fictícios na memória: ao atualizar ou fechar a página, as alterações desaparecem. A escolha de perfil não é autenticação real. Não informe dados pessoais ou senhas verdadeiras. As ofertas ilustrativas da home são exemplos separados das criadas na demonstração.

1. Em **Acesso demo**, escolha Mercado Boa Mesa. No painel, preencha a validade e publique a oferta de arroz.
2. Em **Trocar perfil**, escolha Instituição Mãos Unidas. Abra **Ofertas**, escolha a oferta e solicite parte dos quilos.
3. Volte ao perfil do mercado e inicie o atendimento no painel. A solicitação passa de `PENDENTE` para `EM_ANDAMENTO`. Em **Ver atendimento**, registre uma retirada.
4. Volte ao perfil da instituição e abra a mesma solicitação. Informe os quilos recebidos. Se forem iguais aos entregues, eles entram no saldo confirmado.
5. Volte ao mercado. Se faltar uma viagem, mantenha o atendimento em andamento e registre outra retirada. Quando terminar, conclua ou encerre parcialmente com justificativa. A oferta volta a ficar disponível se houver saldo.

Para demonstrar uma divergência, informe quantidades diferentes e uma justificativa. No perfil de administrador, informe os quilos conciliados por item e registre a resolução. Tudo continua sendo uma simulação.

## Preparação para a API Java e o Oracle

A comunicação seguirá este caminho:

```text
Telas React → funções em services → API Java/Spring Boot → JDBC → Oracle
```

O navegador não acessa o Oracle diretamente. A equipe Java deverá implementar a conexão e as regras de negócio, guardar as credenciais do banco no servidor, fornecer endpoints e configurar o CORS para permitir o endereço do front-end.

Quando a equipe Java fornecer a URL e o contrato da API:

1. Copie `.env.example` para `.env.local` e informe a URL pública da API em `VITE_API_URL`. Reinicie o Vite após alterar o arquivo.
2. Combine os caminhos, os campos JSON e os tipos de resposta com a equipe Java. O modelo SQL ajuda a entender os dados, mas não define sozinho o formato da API.
3. Use as funções de `src/services/api.ts` para implementar uma consulta GET e uma escrita POST reais, conforme o contrato. O cliente em `clienteHttp.ts` usa `fetch` e informa falhas de conexão, HTTP ou leitura da resposta.
4. Substitua os dados fictícios gradualmente e mostre carregamento, erro e lista vazia nas telas. Confirme o funcionamento com a API remota antes da entrega.

A URL é pública no navegador: **nunca coloque senhas, tokens ou credenciais do Oracle em variáveis `VITE_`**. O arquivo `.env.local` fica fora do Git. A configuração acima é apenas uma preparação: nenhuma tela usa a API ainda, e nenhuma conexão com o banco foi estabelecida.

## Páginas obrigatórias e navegação

A proposta é manter ofertas, necessidades e acesso em destaque no cabeçalho, como em um marketplace, e usar um menu **Conheça o Alimenta+** e o rodapé para as páginas institucionais. Cada uma precisa ter sua própria rota:

| Página | Como encaixar |
| --- | --- |
| Home (`/`) | Vitrine de alimentos, busca e explicação curta do projeto. |
| Sobre (`/sobre`) | Problema, propósito e funcionamento do Alimenta+. |
| Integrantes (`/integrantes`) | Apresentação dos integrantes e suas contribuições, com os dados fornecidos pelo grupo. |
| FAQ (`/faq`) | Dúvidas frequentes sobre doação, acesso e retiradas. |
| Contato (`/contato`) | Canais reais de contato e orientações para pedir ajuda. |

Além dessas páginas, a GS exige pelo menos duas páginas distintas para a solução; ofertas e necessidades podem cumprir esse papel. As quatro páginas institucionais acima ainda precisam ser implementadas e testadas. Não inventar nomes ou contatos.

## Conceitos para a apresentação

- **Componentes** são partes reutilizáveis da tela, como o cabeçalho e os cartões.
- **React Router** mostra páginas diferentes conforme o endereço; uma rota com parâmetro identifica, por exemplo, a oferta escolhida.
- **useState** guarda dados enquanto a aplicação está aberta, como o perfil e as ofertas. A home usa **useMemo** para filtrar seus exemplos.
- **Context e useContext** permitem que o cabeçalho leia o perfil fictício escolhido na demonstração sem precisar passar o nome por todas as páginas. Esse perfil não é um login real e é perdido ao atualizar a página.
- **Tailwind** oferece classes de estilo no JSX, inclusive para adaptar a interface a tamanhos diferentes.
- **TypeScript** descreve os dados, como oferta e solicitação, e ajuda a encontrar erros durante o desenvolvimento.
- A pasta **services** separa o acesso a dados das telas. A integração com a API Java ainda precisa ser feita.

## Entrega e trabalho em grupo

Ainda são necessários os links reais da aplicação na Vercel, da API Java e do vídeo, os nomes dos integrantes e um contato. Também é preciso testar mobile, tablet e desktop e entregar o ZIP sem `node_modules` no Portal do Aluno. A rubrica pede ao menos cinco commits por integrante e quinze no total, refletindo contribuições reais.

Depois do commit da etapa atual, o grupo pode combinar o Gitflow: `main` para a versão estável, `develop` para integração e branches `feature/...` para cada tarefa.

Repositório: https://github.com/NEXT-TECH-ALIMENTA-MAIS/FRONT-END-DESIGN-ENGINEERING

## Organização baseada no projeto da aula

Assim como no projeto usado em aula, cada página fica em sua própria pasta e a navegação usa React Router. Componentes reutilizados, como cabeçalho e rodapé, ficam em `src/components`, também em pastas próprias. A página `Demonstracao.tsx` reúne as rotas e os estados compartilhados do protótipo; os modelos e cálculos ficam em `src/data`. As páginas do painel ficam juntas por enquanto porque compartilham o mesmo fluxo.

Exemplo: `src/pages/ListaOfertas/ListaOfertas.tsx` contém a listagem, e `src/components/CardOferta/CardOferta.tsx` contém o cartão da home. Usamos nomes iguais aos das pastas para facilitar a identificação dos arquivos.
O `MainLayout` em `src/layouts` reúne o cabeçalho e o rodapé compartilhados por todas as páginas. A busca do cabeçalho direciona para a lista de ofertas da demonstração. Os links institucionais serão adicionados quando as páginas estiverem prontas.

## Painel da organização — primeira etapa

Branch: `feature/painel`, criada a partir de `develop`. Não há links no menu para este novo painel. A demonstração antiga em `/painel` continua separada.

Execute `npm run dev` e abra diretamente:

- Estabelecimento: http://localhost:5173/painel/estabelecimento
- Instituição: http://localhost:5173/painel/instituicao

Use o mesmo endereço base nas duas abas (não misture `localhost` e `127.0.0.1`), pois o armazenamento pertence à origem do site.

### O que está pronto

- Perfil com edição de nome, CNPJ, responsável, e-mail, telefone, endereço e descrição. Tipo, aprovação e situação da conta não são editáveis pelo cliente. O formato do CNPJ é verificado; a validação cadastral definitiva será da API.
- Listagem de ofertas próprias para estabelecimento e necessidades próprias para instituição.
- Negociações com filtros, contatos fictícios, orientações e histórico com autor e data de cada alteração.
- Início, recusa, cancelamento, múltiplas retiradas, confirmação independente de recebimento e conclusão total ou parcial.
- Um atendimento ativo por oferta; justificativa obrigatória nas exceções; divergências bloqueiam a conclusão.
- Persistência no `localStorage` e atualização entre abas do mesmo navegador. As alterações não são enviadas ao Java nem ao Oracle.

### Roteiro para testar

1. Abra o painel do estabelecimento e edite os dados em **Minha organização**. Atualize a página para verificar que continuam salvos.
2. Em **Minhas publicações**, confira a oferta de 50 kg de arroz.
3. Em **Negociações**, inicie o pedido de 20 kg da Instituição Mãos Unidas. O outro pedido permanece pendente.
4. Registre uma retirada de 20 kg. O saldo ainda aguarda a confirmação da instituição.
5. Em outra aba, abra `/painel/instituicao`, entre em **Negociações** e confirme 20 kg recebidos.
6. Volte ao estabelecimento: o histórico mostra a confirmação e o saldo passa a 30 kg. Conclua o atendimento para liberar a próxima solicitação.
7. Para testar várias viagens, entregue e confirme 10 kg por vez. Para testar divergência, informe valores diferentes com justificativa; esse caso ficará pendente, pois a análise administrativa deste painel ainda será integrada.

As solicitações e publicações desta primeira etapa são exemplos previamente cadastrados e separados do catálogo público. Abrir um contato no catálogo não cria automaticamente uma negociação aqui. Criação de publicações, novas solicitações pelo catálogo, login e integração administrativa serão conectados nas próximas etapas. Não há sincronização entre computadores. A URL permite testar um perfil, mas não é autenticação nem proteção de acesso.

### Como explicar o código

- `PainelCliente` organiza a página e suas três seções.
- `PerfilOrganizacao` contém o formulário; `NegociacaoPainel` apresenta cada solicitação e suas ações. Cada componente fica na pasta de mesmo nome.
- `useState` guarda o formulário, a seção selecionada e os dados exibidos.
- `useEffect` escuta alterações de armazenamento feitas em outra aba e remove esse evento ao sair da página.
- `src/data/painelCliente.ts` define os tipos e o cenário fictício.
- `src/services/painelCliente.ts` concentra leitura, gravação e regras de negociação. A API Java substituirá o armazenamento local e deverá validar novamente permissões e estoque. Somente o backend acessará o Oracle.

Validação: `npm run build`, `npm run lint` e `node --test tests/painelCliente.test.mjs` (Node 24). Os testes cobrem as regras e a persistência; não substituem a conferência visual em celular e desktop.
