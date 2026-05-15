import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.AI_API_KEY!,
    ...(process.env.AI_BASE_URL ? { baseURL: process.env.AI_BASE_URL } : {}),
  });

  const serviceAdapter = new OpenAIAdapter({
    openai,
    model: process.env.AI_MODEL ?? "gpt-4o",
  });

  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
    serviceAdapter,
  });

  return handleRequest(req);
};
