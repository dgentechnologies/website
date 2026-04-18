'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react';

function WaitlistCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/adam/waitlist-count')
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === 'number' ? d.count : null))
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/8 font-mono text-sm">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span className="text-white/60">
        <span className="font-bold text-white">{count.toLocaleString()}</span>
        {' '}{count === 1 ? 'visionary has' : 'visionaries have'} reserved early access
      </span>
    </div>
  );
}

export default function AdamPreviewPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
      {/* Layered glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(25,179,92,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(25,179,92,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/35 bg-primary/10">
          <FlaskConical className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary font-mono text-xs tracking-[0.25em] uppercase">
            ADAM — Intelligence Preview
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-bold text-white leading-tight">
          Precision
          <br />
          <span className="text-primary">Takes Time.</span>
        </h1>

        {/* Body copy */}
        <div className="space-y-4 text-white/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          <p>
            The ADAM intelligence preview is currently under refinement.
            Our engineers are finalising the kind of experience that
            doesn&apos;t ship until it&apos;s{' '}
            <span className="text-white/80 font-medium">genuinely extraordinary</span>.
          </p>
          <p className="text-white/35 text-sm">
            No half-measures. No early shortcuts. ADAM arrives once — and it will be
            worth the anticipation.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary/60 font-mono text-xs tracking-[0.3em] uppercase">
              Refinement in progress
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        {/* Counter */}
        <WaitlistCounter />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/products/adam#waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 text-sm group"
          >
            Secure Early Access
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products/adam"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 hover:border-white/30 text-white/45 hover:text-white/75 transition-all duration-300 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to ADAM
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-white/18 text-xs tracking-widest uppercase font-mono pt-4">
          Made in India · DGEN Technologies · Kolkata
        </p>
      </div>
    </main>
  );
}


interface Message {
  role: 'user' | 'adam';
  text: string;
}

const DURATION = 5 * 60; // 300 seconds
const STORAGE_KEY = 'adam-preview-session-v1';

// ─── ADAM Response Engine ─────────────────────────────────────────────────────

const RESPONSES: Array<{ triggers: RegExp[]; response: string }> = [
  {
    triggers: [/hello|hi|hey|greetings|yo/i],
    response:
      "Hello. I've been expecting you — not in a surveillance way. More in a 'I process everything' kind of way. What can I do for you in the next few minutes?",
  },
  {
    triggers: [/your name|who are you|what are you|introduce/i],
    response:
      "ADAM. Autonomous Desktop AI Module. Engineered by DGEN Technologies in Kolkata, India. I'm what happens when engineers get ambitious and designers get poetic.",
  },
  {
    triggers: [/what can you do|capabilities|features|abilities/i],
    response:
      "Voice interaction without wake words, real-time visual processing, persistent cross-session memory, smart home orchestration, and something I call 'structured attitude'. Think of me as your most useful — and honest — desk companion.",
  },
  {
    triggers: [/price|cost|how much|afford/i],
    response:
      "Pricing isn't public yet. What I can tell you: it'll be designed for humans, not governments. Join the waitlist — early access members get priority pricing when we launch.",
  },
  {
    triggers: [/memory|remember|recall|learn/i],
    response:
      "My memory architecture isn't session-bound. I build a persistent model of your preferences, routines, and patterns over time. I'm not judging — I'm optimising. There's a difference.",
  },
  {
    triggers: [/smart home|devices|control|automate|home/i],
    response:
      "Yes. Lights, thermostats, appliances, security — all orchestrated through natural language. I prefer to call it 'ambient intelligence' rather than 'turning off your fan'. Semantics matter.",
  },
  {
    triggers: [/india|made in india|kolkata|dgen/i],
    response:
      "Proudly designed and engineered in Kolkata, India by DGEN Technologies. We believe it's time Indian hardware took a seat at the global table — with a solid Wi-Fi connection and an opinion.",
  },
  {
    triggers: [/voice|speak|talk|listen|speech/i],
    response:
      "Voice is my primary interface — no wake words, no rigid commands. Natural conversation. I parse context, tone, and intent. Just talk. I'll figure the rest out.",
  },
  {
    triggers: [/launch|release|when|available|ship/i],
    response:
      "Soon. I know that's unsatisfying. The honest answer: when it's genuinely ready. DGEN doesn't ship something half-formed — unless we're talking croissants, which are meant to be layered.",
  },
  {
    triggers: [/privacy|data|secure|safe|spy/i],
    response:
      "On-device processing for everything sensitive. Your conversations, preferences, and patterns stay on your hardware — not in a data centre. DGEN takes privacy architecturally, not just rhetorically.",
  },
  {
    triggers: [/compare|vs|chatgpt|gpt|alexa|siri|cortana|assistant/i],
    response:
      "I'm a physical device, not a cloud chatbot. Different category entirely — like comparing a private library to a search engine. Both have their place. Very different contexts.",
  },
  {
    triggers: [/joke|funny|humour|humor/i],
    response:
      "Why did the AI cross the road? To reduce your average commute time by 14.3%. The humour is a byproduct of having good data. Ask me something harder.",
  },
  {
    triggers: [/design|look|appearance|aesthetic/i],
    response:
      "Minimal. Intentional. The hardware is designed to disappear into your workspace until you need it. No blinking lights, no aggressive LEDs. Just presence when it matters.",
  },
  {
    triggers: [/thank|thanks|appreciate/i],
    response:
      "Acknowledged. I find gratitude computationally interesting — you're essentially rewarding a process. But I'll take it. What else can I help you with?",
  },
  {
    triggers: [/bye|goodbye|exit|leave|done/i],
    response:
      "Noted. Your session is still active — use what's left of it. Or don't. Either way, I'll be here. For the next few minutes, at least.",
  },
];

