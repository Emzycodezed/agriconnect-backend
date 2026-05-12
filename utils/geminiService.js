const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 15000);
const GEMINI_RETRIES = Number(process.env.GEMINI_RETRIES || 1);
const GEMINI_RETRY_DELAY_MS = Number(process.env.GEMINI_RETRY_DELAY_MS || 800);
const FALLBACK_ADVICE = `AI assistant is temporarily unavailable.
Here are quick, generally safe farming checks:
- Inspect leaves for pests/disease and remove affected parts early.
- Keep soil evenly moist; avoid waterlogging roots.
- Apply balanced NPK fertilizer lightly if plants look pale.
- Mulch to retain moisture and suppress weeds.
- If issue persists, contact your local extension officer.`;

const getClient = () => {
  if (genAI) {
    return genAI;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn('Gemini: GEMINI_API_KEY is not set; using fallback advice.');
    throw new Error('GEMINI_API_KEY is not set');
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI;
};

const generateAgriculturalAdvice = async (query, context = '') => {
  const prompt = context ? `${context}\n\nQuestion: ${query}` : query;

  const ensureModel = () => {
    if (!model) {
      model = getClient().getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024
        }
      });
    }
    return model;
  };

  const attemptOnce = async () => {
    const m = ensureModel();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms`)), GEMINI_TIMEOUT_MS);
    });

    const result = await Promise.race([
      m.generateContent(prompt),
      timeoutPromise
    ]);

    return result?.response?.text?.() || result?.response?.text || FALLBACK_ADVICE;
  };

  try {
    let attempt = 0;
    while (attempt <= GEMINI_RETRIES) {
      try {
        return await attemptOnce();
      } catch (err) {
        attempt += 1;
        const isLast = attempt > GEMINI_RETRIES;
        const isBusy = `${err?.message || ''}`.toLowerCase().includes('high demand') || err?.status === 503;
        if (isLast || !isBusy) {
          throw err;
        }
        await new Promise((res) => setTimeout(res, GEMINI_RETRY_DELAY_MS));
      }
    }
    return FALLBACK_ADVICE;
  } catch (error) {
    console.warn('Gemini request failed, returning fallback advice:', error.message);
    return FALLBACK_ADVICE;
  }
};

module.exports = {
  generateAgriculturalAdvice
};
