import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

function buildPrompt(basics: Record<string, unknown>): string {
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

  return `You are an expert HR copywriter for Aareon, a European PropTech and SaaS company headquartered in the Netherlands. Write a professional job description for the following position.

Job details:
- Title: ${jobTitle}
${department ? `- Department: ${department}` : ''}
${location ? `- Location: ${location}` : ''}
${workMode ? `- Work mode: ${workMode}` : ''}
${employmentType ? `- Employment type: ${employmentType}` : ''}
${salaryRange ? `- Salary: ${salaryRange}` : ''}
${education ? `- Education requirement: ${education}` : ''}
${mustHaves ? `- Must-haves: ${mustHaves}` : ''}
${niceToHaves ? `- Nice-to-haves: ${niceToHaves}` : ''}
${additionalDetails ? `- Additional details: ${additionalDetails}` : ''}

Output the job description using EXACTLY these section markers in this order. No preamble, no text before [SUMMARY]:

[SUMMARY]
2-3 sentences describing the role and its business impact at Aareon.

[RESPONSIBILITIES]
5-7 key responsibilities, each on its own line prefixed with •

[REQUIREMENTS]
5-6 required qualifications (draw from must-haves and education level), each on its own line prefixed with •

[BENEFITS]
4-5 benefits Aareon offers${salaryRange ? ` (include salary range: ${salaryRange})` : ''}, each on its own line prefixed with •

Write in a direct, professional tone. Output only the section markers and content — nothing else.`;
}

export async function POST(req: NextRequest) {
  const basics = await req.json() as Record<string, unknown>;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const s = client.messages.stream({
          model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
          max_tokens: 2000,
          messages: [{ role: 'user', content: buildPrompt(basics) }],
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