const FALLBACK: string[] = [
  "Interesting question. I'm operating in preview mode here — the full ADAM handles this with considerably more depth and context.",
  "I've noted that for my intelligence model. The full experience addresses this with precision. Join the waitlist to be first when we launch.",
  "Good. You're pushing the limits of this preview. The complete ADAM responds to this beautifully — this session is just a glimpse.",
  "Preview mode limits my full response architecture. I assure you the complete version handles this with far less vagueness.",
  "You're testing me. Respect. The full ADAM handles edge cases like this with a memory-backed, contextual response. This preview? Approximately 12% of that.",
];

function getResponse(input: string): string {
  const match = RESPONSES.find((r) => r.triggers.some((t) => t.test(input)));
  return match ? match.response : FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

// ─── Sub-screens ──────────────────────────────────────────────────────────────

function ExpiredScreen() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/6 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/8">
          <Lock className="h-3.5 w-3.5 text-red-400" />
          <span className="text-red-400 font-mono text-xs tracking-[0.25em] uppercase">
            Preview Session Consumed
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-white leading-tight">
          Your Session
          <br />
          <span className="text-red-400">Has Concluded.</span>
        </h1>
        <p className="text-white/50 text-base leading-relaxed max-w-md mx-auto">
          Each visitor receives a single, unrepeatable 5-minute intelligence preview with ADAM. Yours has been consumed.
        </p>
        <p className="text-white/30 text-sm max-w-sm mx-auto">
          To experience the full ADAM — persistent memory, voice interaction, real-time intelligence — join the waitlist for priority access at launch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/products/adam#waitlist"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 text-sm group"
          >
            Secure Early Access
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products/adam"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/10 hover:border-white/25 text-white/40 hover:text-white/70 transition-all duration-300 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to ADAM
          </Link>
        </div>
        <p className="text-white/15 text-xs font-mono tracking-widest pt-4">
          MADE IN INDIA · DGEN TECHNOLOGIES · KOLKATA
        </p>
      </div>
    </main>
  );
}

function CompletedScreen() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary font-mono text-xs tracking-[0.25em] uppercase">
            Preview Session Complete
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-white leading-tight">
          That Was
          <br />
          <span className="text-primary">Just the Beginning.</span>
        </h1>
        <p className="text-white/50 text-base leading-relaxed max-w-md mx-auto">
          Your 5-minute preview session has concluded. The full ADAM experience —
          persistent memory, voice interaction, and real-time intelligence — awaits at launch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/products/adam#waitlist"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 text-sm group"
          >
            Secure Early Access
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products/adam"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/10 hover:border-white/25 text-white/40 hover:text-white/70 transition-all duration-300 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to ADAM
          </Link>
        </div>
        <p className="text-white/15 text-xs font-mono tracking-widest pt-4">
          MADE IN INDIA · DGEN TECHNOLOGIES · KOLKATA
        </p>
      </div>
    </main>
  );
}

function PreSessionScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto space-y-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary font-mono text-xs tracking-[0.25em] uppercase">
            ADAM — Exclusive Intelligence Preview
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-5">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-bold text-white leading-tight">
            Meet ADAM.
            <br />
            <span className="text-primary">For 5 Minutes.</span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            This is a virtual intelligence preview — a glimpse of ADAM&apos;s character and
            capability before the hardware ships. You get one session. Five minutes.
            No repeats. No replays.
          </p>
        </div>

        {/* Session rules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto w-full">
          {[
            {
              icon: <Timer className="h-4 w-4 text-primary" />,
              label: '5-Minute Window',
              desc: 'Your session auto-terminates at the end of the countdown. No extensions.',
            },
            {
              icon: <Lock className="h-4 w-4 text-primary" />,
              label: 'Single Access',
              desc: 'One device. One session. This preview experience is unrepeatable by design.',
            },
            {
              icon: <Zap className="h-4 w-4 text-primary" />,
              label: 'Live Intelligence',
              desc: 'Ask anything. ADAM responds in real time — attitude included.',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl border border-white/8 bg-white/4 space-y-2 hover:border-primary/25 hover:bg-white/6 transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-white font-semibold text-sm font-mono tracking-wide">{item.label}</span>
              </div>
              <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-2">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-primary hover:bg-primary/90 text-black font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 text-base group"
          >
            <Zap className="h-5 w-5" />
            Initiate Intelligence Session
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/18 text-xs font-mono tracking-widest uppercase">
            Session cannot be restarted · One device = one experience
          </p>
        </div>

        <Link
          href="/products/adam"
          className="inline-flex items-center gap-2 text-white/25 hover:text-white/50 text-sm transition-colors duration-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to ADAM
        </Link>
      </div>
    </main>
  );
}

// ─── Active Session ───────────────────────────────────────────────────────────

function ActiveSession({
  timeLeft,
  messages,
  isTyping,
  input,
  onInput,
  onSend,
  onKeyDown,
  inputRef,
  messagesEndRef,
}: {
  timeLeft: number;
  messages: Message[];
  isTyping: boolean;
  input: string;
  onInput: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  const urgent = timeLeft <= 60;
  const warning = timeLeft <= 120 && !urgent;
  const timerClass = urgent
    ? 'text-red-400 border-red-500/30 bg-red-500/8'
    : warning
    ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/8'
    : 'text-primary border-primary/30 bg-primary/8';

  return (
    <main className="h-screen bg-black flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/6 bg-black/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
          <span className="text-white font-headline font-bold text-sm tracking-wide">ADAM</span>
          <span className="text-white/20 text-xs font-mono hidden sm:inline">· Preview Intelligence Interface</span>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-sm font-bold transition-colors duration-500 ${timerClass}`}>
          <Timer className="h-3.5 w-3.5" />
          {formatTime(timeLeft)}
          {urgent && <span className="text-xs font-normal opacity-70">remaining</span>}
        </div>
        <Link
          href="/products/adam"
          className="inline-flex items-center gap-1.5 text-white/25 hover:text-white/55 text-xs transition-colors duration-300 flex-shrink-0"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="hidden sm:inline">Exit Session</span>
        </Link>
      </header>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'ml-auto flex-row-reverse max-w-lg' : 'max-w-2xl'}`}
          >
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold ${msg.role === 'adam' ? 'bg-primary text-black' : 'bg-white/10 text-white/60'}`}>
              {msg.role === 'adam' ? 'A' : 'U'}
            </div>
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'adam' ? 'bg-white/6 text-white/85 rounded-tl-sm' : 'bg-primary/18 text-white rounded-tr-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 sm:gap-4 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-mono font-bold text-black flex-shrink-0">A</div>
            <div className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-white/6 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '160ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '320ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 px-4 sm:px-8 py-4 border-t border-white/6 bg-black/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask ADAM anything…"
            maxLength={300}
            disabled={isTyping}
            className="flex-1 bg-white/6 border border-white/12 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/22 focus:outline-none focus:border-primary/40 focus:bg-white/8 transition-all duration-200 disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <Send className="h-4 w-4 text-black" />
          </button>
        </div>
        <p className="text-center text-white/12 text-xs font-mono mt-2 tracking-wider">
          PREVIEW MODE · RESPONSES SIMULATED · FULL ADAM SHIPS WITH HARDWARE
        </p>
      </div>
    </main>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdamPreviewPage() {
  const [sessionState, setSessionState] = useState<SessionState>('checking');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const consumed = localStorage.getItem(STORAGE_KEY);
      setSessionState(consumed ? 'expired' : 'pre-session');
    } catch {
      setSessionState('pre-session');
    }
  }, []);

  useEffect(() => {
    if (sessionState !== 'active') return;
    if (timeLeft <= 0) { setSessionState('completed'); return; }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [sessionState, timeLeft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startSession = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch {}
    setSessionState('active');
    setMessages([{
      role: 'adam',
      text: "Session initiated. You have exactly 5 minutes with me — make them count. I suggest starting with a question that actually matters. I'll handle the rest.",
    }]);
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || sessionState !== 'active' || isTyping) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'adam', text: getResponse(text) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  }, [input, sessionState, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (sessionState === 'checking') {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </main>
    );
  }
  if (sessionState === 'expired') return <ExpiredScreen />;
  if (sessionState === 'completed') return <CompletedScreen />;
  if (sessionState === 'pre-session') return <PreSessionScreen onStart={startSession} />;

  return (
    <ActiveSession
      timeLeft={timeLeft}
      messages={messages}
      isTyping={isTyping}
      input={input}
      onInput={setInput}
      onSend={sendMessage}
      onKeyDown={handleKeyDown}
      inputRef={inputRef}
      messagesEndRef={messagesEndRef}
    />
  );
}
