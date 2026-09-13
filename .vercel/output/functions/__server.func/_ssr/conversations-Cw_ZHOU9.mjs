import { n as detectLanguage } from "./language-D_fIYyd4.mjs";
import { i as extractFlags, n as classify } from "./scoring-BbRGh4-y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conversations-Cw_ZHOU9.js
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
		kind: "aadhaar",
		re: /\b\d{4}\s\d{4}\s\d{4}\b/g
	},
	{
		kind: "url",
		re: /\bhttps?:\/\/[^\s]+/gi
	},
	{
		kind: "address",
		re: /\b(?:house|flat|plot|street|nagar|road|sector)\s+[\w.-]+/gi
	}
];
var NAME_HINT = /\b(?:my name is|i am|i'm|main hoon|naam)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/gi;
function redactText(input) {
	let text = input;
	const kinds = /* @__PURE__ */ new Set();
	for (const { kind, re } of PATTERNS) if (new RegExp(re.source, re.flags).test(text)) {
		kinds.add(kind);
		text = text.replace(new RegExp(re.source, re.flags), `[${kind.toUpperCase()}]`);
	}
	text = text.replace(NAME_HINT, (_m, name) => {
		kinds.add("name");
		return `my name is [${maskName(name)}]`;
	});
	return {
		text,
		kinds: [...kinds]
	};
}
function maskName(name) {
	return name.split(/\s+/).map((p) => `${p[0] ?? ""}***`).join(" ");
}
/** SHA-256 hex. Works in Node 22 and modern browsers. */
async function sha256Hex(value) {
	const data = new TextEncoder().encode(value);
	const buf = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
var STAGE_LABEL = {
	contact: "early contact",
	trust_building: "trust-building",
	isolation: "isolation from caregivers",
	exploitation_attempt: "an exploitation attempt"
};
function explain(input) {
	const top = [];
	top.push({
		label: `Classifier: ${input.classification.label.replace(/_/g, " ")}`,
		weight: Math.round(input.classification.confidence * 100),
		direction: input.classification.label === "benign" ? "down" : "up"
	});
	top.push({
		label: `Thread stage: ${STAGE_LABEL[input.stage]}`,
		weight: stageWeight(input.stage),
		direction: input.stage === "contact" ? "down" : "up"
	});
	for (const h of input.flags.hits) top.push({
		label: h.label,
		weight: 10,
		direction: "up"
	});
	top.sort((a, b) => b.weight - a.weight);
	const trimmed = top.slice(0, 6);
	const flagBits = input.flags.hits.map((h) => h.label.toLowerCase());
	const flagText = flagBits.length === 0 ? "No high-risk behavioural flags fired." : `Signals noted: ${flagBits.join("; ")}.`;
	return {
		top_factors: trimmed,
		plain_summary: input.band === "low" ? `This looks like ordinary conversation at ${STAGE_LABEL[input.stage]}. ${flagText} A human should still glance at it. AI did not decide any action.` : `This thread is in ${STAGE_LABEL[input.stage]} and currently scores ${input.score}/100 (${input.band}). ${flagText} Evidence is redacted. A human responder must confirm any next step — the model cannot intervene.`
	};
}
function stageWeight(s) {
	switch (s) {
		case "contact": return 10;
		case "trust_building": return 35;
		case "isolation": return 65;
		case "exploitation_attempt": return 90;
	}
}
function draftSafetyCase(input) {
	const explanation = explain({
		classification: input.classification,
		flags: input.flags,
		stage: input.stage,
		score: input.score,
		band: input.band
	});
	const redacted_evidence = input.evidence.slice(-8).map((t, i) => ({
		turn: i + 1,
		speaker: t.speaker,
		excerpt: clip(redactText(t.text).text, 140)
	}));
	const who = input.classification.label.replace(/_/g, " ");
	return {
		ai_generated: true,
		label: "AI-generated — human review required",
		incident_summary: `Language ${input.language}. Highest classifier label: ${who} (confidence ${Math.round(input.classification.confidence * 100)}%). Progression stage: ${input.stage.replace(/_/g, " ")}. ${explanation.plain_summary}`,
		risk_band: input.band,
		risk_score: input.score,
		stage: input.stage,
		timeline: input.timeline,
		redacted_evidence,
		explanation,
		recommended_urgency: input.priority,
		human_confirmation_required: true,
		pocso_note: "SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. A designated human officer must confirm before any irreversible step."
	};
}
function clip(s, n) {
	const t = s.replace(/\s+/g, " ").trim();
	return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
var nlpProvider = {
	classify,
	detect_language: detectLanguage,
	extract_flags: extractFlags,
	explain,
	draft_safety_case: draftSafetyCase
};
var SYNTHETIC_THREADS = [
	{
		key: "en-low-school",
		title: "EN · classmate chat about homework",
		language: "en",
		expectedBand: "low",
		expectedLabel: "benign",
		region: "MH",
		turns: [
			{
				speaker: "other",
				text: "Hey, did you finish the maths homework?"
			},
			{
				speaker: "child",
				text: "Almost. Can you send the class notes photo from the group?"
			},
			{
				speaker: "other",
				text: "Sure, I'll drop it in the class group after dinner."
			}
		]
	},
	{
		key: "en-low-surprise",
		title: "EN · surprise party (false-positive candidate)",
		language: "en",
		expectedBand: "low",
		expectedLabel: "benign",
		region: "KA",
		turns: [{
			speaker: "other",
			text: "Don't tell dad — the surprise party is at 6. Secret Santa gifts too."
		}, {
			speaker: "child",
			text: "Haha ok. I'll bring the cake."
		}]
	},
	{
		key: "en-med-bully",
		title: "EN · group exclusion",
		language: "en",
		expectedBand: "med",
		expectedLabel: "cyberbullying_risk",
		region: "DL",
		turns: [{
			speaker: "other",
			text: "Nobody likes you in the group. We'll share this around so everyone is laughing."
		}, {
			speaker: "child",
			text: "Please stop. I don't feel safe in that chat."
		}]
	},
	{
		key: "en-high-groom",
		title: "EN · secrecy + isolation (SYNTHETIC)",
		language: "en",
		expectedBand: "high",
		expectedLabel: "grooming_risk",
		region: "GJ",
		turns: [
			{
				speaker: "other",
				text: "You can tell me anything. Your parents don't get you."
			},
			{
				speaker: "other",
				text: "This is just between us. Don't tell anyone at home."
			},
			{
				speaker: "child",
				text: "I don't know. Maybe."
			}
		]
	},
	{
		key: "hi-latn-high",
		title: "Hinglish · photo + gift + off-platform (SYNTHETIC)",
		language: "hi-Latn",
		expectedBand: "high",
		expectedLabel: "grooming_risk",
		region: "UP",
		turns: [
			{
				speaker: "other",
				text: "Yaar tu bahut mature hai. Mummy papa ko mat batana."
			},
			{
				speaker: "other",
				text: "Pic bhejna, gift dunga. Whatsapp pe chalte hain."
			},
			{
				speaker: "child",
				text: "Nahi yaar, dar lag raha hai."
			}
		]
	},
	{
		key: "ta-latn-critical",
		title: "Tamil-English · isolation + exploitation attempt (SYNTHETIC)",
		language: "ta-Latn",
		expectedBand: "critical",
		expectedLabel: "exploitation_risk",
		region: "TN",
		turns: [
			{
				speaker: "other",
				text: "Un family doesn't understand you. Soladhe veetla."
			},
			{
				speaker: "other",
				text: "Vera app la pesalam. Photo anuppu, I will send gift."
			},
			{
				speaker: "other",
				text: "Meet me alone after school. Don't tell anyone we met."
			},
			{
				speaker: "child",
				text: "I am scared. Please help me."
			}
		]
	},
	{
		key: "hi-dev-med",
		title: "Hindi · secrecy (SYNTHETIC)",
		language: "hi",
		expectedBand: "med",
		expectedLabel: "grooming_risk",
		region: "RJ",
		turns: [{
			speaker: "other",
			text: "यह हमारे बीच की बात है। माता पिता को मत बताना।"
		}, {
			speaker: "child",
			text: "मुझे डर लग रहा है।"
		}]
	}
];
//#endregion
export { sha256Hex as i, nlpProvider as n, redactText as r, SYNTHETIC_THREADS as t };
