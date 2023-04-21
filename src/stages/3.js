import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageThree = {
  async exec({ from, message, client }) {
    storage[from].address = message
    storage[from].stage = STAGES.PEDIDO

    if (message === '*') {
      storage[from].stage = STAGES.INICIAL
      return 'Pedido *CANCELADO* com sucesso. \n Volte Sempre!'
    }

    const itens = storage[from].itens
    const desserts = itens.map((item, index) => {
      if (index === itens.length - 1) {
        return item.description + '.'
      }
      return item.description + ', '
    })

    const total = storage[from].itens.length

    await client.sendText(
      message.from,
      `🗒️ *RESUMO DO PEDIDO*: \n\n🧁 Sabores: *${desserts}* \n🚚 Taxa de entrega: *a confirmar*. \n📍 Endereço: *${message}* \n💰 Valor dos bolos: *${
        total * 6
      },00 reais*. \n⏳ Tempo de entrega: *50 minutos*. \n\n` +
        '🔊 ```Agora, informe a forma de pagamento e se vai precisar de troco, por gentileza.```',
    )

    return '✅ *Prontinho, pedido feito!* \n\nAgora, se você ainda não sabe o valor da taxa de entrega para sua região, vou te passar para um atendente para que ele verique o valor da *taxa de entrega*. \n\n⏳ *Aguarde um instante*.'
  },
}
