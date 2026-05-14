import { CopilotRuntime, AnthropicAdapter } from "@copilotkit/runtime";

export async function POST(req: Request) {
  const copilotRuntime = new CopilotRuntime();

  return copilotRuntime.response(
    new AnthropicAdapter({ model: "claude-3-5-sonnet-20240620" }),
    req
  );
}
