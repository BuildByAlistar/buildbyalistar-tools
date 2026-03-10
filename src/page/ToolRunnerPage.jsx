import React from "react";
import DynamicToolRenderer from "../components/tools/DynamicToolRenderer";

export default function ToolRunnerPage({ tool }) {
  return <DynamicToolRenderer tool={tool} />;
}
