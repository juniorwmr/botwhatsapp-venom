import { menu } from '../menu.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageTwo = {
  async exec({ from, message }) {
    const order =
      '\n-----------------------------------\n#️⃣ - ```FINALIZAR pedido``` \n*️⃣ - ```CANCELAR pedido```'

    switch (message) {
      case '*': {
        storage[from].stage = STAGES.INICIAL
        storage[from].itens = []

        return '🔴 Pedido *CANCELADO* com sucesso. \n\n ```Volte Sempre!```'
      }
      case '#': {
        storage[from].stage = STAGES.RESUMO

        return (
          '🗺️ Agora, informe o *ENDEREÇO*. \n ( ```Rua, Número, Bairro``` ) \n\n ' +
          '\n-----------------------------------\n*️⃣ - ```CANCELAR pedido```'
        )
      }
      default: {
        if (!menu[message]) {
          return `❌ *Código inválido, digite novamente!* \n\n ${order}`
        }
      }
    }

    storage[from].itens.push(menu[message])

    return (
      `✅ *${menu[message].description}* adicionado com sucesso! \n\n` +
      '```Digite outra opção```: \n\n' +
      order
    )
  },
}
