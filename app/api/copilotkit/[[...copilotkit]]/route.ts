import { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

function buildModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022");
  }

  const apiKey =
    process.env.OPENAI_API_KEY ??
    process.env.OPENROUTER_API_KEY ??
    process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No AI API key found. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or OPENROUTER_API_KEY."
    );
  }

  const baseURL =
    process.env.AI_BASE_URL ??
    (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined);

  const openai = createOpenAI({ apiKey, baseURL });
  const modelName =
    process.env.AI_MODEL ??
    process.env.OPENAI_MODEL ??
    (process.env.OPENROUTER_API_KEY ? "anthropic/claude-3.5-sonnet" : "gpt-4o");

  return openai.chat(modelName);
}

function getEndpoint(req: NextRequest) {
  const model = buildModel();
  const runtime = new CopilotRuntime({
    agents: { default: new BuiltInAgent({ model }) },
  });
  return copilotRuntimeNextJSAppRouterEndpoint({ runtime, endpoint: "/api/copilotkit" });
}

export async function POST(req: NextRequest) {
  try {
    const { handleRequest } = getEndpoint(req);
    return handleRequest(req);
  } catch (err: any) {
    console.error("[CopilotKit] POST error:", err?.message);
    return new Response(err?.message ?? "Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { handleRequest } = getEndpoint(req);
    return handleRequest(req);
  } catch (err: any) {
    console.error("[CopilotKit] GET error:", err?.message);
    return new Response(err?.message ?? "Internal Server Error", { status: 500 });
  }
}
