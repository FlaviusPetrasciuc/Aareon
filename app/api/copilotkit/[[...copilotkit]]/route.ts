import { 
  CopilotRuntime, 
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";

async function getRuntime(req: Request) {
  let agentConfig: any;

  if (process.env.ANTHROPIC_API_KEY) {
    agentConfig = {
      model: process.env.ANTHROPIC_MODEL || "anthropic/claude-3-5-sonnet-20240620",
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  } else if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    agentConfig = {
      model: process.env.GOOGLE_MODEL || "google/gemini-1.5-pro",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    };
  } else if (process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    const baseURL = process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY 
      ? "https://openrouter.ai/api/v1" 
      : undefined;

    const openai = createOpenAI({
      apiKey,
      baseURL,
      compatibility: 'compatible', // Better compatibility with OpenRouter/Gemini
    });

    const modelName = process.env.OPENAI_MODEL || (process.env.OPENROUTER_API_KEY ? "anthropic/claude-3.5-sonnet" : "openai/gpt-4o");

    agentConfig = {
      model: openai.chat(modelName),
    };
  } else {
    throw new Error("Missing AI API Key (OpenAI, Anthropic, or Google)");
  }

  const runtime = new CopilotRuntime({
    agents: {
      default: new BuiltInAgent(agentConfig),
    },
  });

  return copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { handleRequest } = await getRuntime(req);
    return handleRequest(req);
  } catch (error: any) {
    console.error("CopilotKit Runtime Error [POST]:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { handleRequest } = await getRuntime(req);
    return handleRequest(req);
  } catch (error: any) {
    console.error("CopilotKit Runtime Error [GET]:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
