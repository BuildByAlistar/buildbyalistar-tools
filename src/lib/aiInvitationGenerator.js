const API_URL = "https://us-central1-buildbystar-a109d.cloudfunctions.net/generateText";

export async function generateInvitationContent(input = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tool: "invitation-generator",
      ...input,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate invitation content");
  }

  return data;
}

export default generateInvitationContent;
