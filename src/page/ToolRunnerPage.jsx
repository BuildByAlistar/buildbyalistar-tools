import React from "react";
import { useNavigate } from "react-router-dom";
import DynamicToolRenderer from "../components/tools/DynamicToolRenderer";
import { useAuth } from "../context/useAuth";

export default function ToolRunnerPage({ tool }) {
  const { canUseTool, incrementUsage } = useAuth();
  const navigate = useNavigate();

  const handleRunTool = async (inputs) => {
    if (!canUseTool()) {
      alert("You have reached your daily limit. Please upgrade for unlimited access.");
      navigate("/upgrade");
      return;
    }

    // The actual tool execution logic will be handled by DynamicToolRenderer
    // We just increment the usage count here.
    await incrementUsage();
  };

  return <DynamicToolRenderer tool={tool} onRun={handleRunTool} />;
}
