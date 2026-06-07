import { getModel, isGeminiConfigured } from './gemini'
import { isMongoConfigured } from './mongodb'
import { mcpQueryFootballData } from './mcp'
import { getMockDataForType, getMockResponse } from './mock-data'
import { generateResponseFromMongoData, isMongoDataEmpty } from './data-response'
import { sanitizeQueryPlan } from './query-safety'
import { getDefaultQueryForType } from './query-defaults'
import { validateAgentResponse } from './validation'
import { formatUserContextBlock, type AgentUserContext } from './user-context'
import type { AgentResponse, MongoQueryPlan, QuestionType } from './types'

const VALID_TYPES: QuestionType[] = [
  'stats',
  'prediction',
  'fantasy',
  'tactical',
  'historical',
  'general',
]

function normalizeQuestionType(raw: string): QuestionType {
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z]/g, '')
  if (VALID_TYPES.includes(cleaned as QuestionType)) {
    return cleaned as QuestionType
  }
  return 'general'
}

function classifyLocally(question: string): QuestionType {
  const q = question.toLowerCase()
  if (/predict|win|chance|probability|outcome|forecast/.test(q)) return 'prediction'
  if (/fantasy|xi|lineup|pick|squad|team selection/.test(q)) return 'fantasy'
  if (/formation|tactic|press|strategy|defensive|weakness|system/.test(q)) return 'tactical'
  if (/history|head.to.head|h2h|past|record|previous|ever met/.test(q)) return 'historical'
  if (/stat|goal|assist|scorer|xg|top|leader|best|most/.test(q)) return 'stats'
  return 'general'
}

export async function classifyQuestion(question: string): Promise<QuestionType> {
  if (!isGeminiConfigured()) {
    return classifyLocally(question)
  }

  try {
    const model = getModel()
    const prompt = `You are a football question classifier. Return ONLY one word:
stats | prediction | fantasy | tactical | historical | general

Question: ${question}`

    const result = await model.generateContent(prompt)
    return normalizeQuestionType(result.response.text())
  } catch {
    return classifyLocally(question)
  }
}

