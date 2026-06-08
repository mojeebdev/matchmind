import type { MongoQueryPlan } from './types'

export const ALLOWED_COLLECTIONS = [
  'matches',
  'players',
  'teams',
  'headToHead',
  'groups',
  'tournament',
  'playerWorldCupCareers',
  'worldCupEditions',
  'worldCupRecords',
] as const

export type AllowedCollection = (typeof ALLOWED_COLLECTIONS)[number]

const BLOCKED_PIPELINE_STAGES = new Set([
  '$out',
  '$merge',
  '$unset',
  '$replaceWith',
])

export const MAX_PIPELINE_STAGES = 10

export function isAllowedCollection(
  collection: string
): collection is AllowedCollection {
  return (ALLOWED_COLLECTIONS as readonly string[]).includes(collection)
}

export function validateQueryPlan(plan: MongoQueryPlan): MongoQueryPlan | null {
  if (!plan || typeof plan !== 'object') return null
  if (!isAllowedCollection(plan.collection)) return null
  if (!Array.isArray(plan.pipeline)) return null
  if (plan.pipeline.length === 0 || plan.pipeline.length > MAX_PIPELINE_STAGES) {
    return null
  }

  for (const stage of plan.pipeline) {
    if (!stage || typeof stage !== 'object' || Array.isArray(stage)) {
      return null
    }
    for (const key of Object.keys(stage)) {
      if (BLOCKED_PIPELINE_STAGES.has(key)) {
        return null
      }
    }
  }

  return {
    collection: plan.collection,
    pipeline: plan.pipeline,
  }
}

export function sanitizeQueryPlan(
  plan: MongoQueryPlan,
  fallback: MongoQueryPlan
): MongoQueryPlan {
  return validateQueryPlan(plan) ?? fallback
}