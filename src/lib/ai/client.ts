/**
 * Provider-isolated LLM client. Swap provider via LLM_PROVIDER without
 * touching UI. Keys are read from process.env on the server only.
 */

export type ChatContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | ChatContent[];
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type ChatJsonResult = {
  ok: true;
  text: string;
  model: string;
  latencyMs: number;
  provider: string;
} | {
  ok: false;
  error: string;
  code: "no_key" | "timeout" | "http" | "empty" | "rate_limit" | "unsupported";
  status?: number;
  latencyMs: number;
  provider: string;
};

export type ProviderInfo = {
  id: "xai" | "groq" | "none";
  model: string;
  baseUrl: string;
  apiKey: string | null;
  vision: boolean;
  stt: boolean;
};

export type AiRuntime = {
  lastOk: boolean;
  lastAt: string | null;
  lastLatencyMs: number | null;
  lastError: string | null;
  lastModel: string | null;
  provider: string;
  vision: boolean;
  stt: boolean;
};

export const aiRuntime: AiRuntime = {
  lastOk: false,
  lastAt: null,
  lastLatencyMs: null,
  lastError: null,
  lastModel: null,
  provider: "none",
  vision: false,
  stt: false,
};

export function resolveProvider(): ProviderInfo {
  const forced = (process.env.LLM_PROVIDER ?? "").trim().toLowerCase();
  const xaiKey = process.env.XAI_API_KEY?.trim() || null;
  const groqKey = process.env.GROQ_API_KEY?.trim() || null;
  const modelOverride = process.env.LLM_MODEL?.trim();

  if (forced === "groq" && groqKey) {
    return {
      id: "groq",
      model: modelOverride || "llama-3.3-70b-versatile",
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
      vision: false,
      stt: true,
    };
  }
  if (xaiKey && forced !== "none") {
    return {
      id: "xai",
      model: modelOverride || "grok-4.5",
      baseUrl: "https://api.x.ai/v1",
      apiKey: xaiKey,
      vision: true,
      stt: true,
    };
  }
  if (groqKey) {
    return {
      id: "groq",
      model: modelOverride || "llama-3.3-70b-versatile",
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
      vision: false,
      stt: true,
    };
  }
  return {
    id: "none",
    model: "",
    baseUrl: "",
    apiKey: null,
    vision: false,
    stt: false,
  };
}

export async function chatJson(opts: {
  messages: ChatMessage[];
  schema?: JsonSchema;
  timeoutMs?: number;
  maxTokens?: number;
  temperature?: number;
}): Promise<ChatJsonResult> {
  const provider = resolveProvider();
  aiRuntime.provider = provider.id;
  aiRuntime.vision = provider.vision;
  aiRuntime.stt = provider.stt;

  if (!provider.apiKey || provider.id === "none") {
    const result: ChatJsonResult = {
      ok: false,
      error: "AI is not available in this environment",
      code: "no_key",
      latencyMs: 0,
      provider: provider.id,
    };
    record(result);
    return result;
  }

  const started = Date.now();
  const timeoutMs = opts.timeoutMs ?? 32_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const body: Record<string, unknown> = {
    model: provider.model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.1,
    max_tokens: opts.maxTokens ?? 2500,
  };
  if (opts.schema) {
    body.response_format = {
      type: "json_schema",
      json_schema: {
        name: opts.schema.name,
        schema: opts.schema.schema,
        strict: opts.schema.strict ?? true,
      },
    };
  } else {
    body.response_format = { type: "json_object" };
  }

  try {
    let res = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok && opts.schema && (res.status === 400 || res.status === 422)) {
      const retryBody = { ...body, response_format: { type: "json_object" } };
      res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify(retryBody),
        signal: controller.signal,
      });
    }

    const latencyMs = Date.now() - started;
    if (res.status === 429) {
      const result: ChatJsonResult = {
        ok: false,
        error: "The safety model is rate-limited. Try again in a moment.",
        code: "rate_limit",
        status: 429,
        latencyMs,
        provider: provider.id,
      };
      record(result);
      return result;
    }
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      const result: ChatJsonResult = {
        ok: false,
        error: `Safety model error (${res.status})`,
        code: res.status === 404 ? "unsupported" : "http",
        status: res.status,
        latencyMs,
        provider: provider.id,
      };
      record(result, errText.slice(0, 180));
      return result;
    }

    const json = (await res.json()) as {
      model?: string;
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) {
      const result: ChatJsonResult = {
        ok: false,
        error: "The safety model returned an empty response.",
        code: "empty",
        latencyMs,
        provider: provider.id,
      };
      record(result);
      return result;
    }
    const result: ChatJsonResult = {
      ok: true,
      text,
      model: json.model || provider.model,
      latencyMs,
      provider: provider.id,
    };
    record(result);
    return result;
  } catch (err) {
    const latencyMs = Date.now() - started;
    const aborted = err instanceof Error && err.name === "AbortError";
    const result: ChatJsonResult = {
      ok: false,
      error: aborted ? "The safety model timed out." : "Could not reach the safety model.",
      code: aborted ? "timeout" : "http",
      latencyMs,
      provider: provider.id,
    };
    record(result);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

export async function transcribeAudio(opts: {
  base64: string;
  mime: string;
  filename?: string;
  timeoutMs?: number;
}): Promise<{ ok: true; text: string } | { ok: false; error: string; unavailable: true }> {
  const provider = resolveProvider();
  if (!provider.apiKey || !provider.stt) {
    return { ok: false, error: "Speech-to-text is not configured.", unavailable: true };
  }

  const bytes = Buffer.from(opts.base64, "base64");
  const mime = opts.mime || "audio/webm";
  const filename = opts.filename || guessFilename(mime);
  const blob = new Blob([bytes], { type: mime });

  const endpoints =
    provider.id === "xai"
      ? [`${provider.baseUrl}/stt`, `${provider.baseUrl}/audio/transcriptions`]
      : [`${provider.baseUrl}/audio/transcriptions`];

  for (const url of endpoints) {
    try {
      const form = new FormData();
      form.append("file", blob, filename);
      form.append("model", provider.id === "groq" ? "whisper-large-v3" : "grok-stt");
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20_000);
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${provider.apiKey}` },
        body: form,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      const json = (await res.json()) as { text?: string; transcript?: string };
      const text = (json.text || json.transcript || "").trim();
      if (text) return { ok: true, text };
    } catch {
      continue;
    }
  }
  return { ok: false, error: "Automatic transcription unavailable.", unavailable: true };
}

function guessFilename(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "note.m4a";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "note.mp3";
  if (mime.includes("ogg")) return "note.ogg";
  if (mime.includes("wav")) return "note.wav";
  return "note.webm";
}

function record(result: ChatJsonResult, detail?: string) {
  aiRuntime.lastAt = new Date().toISOString();
  aiRuntime.lastLatencyMs = result.latencyMs;
  if (result.ok) {
    aiRuntime.lastOk = true;
    aiRuntime.lastError = null;
    aiRuntime.lastModel = result.model;
  } else {
    aiRuntime.lastOk = false;
    aiRuntime.lastError = detail ? `${result.error} ${detail}` : result.error;
  }
}

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object in model output");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}
