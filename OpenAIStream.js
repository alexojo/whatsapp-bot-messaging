const { createParser } = require("eventsource-parser");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const OpenAIModel = {
  DAVINCI_TURBO: "gpt-3.5-turbo",
};
const OpenAIStream = async (prompt, maxTokens, temperature) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Below is a list of articles that include news and updates about AI today.\nWrite me a summary of those articles. Conclude it in 5 bullet points. Limit each bullet point to 150 characters and the entire message to a maximum of 1000. Make it interesting and display the most interesting news and updates on top.\nIf there are small/minor news that seem unimportant, you can conclude them all at the end of the message. Keep the focus on the most important things.\nList of Articles\n\n ${prompt}`,
      max_tokens: 1500,
      temperature: 0.7,
    });

    if (response.status !== 200) {
      throw new Error("OpenAI API returned an error");
    }

    const { data } = response;

    const { choices } = data;

    const { text } = choices[0];

    console.log(text.length);

    return text;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { OpenAIStream };
