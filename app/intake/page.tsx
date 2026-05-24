"use client";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

import IntakeContent from "./IntakeContent";

export default function IntakePage() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
    >
      <IntakeContent />
    </CopilotKit>
  );
}