require('dotenv').config();
const OpenAI = require('openai');

const key = process.env.GEMINI_API_KEY;
console.log('Key cargada:', key ? `${key.slice(0, 6)}...` : 'NO ENCONTRADA');

const client = new OpenAI({
  apiKey: key,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  timeout: 15000,
});

(async () => {
  try {
    const res = await client.chat.completions.create({
      model: 'gemini-2.0-flash',
      max_tokens: 20,
      messages: [{ role: 'user', content: 'Respondé solo: hola' }],
    });
    console.log('✅ Gemini OK:', res.choices[0].message.content);
  } catch (e) {
    console.error('❌ Error:', e.message);
    if (e.status) console.error('   HTTP status:', e.status);
    if (e.error) console.error('   Detalle:', JSON.stringify(e.error, null, 2));
  }
})();
