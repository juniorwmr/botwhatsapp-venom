import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const finalStage = {
  async exec({ from, message }) {
    const msg = message.trim().toUpperCase()

    const currentDate = new Date()
    const history = storage[from].finalStage

    if (history.endsIn < currentDate.getTime() || msg === 'ENCERRAR') {
      storage[from].stage = STAGES.INICIAL
      return VenomBot.getInstance().sendText({
        to: from,
        message: '🔚 *Atendimento encerrado* 🔚',
      })
    }

    storage[from].finalStage.endsIn = new Date().setSeconds(60) // more 1 minute of inactivity
  },
}
