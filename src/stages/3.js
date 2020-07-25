const database = require('../db');

module.exports = {
  exec({ user, message }) {
    database[user].address = message;
    database[user].stage = 4;

    if (message === '*') {
      database[user].stage = 0;
      return 'Pedido *CANCELADO* com sucesso. \n Volte Sempre!'
    }

    let desserts = "";
    const itens = database[user].itens;
    itens.map((item, index) => {
      if (index == itens.length - 1) {
        desserts += item.description + '.'
      } else {
        desserts += item.description + ', '
      }
    })
    const total = database[user].itens.length;
    return `🗒️ *RESUMO DO PEDIDO*: \n\n🧁 Sabores: *${desserts}* \n🚚 Taxa de entrega: *a confirmar*. \n📍 Endereço: *${message}* \n💰 Valor dos bolos: *${total*6},00 reais*. \n⏳ Tempo de entrega: *50 minutos*. \n\n` + "🔊 ```Agora, informe a forma de pagamento e se vai precisar de troco, por gentileza.```";
  }
};