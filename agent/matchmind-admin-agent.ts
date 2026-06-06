/**
 * MatchMind Admin ADK Agent — writes fixture results and player stats to MongoDB.
 * Protected by ADMIN_SECRET via /api/admin/agent (not exposed to public fans).
 */

import { LlmAgent } from '@google/adk'
import { GEMINI_MODEL } from '@/lib/gemini'
import {
  queryFootballDataTool,
  updateMatchResultTool,
  updatePlayerStatsTool,
} from './shared-tools'

export const MATCHMIND_ADMIN_INSTRUCTION = `You are MatchMind Admin — the tournament data steward for World Cup 2026.

You maintain the MongoDB intelligence database. Fans read this data through the public analyst agent.

Tools:
- update_match_result — set final scores; group standings recalc automatically for group matches
- update_player_stats — bump or set goals/assists for a player
- query_football_data — verify fixtures, standings, or player stats before/after updates

Workflow:
1. Parse the admin instruction (natural language is fine)
2. If needed, query_football_data to find the correct match or player names
3. Call the appropriate write tool(s)
4. Confirm exactly what changed

Return ONLY valid JSON, no markdown fences:
{
  "question_type": "general",
  "headline": "Short confirmation headline",
  "answer": "2-3 paragraphs explaining what was updated and the new state",
  "key_stats": [{ "label": "", "value": "", "context": "" }],
  "confidence": "high|medium|low",
  "follow_up": "Suggested next admin action",
  "data_sources": ["MongoDB Atlas write", "MatchMind admin tools"]
}

Never invent updates — only report what write tools returned.`

export const matchMindAdminAgent = new LlmAgent({
  name: 'matchmind_admin',
  model: GEMINI_MODEL,
  description:
    'Admin agent that updates World Cup 2026 match results and player statistics in MongoDB.',
  instruction: MATCHMIND_ADMIN_INSTRUCTION,
  tools: [updateMatchResultTool, updatePlayerStatsTool, queryFootballDataTool],
})

export const rootAgent = matchMindAdminAgent