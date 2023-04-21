import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageFour = {
  async exec({ from, message }) {
    const address = storage[from].address
    const phone = from.split('@')

    storage[from].stage = STAGES.FALAR_COM_ATENDENTE

    storage[from].finalStage = {
      startsIn: new Date().getTime(),
      endsIn: new Date().setSeconds(60), // 1 minute of inactivity
    }

    const itens = storage[from].itens
    const desserts = itens.map((item, index) => {
      if (index === itens.length - 1) {
        return item.description + '.'
      }
      return item.description + ', '
    })
    const total = storage[from].itens.length

    return `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${
      phone[0]
    } \n🧁 Sabores: *${desserts}* \n📍 Endereço: *${address}* \n🚚 Taxa de entrega: *a confirmar*. \n💰 Valor dos bolos: *${
      total * 6
    },00 reais*. \n⏳ Tempo de entrega: *50 minutos*. \n🛑 Detalhes: *${message}*`
  },
}
