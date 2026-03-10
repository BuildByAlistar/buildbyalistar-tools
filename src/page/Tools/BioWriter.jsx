import React from "react";
import DynamicToolRenderer from "../../components/tools/DynamicToolRenderer";
import tools from "../../data/tools";

const bioWriterTool = tools.find((tool) => tool.id === "bio-writer");

export default function BioWriter() {
  return <DynamicToolRenderer tool={bioWriterTool} />;
}
