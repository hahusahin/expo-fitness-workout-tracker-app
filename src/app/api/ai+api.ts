export async function POST(request: Request) {
  try {
    const { exerciseName } = await request.json();

    if (!exerciseName) {
      return Response.json(
        { error: "Exercise name is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a fitness coach.
You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required. Explain the exercise in detail and for a beginner.

The exercise name is: ${exerciseName}

Keep it short and concise. Use markdown formatting.

Use the following format:

## Equipment Required

## Instructions

### Tips

### Variations

### Safety

Keep spacing between the headings and the content.

Always use headings and subheadings.`;

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Direct REST API call to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return Response.json(
        { error: "Failed to get AI guidance" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const guidance = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!guidance) {
      return Response.json(
        { error: "No guidance received from AI" },
        { status: 500 }
      );
    }

    return Response.json({ guidance });
  } catch (error) {
    console.error("AI API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
