import { CopilotRuntime, AnthropicAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const serviceAdapter = new AnthropicAdapter({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    anthropic: new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: "https://api.anthropic.com/v1",
    }),
  });

  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
