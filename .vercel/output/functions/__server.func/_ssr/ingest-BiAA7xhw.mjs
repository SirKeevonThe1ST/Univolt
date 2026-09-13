import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { c as scoreAnalysis, n as analyzeConversation } from "./analyze-B7-LGu4J.mjs";
import { s as scoreThread, t as analyseProgression } from "./scoring-BbRGh4-y.mjs";
import { n as nlpProvider, r as redactText } from "./conversations-Cw_ZHOU9.mjs";
import { n as prioritise, t as getStorageRepository } from "./storage-DDzPOkcj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ingest-BiAA7xhw.js
var ingest_BiAA7xhw_exports = /* @__PURE__ */ __exportAll({
	n: () => loadWeights,
	r: () => case_pack_exports,
	t: () => ingestThread
});
var case_pack_exports = /* @__PURE__ */ __exportAll$1({
	buildLiveSafetyCasePack: () => buildLiveSafetyCasePack,
	stageFromBehaviouralStages: () => stageFromBehaviouralStages,
	toDbBand: () => toDbBand,
	urgencyFromBand: () => urgencyFromBand
});
var EXPLOITATION_STAGES = [
	"threat",
	"blackmail",
	"image_solicitation",
	"manipulation"
];
var ISOLATION_STAGES = ["isolation", "secrecy"];
var TRUST_STAGES = ["trust_building", "personal_information"];
/** Map the LLM's finer-grained behavioural stages onto the DB's 4-stage progression column. */
function stageFromBehaviouralStages(stages) {
	const has = (set) => set.some((s) => stages.includes(s));
	if (has(EXPLOITATION_STAGES)) return "exploitation_attempt";
	if (has(ISOLATION_STAGES)) return "isolation";
	if (has(TRUST_STAGES)) return "trust_building";
	return "contact";
}
function urgencyFromBand(band) {
	if (band === "critical") return "P1";
	if (band === "high") return "P2";
	if (band === "medium") return "P3";
	return "P4";
}
/** "medium" (risk-engine / demo Severity) -> "med" (DB / SafetyCasePack RiskBand). */
function toDbBand(band) {
	return band === "medium" ? "med" : band;
}
function buildLiveSafetyCasePack(opts) {
	const { analysis, risk, turns, modelName } = opts;
	const stage = stageFromBehaviouralStages(analysis.behavioural_stages);
	const dbBand = toDbBand(risk.band === "critical" || risk.band === "high" || risk.band === "low" ? risk.band : "medium");
	const priority = urgencyFromBand(risk.band);
	const timeline = analysis.behavioural_stages.length ? analysis.behavioural_stages.map((s, i) => ({
		at: new Date(Date.now() + i).toISOString(),
		event: `${stageLabel(s)}: detected in evidence`
	})) : [{
		at: (/* @__PURE__ */ new Date()).toISOString(),
		event: "Contact: evidence received, no concerning stage detected"
	}];
	const redacted_evidence = turns.slice(-8).map((t, i) => ({
		turn: i + 1,
		speaker: t.speaker,
		excerpt: clip(t.text, 140)
	}));
	const topFactors = risk.contributions.slice(0, 6).map((c) => ({
		label: c.label,
		weight: c.contribution,
		direction: "up"
	}));
	return {
		ai_generated: true,
		label: "AI-generated — human review required",
		incident_summary: `${analysis.summary} Language: ${analysis.language}. Escalation signal: ${analysis.escalation_signal}.`,
		risk_band: dbBand,
		risk_score: risk.score,
		stage,
		timeline,
		redacted_evidence,
		explanation: {
			top_factors: topFactors,
			plain_summary: analysis.summary
		},
		recommended_urgency: priority,
		human_confirmation_required: true,
		pocso_note: "SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. A designated human officer must confirm before any irreversible step.",
		analysis_mode: "live",
		model: modelName,
		model_confidence: analysis.model_confidence,
		language_label: analysis.language,
		indicators: risk.contributions.map((c) => ({
			type: c.type,
			label: c.label,
			severity: c.severity,
			confidence: c.confidence,
			evidence: c.evidence,
			source: c.source,
			why_it_matters: c.whyItMatters,
			contribution: c.contribution
		})),
		uncertainty: analysis.uncertainty
	};
}
function stageLabel(s) {
	return s.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}
