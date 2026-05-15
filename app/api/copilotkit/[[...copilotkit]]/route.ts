import { 
  CopilotRuntime, 
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";

async function getRuntime(req: Request) {
  let agentConfig: any;

  const apiKey = process.env.ANTHROPIC_API_KEY || 
                 process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                 process.env.OPENAI_API_KEY || 
                 process.env.OPENROUTER_API_KEY || 
                 process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing AI API Key (AI_API_KEY, OPENAI_API_KEY, etc.)");
  }

  if (process.env.ANTHROPIC_API_KEY) {
    agentConfig = {
      model: process.env.ANTHROPIC_MODEL || "anthropic/claude-3-5-sonnet-20240620",
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  } else if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.AI_BASE_URL) {
    agentConfig = {
      model: process.env.GOOGLE_MODEL || "google/gemini-1.5-pro",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    };
  } else {
    // OpenAI compatible (including OpenRouter, Gemini via OpenAI API, etc.)
    const baseURL = process.env.AI_BASE_URL || 
                    (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined);
    
    const openai = createOpenAI({
      apiKey,
      baseURL,
      compatibility: 'compatible',
    });

    const defaultModel = process.env.OPENROUTER_API_KEY ? "anthropic/claude-3.5-sonnet" : "gpt-4o";
    const modelName = process.env.AI_MODEL || process.env.OPENAI_MODEL || defaultModel;

    console.log("CopilotKit Runtime: Using OpenAI-compatible provider", { 
      modelName, 
      baseURL, 
      hasApiKey: !!apiKey 
    });

    agentConfig = {
      model: openai.chat(modelName),
    };
  }

  console.log("CopilotKit Runtime: Initializing with agent config", { 
    isBuiltInAgent: true,
    hasModel: !!agentConfig?.model
  });

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
