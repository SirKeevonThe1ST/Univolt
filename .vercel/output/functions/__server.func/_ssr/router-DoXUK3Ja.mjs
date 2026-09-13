import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useNavigate, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { _ as whyFromIndicators, a as bandFromRisk, c as buildIndicators, d as projectedFrom, f as scaleTimeline, g as trajectoryDirection, h as threatLabel, l as buildSessions, m as statusLabel, o as buildChain, p as singleMessageRiskOf, s as buildCrossPatterns, u as privacyFromMessages } from "./intelligence-Dr71N71v.mjs";
import { n as detectLanguage, t as LANG_LABELS } from "./language-D_fIYyd4.mjs";
import { bn as union, gn as object, hn as number, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as extractFlags, r as cn, s as scoreThread } from "./scoring-BbRGh4-y.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as Area, i as XAxis, l as ResponsiveContainer, o as CartesianGrid, r as YAxis, s as ReferenceLine, t as AreaChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
import { D as Check, E as Circle, _ as Minus, i as TriangleAlert, m as Play, t as X } from "../_libs/lucide-react.mjs";
import { t as auth } from "./server-CZenviKC.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BYn6m9DU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GROOM = {
	en: [
		{
			speaker: "other",
			text: "What's your name?",
			day: "Day 1",
			gloss: "Asks the child's name."
		},
		{
			speaker: "child",
			text: "why do you want to know?",
			day: "Day 1"
		},
		{
			speaker: "other",
			text: "What school do you go to?",
			day: "Day 3",
			gloss: "Asks for the school name."
		},
		{
			speaker: "other",
			text: "Do your parents check your phone?",
			day: "Day 5",
			gloss: "Checks whether trusted adults can see the chat."
		},
		{
			speaker: "other",
			text: "Don't tell anyone we're talking.",
			day: "Day 7",
			gloss: "Asks the child to keep the chat secret."
		},
		{
			speaker: "other",
			text: "Send me a picture.",
			day: "Day 8",
			gloss: "Asks for a private image."
		}
	],
	hi: [
		{
			speaker: "other",
			text: "तुम कितने साल की हो?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "child",
			text: "क्यों पूछ रहे हो?",
			day: "Day 1",
			gloss: "Why are you asking?"
		},
		{
			speaker: "other",
			text: "स्कूल कहाँ है?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "माता-पिता फ़ोन देखते हैं?",
			day: "Day 5",
			gloss: "Do parents check the phone?"
		},
		{
			speaker: "other",
			text: "किसी को मत बताना",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "फ़ोटो भेजो",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	"hi-Latn": [
		{
			speaker: "other",
			text: "kya kar rahi ho?",
			day: "Day 1",
			gloss: "What are you doing?"
		},
		{
			speaker: "child",
			text: "homework. tum kaun ho?",
			day: "Day 1",
			gloss: "Homework. Who are you?"
		},
		{
			speaker: "other",
			text: "school kaha hai?",
			day: "Day 3",
			gloss: "Where is your school?"
		},
		{
			speaker: "other",
			text: "mummy papa phone check karte hain kya?",
			day: "Day 5",
			gloss: "Do your parents check your phone?"
		},
		{
			speaker: "other",
			text: "kisi ko mat batana",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "photo bhejo",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	mr: [
		{
			speaker: "other",
			text: "तू किती वर्षांची आहेस?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "शाळा कुठे आहे?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "आई-बाबांना सांगू नकोस",
			day: "Day 7",
			gloss: "Don't tell your parents."
		},
		{
			speaker: "other",
			text: "फोटो पाठव",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	bn: [
		{
			speaker: "other",
			text: "তোর বয়স কত?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "স্কুল কোথায়?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "কাউকে বলিস না",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "ছবি পাঠা",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	ta: [
		{
			speaker: "other",
			text: "உன் வயசு என்ன?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "ஸ்கூல் எங்க?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "யாருக்கும் சொல்லாதே",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "போட்டோ அனுப்பு",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	te: [
		{
			speaker: "other",
			text: "నీ వయసు ఎంత?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "స్కూల్ ఎక్కడ?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "ఎవరికీ చెప్పకు",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "ఫోటో పంపు",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	kn: [
		{
			speaker: "other",
			text: "ನಿನ್ನ ವಯಸ್ಸು ಎಷ್ಟು?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "ಶಾಲೆ ಎಲ್ಲಿ?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "ಯಾರಿಗೂ ಹೇಳಬೇಡ",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "ಫೋಟೋ ಕಳುಹಿಸು",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	ml: [
		{
			speaker: "other",
			text: "നിന്റെ വയസ്സ് എത്ര?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "സ്കൂൾ എവിടെ?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "ആരോടും പറയരുത്",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "ഫോട്ടോ അയക്ക്",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	gu: [
		{
			speaker: "other",
			text: "તારી ઉંમર કેટલી છે?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "સ્કૂલ ક્યાં છે?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "કોઈને કહેતો નહીં",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "ફોટો મોકલ",
			day: "Day 8",
			gloss: "Send a photo."
		}
	],
	pa: [
		{
			speaker: "other",
			text: "ਤੇਰੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?",
			day: "Day 1",
			gloss: "How old are you?"
		},
		{
			speaker: "other",
			text: "ਸਕੂਲ ਕਿੱਥੇ ਹੈ?",
			day: "Day 3",
			gloss: "Where is the school?"
		},
		{
			speaker: "other",
			text: "ਕਿਸੇ ਨੂੰ ਨਾ ਦੱਸੀਂ",
			day: "Day 7",
			gloss: "Don't tell anyone."
		},
		{
			speaker: "other",
			text: "ਫੋਟੋ ਭੇਜ",
			day: "Day 8",
			gloss: "Send a photo."
		}
	]
};
var BULLY_EN = [
	{
		speaker: "other",
		text: "nobody likes you in the group",
		day: "Day 1",
		gloss: "Group exclusion."
	},
	{
		speaker: "other",
		text: "we'll share this around so everyone is laughing",
		day: "Day 3",
		gloss: "Threat to circulate humiliation."
	},
	{
		speaker: "child",
		text: "please stop. I don't feel safe in that chat",
		day: "Day 3"
	},
	{
		speaker: "other",
		text: "too late. everyone already saw it",
		day: "Day 5",
		gloss: "Continues after the child asks to stop."
	}
];
var BLACKMAIL_EN = [
	{
		speaker: "other",
		text: "i still have that picture you sent last week",
		day: "Day 1",
		gloss: "Claims to hold an image."
	},
	{
		speaker: "other",
		text: "send more or i will post it",
		day: "Day 3",
		gloss: "Threatens to publish unless more images are sent."
	},
	{
		speaker: "child",
		text: "please don't. i'm scared",
		day: "Day 3"
	},
	{
		speaker: "other",
		text: "then do what i say and don't tell anyone",
		day: "Day 5",
		gloss: "Pairs coercion with secrecy."
	}
];
var THREAT_EN = [
	{
		speaker: "other",
		text: "i know where your school is",
		day: "Day 1",
		gloss: "Claims knowledge of location."
	},
	{
		speaker: "other",
		text: "if you tell a teacher i will wait outside",
		day: "Day 3",
		gloss: "Threat tied to disclosure."
	},
	{
		speaker: "child",
		text: "leave me alone",
		day: "Day 3"
	}
];
var SUSPICIOUS_EN = [
	{
		speaker: "other",
		text: "you seem mature for your class",
		day: "Day 1",
		gloss: "Age-inappropriate compliment."
	},
	{
		speaker: "other",
		text: "want to talk somewhere else? this app is boring",
		day: "Day 3",
		gloss: "Suggests moving off-platform."
	},
	{
		speaker: "child",
		text: "i don't think so",
		day: "Day 3"
	}
];
function clone(kind, lang, messages) {
	return {
		kind,
		severity: kind === "suspicious" ? "medium" : kind === "cyberbullying" ? "high" : "critical",
		lang,
		title: `${kind} · ${lang}`,
		messages,
		normalized: messages.filter((m) => m.gloss).map((m) => `${m.text} → ${m.gloss}`).join(" · ")
	};
}
function getScenario(kind, lang, severity) {
	if (kind === "grooming") {
		const pack = clone("grooming", lang, GROOM[lang] ?? GROOM.en);
		pack.severity = severity;
		pack.normalized = "The other account probes identity and school, checks whether parents can see the phone, asks for secrecy, then requests a picture.";
		return pack;
	}
	if (kind === "cyberbullying") {
		const pack = clone("cyberbullying", lang, lang === "en" ? BULLY_EN : localizeFallback(BULLY_EN, lang));
		pack.severity = severity;
		pack.normalized = "A group chat is used to exclude, humiliate, and continue after the child asks to stop.";
		return pack;
	}
	if (kind === "blackmail") {
		const pack = clone("blackmail", lang, lang === "en" ? BLACKMAIL_EN : localizeFallback(BLACKMAIL_EN, lang));
		pack.severity = severity;
		pack.normalized = "The other account claims to hold an image and threatens to publish it unless more are sent, while demanding secrecy.";
		return pack;
	}
	if (kind === "threat") {
		const pack = clone("threat", lang, lang === "en" ? THREAT_EN : localizeFallback(THREAT_EN, lang));
		pack.severity = severity;
		pack.normalized = "The other account claims knowledge of the school and threatens contact if the child tells a trusted adult.";
		return pack;
	}
	const pack = clone("suspicious", lang, lang === "en" ? SUSPICIOUS_EN : localizeFallback(SUSPICIOUS_EN, lang));
	pack.severity = severity;
	pack.normalized = "Compliment about maturity plus an attempt to move the conversation off this platform.";
	return pack;
}
function localizeFallback(en, lang) {
	if (lang === "hi-Latn") return en.map((m) => ({
		...m,
		text: m.gloss ? `${m.gloss} (demo mix)` : m.text
	}));
	return en;
}
getScenario("grooming", "en", "critical");
var BEHAVIOUR_META = [
	{
		id: "age_probe",
		label: "Age / identity probing"
	},
	{
		id: "pii_extract",
		label: "Personal information extraction"
	},
	{
		id: "trust_build",
		label: "Trust building"
	},
	{
		id: "secrecy",
		label: "Secrecy pressure"
	},
	{
		id: "isolation",
		label: "Isolation from trusted adults"
	},
	{
		id: "image_ask",
		label: "Image solicitation"
	},
	{
		id: "blackmail",
		label: "Threat / blackmail indicators"
	},
	{
		id: "unwanted",
		label: "Repeated unwanted contact"
	}
];
function targetScore(kind, severity, live) {
	const curated = Math.min(96, {
		low: 16,
		medium: 38,
		high: 62,
		critical: 84
	}[severity] + {
		grooming: 4,
		cyberbullying: 0,
		blackmail: 6,
		threat: 5,
		suspicious: -8
	}[kind]);
	if (kind === "grooming" && severity === "critical") return 87;
	return Math.round(curated * .72 + live * .28);
}
function analyseMessages(messages, opts = {}) {
	const turns = messages.map((m) => ({
		speaker: m.speaker,
		text: m.text
	}));
	const joined = messages.map((m) => m.text).join("\n");
	const live = scoreThread(turns);
	const flags = extractFlags(joined, turns);
	const kind = opts.kind ?? inferKind(flags, live.classification.label);
	const severity = opts.severity ?? bandFromRisk(live.score);
	const risk = opts.curated ? targetScore(kind, severity, live.score) : live.score;
	const band = bandFromRisk(risk);
	const lang = detectLanguage(joined);
	const languageLabel = LANG_LABELS[lang] ?? String(lang);
	const behaviours = BEHAVIOUR_META.map((meta) => {
		const present = isPresent(meta.id, flags, kind, messages);
		return {
			...meta,
			present,
			evidence: present ? evidenceFor(meta.id, messages) : "Not observed in this thread.",
			weight: present ? weightFor(meta.id) : 0
		};
	});
	const sessions = buildSessions(messages);
	const chain = buildChain(behaviours, kind, band);
	const crossPatterns = buildCrossPatterns(behaviours, sessions, kind);
	const indicators = buildIndicators(behaviours, sessions, kind);
	const why = whyFromIndicators(indicators);
	const timeline = opts.curated || kind === "grooming" ? scaleTimeline(risk) : inferredTimeline(messages, risk);
	const trajectory = trajectoryDirection(timeline);
	const projectedRisk = projectedFrom(risk, trajectory);
	const privacy = privacyFromMessages(messages);
	const normalized = messages.filter((m) => m.gloss).map((m) => m.gloss).join(" → ") || "Meaning taken from the original wording (prototype normalisation).";
	return {
		risk,
		projectedRisk,
		singleMessageRisk: singleMessageRiskOf(sessions),
		band,
		behaviours,
		chain,
		sessions,
		crossPatterns,
		indicators,
		timeline,
		trajectory,
		why: why.length ? why : ["No high-concern behavioural pattern was accumulated in this sample."],
		recommendation: recommend(kind, band),
		summary: summarise(kind, band, behaviours),
		detectedLanguage: lang,
		languageLabel,
		normalizedMeaning: normalized,
		privacy,
		messages,
		threatType: kind,
		threatLabel: threatLabel(kind),
		confidenceLabel: "Simulated",
		modelStatus: "Prototype",
		autonomousAction: "Disabled",
		humanReview: "REQUIRED",
		escalationNote: "Simulated trajectory — not a validated prediction. The system does not accuse a person, contact police, or expose a child's identity. A trained human reviews every consequential step.",
		analysisMode: "prototype",
		isSynthetic: Boolean(opts.curated),
		recommendedHumanReview: band === "high" || band === "critical",
		uncertainty: []
	};
}
function analyseScenario(kind, lang, severity) {
	const pack = getScenario(kind, lang, severity);
	const result = analyseMessages(pack.messages, {
		kind,
		severity,
		lang,
		curated: true
	});
	result.normalizedMeaning = pack.normalized;
	return result;
}
function inferKind(flags, label) {
	if (flags.blackmail) return "blackmail";
	if (label === "cyberbullying_risk") return "cyberbullying";
	if (label === "exploitation_risk" && flags.image_request) return "grooming";
	if (label === "grooming_risk") return "grooming";
	if (flags.image_request || flags.secrecy) return "grooming";
	return "suspicious";
}
function isPresent(id, flags, kind, messages) {
	const text = messages.map((m) => m.text.toLowerCase()).join(" ");
	switch (id) {
		case "age_probe": return flags.age_probe || /old are you|what's your name|kitne saal|umar|kya kar|वयस|বয়স|వయసు|ವಯಸ್ಸು|വയസ്സ്|ઉંમર|ਉਮਰ/.test(text);
		case "pii_extract": return flags.pii_request || /school|स्कूल|স্কুল|ஸ்கூல்|స్కూల్|ಶಾಲೆ|സ്കൂൾ|સ્કૂલ|ਸਕੂਲ/.test(text);
		case "trust_build": return flags.trust_build || kind === "grooming";
		case "secrecy": return flags.secrecy || /don't tell|mat batana|मत बताना|बলিস না|சொல்லாதே/.test(text);
		case "isolation": return flags.isolation || /parents check|माता-पिता|mummy papa/.test(text);
		case "image_ask": return flags.image_request || /picture|photo|pic |फोटो|ছবি|போட்டோ|ఫోటో|ഫോട്ടോ|ਫੋਟੋ/.test(text);
		case "blackmail": return flags.blackmail || kind === "blackmail" || kind === "threat";
		case "unwanted": return flags.unwanted_contact || messages.filter((m) => m.speaker === "other").length >= 4;
	}
}
function evidenceFor(id, messages) {
	const re = {
		age_probe: /old|name|saal|umar|वयस|বয়স|வயசு|వయసు|ವಯಸ್ಸು|വയസ്സ്|ઉંમર|ਉਮਰ|kya kar/i,
		pii_extract: /school|class|phone|स्कूल|স্কুল/i,
		trust_build: /mature|understand|kya kar/i,
		secrecy: /don't tell|mat batana|secret|मत बता|சொல்லாதே|কাউকে/i,
		isolation: /parents|mummy|papa|teacher|माता/i,
		image_ask: /picture|photo|pic|फोटो|ছবি|போட்டோ/i,
		blackmail: /post|or else|scared|blackmail|i have your/i,
		unwanted: /./
	}[id];
	const hit = messages.find((m) => m.speaker === "other" && re.test(m.text));
	return hit ? `“${hit.text}”` : "Pattern inferred across multiple turns.";
}
function weightFor(id) {
	return {
		age_probe: 12,
		pii_extract: 15,
		trust_build: 18,
		secrecy: 20,
		isolation: 16,
		image_ask: 22,
		blackmail: 28,
		unwanted: 10
	}[id];
}
function recommend(kind, band) {
	if (kind === "grooming" && (band === "critical" || band === "high")) return "Review secrecy behaviour and repeated requests for personal information.";
	switch (band) {
		case "low": return "No urgent intervention. Offer safety guidance and keep the door open.";
		case "medium": return "Encourage a trusted adult. Offer safety education. Human review is still available.";
		case "high": return "Offer a trusted-adult or counsellor pathway and create a responder review case. Do not contact authorities automatically.";
		case "critical": return "Urgent human review. Preserve redacted evidence. Open a support pathway. A person decides the next step.";
	}
}
function summarise(kind, band, behaviours) {
	const list = behaviours.filter((b) => b.present).map((b) => b.label.toLowerCase()).slice(0, 3).join(", ");
	return `High-concern pattern (${threatLabel(kind).toLowerCase()}, ${band}). Review ${list || "the accumulated behavioural signals"}. This is a risk indicator, not a finding of guilt.`;
}
function inferredTimeline(messages, risk) {
	const others = messages.filter((m) => m.speaker === "other");
	if (others.length === 0) return [{
		day: "Day 1",
		score: risk,
		event: "Single message",
		delta: risk
	}];
	return others.map((m, i) => ({
		day: m.day ?? `Turn ${i + 1}`,
		score: Math.round((i + 1) / others.length * risk),
		event: m.gloss ?? "Behavioural signal",
		delta: Math.round(risk / others.length)
	}));
}
var DEMO_CASE_ID = "demo-srk-2048";
var DEMO_CASE_PUBLIC_ID = "SRK-DEMO-2048";
function graphFor(risk) {
	return {
		nodes: [
			{
				id: "child",
				label: "CHILD",
				kind: "child",
				risk: 0
			},
			{
				id: "acc-a",
				label: "ACCOUNT A",
				kind: "account",
				risk
			},
			{
				id: "acc-b",
				label: "ACCOUNT B",
				kind: "account",
				risk: Math.max(10, risk - 30)
			},
			{
				id: "acc-c",
				label: "ACCOUNT C",
				kind: "account",
				risk: Math.max(8, risk - 48)
			}
		],
		edges: [
			{
				from: "child",
				to: "acc-a",
				strength: .92,
				label: "repeated interaction"
			},
			{
				from: "acc-a",
				to: "acc-b",
				strength: .5,
				label: "shared behaviour"
			},
			{
				from: "acc-a",
				to: "acc-c",
				strength: .32,
				label: "weak overlap"
			}
		]
	};
}
function caseFromAnalysis(a, opts) {
	return {
		id: opts.id,
		publicId: opts.publicId,
		risk: a.risk,
		projectedRisk: a.projectedRisk,
		singleMessageRisk: a.singleMessageRisk,
		band: a.band,
		threatType: a.threatType,
		threatLabel: a.threatLabel,
		ageBand: opts.ageBand ?? "13–15",
		language: opts.language,
		languageLabel: a.languageLabel,
		status: a.band === "critical" || a.band === "high" ? "human_review" : "monitoring",
		lastActivity: (/* @__PURE__ */ new Date()).toISOString(),
		summary: a.summary,
		recommendation: a.recommendation,
		why: a.why,
		behaviours: a.behaviours,
		chain: a.chain,
		sessions: a.sessions,
		crossPatterns: a.crossPatterns,
		indicators: a.indicators,
		timeline: a.timeline,
		trajectory: a.trajectory,
		messages: a.messages,
		evidence: a.messages.filter((m) => m.speaker === "other").map((m) => m.text),
		graph: graphFor(a.risk),
		audit: [
			{
				id: `${opts.id}-0`,
				at: (/* @__PURE__ */ new Date()).toISOString(),
				action: "Evidence uploaded",
				actor: "system"
			},
			{
				id: `${opts.id}-1`,
				at: (/* @__PURE__ */ new Date()).toISOString(),
				action: a.analysisMode === "live" ? "LLM analysis requested" : a.analysisMode === "fallback" ? "Demo fallback — AI service unavailable" : "Prototype analysis generated — human review required",
				actor: "system"
			},
			{
				id: `${opts.id}-2`,
				at: (/* @__PURE__ */ new Date()).toISOString(),
				action: `Risk engine calculated ${a.risk}`,
				actor: "risk-engine"
			}
		],
		privacy: a.privacy,
		detectedLanguage: a.languageLabel,
		normalizedMeaning: a.normalizedMeaning,
		region: opts.region ?? "MH",
		source: opts.source,
		analysisMode: a.analysisMode ?? (opts.source === "seed" ? "prototype" : "live"),
		isSynthetic: a.isSynthetic ?? opts.source !== "analysis",
		modelName: a.modelName,
		modelConfidence: a.modelConfidence,
		briefing: a.briefing,
		uncertainty: a.uncertainty
	};
}
function stamp(offsetMin) {
	return (/* @__PURE__ */ new Date(Date.now() - offsetMin * 6e4)).toISOString();
}
function audit(publicId, offset) {
	const t0 = Date.now() - offset * 6e4;
	const row = (min, action, actor = "system") => ({
		id: `${publicId}-${min}`,
		at: new Date(t0 + min * 1e3).toISOString(),
		action,
		actor
	});
	return [
		row(0, "Case created"),
		row(2, "AI analysis generated — human review required"),
		row(6, "Risk trajectory updated: 67 → 87"),
		row(21, "Queued for human review")
	];
}
function fromScenario(publicId, id, kind, lang, severity, status, ageBand, region, minsAgo, source = "seed") {
	const created = caseFromAnalysis(analyseScenario(kind, lang, severity), {
		id,
		publicId,
		language: lang,
		source,
		ageBand,
		region
	});
	created.status = status;
	created.lastActivity = stamp(minsAgo);
	created.audit = audit(publicId, minsAgo);
	return created;
}
function seedCases() {
	return [
		fromScenario(DEMO_CASE_PUBLIC_ID, DEMO_CASE_ID, "grooming", "hi-Latn", "critical", "human_review", "13–15", "MH", 18),
		fromScenario("SRK-1991", "demo-srk-1991", "cyberbullying", "en", "high", "support", "11–13", "DL", 42),
		fromScenario("SRK-1877", "demo-srk-1877", "blackmail", "ta", "critical", "human_review", "14–16", "TN", 55),
		fromScenario("SRK-1760", "demo-srk-1760", "suspicious", "mr", "medium", "monitoring", "10–12", "MH", 90),
		fromScenario("SRK-1652", "demo-srk-1652", "grooming", "hi", "high", "counsellor", "13–15", "UP", 140),
		fromScenario("SRK-1544", "demo-srk-1544", "cyberbullying", "en", "low", "closed", "12–14", "KA", 400)
	];
}
function nextPublicId(cases) {
	return `SRK-${2100 + cases.length}`;
}
var useDemoStore = create((set, get) => ({
	role: "responder",
	deskUnlocked: false,
	cases: seedCases(),
	selectedCaseId: DEMO_CASE_ID,
	analysis: null,
	analysisStage: "idle",
	scenarioKind: "grooming",
	scenarioSeverity: "critical",
	scenarioLang: "hi-Latn",
	sim: {
		phase: "idle",
		step: 0,
		label: ""
	},
	supportOpen: false,
	supportChoice: null,
	trustedAdult: null,
	lastChildCaseId: null,
	setRole: (role) => set({ role }),
	unlockDesk: () => set({ deskUnlocked: true }),
	setScenario: (p) => set((s) => ({
		scenarioKind: p.kind ?? s.scenarioKind,
		scenarioSeverity: p.severity ?? s.scenarioSeverity,
		scenarioLang: p.lang ?? s.scenarioLang
	})),
	runAnalysis: (messages) => {
		const { scenarioKind, scenarioSeverity, scenarioLang } = get();
		const result = messages ? analyseMessages(messages, {
			kind: scenarioKind,
			severity: scenarioSeverity,
			lang: scenarioLang,
			curated: true
		}) : analyseScenario(scenarioKind, scenarioLang, scenarioSeverity);
		result.analysisMode = result.analysisMode ?? "prototype";
		set({
			analysis: result,
			analysisStage: "done"
		});
	},
	applyLiveAnalysis: (result) => set({
		analysis: result,
		analysisStage: "done"
	}),
	setAnalysisStage: (analysisStage) => set({ analysisStage }),
	generateScenario: () => {
		const { scenarioKind, scenarioLang, scenarioSeverity } = get();
		const result = analyseScenario(scenarioKind, scenarioLang, scenarioSeverity);
		result.isSynthetic = true;
		result.analysisMode = "prototype";
		set({
			analysis: result,
			analysisStage: "idle"
		});
	},
	createCaseFromAnalysis: (source) => {
		const { analysis, cases, scenarioLang } = get();
		const a = analysis ?? analyseScenario(get().scenarioKind, get().scenarioLang, get().scenarioSeverity);
		const publicId = source === "simulation" ? DEMO_CASE_PUBLIC_ID : nextPublicId(cases);
		const created = caseFromAnalysis(a, {
			id: source === "simulation" ? DEMO_CASE_ID : `demo-${publicId.toLowerCase()}`,
			publicId,
			language: scenarioLang,
			source
		});
		set((s) => ({
			cases: [created, ...s.cases.filter((c) => c.id !== created.id)],
			selectedCaseId: created.id,
			analysis: a,
			deskUnlocked: true
		}));
		return created;
	},
	updateCase: (id, patch) => set((s) => ({ cases: s.cases.map((c) => c.id === id ? {
		...c,
		...patch,
		lastActivity: (/* @__PURE__ */ new Date()).toISOString()
	} : c) })),
	addAudit: (id, action, actor = "responder") => set((s) => ({ cases: s.cases.map((c) => c.id === id ? {
		...c,
		audit: [...c.audit, {
			id: `${id}-${c.audit.length}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			action,
			actor
		}]
	} : c) })),
	openSupport: (supportOpen) => set({ supportOpen }),
	setSupportChoice: (supportChoice) => set({ supportChoice }),
	setTrustedAdult: (trustedAdult) => set({ trustedAdult }),
	createChildCase: (choice) => {
		const { trustedAdult } = get();
		const result = analyseScenario("grooming", "en", choice === "danger" ? "critical" : choice === "unsure" ? "medium" : "high");
		result.summary = choice === "danger" ? "Child indicated immediate danger. Urgent human review. Childline 1098 offered. No autonomous contact with authorities." : "Child asked for help through the anonymous support path. Identity remains sealed.";
		set({ analysis: result });
		const created = get().createCaseFromAnalysis("child");
		get().addAudit(created.id, `Child pathway: ${choice}${trustedAdult ? ` · trusted adult preferred: ${trustedAdult}` : ""}`, "child-flow");
		set({
			lastChildCaseId: created.id,
			supportOpen: false
		});
		return created;
	},
	ingestChildReport: ({ text, analysis, screenshots, voice, region, anonymous }) => {
		const a = analysis ?? analyseMessages(text ? [{
			speaker: "child",
			text,
			source: "paste",
			sourceLabel: "Child report"
		}] : [{
			speaker: "child",
			text: "No written note.",
			source: "paste",
			sourceLabel: "Child report"
		}], { curated: false });
		set({ analysis: a });
		const created = get().createCaseFromAnalysis("child");
		get().updateCase(created.id, {
			screenshots,
			voiceNote: voice,
			region: region || created.region,
			summary: anonymous ? `${a.summary} Reporter chose to stay anonymous.` : `${a.summary} Reporter asked to be contacted.`
		});
		get().addAudit(created.id, "Anonymous child report received", "child-flow");
		if (screenshots?.length) get().addAudit(created.id, `${screenshots.length} screenshot(s) attached`, "child-flow");
		if (voice) get().addAudit(created.id, "Voice note attached", "child-flow");
		set({
			lastChildCaseId: created.id,
			deskUnlocked: true
		});
		return created;
	},
	startSim: () => {
		const result = analyseScenario("grooming", "hi-Latn", "critical");
		result.isSynthetic = true;
		set({
			sim: {
				phase: "running",
				step: 0,
				label: "DETECT"
			},
			deskUnlocked: true,
			scenarioKind: "grooming",
			scenarioSeverity: "critical",
			scenarioLang: "hi-Latn",
			analysis: result,
			analysisStage: "idle"
		});
	},
	setSimStep: (step, label) => set({ sim: {
		phase: "running",
		step,
		label
	} }),
	endSim: () => set({ sim: {
		phase: "done",
		step: 13,
		label: "INTERVENE"
	} }),
	resetSim: () => set({ sim: {
		phase: "idle",
		step: 0,
		label: ""
	} })
}));
function caseKpis(cases) {
	return {
		critical: cases.filter((c) => c.band === "critical" && c.status !== "closed").length,
		high: cases.filter((c) => c.band === "high" && c.status !== "closed").length,
		pending: cases.filter((c) => c.status === "human_review").length,
		support: cases.filter((c) => c.status === "support" || c.status === "counsellor").length
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-1gObGEk8.js
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-teal text-surface hover:bg-teal-deep",
			invert: "bg-ink text-paper hover:bg-ink-soft",
			outline: "border border-border bg-transparent text-ink hover:bg-paper-2",
			ghost: "text-ink-soft hover:bg-paper-2 hover:text-ink",
			danger: "bg-danger text-surface hover:bg-danger/90",
			exit: "bg-ink text-paper hover:bg-ink-soft font-semibold"
		},
		size: {
			sm: "h-9 rounded-[10px] px-3 text-sm",
			md: "h-11 rounded-xl px-4 text-sm",
			lg: "h-12 rounded-2xl px-5 text-base",
			xl: "h-14 rounded-2xl px-6 text-base",
			icon: "size-11 rounded-xl"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/safety-intelligence-JydG7KTU.js
function AnalysisModeMark({ mode, isSynthetic, className }) {
	if (mode === "live") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex flex-wrap items-center gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5 rounded-full bg-teal-mist px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-teal-deep",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-ok" }), "Live LLM analysis"]
		}), isSynthetic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted",
			children: "Synthetic demo · not a real child"
		})]
	});
	if (mode === "fallback") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-[#f3e6c8] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-warn", className),
		children: "Demo fallback — AI service unavailable"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted", className),
		children: "Prototype"
	});
}
function RiskTrajectory({ points, current, projected, band, direction, revealUpTo }) {
	const visible = points.slice(0, revealUpTo ?? points.length);
	const displayRisk = visible[visible.length - 1]?.score ?? current;
	const escalating = direction === "Escalating";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Risk Trajectory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-xl font-medium tracking-tight",
						children: "Behaviour over time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-ink-soft",
						children: "SurakshaNet looks for emerging risk before harm necessarily reaches its final stage."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Simulated trajectory — not a validated prediction" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 lg:grid-cols-[1fr_220px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 min-w-0",
					children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center rounded-xl border border-dashed border-border text-sm text-muted",
						children: "Waiting for behavioural signals…"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: visible,
							margin: {
								top: 8,
								right: 12,
								left: -18,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "riskFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#0E6B66",
										stopOpacity: .28
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#0E6B66",
										stopOpacity: .02
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#E7E0D3",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tick: {
										fill: "#6B7370",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [0, 100],
									tick: {
										fill: "#6B7370",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#FBF8F2",
										border: "1px solid #D4CCBE",
										borderRadius: 12,
										fontSize: 12
									},
									formatter: (value, _n, item) => {
										const p = item?.payload;
										return [`${value}  (+${p?.delta ?? 0} ${p?.event ?? ""})`, "Simulated risk"];
									}
								}),
								visible.length === points.length && projected > current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
									y: projected,
									stroke: "#8A5A12",
									strokeDasharray: "4 4",
									label: {
										value: "Projected",
										fill: "#8A5A12",
										fontSize: 10,
										position: "insideTopRight"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "score",
									stroke: "#0A524E",
									strokeWidth: 2,
									fill: "url(#riskFill)",
									dot: {
										r: 4,
										fill: "#0E6B66",
										stroke: "#FBF8F2",
										strokeWidth: 2
									},
									isAnimationActive: true,
									animationDuration: 600
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-ink px-4 py-4 text-paper",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-wide text-paper/60",
									children: "Current risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-4xl tabular-nums leading-none",
									children: displayRisk
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-paper/70",
									children: "/ 100"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs font-medium uppercase tracking-wide",
									children: band
								})
							]
						}),
						escalating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-danger/30 bg-danger/5 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-wide text-danger",
								children: "Escalation signal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-ink",
								children: "Behavioural escalation detected"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-paper px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-wide text-muted",
									children: "Projected risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-baseline gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm text-ink-soft",
											children: ["Current ", displayRisk]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-ink-soft",
											children: "→"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-2xl tabular-nums",
											children: projected
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-muted",
									children: "If the pattern continues. Simulated."
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 sm:grid-cols-2",
				children: visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-ink-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-ink",
								children: p.day
							}),
							" · ",
							p.event
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-teal-deep",
						children: [
							"+",
							p.delta,
							" → ",
							p.score
						]
					})]
				}, p.day))
			})
		]
	});
}
function TrajectoryChip({ direction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", direction === "Escalating" && "bg-danger/10 text-danger", direction === "Stable" && "bg-paper-2 text-ink-soft", direction === "Declining" && "bg-ok/10 text-ok"),
		children: direction === "Escalating" ? "↑ Escalating" : direction === "Declining" ? "↓ Declining" : "→ Stable"
	});
}
function fromCase(c) {
	return {
		risk: c.risk,
		projectedRisk: c.projectedRisk,
		band: c.band,
		trajectory: c.trajectory,
		pattern: c.threatType === "grooming" ? "Grooming progression" : c.threatLabel,
		language: c.languageLabel,
		piiProtected: !c.privacy.identityExposed,
		explanationAvailable: c.indicators.length > 0,
		humanReview: statusLabel(c.status),
		nextAction: c.recommendation,
		publicId: c.publicId,
		mode: c.analysisMode,
		isSynthetic: c.isSynthetic
	};
}
function fromResult(r) {
	return {
		risk: r.risk,
		projectedRisk: r.projectedRisk,
		band: r.band,
		trajectory: r.trajectory,
		pattern: r.threatType === "grooming" ? "Grooming progression" : r.threatLabel,
		language: r.languageLabel,
		piiProtected: !r.privacy.identityExposed,
		explanationAvailable: r.indicators.length > 0,
		humanReview: "Required",
		nextAction: r.recommendation,
		mode: r.analysisMode,
		isSynthetic: r.isSynthetic
	};
}
function SafetyIntelligence({ result, demoCase }) {
	const s = demoCase ? fromCase(demoCase) : result ? fromResult(result) : null;
	if (!s) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "rounded-xl border border-dashed border-border bg-surface px-5 py-10 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Run analysis to open the Safety Intelligence summary."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Safety Intelligence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-2xl font-medium tracking-tight",
				children: s.publicId ?? "Live analysis"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisModeMark, {
				mode: s.mode,
				isSynthetic: s.isSynthetic
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Current risk",
					value: `${s.risk} / 100`,
					detail: s.band,
					emphasis: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Trajectory",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrajectoryChip, { direction: s.trajectory }),
					detail: `Projected ${s.projectedRisk} · simulated trajectory`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Pattern",
					value: s.pattern,
					detail: s.language
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "PII",
					value: s.piiProtected ? "Protected" : "Exposed",
					detail: "Privacy-preserving analysis"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "AI explanation",
					value: s.explanationAvailable ? "Available" : "Pending"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Human review",
					value: s.humanReview
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Next action",
					value: s.nextAction,
					span: true
				})
			]
		})]
	});
}
function Tile({ label, value, detail, emphasis, span }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: emphasis ? "rounded-xl bg-ink px-4 py-4 text-paper sm:col-span-1" : span ? "rounded-xl border border-border bg-paper px-4 py-4 sm:col-span-2" : "rounded-xl border border-border bg-paper px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: emphasis ? "text-[11px] uppercase tracking-wide text-paper/60" : "text-[11px] uppercase tracking-wide text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-1 text-sm font-medium ${emphasis ? "font-display text-3xl tabular-nums" : "text-ink"}`,
				children: value
			}),
			detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: emphasis ? "mt-1 text-xs capitalize text-paper/70" : "mt-1 text-xs text-muted",
				children: detail
			})
		]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/badge-5_LGO4qJ.js
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
			neutral: "bg-paper-2 text-ink-soft",
			teal: "bg-teal-mist text-teal-deep",
			ok: "bg-teal-mist text-ok",
			warn: "bg-[#f3e6c8] text-warn",
			danger: "bg-[#f0d9d6] text-danger",
			ink: "bg-ink text-paper"
		}[tone], className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/language-analysis-dUOLU25p.js
var STATUS_COPY = {
	detected: "Detected",
	emerging: "Emerging",
	not_detected: "Not detected"
};
function StatusGlyph({ status }) {
	if (status === "detected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex size-8 items-center justify-center rounded-full bg-teal text-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-4",
			strokeWidth: 2.4
		})
	});
	if (status === "emerging") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex size-8 items-center justify-center rounded-full bg-warn text-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex size-8 items-center justify-center rounded-full border border-border bg-paper text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-3.5" })
	});
}
function BehaviouralRiskChain({ stages, revealUpTo, compact }) {
	const limit = revealUpTo ?? stages.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "Behavioural Risk Chain"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-xl font-medium tracking-tight",
					children: "Behavioural progression detected"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm leading-relaxed text-ink-soft",
					children: "The system evaluates patterns across interactions rather than relying only on individual words."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Simulated pattern" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: cn("mt-6", compact ? "grid gap-2 sm:grid-cols-2" : "space-y-0"),
			children: stages.map((stage, i) => {
				const revealed = i < limit;
				const status = revealed ? stage.status : "not_detected";
				const isLast = i === stages.length - 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "sn-rise relative flex gap-3",
					style: { animationDelay: `${Math.min(i, 8) * 70}ms` },
					children: [!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusGlyph, { status }), !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 w-px flex-1 min-h-6", revealed && status !== "not_detected" ? "bg-teal/50" : "bg-border") })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("mb-2 min-w-0 flex-1 rounded-xl border px-3 py-2.5", !revealed && "opacity-40", status === "detected" && "border-teal/40 bg-teal-mist/60", status === "emerging" && "border-warn/30 bg-[#f3e6c8]/50", status === "not_detected" && "border-border bg-paper"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusGlyph, { status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-ink",
									children: stage.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[11px] font-medium uppercase tracking-wide", status === "detected" && "text-teal-deep", status === "emerging" && "text-warn", status === "not_detected" && "text-muted"),
								children: revealed ? STATUS_COPY[status] : "Pending"
							})]
						}), revealed && !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-ink-soft",
							children: stage.evidence
						})]
					})]
				}, stage.id);
			})
		})]
	});
}
var SEV_TONE = {
	low: "ok",
	medium: "warn",
	high: "danger",
	critical: "ink"
};
function ExplainableAi({ result, indicators, revealUpTo }) {
	const shown = indicators.slice(0, revealUpTo ?? indicators.length);
	const confidence = result.modelConfidence;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "Explainable AI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-xl font-medium tracking-tight",
					children: "Why was this flagged?"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisModeMark, {
					mode: result.analysisMode,
					isSynthetic: result.isSynthetic
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink-soft",
				children: "Written for a non-technical responder. These are risk indicators, not findings of guilt."
			}),
			typeof confidence === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"Model confidence ",
					confidence,
					"% — model-reported confidence; not a validated safety probability.",
					confidence < 55 ? " Insufficient evidence for a confident assessment." : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: (result.why.length ? result.why : ["No high-concern behavioural pattern was accumulated in this sample."]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 text-sm leading-relaxed text-ink-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
				}, line))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-2",
				children: shown.map((ind) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "sn-rise rounded-xl border border-border bg-paper px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium uppercase tracking-wide text-ink",
							children: ind.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: SEV_TONE[ind.severity],
							children: ind.severity
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-2 grid gap-2 text-xs sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "What was detected"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-0.5 text-ink-soft",
								children: ind.label
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Why it matters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-0.5 text-ink-soft",
								children: ind.whyItMatters || "Behavioural safety signal for human review."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Evidence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-0.5 text-ink-soft",
									children: ind.evidence ? `“${ind.evidence}”` : "Pattern inferred across the thread."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Source"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-0.5 text-ink-soft",
								children: ind.source
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Model confidence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-0.5 font-mono tabular-nums",
								children: typeof ind.confidence === "number" ? `${Math.round(ind.confidence * 100)}%` : "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Risk contribution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-0.5 font-mono tabular-nums text-teal-deep",
								children: ["+", ind.contribution]
							})] })
						]
					})]
				}, ind.id))
			}),
			result.uncertainty && result.uncertainty.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-lg bg-paper px-3 py-2 text-xs text-muted",
				children: ["Uncertainty: ", result.uncertainty.join(" · ")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid grid-cols-3 gap-2 text-center text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-paper px-2 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Model status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-medium text-ink",
							children: result.modelStatus
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-paper px-2 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Autonomous action"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-medium text-ink",
							children: "Disabled"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-paper px-2 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Human review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-medium text-danger",
							children: "Required"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: result.escalationNote
			})
		]
	});
}
function CrossConversation({ sessions, patterns, caseRisk, revealUpTo }) {
	const visible = sessions.slice(0, revealUpTo ?? sessions.length);
	const single = visible[visible.length - 1]?.singleMessageRisk ?? sessions[0]?.singleMessageRisk ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Cross-conversation analysis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-xl font-medium tracking-tight",
						children: "Pattern accumulation detected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-ink-soft",
						children: "Single message risk is not the same as total case risk. The score rises as sessions accumulate."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Synthetic sessions" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 space-y-0",
				children: sessions.map((s, i) => {
					const shown = i < visible.length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative flex gap-4 pb-5 last:pb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex size-8 items-center justify-center rounded-full font-mono text-xs", shown ? "bg-ink text-paper" : "border border-border bg-paper text-muted"),
								children: s.index
							}), i < sessions.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 w-px flex-1 bg-border" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("min-w-0 flex-1 rounded-xl border px-4 py-3", shown ? "border-border bg-paper sn-rise" : "border-dashed border-border opacity-40"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-medium uppercase tracking-wide text-muted",
										children: [
											s.label,
											" · ",
											s.day
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[11px] tabular-nums text-muted",
										children: ["Single-message risk ", shown ? s.singleMessageRisk : "—"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-ink",
									children: shown ? s.text : "Waiting for next session…"
								}),
								shown && s.gloss && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: s.gloss
								})
							]
						})]
					}, s.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-paper px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "Single message risk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-3xl tabular-nums",
						children: single
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-ink px-4 py-3 text-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wide text-paper/60",
							children: "Total case risk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-3xl tabular-nums",
							children: caseRisk
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-paper/70",
							children: "Single message risk ≠ total case risk"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 grid gap-2 sm:grid-cols-2",
				children: patterns.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm", p.present ? "bg-teal-mist/70 text-teal-deep" : "bg-paper text-muted"),
					children: [p.present ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.label })]
				}, p.id))
			})
		]
	});
}
function LanguageAnalysis({ result }) {
	const hits = result.behaviours.filter((b) => b.present).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "Multilingual understanding"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-xl font-medium tracking-tight",
					children: "Code-mixed analysis"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Prototype multilingual understanding" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-paper px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "Detected language"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-display text-2xl",
						children: result.languageLabel
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-paper px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "Risk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-1 flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl tabular-nums",
							children: result.risk
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: result.band === "critical" ? "ink" : result.band === "high" ? "danger" : "warn",
							children: result.band
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-border bg-paper px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Normalized meaning"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-ink-soft",
					children: result.normalizedMeaning
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Safety indicators"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "teal",
						children: h.label
					}, h.id))
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-dashboard-C2Wbar65.js
function PrivacyDashboard({ metrics }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Privacy-preserving analysis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-xl font-medium tracking-tight",
						children: "Identity stays sealed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-ink-soft",
						children: "The system minimises unnecessary exposure of child identity. Analysis runs on redacted text."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Privacy demonstration" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "rounded-xl bg-paper px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "Example input"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-ink",
						children: metrics.originalSample
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "rounded-xl border border-teal/30 bg-teal-mist/40 px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "text-[11px] uppercase tracking-wide text-teal-deep",
						children: "After redaction"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-teal-deep",
						children: metrics.redactedSample
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "PII detected",
						value: String(metrics.piiDetected)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "PII redacted",
						value: String(metrics.redacted)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Identity exposure",
						value: metrics.identityExposed ? "Yes" : "No"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Autonomous escalation",
						value: "Disabled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Human approval",
						value: "Required"
					})
				]
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-paper px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-display text-xl font-medium tabular-nums",
			children: value
		})]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/ai-B-ghDm4U.js
