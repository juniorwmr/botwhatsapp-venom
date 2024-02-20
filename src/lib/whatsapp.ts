import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { logger } from '@/utils/logger'

export namespace WhatsappClient {
  export interface CreateOptions {
    authStrategy: LocalAuth
  }
}

export class WhatsappClient {
  private static instance?: WhatsappClient
  private client?: Client
  private qr?: string
  private connected = false

  private constructor() {}

  static getInstance(): WhatsappClient {
    if (WhatsappClient.instance === undefined) {
      WhatsappClient.instance = new WhatsappClient()
    }
    return WhatsappClient.instance
  }

  get getQR() {
    return this.qr
  }

  init() {
    logger.info('⏳ Initializing...')
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'client-one' }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
    })

    this.client.on('qr', (qr) => {
      this.qr = qr
      qrcode.generate(qr, { small: true })
    })

    this.client.on('ready', () => {
      logger.info('✅ Ready...')
      this.connected = true
    })

    this.client.on('disconnected', () => {
      logger.info('❌ Disconnected...')
      this.connected = false
    })

    this.client.on('authenticated', () => {
      logger.info('🔑 Authenticated...')
      this.connected = true
    })

    this.client.initialize()
  }

  async onMessage(fn: (message: WAWebJS.Message) => void) {
    if (!this.client) throw new Error('WhatsappClient not initialized.')
    this.client.on('message', fn)
  }

  async sendText({ to, message }: { to: string; message: string }) {
    if (!this.client || !this.connected) {
      throw new Error('WhatsappClient not initialized.')
    }
    return await this.client.sendMessage(to, message)
  }

  async markUnseenMessage({ to }: { to: string }) {
    if (!this.client) throw new Error('WhatsappClient not initialized.')
    return await this.client.markChatUnread(to)
  }
}
