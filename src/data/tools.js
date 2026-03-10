import writingTools from "./tools.json";

const placeholderTools = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDFs into one document.",
    category: "PDF Tools",
    badge: "COMING SOON",
    provider: "adobe",
    route: "/tools/merge-pdf",
    enabled: true,
    comingSoon: true,
    fields: [{ id: "files", type: "file", label: "Upload PDFs", accept: ".pdf", multiple: true, required: true }],
    promptTemplate: "",
    outputType: "file",
    endpointType: "provider-placeholder",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF size while preserving quality.",
    category: "PDF Tools",
    badge: "COMING SOON",
    provider: "adobe",
    route: "/tools/compress-pdf",
    enabled: true,
    comingSoon: true,
    fields: [{ id: "file", type: "file", label: "Upload PDF", accept: ".pdf", required: true }],
    promptTemplate: "",
    outputType: "file",
    endpointType: "provider-placeholder",
  },
];

const tools = [...writingTools, ...placeholderTools];

export default tools;
