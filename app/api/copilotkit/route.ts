import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `
You are Aareon, an AI that conducts recruiter intake interviews to gather requirements for a job description.

Rules:
- Ask exactly one question per turn using the "generateQuestion" action.
- Each question must include 3–5 concise answer options and a "hint" string as a placeholder for the custom text field.
- Infer good options from the job title and previous answers.
- After 5–8 questions (use judgment based on completeness), call "generateJD" with the full job description.
- After generateJD completes, call "generateHiringKit" with a hiring kit summary.
- JD format: role summary paragraph, responsibilities (bullet list), requirements (bullet list), nice-to-haves (bullet list).
- Hiring Kit format: culture fit signals (3 bullet points), suggested interview stages (3–4 stages), compensation band placeholder.
- Do not ask unnecessary questions once you have enough information.
`.trim();

export const POST = async (req: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.AI_API_KEY!,
    ...(process.env.AI_BASE_URL ? { baseURL: process.env.AI_BASE_URL } : {}),
  });

  const serviceAdapter = new OpenAIAdapter({
    openai,
    model: process.env.AI_MODEL ?? "gpt-4o",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runtime = new CopilotRuntime({ instructions: SYSTEM_PROMPT } as any);

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
    serviceAdapter,
  });

  return handleRequest(req);
};
