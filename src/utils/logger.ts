import pino from 'pino'

const pinoPrettyTranporter = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:dd/mm/yyyy hh:MM:ss',
    ignore: 'pid',
  },
})

export const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pinoPrettyTranporter,
)
