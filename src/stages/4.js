const database = require('../db');

module.exports = {
  exec({ user, message }) {
    const address = database[user].address;
    const phone = user.split('@');
  
    database[user].stage = 5;
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
    return `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${phone[0]} \n🧁 Sabores: *${desserts}* \n📍 Endereço: *${address}* \n🚚 Taxa de entrega: *a confirmar*. \n💰 Valor dos bolos: *${total*6},00 reais*. \n⏳ Tempo de entrega: *50 minutos*. \n🛑 Detalhes: *${message}*`;
  }
};