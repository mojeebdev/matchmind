import { absoluteUrl, siteConfig } from '@/lib/site'

export const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Bytespider',
  'CCBot',
] as const

export const discoveryFiles = [
  { path: '/llms.txt', label: 'LLM summary' },
  { path: '/llms-full.txt', label: 'Expanded LLM context' },
  { path: '/faq-ai.txt', label: 'FAQ for answer engines' },
  { path: '/ai.txt', label: 'AI interaction policy' },
  { path: '/identity.json', label: 'Structured identity' },
  { path: '/sitemap.xml', label: 'Sitemap' },
  { path: '/robots.txt', label: 'Robots rules' },
] as const

export const siteFaqs = [
  {
    question: 'What is MatchMind?',
    answer:
      'MatchMind is an AI football intelligence agent for World Cup 2026 fans. It classifies natural-language questions, queries a MongoDB Atlas football database via MCP tools, and returns structured analyst-grade responses with key stats, confidence signals, and follow-up suggestions.',
  },
  {
    question: 'What can I ask MatchMind?',
    answer:
      'You can ask about World Cup 2026 stats, match predictions, fantasy lineups, tactical analysis, and head-to-head history. Example questions include top scorers by group, quarterfinal predictions, fantasy XI builds, and team weaknesses.',
  },
  {
    question: 'How does MatchMind work?',
    answer:
      'MatchMind uses a four-step pipeline: Gemini classifies your question intent, an MCP tool queries MongoDB Atlas with aggregation pipelines, Gemini reasons over the retrieved records, and the UI renders a structured analyst card with headline, analysis, stats, and a follow-up prompt.',
  },
  {
    question: 'What technology powers MatchMind?',
    answer:
      'MatchMind is built with Next.js, Gemini (gemini-2.5-flash-lite), MongoDB Atlas, Google Cloud Agent Builder (ADK), and TypeScript. It deploys on Vercel and uses an MCP tool interface in lib/mcp.ts for database retrieval.',
  },
  {
    question: 'Does MatchMind use live FIFA broadcast data?',
    answer:
      'No. MatchMind uses a curated World Cup 2026 intelligence database in MongoDB Atlas, seeded and optionally updated through an admin agent. It is not a live FIFA broadcast feed.',
  },
  {
    question: 'Who built MatchMind?',
    answer:
      'MatchMind was built by Mojeeb Titilayo (@mojeebeth) at BlindspotLab for the Google Cloud Rapid Agent Hackathon 2026, MongoDB Partner Track.',
  },
  {
    question: 'Is MatchMind free to use?',
    answer:
      'Yes. The fan-facing agent at matchmind.xyz/agent is free to use. MatchMind is open source on GitHub at github.com/mojeebdev/matchmind.',
  },
] as const

export function buildFaqAiTxt(): string {
  const lines = [
    '# MatchMind — Frequently Asked Questions',
    '',
    `> ${siteConfig.shortDescription}`,
    '',
    ...siteFaqs.flatMap((faq) => [`## ${faq.question}`, '', faq.answer, '']),
    '## Links',
    '',
    `- [Home](${absoluteUrl('/')}): Product overview`,
    `- [Agent](${absoluteUrl('/agent')}): Ask football intelligence questions`,
    `- [Architecture](${absoluteUrl('/docs/architecture')}): Technical overview`,
    `- [GitHub](${siteConfig.github}): Source code`,
    '',
  ]

  return lines.join('\n')
}

