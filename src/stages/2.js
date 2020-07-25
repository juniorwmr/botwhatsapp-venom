const menu = require('../menu');
const database = require('../db');

module.exports = {
  exec({ user, message }) {
    const order = "\n-----------------------------------\n#️⃣ - ```FINALIZAR pedido``` \n*️⃣ - ```CANCELAR pedido```"
    if (message === '*') {
      database[user].stage = 0;
      database[user].itens = [];
      return '🔴 Pedido *CANCELADO* com sucesso. \n\n ```Volte Sempre!```'
    } else if (message === '#') {
      database[user].stage = 3;
      return '🗺️ Agora, informe o *ENDEREÇO*. \n ( ```Rua, Número, Bairro``` ) \n\n ' + "\n-----------------------------------\n*️⃣ - ```CANCELAR pedido```";
    } else {
      if (!menu[message]) {
        return `❌ *Código inválido, digite novamente!* \n\n ${order}`
      }
    }
  
    database[user].itens.push(menu[message]);
    
    return (`✅ *${menu[message].description}* adicionado com sucesso! \n\n` + "```Digite outra opção```: \n\n" + order)
  }
};