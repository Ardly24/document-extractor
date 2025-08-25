import { GoogleGenerativeAI } from '@google/generative-ai';

//AI extraction via Gemini
export async function aiDataExtraction(rawText) {
const key = process.env.GEMINI_API_KEY;

// If no API key, skip AI extraction
if (!key) {
return {
rawText,
entities: { warning: 'GEMINI_API_KEY not set; AI extraction skipped.' }
};
}


const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const system = `Extract key fields from the document text and return ONLY JSON.`;


const prompt = `${system}\n\nTEXT:\n${rawText}`;
const resp = await model.generateContent(prompt);
const text = resp.response.text();

// Parse JSON from model output
try {
const s = text.indexOf('{');
const e = text.lastIndexOf('}');
return { rawText, entities: JSON.parse(text.slice(s, e + 1)) };
} catch (e) {
return { rawText, entities: { _raw: text, parsingError: true } };
}
}