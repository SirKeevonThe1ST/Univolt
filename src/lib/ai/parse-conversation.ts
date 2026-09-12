import type { DemoMessage } from "@/lib/demo/types";

const SPEAKER_RE =
  /^(?:\[(?<src>[^\]]+)\]\s*)?(?:(?<spk>other|child|me|them|unknown|adult|stranger|user|friend|reporter|kid|teen)\s*[:\-–]\s*)(?<rest>.*)$/i;

const SESSION_RE = /^\s*(?:session|day)\s*(\d+)\s*[:.-]?\s*$/i;

export function parseConversation(raw: string, sourceLabel = "Pasted text"): DemoMessage[] {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const lines = text.split("\n");
  const messages: DemoMessage[] = [];
  let pendingSrc = sourceLabel;
  let pendingDay: string | undefined;
  let lastSpeaker: DemoMessage["speaker"] | null = null;

  const push = (speaker: DemoMessage["speaker"], body: string, src = pendingSrc, day = pendingDay) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    messages.push({
      speaker,
      text: trimmed,
      day,
      source: src.toLowerCase().includes("screenshot")
        ? "screenshot"
        : src.toLowerCase().includes("voice")
          ? "voice"
          : src.toLowerCase().includes("file")
            ? "file"
            : "paste",
      sourceLabel: src,
    });
    lastSpeaker = speaker;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const session = line.match(SESSION_RE);
    if (session) {
      pendingDay = `Session ${session[1]}`;
      continue;
    }
    if (/^\[.+\]$/.test(line)) {
      pendingSrc = line.slice(1, -1).trim() || sourceLabel;
      continue;
    }

    const m = line.match(SPEAKER_RE);
    if (m?.groups) {
      if (m.groups.src) pendingSrc = m.groups.src.trim();
      const speaker = normaliseSpeaker(m.groups.spk);
      push(speaker, m.groups.rest ?? "", pendingSrc);
      continue;
    }

    if (messages.length && lastSpeaker && /^["“']/.test(line)) {
      messages[messages.length - 1].text += ` ${line.replace(/^["“']|["”']$/g, "")}`;
      continue;
    }

    // Unlabelled lines: default to "other", flip if previous was other and this looks like a reply.
    const speaker: DemoMessage["speaker"] =
      lastSpeaker === "other" && looksLikeChild(line) ? "child" : lastSpeaker === "child" ? "other" : "other";
    push(speaker, line, pendingSrc);
  }

  return dedupeMessages(messages);
}

export function formatConversation(messages: DemoMessage[]): string {
  return messages
    .map((m) => {
      const tag = m.sourceLabel ? `[${m.sourceLabel}]\n` : "";
      return `${tag}${m.speaker.toUpperCase()}: ${m.text}`;
    })
    .join("\n");
}

export function dedupeMessages(messages: DemoMessage[]): DemoMessage[] {
  const seen = new Set<string>();
  const out: DemoMessage[] = [];
  for (const m of messages) {
    const key = `${m.speaker}:${m.text.toLowerCase().replace(/\s+/g, " ").trim()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(m);
  }
  return out;
}

export function combineMessageLists(lists: DemoMessage[][]): DemoMessage[] {
  return dedupeMessages(lists.flat());
}

function normaliseSpeaker(raw: string): DemoMessage["speaker"] {
  const s = raw.toLowerCase();
  if (s === "child" || s === "me" || s === "kid" || s === "teen") return "child";
  return "other";
}

function looksLikeChild(line: string): boolean {
  return /^(why|kya|nahi|no |i don't|i dont|stop|leave me|kaun|who are)/i.test(line);
}