function clip(s, n) {
	const t = s.replace(/\s+/g, " ").trim();
	return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
async function loadWeights() {
	return {
		classifier_confidence: 22,
		stage: 20,
		persistence: 12,
		secrecy: 12,
		pii_request: 12,
		image_request: 10,
		age_gap: 7,
		prior_flags: 5
	};
}
async function ingestThread(input) {
	const repo = getStorageRepository();
	const weights = await loadWeights();
	const turns = input.turns.length ? input.turns : [{
		speaker: "reporter",
		text: "(empty report)"
	}];
	const { id, publicId } = await repo.createInitialReport(input);
	const joinedLang = nlpProvider.detect_language(turns.map((t) => t.text).join(" "));
	const llmMessages = turns.map((t) => ({
		speaker: t.speaker === "other" ? "other" : "child",
		text: t.text,
		source: "paste"
	}));
	let live = {
		ok: false,
		error: "AI unavailable",
		code: "no_key"
	};
	try {
		live = await analyzeConversation({ messages: llmMessages });
	} catch (err) {
		console.warn("[ai] analyzeConversation call threw error, falling back to deterministic risk engine:", err);
	}
	let score;
	let band;
	let stage;
	let factors;
	let livePack = null;
	let distress;
	let priority;
	let fallbackScored = null;
	if (live.ok) {
		const risk = scoreAnalysis(live.analysis);
		livePack = buildLiveSafetyCasePack({
			analysis: live.analysis,
			risk,
			turns,
			modelName: live.result.modelName ?? "unknown"
		});
		score = risk.score;
		band = livePack.risk_band;
		stage = livePack.stage;
		factors = risk.contributions.map((c) => ({
			key: c.type,
			label: c.label,
			points: c.contribution
		}));
		distress = livePack.risk_band === "critical" || (input.severity ?? 0) >= 4;
		priority = livePack.recommended_urgency;
	} else {
		fallbackScored = scoreThread(turns, weights, 0);
		score = fallbackScored.score;
		band = fallbackScored.band;
		stage = fallbackScored.stage;
		factors = fallbackScored.factors;
		distress = fallbackScored.flags.distress || (input.severity ?? 0) >= 4;
		priority = prioritise({
			band,
			stage,
			distress
		}).priority;
	}
	const { history } = analyseProgression(turns);
	const now = /* @__PURE__ */ new Date();
	const timeline = history.map((h) => ({
		at: now.toISOString(),
		event: `${h.stage}: ${h.reason}`
	}));
	const pack = livePack ?? {
		...nlpProvider.draft_safety_case({
			evidence: turns.map((t) => ({
				...t,
				text: redactText(t.text).text
			})),
			timeline,
			classification: fallbackScored.classification,
			flags: fallbackScored.flags,
			stage,
			score,
			band,
			priority,
			language: joinedLang
		}),
		analysis_mode: "fallback",
		label: "AI-generated — human review required",
		pocso_note: `DEMO FALLBACK — AI SERVICE UNAVAILABLE. ${live.ok ? "" : live.error ?? ""} This pack was built from the offline rule/lexicon classifier, not a live model call. SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. A designated human officer must confirm before any irreversible step.`
	};
	const flags = [];
	for (const turn of turns) for (const h of nlpProvider.extract_flags(turn.text, turns).hits) flags.push({
		flag: h.flag,
		label: h.label
	});
	await repo.updateCaseAnalysis(id, {
		score,
		band,
		stage,
		priority,
		distress,
		factors,
		flags,
		history,
		pack,
		analysisMode: live.ok ? "live" : "fallback",
		modelName: live.ok ? live.result.modelName ?? null : null
	});
	return {
		id,
		publicId,
		score,
		band,
		priority,
		stage
	};
}
//#endregion
export { ingest_BiAA7xhw_exports as n, loadWeights as r, ingestThread as t };
