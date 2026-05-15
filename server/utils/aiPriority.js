import OpenAI from 'openai';

const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function detectPriority(title, description) {
  if (!openai) {
    return 'Medium';
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Classify the urgency of this civic complaint as Low, Medium, High, or Critical. Reply with only the priority level. Complaint: ${title}. ${description}`,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const raw = response.choices[0]?.message?.content?.trim() || 'Medium';
    const match = VALID_PRIORITIES.find(
      (p) => p.toLowerCase() === raw.toLowerCase()
    );
    return match || 'Medium';
  } catch (err) {
    console.error('AI priority detection failed:', err.message);
    return 'Medium';
  }
}
