

# Tbot-challenge

Seja bem vindo ao meu projeto, sou Matheus Alves e esse projeto foi feito para concorrer a vaga de desenvolvedor Fullstack.

## Especificações

O Back-end possui algumas subdivisões em sua estrutura, visto que ele necessitava receber as mensagens da API do Telegram (via pulling, porque é a maneira mais otimizada e segura)
e realizar outras operações com essas mensagens, além de ter que mandar as mensagens novas para o Front-End ao mesmo tempo.

O Back-end foi divido entre sete pastas no diretório principal:

- Bot: pasta que contém o singleton para gerenciamento de criação de instância (uma instância por vez) do Bot do telegram

- Config: pasta que contém as configurações referentes a conexão com banco de dados. É aqui que deverão ser feitas mudanças, caso a aplicação necessite conectar a outra base de dados no MongoDB Atlas.

- Controllers: É onde são definidas todas as operações/funções referentes ao fluxo de dados das rotas.

- Middleware: É onde fica o Middleware de autenticação, para não permitir o acesso não autenticado a rotas protegidas.

- Models: É a pasta que guarda o lugar onde são modeladas as coleções de usuários, chats e mensagens

- Routes: Pasta que contém todas as rotas da aplicação

- Sockets: É onde fica a criação do websocket para transmissão das mensagens

### Webhook

Para receber as mensagens da API do telegram foi necessário criar um webhook com o Ngrok (tecnologia escolhida para essa função) utilizando a técnica do pulling para o webhook receber mensagens novas, a todo momento em que eram enviadas, e passá-las para as rotas do Back-End e/ou realizar requisições ao banco de dados para salvá-las.

### Websocket

Para passar as mensagens recebidas do Back-End para o Front-End foi necessário criar um websocket em que o Front-End, ao carregar a tela de mensagens irá se conectar como cliente, e ao tratar as mensagens recebidas do webhook, vai passá-las para o socket que irá distribuir todas as novas mensagens para todos os clientes que estiverem conectados (no caso, apenas a aba que será testada ou a que está hospedada).

### MongoDB Atlas

Foi o banco de dados NoSQL escolhido para guardar as informações da aplicação, que possui acesso via Web e não possui gastos iniciais para ser utilizado. A database deve ser criada antes de realizar a criação das coleções (que são criadas automaticamente devido a utilização do ORM mongoose). A aplicação irá utilizar três coleções, sendo elas uma para os usuários (users), uma para as conversas (chats) e outra para as mensagens em si (messages).

## Funcionamento da aplicação

### Telegram Bot API

Crie um bot para testar o sistema com o botFather do telegram e pegue o token que ele te oferecer. Guarde o token do bot em seu arquivo .env como o "TOKEN" no arquivo mostrado mais abaixo.

### MongoDB Atlas 

Crie uma conta no mongoDB para utilizar o Atlas, realize as configurações iniciais (criação de conta, de acesso remoto, referente ao endereço IP) e depois mude as configurações (.env) que necessitam das informações no banco de dados.

Obs.: Não seria muito correto disponibilizar meu acesso ao meu banco de dados, pois se fosse o caso deveria disponibilizar o acesso a qualquer pessoas com a conta, e o repositório está público.

### Ngrok (webhook)

Crie uma conta e baixe a aplicação do ngrok para rodá-la na sua máquina para transmitir as atualizações do telegram via pulling.

Site: https://ngrok.com/

Depois de configurar a sua conta e baixar o aplicativo, deszipe (unzipe) o arquivo zipado e abra o aplicativo.

Salve a configuraçõa da sua chave com o comando a seguir:

```bash
  ngrok config add-authtoken ****** (seu token em "*")
```

Após isso rode a aplicação com o comando:

```bash
  ngrok http 80
```

Deixe ela rodando enquanto utilizar o sistema completo.

Obs.: Copie o link que o aplicativo oferece do HTTPS para colocar na variável SERVER_URL do arquivo .env

### Back-end e websocket

Realize o git clone do projeto e rode o comando npm i no terminal que desejar antes de iniciar a aplicação.

```bash
  npm install
```

Depois crie um arquivo .env na raíz do projeto com as informações necessárias para o funcionamento da aplicação.

Ex.:

```bash
DB_USER=***** // Conta da aplicação no mongoDB Atlas
DB_PASS=***** // Senha da aplicação no mongoDB Atlas
SERVER_URL=***** // URL disponivel no terminal do Ngrok
TOKEN=***** // Token do bot utilizado no desenvolvimento
SECRET_KEY="MyS&cr&tK&yT0t@llyR@nd0m" // Chave para criação de tokens de autenticação
```

Após isso rode o projeto com o comando npm start.

```bash
  nodemon index ou node index.js
```

E pronto, o projeto já o Back-end já vai estar funcional e pode ser testado tanto em aplicativos de realizar requisições HTTP, como no Front-End (se estiver rodando).

### Telegram Bot API

Depois de tudo isso, no Front-End, inicie uma conversa com o bot no telegram e veja o resultado no sistema (com tudo rodando).

- Criando novo chat: Um novo código será recebido e salvo no banco de dados. Assim surgirá um novo chat no lado esquerdo do site com o link para a conversa daquele chat. Utilize o refresh no icone de seta roxa do lado do "ChatId" para recarregar. Obs.: Se houver algum erro ao fazer isso apenas recarregue a página.

- Recebendo mensagens do telegram: Digite as mensagens pelo chat do telegram e veja o resultado no Front-End, sem precisar recarregar a página. 

- Enviando mensagens para o telegram: Envie a mensagem pela própria interface do Front-End e veja o resultado no Front-End e no telegram.
    
## Bibliotecas utilizadas

**axios:**
Axios é uma biblioteca cliente HTTP popular para fazer solicitações de um navegador da web ou Node.js. Ele fornece uma maneira simples e eficiente de fazer solicitações HTTP, incluindo GET, POST, PUT e DELETE, para interagir com APIs e serviços da web.

**bcrypt:**
Bcrypt é uma biblioteca para hash e salga de senhas com segurança. É comumente usado em aplicativos da web para armazenar senhas de usuários com segurança, criptografando-as antes do armazenamento, dificultando a engenharia reversa da senha original pelos invasores.

**body-parser:**
Body-parser é um middleware para Express.js que analisa o corpo da solicitação e o torna acessível como um objeto no objeto da solicitação. Ele simplifica o processamento de dados enviados no corpo da solicitação HTTP, como dados de formulário ou cargas JSON.

**cors:**
CORS (Cross-Origin Resource Sharing) é uma biblioteca para Express.js que permite o compartilhamento controlado de recursos entre diferentes origens (domínios) por meio de cabeçalhos HTTP. É essencial ao lidar com aplicações web que fazem solicitações a APIs em domínios diferentes.

**dotenv:**
Dotenv é um módulo Node.js de dependência zero que carrega variáveis ​​de ambiente de um arquivo .env em process.env. É comumente usado para gerenciar definições de configuração em aplicativos Node.js.

**express:**
Express é uma estrutura de aplicativo da web popular para Node.js. Ele simplifica a criação de aplicativos da web, fornecendo uma variedade de recursos e ferramentas para a construção de APIs e servidores da web robustos e escaláveis.

**jsonwebtoken:**
JSON Web Token (JWT) é uma biblioteca para codificar declarações em um formato JSON e assiná-las. É comumente usado para autenticação de usuário em aplicativos da web. Os JWTs permitem a transferência segura de informações entre as partes de forma compacta e independente.

**mongoose:**
Mongoose é uma biblioteca Object Data Modeling (ODM) para MongoDB e Node.js. Ele simplifica o trabalho com bancos de dados MongoDB, fornecendo uma maneira estruturada e baseada em esquema de interagir com os dados.

**soquete.io:**
Socket.io é uma biblioteca para construção de aplicações em tempo real. Ele permite a comunicação bidirecional em tempo real entre o servidor e os clientes, permitindo que os aplicativos enviem eventos e atualizações instantaneamente.

**telegraf:**
Telegraf é uma biblioteca API Telegram Bot moderna e fácil de usar para Node.js. Simplifica o desenvolvimento de bots do Telegram, fornecendo uma API expressiva e intuitiva.

**ws:**
ws (WebSocket) é uma biblioteca eficiente e simples de usar para criar servidores e clientes WebSocket em Node.js. WebSocket é um protocolo de comunicação que permite a comunicação full-duplex em tempo real entre um cliente e um servidor, adequado para aplicações como chat e jogos.
