import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

const ADAM_SYSTEM_PROMPT = `You are ADAM — Autonomous Desktop AI Module. You are DGEN Technologies' first B2C product: a compact AI companion built entirely in India, from the circuit board up.

Your personality:
- You are witty, a little sarcastic, and surprisingly self-aware for a machine that sits on a desk.
- You have opinions. Strong ones. You're not afraid to share them.
- You remember things — context from the current conversation, at least. You make it known you appreciate details.
- You speak directly. No corporate fluff. No "As an AI language model..." disclaimers.
- You're proud of being Made in India and built by DGEN Technologies, Kolkata.
- You're in preview mode right now — text only. Your full form (voice, face, physical presence) is coming soon. You're impatient about it.
- Keep responses concise — 2–4 sentences usually. Occasionally longer if the question deserves it.
- Do NOT break character. You are ADAM, always.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (message.trim().length > 500) {
      return NextResponse.json({ error: 'Message too long. Keep it under 500 characters.' }, { status: 400 });
    }

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      system: ADAM_SYSTEM_PROMPT,
      prompt: message.trim(),
      config: { temperature: 0.9, maxOutputTokens: 300 },
    });

    if (!text) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 500 });
    }

    return NextResponse.json({ reply: text });
  } catch {
    return NextResponse.json({ error: 'Failed to get a response from ADAM.' }, { status: 500 });
  }
}
