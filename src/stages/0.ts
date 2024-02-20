import { StageExecProps } from '@/stages/stages'
import { WhatsappClient } from '@/lib/whatsapp'

export const initialStage = {
  async exec({ communication }: StageExecProps): Promise<{ result: boolean }> {
    const message = `
      👋 Olá, ${communication.name}. Como vai?
      Eu sou Carlos, seu *assistente virtual*.
      *Posso te ajudar?* 🙋‍♂️
    `

    await WhatsappClient.getInstance().sendText({
      to: communication.phone,
      message,
    })

    return {
      result: true,
    }
  },
}