export async function generateMongoQuery(
  questionType: QuestionType,
  question: string
): Promise<MongoQueryPlan> {
  const fallback = getDefaultQueryForType(questionType, question)

  if (!isGeminiConfigured()) {
    return fallback
  }

  try {
    const model = getModel()
    const prompt = `You are a MongoDB query generator for a football database.
Given a question type and user question, generate the optimal MongoDB aggregation pipeline to retrieve the most relevant data.

Database collections:
- matches: { homeTeam, awayTeam, score, date, stage, group, stats }
- players: { name, team, goals, assists, xG, minutes, position }
- teams: { name, group, form, possession, shotsOnTarget, cleanSheets }
- headToHead: { team1, team2, matches[], wins, draws, losses }

Return ONLY a valid JSON object with:
{
  "collection": "collection name",
  "pipeline": [ ...aggregation pipeline stages ]
}

Question type: ${questionType}
User question: ${question}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text) as MongoQueryPlan
    return sanitizeQueryPlan(parsed, fallback)
  } catch {
    return fallback
  }
}

async function fetchFootballData(
  questionType: QuestionType,
  question: string
): Promise<{ mongoData: Record<string, unknown>; isLiveData: boolean }> {
  if (!isMongoConfigured()) {
    console.info('[MatchMind] Demo mode — MongoDB not configured, using mock data')
    return {
      mongoData: getMockDataForType(questionType, question),
      isLiveData: false,
    }
  }

  const queryPlan = await generateMongoQuery(questionType, question)
  const mcpResult = await mcpQueryFootballData(queryPlan)

  if (mcpResult.records.length === 0) {
    console.info(`[MatchMind] Empty result from ${mcpResult.collection} — no mock fallback`)
  }

  return {
    mongoData: { [mcpResult.collection]: mcpResult.records },
    isLiveData: true,
  }
}

function buildDatabaseErrorResponse(
  question: string,
  questionType: QuestionType,
  error: unknown
): AgentResponse {
  const detail = error instanceof Error ? error.message : 'Unknown database error'
  return {
    question_type: questionType,
    headline: 'Database Query Failed',
    answer:
      `MatchMind could not query MongoDB Atlas for your question — "${question}". The live database is configured but the request failed.\n\nError: ${detail}\n\nPlease try again in a moment. If this persists, verify MONGODB_URI on the server and that the Atlas cluster is reachable.`,
    key_stats: [
      { label: 'Data source', value: 'MongoDB Atlas', context: 'Query did not complete' },
      { label: 'Status', value: 'Error', context: detail.slice(0, 80) },
    ],
    confidence: 'low',
    follow_up: 'Who are the top scorers in Group B?',
    data_sources: ['MongoDB Atlas'],
    live_data: false,
  }
}

export async function analyzeFootballQuestion(
  question: string,
  questionType: QuestionType,
  mongoData: Record<string, unknown>,
  isLiveData: boolean,
  userContext?: AgentUserContext
): Promise<AgentResponse> {
  if (!isGeminiConfigured()) {
    if (isMongoDataEmpty(mongoData)) {
      if (isMongoConfigured()) {
        return {
          ...generateResponseFromMongoData(question, questionType, mongoData, {
            isLiveData: true,
            dataSource: 'MongoDB Atlas',
          }),
          live_data: true,
        }
      }
      return getMockResponse(questionType, question)
    }
    return {
      ...generateResponseFromMongoData(question, questionType, mongoData, {
        isLiveData,
        dataSource: isLiveData ? 'MongoDB Atlas' : 'Demo dataset',
      }),
      live_data: isLiveData,
    }
  }

  try {
    const model = getModel()

    const systemPrompt = `You are MatchMind — an elite AI football analyst for World Cup 2026.
Return ONLY valid JSON in this exact shape:
{
  "question_type": "${questionType}",
  "headline": "punchy analyst headline",
  "answer": "full analyst response 2-4 paragraphs",
  "key_stats": [{ "label": "", "value": "", "context": "" }],
  "confidence": "high|medium|low",
  "follow_up": "suggested next question",
  "data_sources": []
}`

    const userPrompt = `${formatUserContextBlock(userContext)}Question: ${question}

Available data from MongoDB:
${JSON.stringify(mongoData, null, 2)}

Analyze this data and answer the question as a senior football analyst. When fan profile context is present, personalize examples and emphasis without inventing unsupported preferences.`

    const result = await model.generateContent([systemPrompt, userPrompt])
    const text = result.response.text()

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    const validated = validateAgentResponse(parsed, questionType)
    if (validated) return validated

    console.warn('[MatchMind] Gemini response failed validation — using fallback')
    if (!isMongoDataEmpty(mongoData)) {
      return {
        ...generateResponseFromMongoData(question, questionType, mongoData, { isLiveData }),
        live_data: isLiveData,
      }
    }
    if (isMongoConfigured()) {
      return {
        ...generateResponseFromMongoData(question, questionType, mongoData, {
          isLiveData: true,
          dataSource: 'MongoDB Atlas',
        }),
        live_data: true,
      }
    }
    return getMockResponse(questionType, question)
  } catch {
    if (!isMongoDataEmpty(mongoData)) {
      return {
        ...generateResponseFromMongoData(question, questionType, mongoData, { isLiveData }),
        live_data: isLiveData,
      }
    }
    if (isMongoConfigured()) {
      return {
        ...generateResponseFromMongoData(question, questionType, mongoData, {
          isLiveData: true,
          dataSource: 'MongoDB Atlas',
        }),
        live_data: true,
      }
    }
    return getMockResponse(questionType, question)
  }
}

export async function processAgentQuestion(
  question: string,
  userContext?: AgentUserContext
): Promise<AgentResponse> {
  const questionType = await classifyQuestion(question)

  let mongoData: Record<string, unknown>
  let isLiveData: boolean

  try {
    const fetched = await fetchFootballData(questionType, question)
    mongoData = fetched.mongoData
    isLiveData = fetched.isLiveData
  } catch (error) {
    console.warn('[MatchMind] MongoDB/MCP query failed:', error)
    return buildDatabaseErrorResponse(question, questionType, error)
  }

  const response = await analyzeFootballQuestion(
    question,
    questionType,
    mongoData,
    isLiveData,
    userContext
  )

  const validated = validateAgentResponse(response, questionType)
  if (validated) {
    return { ...validated, live_data: isMongoConfigured() ? true : isLiveData }
  }

  if (isMongoConfigured()) {
    return {
      ...generateResponseFromMongoData(question, questionType, mongoData, {
        isLiveData: true,
        dataSource: 'MongoDB Atlas',
      }),
      live_data: true,
    }
  }

  return { ...getMockResponse(questionType, question), live_data: false }
}