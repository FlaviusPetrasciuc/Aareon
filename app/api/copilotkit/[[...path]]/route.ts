import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY!,
  baseURL: process.env.LLM_BASE_URL,
});

const serviceAdapter = new OpenAIAdapter({
  openai,
  model: process.env.LLM_MODEL,
});

const runtime = new CopilotRuntime();

const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

export const GET = (req: NextRequest) => handleRequest(req);
export const POST = (req: NextRequest) => handleRequest(req);
export const PATCH = (req: NextRequest) => handleRequest(req);
export const DELETE = (req: NextRequest) => handleRequest(req);
