import { logger } from '@/utils/logger'
import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  APP_NAME: z.string().default('app'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().url(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  logger.error(_env.error)
  throw new Error('Invalid environment variables')
}

export const env = _env.data
