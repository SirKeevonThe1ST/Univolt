import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { h as threatLabel, n as CHAIN_META } from "./intelligence-Dr71N71v.mjs";
import { n as detectLanguage, t as LANG_LABELS } from "./language-D_fIYyd4.mjs";
import { n as formatConversation } from "./parse-conversation-CqsiqhAG.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, pn as literal, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-B7-LGu4J.js
var analyze_B7_LGu4J_exports = /* @__PURE__ */ __exportAll({
	a: () => generateBriefing,
	c: () => risk_engine_exports,
	d: () => resolveProvider,
	i: () => extractConversationFromImages,
	l: () => scoreAnalysis,
	n: () => analyze_exports,
	o: () => simulateWhatIf,
	r: () => copilotAsk,
	s: () => transcribeVoiceNote,
	t: () => analyzeConversation,
	u: () => aiRuntime
});
/** Indicator types the LLM may emit. Final scores are computed elsewhere. */
var INDICATOR_TYPES = [
	"identity_probing",
	"personal_information",
	"trust_building",
	"secrecy_pressure",
	"isolation",
	"image_solicitation",
	"manipulation",
	"threat",
	"blackmail",
	"repeated_unwanted_contact"
];
var BEHAVIOURAL_STAGES = [
	"contact",
	"trust_building",
	"personal_information",
	"secrecy",
	"isolation",
	"image_solicitation",
	"manipulation",
	"threat",
	"blackmail"
];
var THREAT_TYPES = [
	"grooming",
	"cyberbullying",
	"blackmail",
	"threat",
	"suspicious",
	"none"
];
var SEVERITIES = [
	"low",
	"medium",
	"high",
	"critical"
];
var ESCALATIONS = [
	"escalating",
	"stable",
	"declining"
];
var RiskIndicatorSchema = object({
	type: _enum(INDICATOR_TYPES),
	severity: _enum(SEVERITIES),
	confidence: number().min(0).max(1),
	evidence: string(),
	source: string(),
	why_it_matters: string()
});
var SessionSignalSchema = object({
	session_index: number().int().min(1),
	label: string(),
	indicators: array(_enum(INDICATOR_TYPES))
});
var LlmSafetyAnalysisSchema = object({
	language: string(),
	language_code: string(),
	summary: string(),
	normalized_meaning: string(),
	threat_type: _enum(THREAT_TYPES),
	risk_indicators: array(RiskIndicatorSchema),
	behavioural_stages: array(_enum(BEHAVIOURAL_STAGES)),
	escalation_signal: _enum(ESCALATIONS),
	uncertainty: array(string()),
	recommended_human_review: boolean(),
	model_confidence: number().min(0).max(1),
	session_signals: array(SessionSignalSchema).optional()
});
var OcrMessageSchema = object({
	speaker: _enum(["child", "other"]),
	text: string(),
	source_label: string()
});
var OcrExtractSchema = object({
	language: string(),
	ocr_confidence: number().min(0).max(1),
	low_confidence: boolean(),
	messages: array(OcrMessageSchema),
	notes: string()
});
var CopilotReplySchema = object({
	answer: string(),
	missing_information: array(string()),
	human_judgment_required: literal(true)
});
var BriefingSchema = object({
	briefing: string(),
	bullets: array(string()),
	human_judgment_required: literal(true)
});
var WhatIfSchema = object({
	scenario: string(),
	plausible_description: string(),
	illustrative_projection: string(),
	not_a_prediction: literal(true)
});
/** JSON Schema sent to the provider for structured decoding. */
var LLM_ANALYSIS_JSON_SCHEMA = {
	type: "object",
	additionalProperties: false,
	required: [
		"language",
		"language_code",
		"summary",
		"normalized_meaning",
		"threat_type",
		"risk_indicators",
		"behavioural_stages",
		"escalation_signal",
		"uncertainty",
		"recommended_human_review",
		"model_confidence",
		"session_signals"
	],
	properties: {
		language: { type: "string" },
		language_code: { type: "string" },
		summary: { type: "string" },
		normalized_meaning: { type: "string" },
		threat_type: {
			type: "string",
			enum: [...THREAT_TYPES]
		},
		risk_indicators: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"type",
					"severity",
					"confidence",
					"evidence",
					"source",
					"why_it_matters"
				],
				properties: {
					type: {
						type: "string",
						enum: [...INDICATOR_TYPES]
					},
					severity: {
						type: "string",
						enum: [...SEVERITIES]
					},
					confidence: { type: "number" },
					evidence: { type: "string" },
					source: { type: "string" },
					why_it_matters: { type: "string" }
				}
			}
		},
		behavioural_stages: {
			type: "array",
			items: {
				type: "string",
				enum: [...BEHAVIOURAL_STAGES]
			}
		},
		escalation_signal: {
			type: "string",
			enum: [...ESCALATIONS]
		},
		uncertainty: {
			type: "array",
			items: { type: "string" }
		},
		recommended_human_review: { type: "boolean" },
		model_confidence: { type: "number" },
		session_signals: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"session_index",
					"label",
					"indicators"
				],
				properties: {
					session_index: { type: "integer" },
					label: { type: "string" },
					indicators: {
						type: "array",
						items: {
							type: "string",
							enum: [...INDICATOR_TYPES]
						}
					}
				}
			}
		}
	}
};
var OCR_JSON_SCHEMA = {
	type: "object",
	additionalProperties: false,
	required: [
		"language",
		"ocr_confidence",
		"low_confidence",
		"messages",
		"notes"
	],
	properties: {
		language: { type: "string" },
		ocr_confidence: { type: "number" },
		low_confidence: { type: "boolean" },
		notes: { type: "string" },
		messages: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"speaker",
					"text",
					"source_label"
				],
				properties: {
					speaker: {
						type: "string",
						enum: ["child", "other"]
					},
					text: { type: "string" },
					source_label: { type: "string" }
				}
			}
		}
	}
};
var aiRuntime = {
	lastOk: false,
	lastAt: null,
	lastLatencyMs: null,
	lastError: null,
	lastModel: null,
	provider: "none",
	vision: false,
	stt: false
};
function resolveProvider() {
	const forced = (process.env.LLM_PROVIDER ?? "").trim().toLowerCase();
	const xaiKey = process.env.XAI_API_KEY?.trim() || null;
	const groqKey = process.env.GROQ_API_KEY?.trim() || null;
	const modelOverride = process.env.LLM_MODEL?.trim();
	if (forced === "groq" && groqKey) return {
		id: "groq",
		model: modelOverride || "llama-3.3-70b-versatile",
		baseUrl: "https://api.groq.com/openai/v1",
		apiKey: groqKey,
		vision: false,
		stt: true
	};
	if (xaiKey && forced !== "none") return {
		id: "xai",
		model: modelOverride || "grok-4.5",
		baseUrl: "https://api.x.ai/v1",
		apiKey: xaiKey,
		vision: true,
		stt: true
	};
	if (groqKey) return {
		id: "groq",
		model: modelOverride || "llama-3.3-70b-versatile",
		baseUrl: "https://api.groq.com/openai/v1",
		apiKey: groqKey,
		vision: false,
		stt: true
	};
	return {
		id: "none",
		model: "",
		baseUrl: "",
		apiKey: null,
		vision: false,
		stt: false
	};
}
async function chatJson(opts) {
	const provider = resolveProvider();
	aiRuntime.provider = provider.id;
	aiRuntime.vision = provider.vision;
	aiRuntime.stt = provider.stt;
	if (!provider.apiKey || provider.id === "none") {
		const result = {
			ok: false,
			error: "AI is not available in this environment",
			code: "no_key",
			latencyMs: 0,
			provider: provider.id
		};
		record(result);
		return result;
	}
	const started = Date.now();
	const timeoutMs = opts.timeoutMs ?? 32e3;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	const body = {
		model: provider.model,
		messages: opts.messages,
		temperature: opts.temperature ?? .1,
		max_tokens: opts.maxTokens ?? 2500
	};
	if (opts.schema) body.response_format = {
		type: "json_schema",
		json_schema: {
			name: opts.schema.name,
			schema: opts.schema.schema,
			strict: opts.schema.strict ?? true
		}
	};
	else body.response_format = { type: "json_object" };
	try {
		let res = await fetch(`${provider.baseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${provider.apiKey}`
			},
			body: JSON.stringify(body),
			signal: controller.signal
		});
		if (!res.ok && opts.schema && (res.status === 400 || res.status === 422)) {
			const retryBody = {
				...body,
				response_format: { type: "json_object" }
			};
			res = await fetch(`${provider.baseUrl}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${provider.apiKey}`
				},
				body: JSON.stringify(retryBody),
				signal: controller.signal
			});
		}
		const latencyMs = Date.now() - started;
		if (res.status === 429) {
			const result = {
				ok: false,
				error: "The safety model is rate-limited. Try again in a moment.",
				code: "rate_limit",
				status: 429,
				latencyMs,
				provider: provider.id
			};
			record(result);
			return result;
		}
		if (!res.ok) {
			const errText = await res.text().catch(() => "");
			const result = {
				ok: false,
				error: `Safety model error (${res.status})`,
				code: res.status === 404 ? "unsupported" : "http",
				status: res.status,
				latencyMs,
				provider: provider.id
			};
			record(result, errText.slice(0, 180));
			return result;
		}
		const json = await res.json();
		const text = json.choices?.[0]?.message?.content ?? "";
		if (!text.trim()) {
			const result = {
				ok: false,
				error: "The safety model returned an empty response.",
				code: "empty",
				latencyMs,
				provider: provider.id
			};
			record(result);
			return result;
		}
		const result = {
			ok: true,
			text,
			model: json.model || provider.model,
			latencyMs,
			provider: provider.id
		};
		record(result);
		return result;
	} catch (err) {
		const latencyMs = Date.now() - started;
		const aborted = err instanceof Error && err.name === "AbortError";
		const result = {
			ok: false,
			error: aborted ? "The safety model timed out." : "Could not reach the safety model.",
			code: aborted ? "timeout" : "http",
			latencyMs,
			provider: provider.id
		};
		record(result);
		return result;
	} finally {
		clearTimeout(timer);
	}
}
async function transcribeAudio(opts) {
	const provider = resolveProvider();
	if (!provider.apiKey || !provider.stt) return {
		ok: false,
		error: "Speech-to-text is not configured.",
		unavailable: true
	};
	const bytes = Buffer.from(opts.base64, "base64");
	const mime = opts.mime || "audio/webm";
	const filename = opts.filename || guessFilename(mime);
	const blob = new Blob([bytes], { type: mime });
	const endpoints = provider.id === "xai" ? [`${provider.baseUrl}/stt`, `${provider.baseUrl}/audio/transcriptions`] : [`${provider.baseUrl}/audio/transcriptions`];
	for (const url of endpoints) try {
		const form = new FormData();
		form.append("file", blob, filename);
		form.append("model", provider.id === "groq" ? "whisper-large-v3" : "grok-stt");
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 2e4);
		const res = await fetch(url, {
			method: "POST",
			headers: { Authorization: `Bearer ${provider.apiKey}` },
			body: form,
			signal: controller.signal
		});
		clearTimeout(timer);
		if (!res.ok) continue;
		const json = await res.json();
		const text = (json.text || json.transcript || "").trim();
		if (text) return {
			ok: true,
			text
		};
	} catch {
		continue;
	}
	return {
		ok: false,
		error: "Automatic transcription unavailable.",
		unavailable: true
	};
}
function guessFilename(mime) {
	if (mime.includes("mp4") || mime.includes("m4a")) return "note.m4a";
	if (mime.includes("mpeg") || mime.includes("mp3")) return "note.mp3";
	if (mime.includes("ogg")) return "note.ogg";
	if (mime.includes("wav")) return "note.wav";
	return "note.webm";
}
function record(result, detail) {
	aiRuntime.lastAt = (/* @__PURE__ */ new Date()).toISOString();
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
function extractJsonObject(raw) {
	const trimmed = raw.trim();
	const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const candidate = fenced ? fenced[1].trim() : trimmed;
	const start = candidate.indexOf("{");
	const end = candidate.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) throw new Error("No JSON object in model output");
	return JSON.parse(candidate.slice(start, end + 1));
}
var PATTERNS = [
	{
		kind: "email",
		re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
	},
	{
		kind: "phone",
		re: /(?:\+91[\s-]?)?[6-9]\d{9}\b/g
	},
	{
		kind: "phone",
		re: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
	},
	{
		kind: "handle",
		re: /(?<!\w)@[A-Za-z0-9._]{2,32}/g
	},
	{
		kind: "username",
		re: /\b(?:user(?:name)?|id|handle)\s*[:#]?\s*[A-Za-z0-9._]{3,32}\b/gi
	},
	{
		kind: "school",
		re: /\b(?:[A-Z][\w'.-]+(?:\s+[A-Z][\w'.-]+){0,4}\s+)?(?:School|Vidyalaya|Vidya Mandir|Academy|Convent|High School|Public School)\b/g
	},
	{
		kind: "address",
		re: /\b(?:house|flat|plot|street|nagar|road|sector|lane|block)\s+[\w.-]+(?:\s+[\w.-]+){0,4}/gi
	}
];
var NAME_HINT = /\b(?:my name is|i am|i['’]m|naam(?:\s+hai)?|mera naam)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?|[A-Za-z\u0900-\u097F]{2,})/gi;
var LOCATION_HINT = /\b(?:in|at|from|near)\s+(Panaji|Goa|Mumbai|Delhi|Pune|Chennai|Bengaluru|Bangalore|Kolkata|Hyderabad|Jaipur|Lucknow|Ahmedabad|Surat|Indore|Bhopal|Patna|Nagpur|Kanpur|Noida|Gurgaon|Gurugram|[A-Z][a-z]{3,})\b/g;
function detectAndRedactPii(text) {
	const original = text;
	let redacted = text;
	const hits = [];
	const apply = (kind, re) => {
		const copy = new RegExp(re.source, re.flags);
		redacted = redacted.replace(copy, (value) => {
			hits.push({
				kind,
				value
			});
			return "[REDACTED]";
		});
	};
	for (const { kind, re } of PATTERNS) apply(kind, re);
	apply("name", NAME_HINT);
	apply("location", LOCATION_HINT);
	const unique = dedupeHits(hits);
	const sampleSrc = original.length > 280 ? `${original.slice(0, 280)}…` : original;
	const sampleRed = redacted.length > 280 ? `${redacted.slice(0, 280)}…` : redacted || sampleSrc;
	return {
		hits: unique,
		detected: unique.length,
		redacted: unique.length,
		identityExposed: false,
		originalSample: sampleSrc || "No text provided.",
		redactedSample: unique.length ? sampleRed : sampleSrc || "No text provided."
	};
}
function dedupeHits(hits) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const h of hits) {
		const key = `${h.kind}:${h.value.toLowerCase()}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(h);
	}
	return out;
}
var risk_engine_exports = /* @__PURE__ */ __exportAll$1({
	INDICATOR_LABELS: () => INDICATOR_LABELS,
	INDICATOR_WEIGHTS: () => INDICATOR_WEIGHTS,
	bandFromScore: () => bandFromScore,
	projectedScore: () => projectedScore,
	scoreAnalysis: () => scoreAnalysis,
	scoreBySession: () => scoreBySession,
	scoreIndicators: () => scoreIndicators
});
var INDICATOR_WEIGHTS = {
	identity_probing: 10,
	personal_information: 15,
	trust_building: 10,
	secrecy_pressure: 20,
	isolation: 20,
	image_solicitation: 25,
	manipulation: 20,
	threat: 30,
	blackmail: 35,
	repeated_unwanted_contact: 15
};
var INDICATOR_LABELS = {
	identity_probing: "Age / identity probing",
	personal_information: "Personal information extraction",
	trust_building: "Trust-building behaviour",
	secrecy_pressure: "Secrecy pressure",
	isolation: "Isolation from trusted adults",
	image_solicitation: "Image solicitation",
	manipulation: "Manipulation",
	threat: "Threat",
	blackmail: "Blackmail",
	repeated_unwanted_contact: "Repeated unwanted contact"
};
function bandFromScore(score) {
	if (score >= 75) return "critical";
	if (score >= 50) return "high";
	if (score >= 25) return "medium";
	return "low";
}
function severityFloor(sev) {
	if (sev === "critical") return .95;
	if (sev === "high") return .85;
	if (sev === "medium") return .7;
	return .55;
}
/**
* Score a set of LLM indicators. Duplicate types keep the highest
* (weight × confidence) contribution.
*/
function scoreIndicators(indicators) {
	const best = /* @__PURE__ */ new Map();
	for (const ind of indicators) {
		const weight = INDICATOR_WEIGHTS[ind.type];
		if (weight == null) continue;
		const confidence = clamp01(ind.confidence);
		if (confidence < .35) continue;
		const contribution = Math.round(weight * Math.max(confidence, severityFloor(ind.severity)));
		const current = best.get(ind.type);
		const next = {
			type: ind.type,
			label: INDICATOR_LABELS[ind.type],
			weight,
			contribution,
			severity: ind.severity,
			confidence,
			evidence: ind.evidence,
			source: ind.source,
			whyItMatters: ind.why_it_matters
		};
		if (!current || next.contribution > current.contribution) best.set(ind.type, next);
	}
	const contributions = [...best.values()].sort((a, b) => b.contribution - a.contribution);
	const raw = contributions.reduce((sum, c) => sum + c.contribution, 0);
	const score = Math.max(0, Math.min(100, raw));
	return {
		score,
		band: bandFromScore(score),
		contributions,
		uniqueTypes: contributions.map((c) => c.type)
	};
}
function scoreAnalysis(analysis) {
	return scoreIndicators(analysis.risk_indicators);
}
/** Session-by-session cumulative score from session_signals or message groups. */
function scoreBySession(analysis, fallbackTypes) {
	const sessions = analysis.session_signals && analysis.session_signals.length ? [...analysis.session_signals].sort((a, b) => a.session_index - b.session_index) : fallbackTypes.map((types, i) => ({
		session_index: i + 1,
		label: `Session ${i + 1}`,
		indicators: types
	}));
	const seen = /* @__PURE__ */ new Set();
	let prev = 0;
	return sessions.map((s) => {
		for (const t of s.indicators) seen.add(t);
		const scored = scoreIndicators([...seen].map((type) => {
			return analysis.risk_indicators.find((r) => r.type === type) ?? {
				type,
				severity: "medium",
				confidence: .7,
				evidence: "",
				source: s.label,
				why_it_matters: ""
			};
		}));
		const delta = scored.score - prev;
		const newest = s.indicators[s.indicators.length - 1];
		const event = newest ? INDICATOR_LABELS[newest] : "No new indicator";
		prev = scored.score;
		return {
			label: s.label || `Session ${s.session_index}`,
			types: s.indicators,
			score: scored.score,
			delta,
			event
		};
	});
}
function projectedScore(score, direction) {
	if (direction === "escalating") return Math.min(100, score + 7);
	if (direction === "declining") return Math.max(0, score - 6);
	return score;
}
function clamp01(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.max(0, Math.min(1, n));
}
var STAGE_MAP = {
	contact: "contact",
	trust_building: "trust",
	personal_information: "personal_info",
	secrecy: "secrecy",
	isolation: "isolation",
	image_solicitation: "image",
	manipulation: "manipulation",
	threat: "threat",
	blackmail: "threat"
};
function mapToAnalysisResult(analysis, messages, meta) {
	const scored = scoreAnalysis(analysis);
	const threatType = toThreat(analysis.threat_type);
	const lang = toLang(analysis.language_code, messages);
	const behaviours = buildBehaviours(scored.contributions, messages);
	const chain = buildChain(analysis.behavioural_stages, scored.contributions, messages);
	const sessions = buildSessions(messages, analysis, scored.contributions);
	const timeline = buildTimeline(analysis, messages, scored.score);
	const trajectory = analysis.escalation_signal === "escalating" ? "Escalating" : analysis.escalation_signal === "declining" ? "Declining" : "Stable";
	const projected = projectedScore(scored.score, analysis.escalation_signal);
	const pii = detectAndRedactPii(messages.map((m) => m.text).join("\n"));
	const indicators = scored.contributions.map((c) => ({
		id: c.type,
		type: c.type,
		label: c.label,
		severity: c.severity,
		source: c.source,
		contribution: c.contribution,
		evidence: c.evidence,
		whyItMatters: c.whyItMatters,
		confidence: c.confidence
	}));
	const crossPatterns = buildCross(scored.uniqueTypes, sessions);
	return {
		risk: scored.score,
		projectedRisk: projected,
		singleMessageRisk: sessions[0]?.singleMessageRisk ?? Math.min(18, scored.score),
		band: scored.band,
		behaviours,
		chain,
		sessions,
		crossPatterns,
		indicators,
		timeline,
		trajectory,
		why: indicators.map((i) => i.label),
		recommendation: recommend(threatType, scored.band, indicators),
		summary: analysis.summary,
		detectedLanguage: lang,
		languageLabel: analysis.language || LANG_LABELS[lang] || String(lang),
		normalizedMeaning: analysis.normalized_meaning,
		privacy: {
			piiDetected: pii.detected,
			redacted: pii.redacted,
			identityExposed: false,
			autonomousEscalation: false,
			humanApproval: true,
			originalSample: pii.originalSample,
			redactedSample: pii.redactedSample
		},
		messages,
		threatType,
		threatLabel: threatType === "suspicious" && analysis.threat_type === "none" ? "No concerning pattern" : threatLabel(threatType),
		confidenceLabel: meta.analysisMode === "live" ? "Live model" : "Fallback",
		modelStatus: meta.analysisMode === "live" ? "Live LLM" : "Unavailable",
		autonomousAction: "Disabled",
		humanReview: "REQUIRED",
		escalationNote: "Simulated trajectory — not a validated prediction. The system does not accuse a person, contact police, or expose a child's identity. A trained human reviews every consequential step. Model-reported confidence is not a validated safety probability.",
		analysisMode: meta.analysisMode,
		isSynthetic: meta.isSynthetic,
		modelName: meta.modelName,
		modelConfidence: Math.round(analysis.model_confidence * 100),
		latencyMs: meta.latencyMs,
		recommendedHumanReview: analysis.recommended_human_review || scored.band === "high" || scored.band === "critical",
		uncertainty: analysis.uncertainty,
		visionUsed: meta.visionUsed,
		visionNote: meta.visionNote,
		transcriptionNote: meta.transcriptionNote,
		provider: meta.provider,
		evidenceSources: uniqueSources(messages)
	};
}
function toThreat(t) {
	if (t === "none") return "suspicious";
	return t;
}
function toLang(code, messages) {
	const joined = messages.map((m) => m.text).join(" ");
	const detected = detectLanguage(joined);
	const raw = (code || "").trim();
	if (!raw) return detected;
	if ([
		"en",
		"hi",
		"hi-Latn",
		"mr",
		"bn",
		"ta",
		"te",
		"kn",
		"ml",
		"gu",
		"pa"
	].includes(raw)) return raw;
	return detected;
}
function buildBehaviours(contrib, messages) {
	return [
		{
			id: "age_probe",
			label: "Age / identity probing",
			types: ["identity_probing"]
		},
		{
			id: "pii_extract",
			label: "Personal information extraction",
			types: ["personal_information"]
		},
		{
			id: "trust_build",
			label: "Trust building",
			types: ["trust_building"]
		},
		{
			id: "secrecy",
			label: "Secrecy pressure",
			types: ["secrecy_pressure"]
		},
		{
			id: "isolation",
			label: "Isolation from trusted adults",
			types: ["isolation"]
		},
		{
			id: "image_ask",
			label: "Image solicitation",
			types: ["image_solicitation"]
		},
		{
			id: "blackmail",
			label: "Threat / blackmail indicators",
			types: ["threat", "blackmail"]
		},
		{
			id: "unwanted",
			label: "Repeated unwanted contact",
			types: ["repeated_unwanted_contact"]
		}
	].map((m) => {
		const hit = contrib.find((c) => m.types.includes(c.type));
		return {
			id: m.id,
			label: m.label,
			present: Boolean(hit),
			evidence: hit?.evidence ?? "Not observed in this thread.",
			weight: hit?.contribution ?? 0
		};
	});
}
function buildChain(stages, contrib, messages) {
	const present = new Set(stages.map((s) => STAGE_MAP[s]));
	if (messages.some((m) => m.speaker === "other")) present.add("contact");
	const evidenceOf = (id) => {
		return contrib.find((c) => STAGE_MAP_REVERSE[c.type] === id)?.evidence ?? "Pattern observed across the thread.";
	};
	return CHAIN_META.map((meta) => {
		const status = present.has(meta.id) ? "detected" : relatedEmerging(meta.id, present) ? "emerging" : "not_detected";
		return {
			id: meta.id,
			label: meta.label,
			status,
			evidence: status === "not_detected" ? "Not observed in this thread." : status === "emerging" ? "Early signal — not a confirmed stage." : evidenceOf(meta.id)
		};
	});
}
var STAGE_MAP_REVERSE = {
	identity_probing: "personal_info",
	personal_information: "personal_info",
	trust_building: "trust",
	secrecy_pressure: "secrecy",
	isolation: "isolation",
	image_solicitation: "image",
	manipulation: "manipulation",
	threat: "threat",
	blackmail: "threat",
	repeated_unwanted_contact: "contact"
};
function relatedEmerging(id, present) {
	if (id === "isolation" && present.has("secrecy")) return true;
	if (id === "image" && present.has("secrecy")) return true;
	if (id === "manipulation" && present.has("trust") && present.has("secrecy")) return true;
	return false;
}
function buildSessions(messages, analysis, contrib) {
	const groups = groupSessions(messages);
	const scored = scoreBySession(analysis, groups.map((g) => contrib.filter((c) => g.some((m) => m.text.includes(c.evidence.slice(0, 24)) || c.source.toLowerCase().includes("session"))).map((c) => c.type)));
	return groups.map((g, i) => ({
		index: i + 1,
		label: g[0]?.day || scored[i]?.label || `Session ${i + 1}`,
		day: g[0]?.day ?? `Session ${i + 1}`,
		text: g.map((m) => m.text).join(" / "),
		gloss: g.find((m) => m.gloss)?.gloss,
		singleMessageRisk: scored[i]?.score ?? Math.round((i + 1) / groups.length * contrib.reduce((s, c) => s + c.contribution, 0)),
		sourceLabel: g[0]?.sourceLabel
	}));
}
function groupSessions(messages) {
	const byDay = /* @__PURE__ */ new Map();
	let auto = 0;
	for (const m of messages) {
		const key = m.day || m.sourceLabel || `turn-${++auto}`;
		const list = byDay.get(key) ?? [];
		list.push(m);
		byDay.set(key, list);
	}
	const groups = [...byDay.values()];
	if (groups.length <= 1) {
		const others = messages.filter((m) => m.speaker === "other");
		if (others.length >= 3) return others.map((m) => [m]);
	}
	return groups.length ? groups : [messages];
}
function buildTimeline(analysis, messages, risk) {
	const rows = scoreBySession(analysis, groupSessions(messages).map((_, i) => {
		return analysis.risk_indicators.filter((_, idx) => idx <= i).map((r) => r.type);
	}));
	if (!rows.length) return [{
		day: "Now",
		score: risk,
		event: "Single analysis",
		delta: risk
	}];
	return rows.map((r) => ({
		day: r.label,
		score: r.score,
		event: r.event,
		delta: r.delta
	}));
}
function buildCross(types, sessions) {
	return [
		{
			id: "identity",
			label: "Repeated identity probing",
			present: types.includes("identity_probing") || types.includes("personal_information")
		},
		{
			id: "pii",
			label: "Personal information extraction",
			present: types.includes("personal_information")
		},
		{
			id: "secrecy",
			label: "Increasing secrecy",
			present: types.includes("secrecy_pressure")
		},
		{
			id: "pressure",
			label: "Escalating pressure",
			present: types.includes("image_solicitation") || types.includes("blackmail") || types.includes("threat")
		},
		{
			id: "intensity",
			label: "Increasing interaction intensity",
			present: sessions.length >= 4 || types.includes("repeated_unwanted_contact")
		}
	];
}
function recommend(kind, band, indicators) {
	if (kind === "grooming" && (band === "critical" || band === "high")) return "Review secrecy behaviour and repeated requests for personal information.";
	switch (band) {
		case "low": return indicators.length ? "Low concern. Offer safety guidance and keep the door open." : "No urgent intervention. Offer safety guidance and keep the door open.";
		case "medium": return "Encourage a trusted adult. Offer safety education. Human review is still available.";
		case "high": return "Offer a trusted-adult or counsellor pathway and create a responder review case. Do not contact authorities automatically.";
		case "critical": return "Urgent human review. Preserve redacted evidence. Open a support pathway. A person decides the next step.";
	}
}
function uniqueSources(messages) {
	return [...new Set(messages.map((m) => m.sourceLabel || m.source || "paste"))];
}
var analyze_exports = /* @__PURE__ */ __exportAll$1({
	analyzeConversation: () => analyzeConversation,
	copilotAsk: () => copilotAsk,
	extractConversationFromImages: () => extractConversationFromImages,
	generateBriefing: () => generateBriefing,
	simulateWhatIf: () => simulateWhatIf,
	transcribeVoiceNote: () => transcribeVoiceNote
});
var ANALYST_SYSTEM = `You are SurakshaNet Safety Analyst, a child-safety behavioural signal extractor for India.

You analyse conversation evidence (chat logs, screenshot text, voice transcripts) for grooming, cyberbullying, blackmail, threats, and related harms.

Rules:
- Extract behavioural indicators grounded in quoted evidence from the input. Never invent messages.
- Do NOT output a final numeric risk_score. A deterministic engine scores indicators separately.
- Do NOT determine guilt, name a perpetrator, or recommend contacting police, parents, or authorities.
- Set recommended_human_review true whenever any medium-or-higher indicator is present.
- Understand English, Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, and code-mixed text. Preserve original wording in evidence quotes.
- If the conversation is harmless (homework, casual chat, family logistics), return an empty risk_indicators array, threat_type "none", behavioural_stages [] or ["contact"] only, and recommended_human_review false.
- behavioural_stages must only include stages actually observed in the evidence.
- uncertainty lists ambiguities. Do not force a high-risk classification when evidence is thin.
- session_signals: group indicators by session/day when chronological evidence exists.
- language_code should be one of: en, hi, hi-Latn, mr, bn, ta, te, kn, ml, gu, pa.
- model_confidence is your confidence in the extraction (0-1), not a probability of harm.

Return JSON only matching the schema.`;
var OCR_SYSTEM = `You extract chat conversations from screenshots of messaging apps.
Return JSON only. For each visible bubble, identify speaker as "other" (the person messaging the child) or "child".
Preserve original language (including Hinglish). Do not translate the text field.
If text is unreadable, set low_confidence true and include what you could read.
Never invent messages that are not visible.`;
async function analyzeConversation(input) {
	if (!input.messages.length && !input.images?.length) return {
		ok: false,
		error: "Add a conversation, screenshot, or voice note first.",
		code: "empty"
	};
	const provider = resolveProvider();
	const joined = formatConversation(input.messages);
	const userParts = [{
		type: "text",
		text: `Analyse this conversation evidence for child-safety behavioural indicators.

EVIDENCE (PII redacted where detected):
${detectAndRedactPii(joined).redactedSample.length > 20 ? redactMessages(input.messages) : joined}

${input.isSynthetic ? "NOTE: This is a SYNTHETIC DEMO conversation, not a real child." : "NOTE: This is live user-provided evidence."}

Return structured JSON.`
	}];
	const visionUsed = Boolean(provider.vision && input.images?.length);
	if (visionUsed && input.images) {
		for (const img of input.images.slice(0, 4)) userParts.push({
			type: "image_url",
			image_url: { url: img.dataUrl }
		});
		userParts.push({
			type: "text",
			text: "Screenshots are attached. Use them as additional evidence. Prefer the reviewed transcript if it conflicts with OCR."
		});
	}
	const messages = [{
		role: "system",
		content: ANALYST_SYSTEM
	}, {
		role: "user",
		content: userParts
	}];
	let raw = await chatJson({
		messages,
		schema: {
			name: "safety_analysis",
			schema: LLM_ANALYSIS_JSON_SCHEMA,
			strict: true
		},
		maxTokens: 2800,
		timeoutMs: 34e3
	});
	if (!raw.ok) return {
		ok: false,
		error: raw.error,
		code: raw.code
	};
	let parsed = parseAnalysis(raw.text);
	if (!parsed.ok) {
		raw = await chatJson({
			messages: [
				...messages,
				{
					role: "assistant",
					content: raw.text
				},
				{
					role: "user",
					content: `The previous JSON failed validation (${parsed.error}). Return corrected JSON only, matching the schema. Do not invent evidence.`
				}
			],
			maxTokens: 2800,
			timeoutMs: 2e4
		});
		if (!raw.ok) return {
			ok: false,
			error: raw.error,
			code: raw.code
		};
		parsed = parseAnalysis(raw.text);
		if (!parsed.ok) return {
			ok: false,
			error: "The safety model returned invalid structured output.",
			code: "invalid_json"
		};
	}
	const meta = {
		analysisMode: "live",
		modelName: raw.ok ? raw.model : provider.model,
		latencyMs: raw.ok ? raw.latencyMs : 0,
		visionUsed,
		visionNote: visionUsed ? void 0 : input.images?.length ? "Image analysis unavailable for the current model. Text was extracted from the screenshot for analysis." : void 0,
		transcriptionNote: input.transcriptionNote,
		isSynthetic: Boolean(input.isSynthetic),
		provider: provider.id
	};
	return {
		ok: true,
		result: mapToAnalysisResult(parsed.data, input.messages, meta),
		analysis: parsed.data,
		rawMode: "live"
	};
}
async function extractConversationFromImages(images) {
	const provider = resolveProvider();
	if (!images.length) return {
		ok: false,
		error: "No screenshots attached.",
		visionUsed: false
	};
	if (!provider.vision) return {
		ok: false,
		error: "Image analysis unavailable for the current model. Paste the conversation text instead.",
		visionUsed: false
	};
	const parts = [{
		type: "text",
		text: `Extract every readable chat message from these ${images.length} screenshot(s). Label speakers as child or other. source_label should be the screenshot filename.`
	}];
	for (const img of images.slice(0, 6)) {
		parts.push({
			type: "image_url",
			image_url: { url: img.dataUrl }
		});
		parts.push({
			type: "text",
			text: `Filename: ${img.name}`
		});
	}
	const raw = await chatJson({
		messages: [{
			role: "system",
			content: OCR_SYSTEM
		}, {
			role: "user",
			content: parts
		}],
		schema: {
			name: "ocr_extract",
			schema: OCR_JSON_SCHEMA,
			strict: true
		},
		maxTokens: 2200,
		timeoutMs: 34e3
	});
	if (!raw.ok) return {
		ok: false,
		error: raw.error,
		visionUsed: true
	};
	try {
		const json = extractJsonObject(raw.text);
		const parsed = OcrExtractSchema.safeParse(json);
		if (!parsed.success) return {
			ok: false,
			error: "Could not reconstruct a conversation from the screenshot.",
			visionUsed: true
		};
		return {
			ok: true,
			extract: parsed.data,
			visionUsed: true
		};
	} catch {
		return {
			ok: false,
			error: "Could not reconstruct a conversation from the screenshot.",
			visionUsed: true
		};
	}
}
async function transcribeVoiceNote(input) {
	return transcribeAudio(input);
}
async function generateBriefing(input) {
	const raw = await chatJson({
		messages: [{
			role: "system",
			content: "You write concise factual responder briefings for a child-safety desk. Do not accuse anyone. Do not recommend contacting police. Always require human judgment. JSON only: { briefing, bullets, human_judgment_required: true }."
		}, {
			role: "user",
			content: caseContext(input.result) + "\n\nGenerate a 30-second responder briefing."
		}],
		maxTokens: 700,
		timeoutMs: 2e4
	});
	if (!raw.ok) return raw;
	try {
		const parsed = BriefingSchema.safeParse(extractJsonObject(raw.text));
		if (!parsed.success) return {
			ok: true,
			briefing: raw.text.trim(),
			bullets: [],
			human_judgment_required: true,
			model: raw.model,
			latencyMs: raw.latencyMs
		};
		return {
			ok: true,
			...parsed.data,
			model: raw.model,
			latencyMs: raw.latencyMs
		};
	} catch {
		return {
			ok: true,
			briefing: raw.text.trim(),
			bullets: [],
			human_judgment_required: true,
			model: raw.model,
			latencyMs: raw.latencyMs
		};
	}
}
async function copilotAsk(input) {
	const q = input.question.trim();
	if (!q) return {
		ok: false,
		error: "Ask a question."
	};
	const raw = await chatJson({
		messages: [{
			role: "system",
			content: "You are SurakshaNet Safety Copilot for trained responders. Answer only from the case context. Never make autonomous safeguarding decisions. Never tell the responder to contact police or parents automatically. Always state that human judgment is required. JSON: { answer, missing_information, human_judgment_required: true }."
		}, {
			role: "user",
			content: `${caseContext(input.result)}\n\nResponder question: ${q}`
		}],
		maxTokens: 900,
		timeoutMs: 2e4
	});
	if (!raw.ok) return raw;
	try {
		const parsed = CopilotReplySchema.safeParse(extractJsonObject(raw.text));
		if (!parsed.success) return {
			ok: true,
			answer: raw.text.trim(),
			missing_information: [],
			human_judgment_required: true
		};
		return {
			ok: true,
			...parsed.data
		};
	} catch {
		return {
			ok: true,
			answer: raw.text.trim(),
			missing_information: [],
			human_judgment_required: true
		};
	}
}
async function simulateWhatIf(input) {
	const labels = {
		continue: "Continue interaction",
		block: "Block contact",
		tell_adult: "Tell a trusted adult",
		counsellor: "Request counsellor support"
	};
	const raw = await chatJson({
		messages: [{
			role: "system",
			content: "You write a short PLAUSIBLE SCENARIO for a child-safety what-if simulator. It is ILLUSTRATIVE, NOT a guaranteed prediction, NOT scientifically validated. JSON: { scenario, plausible_description, illustrative_projection, not_a_prediction: true }."
		}, {
			role: "user",
			content: `${caseContext(input.result)}\n\nWhat-if: ${labels[input.scenario]}. Keep it under 120 words.`
		}],
		maxTokens: 500,
		timeoutMs: 18e3
	});
	if (!raw.ok) return raw;
	try {
		const parsed = WhatIfSchema.safeParse(extractJsonObject(raw.text));
		if (!parsed.success) return {
			ok: true,
			scenario: labels[input.scenario],
			plausible_description: raw.text.trim(),
			illustrative_projection: "Illustrative only.",
			not_a_prediction: true
		};
		return {
			ok: true,
			...parsed.data
		};
	} catch {
		return {
			ok: true,
			scenario: labels[input.scenario],
			plausible_description: raw.text.trim(),
			illustrative_projection: "Illustrative only.",
			not_a_prediction: true
		};
	}
}
function parseAnalysis(text) {
	try {
		const json = extractJsonObject(text);
		const parsed = LlmSafetyAnalysisSchema.safeParse(json);
		if (!parsed.success) return {
			ok: false,
			error: parsed.error.issues.map((i) => i.message).join("; ")
		};
		return {
			ok: true,
			data: parsed.data
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "invalid json"
		};
	}
}
function redactMessages(messages) {
	return messages.map((m) => {
		const red = detectAndRedactPii(m.text).redactedSample;
		return `${m.sourceLabel ? `[${m.sourceLabel}] ` : ""}${m.speaker.toUpperCase()}: ${red}`;
	}).join("\n");
}
function caseContext(r) {
	const indicators = r.indicators.map((i) => `- ${i.label} (${i.severity}, +${i.contribution}) evidence: ${i.evidence ?? i.source}`).join("\n");
	const thread = r.messages.slice(0, 24).map((m) => `${m.speaker}: ${detectAndRedactPii(m.text).redactedSample}`).join("\n");
	return `Risk ${r.risk}/100 (${r.band}). Threat: ${r.threatLabel}. Language: ${r.languageLabel}.
Trajectory: ${r.trajectory}. Human review: REQUIRED. Autonomous action: DISABLED.

Indicators:
${indicators || "(none)"}

Uncertainty:
${(r.uncertainty ?? []).join("; ") || "(none)"}

Redacted evidence:
${thread}`;
}
//#endregion
export { extractConversationFromImages as a, scoreAnalysis as c, copilotAsk as i, simulateWhatIf as l, analyzeConversation as n, generateBriefing as o, analyze_B7_LGu4J_exports as r, resolveProvider as s, aiRuntime as t, transcribeVoiceNote as u };
