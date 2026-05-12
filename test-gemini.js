require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const FALLBACK_ADVICE =
  'For yellow maize leaves: 1) Check soil moisture 2) Test for nitrogen/zinc deficiency 3) Apply appropriate fertilizer 4) Consult local extension officer. Visit Agriconnect for more localized advice.';

async function generateWithFallback(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { source: 'fallback-local', text: FALLBACK_ADVICE };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();
      if (text && text.trim()) {
        return { source: modelName, text: text.trim() };
      }
    } catch (error) {
      console.warn(`Model ${modelName} failed: ${error.message}`);
    }
  }

  return { source: 'fallback-local', text: FALLBACK_ADVICE };
}

(async () => {
  try {
    const result = await generateWithFallback(
      'Maize leaves yellow Zambia dry season advice.'
    );
    console.log(`Result source: ${result.source}`);
    console.log(result.text);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
