const API_URL = "https://us-central1-buildbystar-a109d.cloudfunctions.net/generateText";

export async function generateProposalContent(input = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tool: "proposal-generator",
      ...input,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate instruction content");
  }

  return data;
}

export default generateProposalContent;
