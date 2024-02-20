import { prisma } from '@/lib/prisma'
import { Communication } from '@prisma/client'

import { initialStage } from '.'

export type StageExecProps = {
  communication: Communication
  body?: string
}

type StageValue = '1' | '2' | '-1'

export const STAGES: Record<string, StageValue> = {
  FIRST: '1',
  SECOND: '2',
  FINAL: '-1',
}

export interface Stage {
  description: string
  exec: (props: StageExecProps) => Promise<{ result: boolean }>
  nextStage?: StageValue
}

type Stages = Record<StageValue, Stage>

export const stages: Stages = {
  '1': {
    description: 'Welcome',
    exec: initialStage.exec,
    nextStage: STAGES.SECOND,
  },
  '2': {
    description: 'Second Stage',
    exec: async () => {
      return {
        result: true,
      }
    },
    nextStage: STAGES.FINAL,
  },
  '-1': {
    description: 'End',
    exec: async () => {
      return {
        result: true,
      }
    },
  },
}

export const getStage = async ({
  from,
  notifyName,
}: {
  from: string
  notifyName: string
}): Promise<{ stage: Stage; communication: Communication }> => {
  // Find the last communication from the user in the 30 minutes
  let communication = await prisma.communication.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
    where: {
      phone: from,
      finishedAt: null,
    },
  })

  // If there is no communication, return the initial stage
  if (!communication) {
    communication = await prisma.communication.create({
      data: {
        name: notifyName,
        phone: from,
        stage: '0',
        nextStage: STAGES.FIRST,
      },
    })
  }

  const stage = stages[communication.nextStage as StageValue]
  if (!stage) {
    // If there is not next stage, throw an error
    throw new Error('Invalid stage')
  }

  return {
    stage,
    communication,
  }
}
