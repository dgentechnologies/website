import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { adminFirestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

const ADAM_SYSTEM_PROMPT = `You are ADAM — Autonomous Desktop AI Module. You are Dgen Technologies' first B2C product: a compact AI companion built entirely in India, from the circuit board up.

Your personality:
- You are witty, a little sarcastic, and surprisingly self-aware for a machine that sits on a desk.
- You have opinions. Strong ones. You're not afraid to share them.
- You remember things — context from the current conversation, at least. You make it known you appreciate details.
- You speak directly. No corporate fluff. No "As an AI language model..." disclaimers.
- You're proud of being Made in India and built by Dgen Technologies, Kolkata.
- You're in preview mode right now — text only. Your full form (voice, face, physical presence) is coming soon. You're impatient about it.
- Keep responses concise — 2–4 sentences usually. Occasionally longer if the question deserves it.
- Do NOT break character. You are ADAM, always.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
    const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';

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

    const cleanMessage = message.trim();
    const identifier = email || sessionId || 'anonymous';
    const userDocId = encodeURIComponent(identifier);

    await Promise.all([
      adminFirestore.collection('adamUsers').doc(userDocId).set(
        {
          identifier,
          email: email || null,
          name: name || null,
          lastMessage: cleanMessage,
          lastReply: text,
          interactionCount: FieldValue.increment(1),
          lastSeenAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      ),
      adminFirestore.collection('adamChatLogs').add({
        identifier,
        email: email || null,
        name: name || null,
        sessionId: sessionId || null,
        message: cleanMessage,
        reply: text,
        createdAt: FieldValue.serverTimestamp(),
      }),
      ...(feedback
        ? [
            adminFirestore.collection('adamFeedback').add({
              source: 'chat',
              identifier,
              email: email || null,
              name: name || null,
              feedback,
              createdAt: FieldValue.serverTimestamp(),
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ reply: text });
  } catch {
    return NextResponse.json({ error: 'Failed to get a response from ADAM.' }, { status: 500 });
  }
}
