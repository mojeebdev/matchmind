import { getModel, isGeminiConfigured } from './gemini'
import { isMongoConfigured } from './mongodb'
import { mcpQueryFootballData } from './mcp'
import { getMockDataForType, getMockResponse } from './mock-data'
import { generateResponseFromMongoData, isMongoDataEmpty } from './data-response'
import { sanitizeQueryPlan } from './query-safety'
import { getDefaultQueryForType } from './query-defaults'
import { validateAgentResponse } from './validation'
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

  try {
    const queryPlan = await generateMongoQuery(questionType, question)
    const mcpResult = await mcpQueryFootballData(queryPlan)

    if (mcpResult.records.length === 0) {
      console.info(
        `[MatchMind] Empty result from ${mcpResult.collection} — falling back to mock data`
      )
      return {
        mongoData: getMockDataForType(questionType, question),
        isLiveData: false,
      }
    }

    return {
      mongoData: { [mcpResult.collection]: mcpResult.records },
      isLiveData: true,
    }
  } catch (error) {
    console.warn('[MatchMind] MongoDB/MCP query failed — using mock data:', error)
    return {
      mongoData: getMockDataForType(questionType, question),
      isLiveData: false,
    }
  }
}

export async function analyzeFootballQuestion(
  question: string,
  questionType: QuestionType,
  mongoData: Record<string, unknown>,
  isLiveData: boolean
): Promise<AgentResponse> {
  if (!isGeminiConfigured()) {
    if (isMongoDataEmpty(mongoData)) {
      return getMockResponse(questionType, question)
    }
    return generateResponseFromMongoData(question, questionType, mongoData, {
      isLiveData,
      dataSource: isLiveData ? 'MongoDB Atlas' : 'Demo dataset',
    })
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

    const userPrompt = `Question: ${question}

Available data from MongoDB:
${JSON.stringify(mongoData, null, 2)}

Analyze this data and answer the question as a senior football analyst.`

    const result = await model.generateContent([systemPrompt, userPrompt])
    const text = result.response.text()

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    const validated = validateAgentResponse(parsed, questionType)
    if (validated) return validated

    console.warn('[MatchMind] Gemini response failed validation — using fallback')
    if (!isMongoDataEmpty(mongoData)) {
      return generateResponseFromMongoData(question, questionType, mongoData, {
        isLiveData,
      })
    }
    return getMockResponse(questionType, question)
  } catch {
    if (!isMongoDataEmpty(mongoData)) {
      return generateResponseFromMongoData(question, questionType, mongoData, {
        isLiveData,
      })
    }
    return getMockResponse(questionType, question)
  }
}

export async function processAgentQuestion(question: string): Promise<AgentResponse> {
  const questionType = await classifyQuestion(question)
  const { mongoData, isLiveData } = await fetchFootballData(questionType, question)
  const response = await analyzeFootballQuestion(
    question,
    questionType,
    mongoData,
    isLiveData
  )

  const final =
    validateAgentResponse(response, questionType) ?? getMockResponse(questionType, question)
  return { ...final, live_data: isLiveData }
}