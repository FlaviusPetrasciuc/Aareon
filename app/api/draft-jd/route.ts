import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

type DraftStyle = 'standard' | 'extensive' | 'short' | 'informal';

function buildPrompt(basics: Record<string, unknown>, style: DraftStyle): string {
  const jobTitle = (basics.jobTitle as string) || 'this role';
  const department = (basics.department as string) || '';
  const location = (basics.location as string) || '';
  const workMode = (basics.workMode as string) || '';
  const employmentType = (basics.employmentType as string) || '';
  const salaryMin = basics.salaryMin ?? '';
  const salaryMax = basics.salaryMax ?? '';
  const currency = (basics.currency as string) || 'EUR';
  const salaryRange = salaryMin && salaryMax ? `${currency} ${salaryMin}–${salaryMax} per month` : '';
  const education = (basics.education as string) || '';
  const mustHaves = (basics.mustHaves as string) || '';
  const niceToHaves = (basics.niceToHaves as string) || '';
  const additionalDetails = (basics.additionalDetails as string) || '';

  const jobDetails = `Job details:
- Title: ${jobTitle}
${department ? `- Department: ${department}` : ''}
${location ? `- Location: ${location}` : ''}
${workMode ? `- Work mode: ${workMode}` : ''}
${employmentType ? `- Employment type: ${employmentType}` : ''}
${salaryRange ? `- Salary: ${salaryRange}` : ''}
${education ? `- Education requirement: ${education}` : ''}
${mustHaves ? `- Must-haves: ${mustHaves}` : ''}
${niceToHaves ? `- Nice-to-haves: ${niceToHaves}` : ''}
${additionalDetails ? `- Additional details: ${additionalDetails}` : ''}`;

  const markers = `Output the job description using EXACTLY these section markers in this order. Write the ENTIRE job description in Dutch (Nederlands). All content under each marker must be written in Dutch. No preamble, no text before [SUMMARY]:`;

  if (style === 'short') {
    return `You are an expert HR copywriter for Aareon, a European PropTech and SaaS company. Write a concise, to-the-point job description in Dutch (Nederlands).

${jobDetails}

${markers}

[SUMMARY]
1-2 sentences in Dutch — role and main purpose only.

[RESPONSIBILITIES]
3-4 core responsibilities in Dutch, each on its own line prefixed with •

[REQUIREMENTS]
3-4 must-have qualifications in Dutch, each on its own line prefixed with •

[BENEFITS]
2-3 key benefits Aareon offers in Dutch${salaryRange ? ` (include salary range: ${salaryRange})` : ''}, each on its own line prefixed with •

Be brief and direct. Output only the section markers and content in Dutch — nothing else.`;
  }

  if (style === 'extensive') {
    return `You are an expert HR copywriter for Aareon, a European PropTech and SaaS company. Write a comprehensive, in-depth job description in Dutch (Nederlands).

${jobDetails}

${markers}

[SUMMARY]
4-5 sentences in Dutch — rich overview of the role, its strategic importance, team context, and candidate impact.

[RESPONSIBILITIES]
10-12 detailed responsibilities in Dutch, each on its own line prefixed with •. Include day-to-day tasks and long-term ownership areas.

[REQUIREMENTS]
8-10 qualifications in Dutch (must-haves, nice-to-haves, education), each on its own line prefixed with •. Clearly separate hard skills, soft skills, and experience levels.

[BENEFITS]
6-8 benefits Aareon offers in Dutch${salaryRange ? ` (include salary range: ${salaryRange})` : ''}, each on its own line prefixed with •. Include culture, growth opportunities, and perks.

Write in a compelling tone in Dutch that sells the role. Output only the section markers and content in Dutch — nothing else.`;
  }

  if (style === 'informal') {
    return `You are an HR copywriter for Aareon, a European PropTech and SaaS company. Write a friendly, approachable job description in Dutch (Nederlands) that feels human and welcoming — not corporate.

${jobDetails}

${markers}

[SUMMARY]
2-3 sentences in Dutch in a warm, conversational tone. Talk directly to the candidate using informal Dutch pronouns ("je" / "jij" / "jouw").

[RESPONSIBILITIES]
5-7 responsibilities in Dutch written casually, each on its own line prefixed with •. Use plain language, avoid jargon.

[REQUIREMENTS]
4-6 qualifications in Dutch in a non-intimidating way, each on its own line prefixed with •. Lead with what matters most, not a laundry list.

[BENEFITS]
4-5 benefits in Dutch${salaryRange ? ` (include salary range: ${salaryRange})` : ''}, each on its own line prefixed with •. Sound genuine, not like a PR brochure.

Keep it human and friendly. Output only the section markers and content in Dutch — nothing else.`;
  }

  return `You are an expert HR copywriter for Aareon, a European PropTech and SaaS company headquartered in the Netherlands. Write a professional job description in Dutch (Nederlands) for the following position.

${jobDetails}

${markers}

[SUMMARY]
2-3 sentences in Dutch describing the role and its business impact at Aareon.

[RESPONSIBILITIES]
5-7 key responsibilities in Dutch, each on its own line prefixed with •

[REQUIREMENTS]
5-6 required qualifications in Dutch (draw from must-haves and education level), each on its own line prefixed with •

[BENEFITS]
4-5 benefits Aareon offers in Dutch${salaryRange ? ` (include salary range: ${salaryRange})` : ''}, each on its own line prefixed with •

Write in a direct, professional tone in Dutch. Output only the section markers and content in Dutch — nothing else.`;
}

const maxTokens: Record<DraftStyle, number> = {
  short: 1000,
  standard: 2000,
  extensive: 4000,
  informal: 2000,
};

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;
  const { style, ...basics } = body;
  const draftStyle: DraftStyle = (style as DraftStyle) || 'standard';

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const s = client.messages.stream({
          model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
          max_tokens: maxTokens[draftStyle],
          messages: [{ role: 'user', content: buildPrompt(basics, draftStyle) }],
        });

        for await (const chunk of s) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(enc.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
