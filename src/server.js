require('dotenv').config()

const { create } = require("venom-bot");
const database = require("./db");
const stages = require("./stages");
const { secundary_number } = require('./config');

function getStage(user) {
  if (database[user]) {
    return database[user].stage;
  } else {
    database[user] = {
      stage: 0,
      itens: [],
      address: '',
    };
    return database[user].stage;
  }
};

create().then((client) => start(client));

async function start(client) {
  await client.onMessage(async (message) => {
    const user = getStage(message.from);
    const resp = stages[user].stage.exec({user: message.from, message: message.body, client});
    if (user === 4) {
      await client.sendText(secundary_number, resp);
      await client.sendText(message.from, '✅ *Prontinho, pedido feito!* \n\nAgora, se você ainda não sabe o valor da taxa de entrega para sua região, vou te passar para um atendente para que ele verique o valor da *taxa de entrega*. \n\n⏳ *Aguarde um instante*.');
    } else if (user === 5) {
      await client.markUnseenMessage(message.from);
    } else {
      await client.sendText(message.from, resp);
    }
  })
  // close the connection with the client correctly  
  process.on('SIGINT', function() {
    console.log('oi');
    client.close();
  });
}



