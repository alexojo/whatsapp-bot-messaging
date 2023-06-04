const { createParser } = require("eventsource-parser");

const OpenAIStream = async (prompt, maxTokens, temperature) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        {
          role: "system",
          content:
            "Below is a list of articles that include news and updates about AI today.Write me a summary of those articles. Conclude it in 5 bullet points. Limit each bullet point to 150 characters and the entire message to a maximum of 1000. Make it interesting and display the most interesting news and updates on top.If there are small/minor news that seem unimportant, you can conclude them all at the end of the message. Keep the focus on the most important things. List of Articles:",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens ?? 300,
      temperature: temperature ?? 0.9,
      stream: true,
    }),
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

module.exports = { OpenAIStream };
