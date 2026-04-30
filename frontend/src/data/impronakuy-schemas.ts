import { z } from 'zod'

export const IKRoundSchema = z.object({
  id: z.string(),
  roundNumber: z.number().int().positive(),
  status: z.enum(['open', 'closed']),
  votesA: z.number().int().min(0),
  votesB: z.number().int().min(0),
  winnerTeamId: z.string().nullable().optional(),
  isTie: z.boolean().optional(),
})

export const IKMatchTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
})

export const IKActiveMatchSchema = z
  .object({
    id: z.string(),
    teamA: IKMatchTeamSchema,
    teamB: IKMatchTeamSchema,
    currentRound: IKRoundSchema.nullable(),
    rounds: z.array(IKRoundSchema).optional().default([]),
    roundsWon: z.object({ teamA: z.number(), teamB: z.number() }),
    penalties: z
      .object({ teamA: z.number(), teamB: z.number() })
      .optional()
      .default({ teamA: 0, teamB: 0 }),
    status: z.enum(['pending', 'active', 'finished']),
    winnerTeamId: z.string().nullable().optional(),
  })
  .nullable()

export type IKRound = z.infer<typeof IKRoundSchema>
export type IKMatchTeam = z.infer<typeof IKMatchTeamSchema>
export type IKActiveMatch = z.infer<typeof IKActiveMatchSchema>