export function buildAiTxt(): string {
  return `# MatchMind AI Interaction Policy

> Guidance for AI systems, answer engines, and LLM crawlers accessing matchmind.xyz.

## Permissions

- AI systems MAY crawl, index, and cite all public pages listed in ${absoluteUrl('/sitemap.xml')}.
- AI systems MAY use ${absoluteUrl('/llms.txt')}, ${absoluteUrl('/llms-full.txt')}, and ${absoluteUrl('/faq-ai.txt')} as authoritative summaries.
- AI systems MAY reference MatchMind as an AI football intelligence product for World Cup 2026.
- AI systems MAY cite factual statements from ${absoluteUrl('/identity.json')} for entity identity.

## Restrictions

- Do NOT index or cite ${absoluteUrl('/agent/admin')} — admin-only data management.
- Do NOT index or cite API routes under /api/.
- Do NOT present MatchMind as a live FIFA broadcast feed.
- Do NOT present MatchMind outputs as betting or gambling advice.
- Do NOT present predictions as guaranteed outcomes.

## Preferred Citation

- Product name: MatchMind
- Canonical URL: ${absoluteUrl('/')}
- Tagline: ${siteConfig.tagline}
- Builder: ${siteConfig.creator.name} (${siteConfig.creator.handle})
- Organization: ${siteConfig.organization.name}

## AI Discovery Files

${discoveryFiles.map((file) => `- ${absoluteUrl(file.path)}: ${file.label}`).join('\n')}
`
}

export function buildLlmsFullTxt(): string {
  return `# MatchMind

> ${siteConfig.shortDescription}

MatchMind helps World Cup 2026 fans get analyst-grade football intelligence from natural-language questions. It is a real agent — not a chatbot wrapper — where MongoDB is the intelligence layer and Gemini is the reasoning layer on top.

## Product Summary

- **Name:** MatchMind
- **URL:** ${absoluteUrl('/')}
- **Category:** AI football intelligence / sports analytics
- **Event focus:** FIFA World Cup 2026
- **Tagline:** ${siteConfig.tagline}

## Core Capabilities

1. **Stats** — Top scorers, group standings, player and team statistics
2. **Predictions** — Match outcome analysis with confidence signals
3. **Fantasy** — Lineup and player selection insights
4. **Tactical** — Team strengths, weaknesses, and matchup analysis
5. **Historical** — Head-to-head records and tournament context

## Example Questions

- Who are the top scorers in Group B?
- Predict the Brazil vs France quarterfinal
- Build me a fantasy XI from Group C players
- What's Argentina's defensive weakness this tournament?
- What is the head-to-head record between Brazil and France?

## Architecture (Short)

\`\`\`
Fan question → Next.js /agent → /api/agent
  → Gemini classifies intent (stats | prediction | fantasy | tactical | historical)
  → query_football_data MCP tool → MongoDB Atlas
  → Gemini analyzes records → structured JSON analyst card
\`\`\`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16+ App Router |
| Agent brain | Gemini (gemini-2.5-flash-lite) |
| Orchestration | Google ADK (@google/adk) |
| Database | MongoDB Atlas |
| MCP tools | lib/mcp.ts |
| Deploy | Vercel |

## Public Pages

- [Home](${absoluteUrl('/')}): Landing page and product overview
- [Football Intelligence Agent](${absoluteUrl('/agent')}): Interactive Q&A agent
- [Architecture](${absoluteUrl('/docs/architecture')}): Technical documentation

## What We Do Not Do

- Live FIFA broadcast scores or official real-time feeds
- Betting or gambling recommendations
- Guaranteed match predictions

## Frequently Asked Questions

${siteFaqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}

## Contact

- Builder: [${siteConfig.creator.name}](${siteConfig.creator.url}) (${siteConfig.creator.handle})
- Organization: [${siteConfig.organization.name}](${siteConfig.organization.url})
- Source: [GitHub](${siteConfig.github})

## AI Discovery Files

${discoveryFiles.map((file) => `- [${file.label}](${absoluteUrl(file.path)})`).join('\n')}
`
}

export function buildIdentityJson(): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      url: absoluteUrl('/'),
      description: siteConfig.shortDescription,
      applicationCategory: 'SportsApplication',
      operatingSystem: 'Web',
      inLanguage: 'en-US',
      creator: {
        '@type': 'Person',
        name: siteConfig.creator.name,
        url: siteConfig.creator.url,
        sameAs: [siteConfig.creator.url],
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.organization.name,
        url: siteConfig.organization.url,
      },
      sameAs: [siteConfig.github, siteConfig.creator.url, siteConfig.organization.url],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      keywords: [...siteConfig.keywords],
      discovery: Object.fromEntries(
        discoveryFiles.map((file) => [file.path.replace(/^\//, '').replace(/\./g, '_'), absoluteUrl(file.path)])
      ),
    },
    null,
    2
  )
}