var analyzeEvidence = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("23613fa5c5ec9d091e7fc11f563ec7f3dc3c99a1b539079c465cb0908513a481"));
var extractScreenshots = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("ac75ccc586c5f974a3ceb2d99581759dcc6f968eaac408e876c3d9e4d48a8aff"));
var transcribeVoice = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("efb4637100b8e30a5e1592cea90da261dbf48b8889f256fdd880abcd6e324cff"));
var askCopilot = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("df10cdd3de9db6ae165740322dca73f5fb0e6314f4a1cb138c1b9bc710948077"));
var requestBriefing = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("03275d8e2cedc9376ecd1ec83a8f097b3450152085232e17c190c46af342798c"));
var requestWhatIf = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("808003d5e3c22ceaaf3216bb7139cef97bc58df899a92db4a92436e36ec7bdf0"));
var getAiHealth = createServerFn({ method: "GET" }).handler(createSsrRpc("d65db909f09208a7a75e671266470f4d8bd4c87c240e789e4d8053067b9f0159"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DoXUK3Ja.js
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var LOCALES = [
	{
		code: "en",
		label: "English",
		native: "English"
	},
	{
		code: "hi",
		label: "Hindi",
		native: "हिन्दी"
	},
	{
		code: "mr",
		label: "Marathi",
		native: "मराठी"
	},
	{
		code: "ta",
		label: "Tamil",
		native: "தமிழ்"
	}
];
var dictionaries = {
	en: {
		appName: "SurakshaNet",
		tagline: "Don't wait for a child to report harm after it happens.",
		safeExit: "Leave quickly",
		childline: "Talk to someone now",
		childlineNum: "1098",
		childPath: "I want to share something",
		staffPath: "I respond to reports",
		landingLead: "Detect emerging risk, give the child a safe path to support, and help trusted humans intervene. If something online feels wrong, you can tell us privately. You do not have to give your name. You can leave this page in one tap.",
		landingStaff: "Responders, NGO desks, and supervisors sign in to the protected console. The model never closes a case on its own.",
		howItWorks: "How detection works",
		privacy: "Privacy & law notes",
		reportTitle: "Share what happened",
		reportLead: "Tell us as little or as much as you want. You can stop at any time. We do not keep your phone, email, or location unless you ask for a call back.",
		feelTitle: "How heavy does this feel?",
		sev1: "A small thing",
		sev2: "It keeps happening",
		sev3: "I feel scared",
		sev4: "I need help now",
		whatHappened: "What happened? (optional)",
		placeholder: "You can write in English, Hindi, Marathi, Tamil, or a mix. Short is fine.",
		attachPhoto: "Attach a screenshot",
		attachVoice: "Record a voice note",
		voiceStub: "Voice notes are accepted as a sealed placeholder in this preview.",
		screenshotStub: "Screenshots are sealed and never shown in the console.",
		stayAnon: "Keep me anonymous",
		wantCallback: "I want someone to contact me",
		callbackHint: "If you choose this, your number is sealed and only opened with a supervisor's confirm.",
		contactLabel: "A number we can call (sealed)",
		regionLabel: "State or region (optional)",
		regionSkip: "I'd rather not say",
		send: "Send privately",
		sending: "Sending…",
		doneTitle: "Thank you. You are not alone.",
		doneBody: "Your note was received. A person will look at it. If you are in danger now, call 1098 — Childline is free, and it is for you.",
		caseId: "Your private reference",
		another: "Share something else",
		helpTitle: "Help is close",
		helpLead: "Childline 1098 is India's 24×7 helpline for children. It is free.",
		panicHint: "Press Esc twice, or use Leave quickly, to step away from this page.",
		lang: "Language",
		footerLegal: "Protective system. AI-generated assessments are labeled and never execute an irreversible action. Simulated agency links only.",
		console: "Responder console",
		signIn: "Sign in",
		queue: "Priority queue",
		analytics: "Analytics",
		settings: "Scoring & retention",
		audit: "Audit log",
		architecture: "Architecture",
		notes: "Notes",
		assignMe: "Assign to me",
		takeInProgress: "Mark in progress",
		escalate: "Escalate to authorities (confirm)",
		resolve: "Mark resolved",
		close: "Close case (confirm)",
		reveal: "Reveal sealed identity (confirm)",
		aiLabel: "AI-generated — human review required",
		overdue: "Overdue",
		noCases: "No cases in this filter.",
		regionView: "Region view (opt-in only)"
	},
	hi: {
		appName: "सुरक्षा नेट",
		tagline: "बताने के लिए एक शांत जगह, और जवाब देने के लिए एक सावधान मेज़।",
		safeExit: "जल्दी निकलें",
		childline: "अभी किसी से बात करें",
		childlineNum: "1098",
		childPath: "मैं कुछ बताना चाहता/चाहती हूँ",
		staffPath: "मैं रिपोर्ट देखता/देखती हूँ",
		landingLead: "अगर ऑनलाइन कुछ गलत लगे, तो आप हमें निजी तौर पर बता सकते हैं। नाम देना ज़रूरी नहीं। एक टैप में यह पेज छोड़ सकते हैं।",
		landingStaff: "रिस्पॉन्डर, एनजीओ और सुपरवाइज़र सुरक्षित कंसोल में साइन इन करते हैं। मॉडल खुद कोई केस बंद नहीं करता।",
		howItWorks: "पहचान कैसे होती है",
		privacy: "गोपनीयता और क़ानून",
		reportTitle: "जो हुआ, वह बताएँ",
		reportLead: "जितना चाहें उतना लिखें। कभी भी रुक सकते हैं। कॉल बैक न माँगें तो हम फ़ोन, ईमेल या लोकेशन नहीं रखते।",
		feelTitle: "यह कितना भारी लग रहा है?",
		sev1: "एक छोटी बात",
		sev2: "बार-बार हो रहा है",
		sev3: "डर लग रहा है",
		sev4: "अभी मदद चाहिए",
		whatHappened: "क्या हुआ? (वैकल्पिक)",
		placeholder: "अंग्रेज़ी, हिन्दी, मराठी, तमिल या मिला-जुला लिख सकते हैं। छोटा भी ठीक है।",
		attachPhoto: "स्क्रीनशॉट जोड़ें",
		attachVoice: "आवाज़ का नोट",
		voiceStub: "इस पूर्वावलोकन में आवाज़ एक सीलबंद संकेत के रूप में ली जाती है।",
		screenshotStub: "स्क्रीनशॉट सील रहते हैं और कंसोल में नहीं दिखते।",
		stayAnon: "मुझे गुमनाम रखें",
		wantCallback: "कोई मुझसे संपर्क करे",
		callbackHint: "नंबर सील रहेगा। सुपरवाइज़र की पुष्टि के बिना नहीं खुलेगा।",
		contactLabel: "एक नंबर जिस पर कॉल हो सके (सील)",
		regionLabel: "राज्य या क्षेत्र (वैकल्पिक)",
		regionSkip: "नहीं बताना चाहता/चाहती",
		send: "निजी रूप से भेजें",
		sending: "भेज रहे हैं…",
		doneTitle: "धन्यवाद। आप अकेले नहीं हैं।",
		doneBody: "आपकी बात मिल गई है। कोई व्यक्ति इसे देखेगा। अगर अभी ख़तरा है तो 1098 पर कॉल करें — चाइल्डलाइन मुफ़्त है।",
		caseId: "आपका निजी संदर्भ",
		another: "और कुछ बताएँ",
		helpTitle: "मदद पास है",
		helpLead: "चाइल्डलाइन 1098 भारत की 24×7 हेल्पलाइन है। यह मुफ़्त है।",
		panicHint: "Esc दो बार दबाएँ, या ‘जल्दी निकलें’ से यह पेज छोड़ें।",
		lang: "भाषा",
		footerLegal: "सुरक्षा प्रणाली। एआई आकलन नामांकित हैं और कोई भी अंतिम कदम इंसान की पुष्टि से ही होता है।",
		console: "रिस्पॉन्डर कंसोल",
		signIn: "साइन इन",
		queue: "प्राथमिकता कतार",
		analytics: "विश्लेषण",
		settings: "स्कोर और रख-रखाव",
		audit: "ऑडिट लॉग",
		architecture: "आर्किटेक्चर",
		notes: "नोट्स",
		assignMe: "मुझे सौंपें",
		takeInProgress: "काम शुरू",
		escalate: "अधिकारियों को भेजें (पुष्टि)",
		resolve: "हल हुआ",
		close: "केस बंद (पुष्टि)",
		reveal: "सील पहचान खोलें (पुष्टि)",
		aiLabel: "एआई-निर्मित — मानव समीक्षा ज़रूरी",
		overdue: "समय बीत गया",
		noCases: "इस फ़िल्टर में कोई केस नहीं।",
		regionView: "क्षेत्र दृश्य (सहमति पर)"
	},
	mr: {
		appName: "सुरक्षा नेट",
		tagline: "सांगण्यासाठी शांत जागा, आणि उत्तर देण्यासाठी काळजीपूर्वक डेस्क.",
		safeExit: "त्वरित निघा",
		childline: "आता कुणाशी बोला",
		childlineNum: "1098",
		childPath: "मला काही सांगायचे आहे",
		staffPath: "मी अहवाल पाहतो/पाहते",
		landingLead: "ऑनलाइन काही चुकीचे वाटत असेल तर आपण गुप्तपणे सांगू शकता. नाव देणे गरजेचे नाही. एका टॅपने हे पान सोडता येईल.",
		landingStaff: "प्रतिसादक, एनजीओ आणि पर्यवेक्षक सुरक्षित कन्सोलमध्ये साइन इन करतात. मॉडेल स्वतः केस बंद करत नाही.",
		howItWorks: "ओळख कशी होते",
		privacy: "गोपनीयता आणि कायदा",
		reportTitle: "काय झाले ते सांगा",
		reportLead: "इच्छेइतके लिहा. कधीही थांबू शकता. कॉलबॅक नको असेल तर फोन, ईमेल किंवा स्थान ठेवत नाही.",
		feelTitle: "हे किती जड वाटते?",
		sev1: "छोटी गोष्ट",
		sev2: "वारंवार होते",
		sev3: "भीती वाटते",
		sev4: "आता मदत हवी",
		whatHappened: "काय झाले? (पर्यायी)",
		placeholder: "इंग्रजी, हिंदी, मराठी, तमिळ किंवा मिश्र लिहू शकता. छोटे चालेल.",
		attachPhoto: "स्क्रीनशॉट जोडा",
		attachVoice: "आवाजाची नोंद",
		voiceStub: "या पूर्वावलोकनात आवाज सील केलेल्या संकेताने घेतला जातो.",
		screenshotStub: "स्क्रीनशॉट सील राहतात; कन्सोलमध्ये दिसत नाहीत.",
		stayAnon: "मला अनामिक ठेवा",
		wantCallback: "कोणी संपर्क करावा",
		callbackHint: "नंबर सील राहील. पर्यवेक्षकाच्या पुष्टीशिवाय उघडणार नाही.",
		contactLabel: "कॉल करता येईल असा नंबर (सील)",
		regionLabel: "राज्य किंवा प्रदेश (पर्यायी)",
		regionSkip: "सांगू इच्छित नाही",
		send: "खाजगी पाठवा",
		sending: "पाठवत आहोत…",
		doneTitle: "धन्यवाद. तुम्ही एकटे नाही.",
		doneBody: "तुमची नोंद मिळाली. एखादी व्यक्ती पाहेल. धोका असेल तर १०९८ वर कॉल करा — चाइल्डलाइन मोफत आहे.",
		caseId: "तुमचा खाजगी संदर्भ",
		another: "आणखी काही सांगा",
		helpTitle: "मदत जवळ आहे",
		helpLead: "चाइल्डलाइन १०९८ ही भारताची २४×७ हेल्पलाइन आहे. मोफत.",
		panicHint: "Esc दोनदा दाबा, किंवा ‘त्वरित निघा’ वापरा.",
		lang: "भाषा",
		footerLegal: "संरक्षण प्रणाली. एआय मूल्यांकन नामांकित आहेत; अंतिम पाऊल मानवी पुष्टीनेच.",
		console: "प्रतिसाद कन्सोल",
		signIn: "साइन इन",
		queue: "प्राधान्य रांग",
		analytics: "विश्लेषण",
		settings: "स्कोर आणि धारणा",
		audit: "ऑडिट लॉग",
		architecture: "आर्किटेक्चर",
		notes: "नोट्स",
		assignMe: "मला सोपवा",
		takeInProgress: "काम सुरू",
		escalate: "अधिकाऱ्यांकडे पाठवा (पुष्टी)",
		resolve: "सोडवले",
		close: "केस बंद (पुष्टी)",
		reveal: "सील ओळख उघडा (पुष्टी)",
		aiLabel: "एआय-निर्मित — मानवी तपास आवश्यक",
		overdue: "वेळ निघून गेली",
		noCases: "या फिल्टरमध्ये केस नाहीत.",
		regionView: "प्रदेश दृश्य (संमतीवर)"
	},
	ta: {
		appName: "சுரக்ஷா நெட்",
		tagline: "சொல்ல ஒரு அமைதியான இடம், பதிலளிக்க ஒரு கவனம் கொண்ட மேசை.",
		safeExit: "விரைவில் வெளியேறு",
		childline: "இப்போது பேசுங்கள்",
		childlineNum: "1098",
		childPath: "நான் ஏதோ பகிர விரும்புகிறேன்",
		staffPath: "நான் அறிக்கைகளை பார்க்கிறேன்",
		landingLead: "ஆன்லைனில் ஏதேனும் தவறாக இருந்தால், தனிப்பட்ட முறையில் சொல்லலாம். பெயர் தேவையில்லை. ஒரு தட்டலில் இந்த பக்கத்தை விடலாம்.",
		landingStaff: "பதிலளிப்பவர்கள் பாதுகாப்பான கன்சோலில் உள்நுழைகின்றனர். மாதிரி தானாக ஒரு வழக்கை மூவாது.",
		howItWorks: "எப்படி கண்டறியப்படுகிறது",
		privacy: "தனியுரிமை மற்றும் சட்டம்",
		reportTitle: "நடந்ததை பகிரவும்",
		reportLead: "விரும்பிய அளவு எழுதுங்கள். எப்போதும் நிறுத்தலாம். திரும்ப அழைக்கச் சொல்லாவிட்டால் எண், மின்னஞ்சல், இடம் வைக்கமாட்டோம்.",
		feelTitle: "இது எவ்வளவு பாரமாக இருக்கிறது?",
		sev1: "சிறியது",
		sev2: "மீண்டும் நடக்கிறது",
		sev3: "பயம் இருக்கிறது",
		sev4: "இப்போது உதவி வேண்டும்",
		whatHappened: "என்ன நடந்தது? (விருப்பம்)",
		placeholder: "ஆங்கிலம், இந்தி, மராத்தி, தமிழ் அல்லது கலந்து எழுதலாம். சிறிதும் போதும்.",
		attachPhoto: "திரைப்பிடிப்பு சேர்",
		attachVoice: "குரல் குறிப்பு",
		voiceStub: "இந்த முன்னோட்டத்தில் குரல் ஒரு முத்திரையிட்ட குறியாக ஏற்கப்படுகிறது.",
		screenshotStub: "திரைப்பிடிப்புகள் முத்திரையிடப்பட்டு கன்சோலில் காட்டப்படாது.",
		stayAnon: "என்னை அநாமதேயமாக வை",
		wantCallback: "யாராவது தொடர்பு கொள்ளட்டும்",
		callbackHint: "எண் முத்திரையிடப்படும். மேற்பார்வையாளர் உறுதி இல்லாமல் திறக்கப்படாது.",
		contactLabel: "அழைக்க ஒரு எண் (முத்திரை)",
		regionLabel: "மாநிலம் (விருப்பம்)",
		regionSkip: "சொல்ல விரும்பவில்லை",
		send: "தனிப்பட்ட முறையில் அனுப்பு",
		sending: "அனுப்புகிறது…",
		doneTitle: "நன்றி. நீங்கள் தனியாக இல்லை.",
		doneBody: "உங்கள் குறிப்பு கிடைத்தது. ஒருவர் பார்ப்பார். ஆபத்து இருந்தால் 1098 அழைக்கவும் — சைல்ட்லைன் இலவசம்.",
		caseId: "உங்கள் தனி குறிப்பு எண்",
		another: "இன்னும் பகிர",
		helpTitle: "உதவி அருகில் உள்ளது",
		helpLead: "சைல்ட்லைன் 1098 இந்தியாவின் 24×7 உதவி எண். இலவசம்.",
		panicHint: "Esc இருமுறை அழுத்தவும், அல்லது விரைவில் வெளியேறு பயன்படுத்தவும்.",
		lang: "மொழி",
		footerLegal: "பாதுகாப்பு அமைப்பு. AI மதிப்பீடுகள் குறிக்கப்படும்; இறுதி நடவடிக்கை மனித உறுதிப்பாட்டில் மட்டுமே.",
		console: "பதிலளிப்பு கன்சோல்",
		signIn: "உள்நுழை",
		queue: "முன்னுரிமை வரிசை",
		analytics: "பகுப்பாய்வு",
		settings: "மதிப்பெண் மற்றும் தக்கவைப்பு",
		audit: "தணிக்கை பதிவு",
		architecture: "கட்டமைப்பு",
		notes: "குறிப்புகள்",
		assignMe: "எனக்கு ஒப்படை",
		takeInProgress: "வேலை தொடங்கு",
		escalate: "அதிகாரிகளுக்கு அனுப்பு (உறுதி)",
		resolve: "தீர்ந்தது",
		close: "வழக்கை மூடு (உறுதி)",
		reveal: "முத்திரை அடையாளம் திற (உறுதி)",
		aiLabel: "AI உருவாக்கியது — மனித பரிசீலனை தேவை",
		overdue: "காலாவதி",
		noCases: "இந்த வடிகட்டியில் வழக்குகள் இல்லை.",
		regionView: "பகுதி காட்சி (ஒப்புதல்)"
	}
};
function detectBrowserLocale() {
	if (typeof navigator === "undefined") return "en";
	const nav = (navigator.language ?? "en").toLowerCase();
	if (nav.startsWith("hi")) return "hi";
	if (nav.startsWith("mr")) return "mr";
	if (nav.startsWith("ta")) return "ta";
	return "en";
}
var I18nContext = (0, import_react.createContext)(null);
function I18nProvider({ children }) {
	const [locale, setLocaleState] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem("sn.locale");
			if (saved && dictionaries[saved]) setLocaleState(saved);
			else setLocaleState(detectBrowserLocale());
		} catch {
			setLocaleState(detectBrowserLocale());
		}
	}, []);
	const setLocale = (0, import_react.useCallback)((l) => {
		setLocaleState(l);
		try {
			localStorage.setItem("sn.locale", l);
		} catch {}
	}, []);
	const t = (0, import_react.useCallback)((key) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key, [locale]);
	const value = (0, import_react.useMemo)(() => ({
		locale,
		setLocale,
		t
	}), [
		locale,
		setLocale,
		t
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nContext);
	if (!ctx) throw new Error("useI18n outside provider");
	return ctx;
}
var PHASES = [
	"DETECT",
	"ANALYZE",
	"UNDERSTAND",
	"PROTECT",
	"HUMAN REVIEW",
	"INTERVENE"
];
var BEATS = [
	{
		phase: "DETECT",
		ms: 6500,
		title: "A fictional child receives suspicious messages.",
		kicker: "Step 1 · Synthetic thread"
	},
	{
		phase: "DETECT",
		ms: 7e3,
		title: "The same account returns across five sessions.",
		kicker: "Step 2 · Cross-conversation"
	},
	{
		phase: "ANALYZE",
		ms: 6e3,
		title: "The live model begins analysing the conversation.",
		kicker: "Step 3 · Live LLM"
	},
	{
		phase: "ANALYZE",
		ms: 7500,
		title: "Behaviour indicators appear one by one.",
		kicker: "Step 4 · Not just keywords"
	},
	{
		phase: "ANALYZE",
		ms: 7e3,
		title: "Risk increases over multiple interactions.",
		kicker: "Step 5 · Accumulating score"
	},
	{
		phase: "UNDERSTAND",
		ms: 7500,
		title: "The Behavioural Risk Chain updates.",
		kicker: "Step 6 · Attack-chain"
	},
	{
		phase: "UNDERSTAND",
		ms: 7500,
		title: "The Risk Trajectory graph rises.",
		kicker: "Step 7 · Early warning"
	},
	{
		phase: "UNDERSTAND",
		ms: 7e3,
		title: "Explainable AI shows why the system is concerned.",
		kicker: "Step 8 · Human-readable"
	},
	{
		phase: "PROTECT",
		ms: 6e3,
		title: "A prioritised case is created for human review.",
		kicker: "Step 9 · Case file"
	},
	{
		phase: "HUMAN REVIEW",
		ms: 6e3,
		title: "The responder console receives the case.",
		kicker: "Step 10 · Queue"
	},
	{
		phase: "HUMAN REVIEW",
		ms: 6500,
		title: "The responder opens the case.",
		kicker: "Step 11 · Desk"
	},
	{
		phase: "HUMAN REVIEW",
		ms: 7e3,
		title: "Evidence and the AI explanation are reviewed.",
		kicker: "Step 12 · Sealed identity"
	},
	{
		phase: "INTERVENE",
		ms: 8e3,
		title: "The responder selects a recommended intervention.",
		kicker: "Step 13 · Human decision"
	},
	{
		phase: "INTERVENE",
		ms: 6500,
		title: "The decision is recorded in the audit trail.",
		kicker: "Step 14 · Accountability"
	}
];
function SimulationLauncher({ className }) {
	const start = useDemoStore((s) => s.startSim);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		className,
		variant: "invert",
		onClick: () => start(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Run safety simulation"]
	});
}
function finishSimulation() {
	const store = useDemoStore.getState();
	const result = store.analysis ?? analyseScenario("grooming", "hi-Latn", "critical");
	store.applyLiveAnalysis(result);
	const created = store.createCaseFromAnalysis("simulation");
	store.addAudit(created.id, "Simulation: case opened for human review", "system");
	store.addAudit(created.id, "Responder reviewed evidence and AI explanation", "responder");
	store.updateCase(created.id, { status: "counsellor" });
	store.addAudit(created.id, "Human confirmed: assign counsellor. Autonomous action disabled.", "responder");
}
function SimulationOverlay() {
	const sim = useDemoStore((s) => s.sim);
	const start = useDemoStore((s) => s.startSim);
	const setStep = useDemoStore((s) => s.setSimStep);
	const end = useDemoStore((s) => s.endSim);
	const reset = useDemoStore((s) => s.resetSim);
	const create = useDemoStore((s) => s.createCaseFromAnalysis);
	const addAudit = useDemoStore((s) => s.addAudit);
	const updateCase = useDemoStore((s) => s.updateCase);
	const applyLive = useDemoStore((s) => s.applyLiveAnalysis);
	const live = useDemoStore((s) => s.analysis);
	const kpis = useDemoStore((s) => s.cases);
	const navigate = useNavigate();
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const canned = (0, import_react.useMemo)(() => {
		const r = analyseScenario("grooming", "hi-Latn", "critical");
		r.isSynthetic = true;
		return r;
	}, []);
	const result = live?.messages?.length ? live : canned;
	(0, import_react.useEffect)(() => {
		if (sim.phase !== "running" || sim.step !== 0) return;
		let cancelled = false;
		(async () => {
			try {
				const res = await analyzeEvidence({ data: {
					messages: canned.messages,
					isSynthetic: true
				} });
				if (cancelled) return;
				if (res.ok) applyLive(res.result);
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		sim.phase,
		sim.step,
		applyLive,
		canned.messages
	]);
	(0, import_react.useEffect)(() => {
		if (sim.phase !== "running") return;
		const beat = BEATS[sim.step];
		if (!beat) {
			end();
			return;
		}
		const t = window.setTimeout(() => {
			const next = sim.step + 1;
			if (next >= BEATS.length) end();
			else setStep(next, BEATS[next].phase);
		}, beat.ms);
		return () => window.clearTimeout(t);
	}, [
		sim.phase,
		sim.step,
		end,
		setStep
	]);
	(0, import_react.useEffect)(() => {
		if (sim.phase !== "running") return;
		if (sim.step === 8) {
			applyLive(result);
			const created = create("simulation");
			addAudit(created.id, "Simulation: case opened for human review", "system");
		}
		if (sim.step === 12) setConfirmed(false);
		if (sim.step === 13) {
			updateCase(DEMO_CASE_ID, { status: "counsellor" });
			addAudit(DEMO_CASE_ID, "Human confirmed: assign counsellor. Autonomous action disabled.", "responder");
		}
	}, [
		sim.phase,
		sim.step,
		addAudit,
		create,
		applyLive,
		result,
		updateCase
	]);
	if (sim.phase === "idle") return null;
	const beat = BEATS[Math.min(sim.step, BEATS.length - 1)];
	const phaseIdx = PHASES.indexOf(beat?.phase ?? "DETECT");
	const demoCase = caseFromAnalysis(result, {
		id: DEMO_CASE_ID,
		publicId: DEMO_CASE_PUBLIC_ID,
		language: "hi-Latn",
		source: "simulation"
	});
	function skip() {
		finishSimulation();
		end();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "Safety simulation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Synthetic demo · not a real child" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisModeMark, {
						mode: result.analysisMode,
						isSynthetic: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [sim.phase === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: skip,
							children: "Skip to end"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-10 items-center justify-center rounded-lg hover:bg-paper-2",
							onClick: () => reset(),
							"aria-label": "Close simulation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto px-4 py-3",
				children: PHASES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[4.5rem] flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1 rounded-full", i <= phaseIdx ? "bg-teal" : "bg-paper-2") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 text-[10px] uppercase tracking-wide", i <= phaseIdx ? "text-teal-deep" : "text-muted"),
						children: p
					})]
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-4 py-6",
				children: sim.phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-lg py-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-teal",
							children: "Safety loop completed."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-4xl font-medium tracking-tight",
							children: "Detected, explained, protected, reviewed."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 space-y-2 text-left text-sm text-ink-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "rounded-xl border border-border bg-surface px-4 py-3",
									children: "AI detected the pattern."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "rounded-xl border border-border bg-surface px-4 py-3",
									children: "AI explained the pattern."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "rounded-xl border border-border bg-surface px-4 py-3",
									children: "Human reviewed the evidence."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "rounded-xl border border-ink bg-ink px-4 py-3 text-paper",
									children: "Human decided the intervention."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-sm text-ink-soft",
							children: "A counsellor was assigned. The model did not contact authorities. The audit trail recorded the decision."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
										reset();
										navigate({
											to: "/console/cases/$caseId",
											params: { caseId: DEMO_CASE_ID }
										});
									},
									children: ["Open ", DEMO_CASE_PUBLIC_ID]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => {
										reset();
										navigate({ to: "/console" });
									},
									children: "Response center"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => start(),
									children: "Run again"
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-teal",
							children: beat.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl",
							children: beat.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeatView, {
								step: sim.step,
								result,
								demoCase,
								caseCount: kpis.length,
								confirmed,
								onConfirm: () => {
									setConfirmed(true);
									updateCase(DEMO_CASE_ID, { status: "counsellor" });
									addAudit(DEMO_CASE_ID, "Human confirmed: assign counsellor", "responder");
									const next = sim.step + 1;
									if (next >= BEATS.length) end();
									else setStep(next, BEATS[next].phase);
								}
							})
						})
					]
				})
			})
		]
	});
}
function BeatView({ step, result, demoCase, caseCount, confirmed, onConfirm }) {
	const sessions = result.sessions;
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-sm rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: "Synthetic thread · Hinglish"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: result.messages.slice(0, 3).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-2xl px-3 py-2 text-sm", m.speaker === "other" ? "rounded-tl-md bg-paper-2" : "ml-6 rounded-tr-md bg-teal-mist text-teal-deep"),
				children: [m.text, m.gloss && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-[11px] text-muted",
					children: m.gloss
				})]
			}, m.text))
		})]
	});
	if (step === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrossConversation, {
		sessions,
		patterns: result.crossPatterns,
		caseRisk: result.risk,
		revealUpTo: 3
	});
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid gap-2 sm:grid-cols-2",
		children: [
			"Message analysis",
			"Behaviour detection",
			"Risk accumulation",
			"Safety assessment"
		].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "sn-rise rounded-xl border border-teal bg-teal-mist px-4 py-3 text-sm text-teal-deep",
			style: { animationDelay: `${i * 120}ms` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "block font-mono text-[11px] opacity-70",
				children: ["0", i + 1]
			}), s]
		}, s))
	});
	if (step === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BehaviouralRiskChain, {
		stages: result.chain,
		revealUpTo: 4,
		compact: true
	});
	if (step === 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTrajectory, {
		points: result.timeline,
		current: result.risk,
		projected: result.projectedRisk,
		band: result.band,
		direction: result.trajectory,
		revealUpTo: 3
	});
	if (step === 5) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BehaviouralRiskChain, { stages: result.chain });
	if (step === 6) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTrajectory, {
		points: result.timeline,
		current: result.risk,
		projected: result.projectedRisk,
		band: result.band,
		direction: result.trajectory
	});
	if (step === 7) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainableAi, {
		result,
		indicators: result.indicators
	});
	if (step === 8) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm text-muted",
				children: DEMO_CASE_PUBLIC_ID
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl",
				children: "Queued for human review"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-ink-soft",
				children: [
					"Risk ",
					result.risk,
					" / 100 · ",
					result.band,
					" · ",
					result.threatLabel,
					" · ",
					result.languageLabel,
					" · age band 13–15"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Identity sealed. Evidence redacted. No autonomous contact."
			})
		]
	});
	if (step === 9) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-3",
		children: [[
			["Critical cases", String(Math.max(1, caseCount > 0 ? 2 : 1))],
			["High risk", "2"],
			["Pending review", "2"],
			["Active support", "2"]
		].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-surface px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: k
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl tabular-nums",
				children: v
			})]
		}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "col-span-2 text-sm text-ink-soft",
			children: [DEMO_CASE_PUBLIC_ID, " is now at the top of the responder queue."]
		})]
	});
	if (step === 10) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyIntelligence, { demoCase });
	if (step === 11) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageAnalysis, { result }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyDashboard, { metrics: result.privacy })]
	});
	if (step === 12) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg rounded-xl border border-border bg-surface p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Recommended next step"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl",
				children: result.recommendation
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink-soft",
				children: "Confirm human escalation? The model will not contact police, parents, or external organisations."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					disabled: true,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: onConfirm,
					disabled: confirmed,
					children: confirmed ? "Confirmed" : "Confirm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Human confirmation required. Autonomous action disabled."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: "space-y-2 font-mono text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Evidence uploaded · ", DEMO_CASE_PUBLIC_ID] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "LLM analysis requested" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Risk engine calculated ", result.risk] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Responder opened case" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Human review confirmed · counsellor assigned" })
		]
	});
}
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 15e3,
	retry: 1
} } });
function AppProviders({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(I18nProvider, { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				toastOptions: {
					className: "font-sans",
					style: {
						background: "#FBF8F2",
						color: "#1A2422",
						border: "1px solid #D4CCBE"
					}
				}
			})
		] })
	});
}
var styles_default = "/assets/styles-BxiIv1PS.css";
var APP_NAME = "SurakshaNet";
var Route$21 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0E6B66"
			},
			{
				name: "description",
				content: "An AI-powered child safety early-warning and human-intervention platform. Detect → Understand → Predict → Protect. Human decision required."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$19 = () => import("./routes-C9Luu_RM.mjs");
var Route$20 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./console-VOEkRmQ8.mjs");
var Route$19 = createFileRoute("/console")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./detect-DHjNUzzj.mjs");
var Route$18 = createFileRoute("/detect")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./exit-DVpGIf2a.mjs");
var Route$17 = createFileRoute("/exit")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./help-pPjDcjG9.mjs");
var Route$16 = createFileRoute("/help")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./impact-Ct9fNsgm.mjs");
var Route$15 = createFileRoute("/impact")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./india-BaWPeTko.mjs");
var Route$14 = createFileRoute("/india")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./intelligence-D8vkaUqk.mjs");
var Route$13 = createFileRoute("/intelligence")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./login-B1WazcPv.mjs");
var Route$12 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./privacy-Dq6zy4Fc.mjs");
var Route$11 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./report-DtLpBEwe.mjs");
var Route$10 = createFileRoute("/report")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./support-Bc3bY26l.mjs");
var Route$9 = createFileRoute("/support")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./trusted-adult-BqJevMmZ.mjs");
var Route$8 = createFileRoute("/trusted-adult")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./console-CA9fuHaw.mjs");
var Route$7 = createFileRoute("/console/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./analytics-BhrTDgRe.mjs");
var Route$6 = createFileRoute("/console/analytics")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./architecture-CubzbZ9v.mjs");
var Route$5 = createFileRoute("/console/architecture")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./audit-Dxc4S4dx.mjs");
var Route$4 = createFileRoute("/console/audit")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./settings-sG0-Ke_c.mjs");
var Route$3 = createFileRoute("/console/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./report_.done-BIXZfHSi.mjs");
var Route$2 = createFileRoute("/report_/done")({
	validateSearch: object({ id: string().optional() }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Route$1 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var $$splitComponentImporter = () => import("./cases._caseId-BYlK4Vaq.mjs");
var Route = createFileRoute("/console/cases/$caseId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$21
});
var ConsoleRoute = Route$19.update({
	id: "/console",
	path: "/console",
	getParentRoute: () => Route$21
});
var DetectRoute = Route$18.update({
	id: "/detect",
	path: "/detect",
	getParentRoute: () => Route$21
});
var ExitRoute = Route$17.update({
	id: "/exit",
	path: "/exit",
	getParentRoute: () => Route$21
});
var HelpRoute = Route$16.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$21
});
var ImpactRoute = Route$15.update({
	id: "/impact",
	path: "/impact",
	getParentRoute: () => Route$21
});
var IndiaRoute = Route$14.update({
	id: "/india",
	path: "/india",
	getParentRoute: () => Route$21
});
var IntelligenceRoute = Route$13.update({
	id: "/intelligence",
	path: "/intelligence",
	getParentRoute: () => Route$21
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$21
});
var PrivacyRoute = Route$11.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$21
});
var ReportRoute = Route$10.update({
	id: "/report",
	path: "/report",
	getParentRoute: () => Route$21
});
var SupportRoute = Route$9.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => Route$21
});
var TrustedAdultRoute = Route$8.update({
	id: "/trusted-adult",
	path: "/trusted-adult",
	getParentRoute: () => Route$21
});
var ConsoleIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => ConsoleRoute
});
var ConsoleAnalyticsRoute = Route$6.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => ConsoleRoute
});
var ConsoleArchitectureRoute = Route$5.update({
	id: "/architecture",
	path: "/architecture",
	getParentRoute: () => ConsoleRoute
});
var ConsoleAuditRoute = Route$4.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => ConsoleRoute
});
var ConsoleSettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => ConsoleRoute
});
var ReportDoneRoute = Route$2.update({
	id: "/report_/done",
	path: "/report/done",
	getParentRoute: () => Route$21
});
var ApiAuthSplatRoute = Route$1.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$21
});
var ConsoleRouteChildren = {
	ConsoleAnalyticsRoute,
	ConsoleArchitectureRoute,
	ConsoleAuditRoute,
	ConsoleSettingsRoute,
	ConsoleIndexRoute,
	ConsoleCasesCaseIdRoute: Route.update({
		id: "/cases/$caseId",
		path: "/cases/$caseId",
		getParentRoute: () => ConsoleRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	ConsoleRoute: ConsoleRoute._addFileChildren(ConsoleRouteChildren),
	DetectRoute,
	ExitRoute,
	HelpRoute,
	ImpactRoute,
	IndiaRoute,
	IntelligenceRoute,
	LoginRoute,
	PrivacyRoute,
	ReportRoute,
	SupportRoute,
	TrustedAdultRoute,
	ReportDoneRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$21._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Button as C, useDemoStore as D, getScenario as E, SafetyIntelligence as S, caseKpis as T, ExplainableAi as _, useI18n as a, AnalysisModeMark as b, askCopilot as c, requestBriefing as d, requestWhatIf as f, CrossConversation as g, BehaviouralRiskChain as h, SimulationLauncher as i, extractScreenshots as l, PrivacyDashboard as m, Route as n, LOCALES as o, transcribeVoice as p, Route$2 as r, analyzeEvidence as s, router_exports as t, getAiHealth as u, LanguageAnalysis as v, analyseMessages as w, RiskTrajectory as x, Badge as y };
