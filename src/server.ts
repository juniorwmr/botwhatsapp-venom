import './utils/module-alias'

import { Message } from 'whatsapp-web.js'

import { logger } from '@/utils/logger'
import { WhatsappClient } from '@/lib/whatsapp'
import { getStage } from '@/stages'
import { prisma } from './lib/prisma'

interface MessageType extends Message {
  _data: {
    notifyName: string
  }
}

const whatsappClient = WhatsappClient.getInstance()

whatsappClient.init()

whatsappClient
  .onMessage(async (message: Message) => {
    const { from, _data, body } = message as MessageType

    const { stage, communication } = await getStage({
      from,
      notifyName: _data.notifyName,
    })

    logger.info(
      {
        from,
        message: body,
        stage: stage.description,
      },
      '📩 message received',
    )

    const { result } = await stage.exec({
      communication,
      body,
    })

    if (result && stage.nextStage) {
      await prisma.communication.update({
        where: {
          id: communication.id,
        },
        data: {
          stage: communication.nextStage,
          nextStage: stage.nextStage,
        },
      })
    }
  })
  .catch((e) => {
    logger.fatal({ error: e }, '❌ error')
  })
