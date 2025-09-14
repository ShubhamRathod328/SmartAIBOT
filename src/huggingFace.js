import { prevUser } from "./context/UserContext";

export async function query() {
  const response = await fetch(
    "https://router.huggingface.co/fal-ai/fal-ai/fast-sdxl",
    {
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        sync_mode: true,
        prompt: prevUser.prompt,
      }),
    }
  );
  const json = await response.json();

  // Inspect the returned JSON structure
  console.log("API Response:", json);

  // Step 2: Extract the image URL (adjust path depending on actual JSON structure)
  const imageUrl = json.images?.[0]?.url || json.url;

  if (!imageUrl) {
    throw new Error("No image URL found in API response");
  }

  // Step 3: Fetch the actual image
  const imageResponse = await fetch(imageUrl);
  const blob = await imageResponse.blob();

  return blob;
}
