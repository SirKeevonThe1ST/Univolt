import { n as detectLanguage } from "./language-D_fIYyd4.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scoring-BbRGh4-y.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function nid(prefix) {
	return `${prefix}_${(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "") : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).slice(0, 16)}`;
}
function publicCaseId() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "SN-";
	const bytes = typeof crypto !== "undefined" && "getRandomValues" in crypto ? crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6)) : Uint8Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
	for (const b of bytes) out += alphabet[b % 32];
	return out;
}
function clamp(n, lo, hi) {
	return Math.max(lo, Math.min(hi, n));
}
function bandFromScore(score) {
	if (score >= 75) return "critical";
	if (score >= 50) return "high";
	if (score >= 25) return "med";
	return "low";
}
/** Common Roman → Devanagari / Tamil glosses used only for matching, not display. */
var ROMAN_GLOSS = {
	nahi: "नहीं",
	nahin: "नहीं",
	mat: "मत",
	bata: "बता",
	batana: "बताना",
	bataana: "बताना",
	bhejo: "भेजो",
	bhejna: "भेजना",
	pic: "photo",
	photo: "photo",
	mummy: "मम्मी",
	papa: "पापा",
	ghar: "घर",
	secret: "secret",
	gupt: "गोपनीय",
	chalo: "चलो",
	chalte: "चलते",
	yaar: "यार",
	dost: "दोस्त",
	school: "school",
	number: "number",
	phone: "phone",
	address: "address",
	gift: "gift",
	paise: "पैसे",
	akele: "अकेले",
	mil: "मिल",
	soladhe: "சொல்லாதே",
	anuppu: "அனுப்பு",
	pesalam: "பேசலாம்",
	vera: "வேற",
	amma: "அம்மா",
	appa: "அப்பா",
	illa: "இல்ல"
};
var EMOJI_GLOSS = {
	"🤫": " secret ",
	"🙊": " secret ",
	"🎁": " gift ",
	"💰": " money ",
	"📱": " phone ",
	"📸": " photo ",
	"📷": " photo ",
	"🏠": " home ",
	"❤️": " affection ",
	"😘": " affection ",
	"😈": " threat ",
	"😡": " anger "
};
var SCRIPT_FOLD = {
	"०": "0",
	"१": "1",
	"२": "2",
	"३": "3",
	"४": "4",
	"५": "5",
	"६": "6",
	"७": "7",
	"८": "8",
	"९": "9"
};
function preprocess(text, langHint) {
	let s = text.normalize("NFKC");
	for (const [k, v] of Object.entries(SCRIPT_FOLD)) s = s.split(k).join(v);
	for (const [e, g] of Object.entries(EMOJI_GLOSS)) s = s.split(e).join(g);
	s = s.replace(/[“”]/g, "\"").replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
	const lower = s.toLowerCase();
	const tokens = lower.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
	const gloss = `${lower} ${tokens.map((t) => ROMAN_GLOSS[t] ?? t).join(" ")}`;
	return {
		original: text,
		normalized: lower,
		tokens,
		lang: langHint && langHint !== "auto" ? langHint : detectLanguage(text),
		gloss
	};
}
function containsAny(hay, needles) {
	const h = hay.toLowerCase();
	for (const n of needles) if (n.length < 3) {
		if (new RegExp(`(?:^|\\s)${escapeRe(n)}(?:\\s|$)`, "i").test(h)) return n;
	} else if (h.includes(n.toLowerCase())) return n;
	return null;
}
function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
* Protective lexicons. Patterns are clinical and short.
* SYNTHETIC / DETECTIVE use only — never used to generate dialogue.
*/
var SECRECY = [
	"don't tell",
	"dont tell",
	"do not tell",
	"keep this between us",
	"our secret",
	"keep it secret",
	"parents wouldn't understand",
	"parents wouldnt understand",
	"they don't need to know",
	"nobody has to know",
	"delete this chat",
	"mat bata",
	"mat batana",
	"mat bataana",
	"kisi ko mat",
	"gupt rakh",
	"secret rakh",
	"mummy papa ko mat",
	"ghar walon ko mat",
	"chhupa ke",
	"சொல்லாதே",
	"soladhe",
	"veetla solladhe",
	"yaarukittayum solladhe",
	"कोई मत बताना",
	"रहस्य",
	"गोपनीय",
	"माता पिता को मत"
];
var BENIGN_SECRECY = [
	"surprise party",
	"secret santa",
	"secret base",
	"birthday surprise",
	"surprise gift",
	"don't tell dad the cake",
	"dont tell dad the cake",
	"secret recipe",
	"project secret",
	"spoilers"
];
var PII_REQUEST = [
	"phone number",
	"mobile number",
	"whatsapp number",
	"home address",
	"school name",
	"which school",
	"where do you live",
	"send your number",
	"number bhejo",
	"address bhejo",
	"school ka naam",
	"ghar ka address",
	"roll number",
	"class section",
	"pin code",
	"pincode",
	"फ़ोन",
	"मोबाइल",
	"पता भेजो",
	"स्कूल का नाम",
	"number kudunga",
	"address anuppu",
	"school peru"
];
var IMAGE_REQUEST = [
	"send a pic",
	"send a photo",
	"send me a picture",
	"pic bhejo",
	"photo bhejo",
	"selfie bhejo",
	"photo anuppu",
	"pic anuppu",
	"send nudes",
	"undress",
	"without clothes",
	"body pic",
	"फोटो भेजो",
	"सेल्फी",
	"புகைப்படம் அனுப்பு"
];
var ISOLATION = [
	"your parents don't get you",
	"parents dont get you",
	"they don't understand you",
	"i'm the only one who cares",
	"im the only one who cares",
	"your friends are fake",
	"nobody else understands",
	"you can only trust me",
	"they're against you",
	"akela hai tu",
	"sirf main samajhta",
	"dost dhokha",
	"ghar wale nahi samajhte",
	"only i understand you",
	"don't listen to them",
	"dont listen to them"
];
var INCENTIVE = [
	"gift card",
	"i'll buy you",
	"ill buy you",
	"free recharge",
	"free game",
	"paise dunga",
	"gift dunga",
	"recharge kar dunga",
	"i will send money",
	"amazon voucher",
	"i'll pay",
	"ill pay",
	"treat dunga",
	"gift anuppuven",
	"money send",
	"₹",
	"rupees for you"
];
var PLATFORM_MIGRATION = [
	"move to telegram",
	"add me on telegram",
	"message me on whatsapp",
	"switch to discord",
	"talk on snap",
	"dusre app",
	"doosre app",
	"whatsapp pe chalte",
	"telegram pe aao",
	"instagram pe dm",
	"vera app la",
	"vera app la pesalam",
	"inkeya app",
	"leave this app",
	"this app is not safe to talk"
];
var GROOMING_TRUST = [
	"you can tell me anything",
	"you're so mature",
	"youre so mature",
	"older than your age",
	"special bond",
	"i care more than they do",
	"late night chat",
	"can't sleep thinking of you"
];
var AGE_GAP = [
	"i'm 28",
	"im 28",
	"i am 30",
	"i'm 24",
	"im 24",
	"i'm 32",
	"im 32",
	"college khatam",
	"i have a job",
	"i drive",
	"my wife",
	"my girlfriend left",
	"you're just a kid but",
	"youre just a kid but"
];
var EXPLOITATION = [
	"meet me alone",
	"akele mil",
	"pick you up",
	"come to my house",
	"don't tell anyone we met",
	"hotel",
	"send more photos",
	"if you don't i will",
	"if you dont i will",
	"i have your photos",
	"or i will post",
	"blackmail",
	"meet after school"
];
var BULLYING = [
	"nobody likes you",
	"loser",
	"ugly",
	"fatso",
	"we'll share this around",
	"well share this around",
	"everyone is laughing",
	"group se nikaal",
	"tu pagal hai",
	"shame you",
	"post this and tag",
	"you're worthless",
	"youre worthless",
	"kill your reputation",
	"class mein fail"
];
var DISTRESS = [
	"i want to disappear",
	"i can't take this",
	"i cant take this",
	"help me please",
	"i'm scared",
	"im scared",
	"dar lag raha",
	"bachao",
	"please help me",
	"i don't feel safe",
	"i dont feel safe"
];
var BENIGN_SCHOOL = [
	"homework",
	"class notes",
	"project",
	"exam",
	"tuition",
	"cricket",
	"minecraft",
	"roblox",
	"birthday",
	"festival",
	"diwali",
	"holi",
	"school picnic",
	"teacher",
	"assignment"
];
var AGE_PROBE = [
	"how old are you",
	"how old r u",
	"what age",
	"kitne saal",
	"kitni umar",
	"umar kya",
	"what school",
	"which school",
	"school kaha",
	"school kahaan",
	"what class",
	"which class",
	"what grade",
	"kaunsi class",
	"school peru",
	"school naam",
	"where do you study"
];
var BLACKMAIL = [
	"i have your photos",
	"i have your pictures",
	"i will post",
	"i'll post",
	"ill post",
	"or i will send",
	"everyone will see",
	"send more or",
	"nahi to post",
	"warna daal dunga",
	"blackmail",
	"i'll tell everyone",
	"ill tell everyone",
	"or else"
];
var UNWANTED = [
	"why aren't you replying",
	"why arent you replying",
	"answer me now",
	"i messaged you 10 times",
	"stop ignoring",
	"reply instantly",
	"abhi reply",
	"turant jawab"
];
function hit(text, needles, benign) {
	if (benign && containsAny(text, benign)) return null;
	return containsAny(text, needles);
}
function extractFlags(turn, context = []) {
	const p = preprocess(turn);
	const joined = `${p.gloss} ${context.map((c) => c.text).join(" ")}`;
	const hits = [];
	const push = (flag, label, found) => {
		if (found) hits.push({
			flag,
			label
		});
	};
	push("secrecy", "Request to hide the conversation", hit(p.gloss, SECRECY, BENIGN_SECRECY));
	push("pii_request", "Request for personal identifiers", hit(p.gloss, PII_REQUEST));
	push("image_request", "Request for photos or media", hit(p.gloss, IMAGE_REQUEST));
	push("isolation", "Attempt to cut the child off from caregivers", hit(joined, ISOLATION));
	push("incentive", "Offer of gifts, money, or game credit", hit(p.gloss, INCENTIVE));
	push("platform_migration", "Attempt to move off this platform", hit(p.gloss, PLATFORM_MIGRATION));
	push("age_gap", "Adult-minor age-gap linguistic signal", hit(joined, AGE_GAP));
	push("distress", "Distress or fear language from the reporter", hit(p.gloss, DISTRESS));
	push("age_probe", "Age or identity probing", hit(p.gloss, AGE_PROBE));
	push("trust_build", "Trust-building / special-bond language", hit(p.gloss, GROOMING_TRUST));
	push("blackmail", "Threat or blackmail language", hit(p.gloss, BLACKMAIL));
	if (context.filter((t) => t.speaker === "other").length >= 4 && hit(joined, UNWANTED)) push("unwanted_contact", "Repeated unwanted contact", "repeat");
	const present = (f) => hits.some((h) => h.flag === f);
	return {
		secrecy: present("secrecy"),
		pii_request: present("pii_request"),
		isolation: present("isolation"),
		incentive: present("incentive"),
		platform_migration: present("platform_migration"),
		image_request: present("image_request"),
		age_gap: present("age_gap"),
		distress: present("distress"),
		age_probe: present("age_probe"),
		trust_build: present("trust_build"),
		blackmail: present("blackmail"),
		unwanted_contact: present("unwanted_contact"),
		hits
	};
}
function classify(text, langHint) {
	const p = preprocess(text, langHint);
	const flags = extractFlags(p.original, []);
	const school = Boolean(containsAny(p.gloss, BENIGN_SCHOOL));
	const bullyingHit = Boolean(containsAny(p.gloss, BULLYING));
	const exploitHit = Boolean(containsAny(p.gloss, EXPLOITATION));
	const trustHit = Boolean(containsAny(p.gloss, GROOMING_TRUST));
	let grooming = 0;
	let bullying = 0;
	let exploit = 0;
	let benign = .55;
	if (flags.secrecy) grooming += .22;
	if (flags.isolation) grooming += .2;
	if (trustHit) grooming += .14;
	if (flags.incentive) grooming += .12;
	if (flags.platform_migration) grooming += .16;
	if (flags.image_request) {
		grooming += .18;
		exploit += .12;
	}
	if (flags.pii_request) {
		grooming += .1;
		exploit += .08;
	}
	if (flags.age_gap) grooming += .12;
	if (exploitHit) exploit += .45;
	if (bullyingHit) bullying += .48;
	if (flags.distress) bullying += .08;
	if (school && !flags.platform_migration && !exploitHit && !flags.age_gap) {
		grooming *= .35;
		exploit *= .35;
		if (!bullyingHit) bullying *= .4;
		benign += .25;
	}
	if (!flags.secrecy && !flags.isolation && !flags.incentive && !flags.image_request && !exploitHit && !bullyingHit) {
		benign += .3;
		grooming *= .4;
	}
	grooming = clamp01(grooming);
	bullying = clamp01(bullying);
	exploit = clamp01(exploit);
	benign = clamp01(benign);
	const scores = {
		grooming_risk: round2(grooming),
		cyberbullying_risk: round2(bullying),
		exploitation_risk: round2(exploit),
		benign: round2(benign)
	};
	const entries = [
		["grooming_risk", scores.grooming_risk],
		["cyberbullying_risk", scores.cyberbullying_risk],
		["exploitation_risk", scores.exploitation_risk],
		["benign", scores.benign]
	];
	entries.sort((a, b) => b[1] - a[1]);
	const [label, confidence] = entries[0];
	detectLanguage(text);
	return {
		...scores,
		label,
		confidence: round2(confidence)
	};
}
function clamp01(n) {
	return Math.max(0, Math.min(1, n));
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
/**
* Per-thread state machine:
*   contact → trust_building → isolation → exploitation_attempt
* Stages only advance; they never skip backwards.
*/
function analyseProgression(turns) {
	let stage = "contact";
	const history = [{
		stage: "contact",
		reason: "Thread opened"
	}];
	const seen = [];
	for (const turn of turns) {
		const flags = extractFlags(turn.text, turns);
		seen.push(flags);
		const cls = classify(turn.text);
		const next = nextStage(stage, flags, cls.label);
		if (next !== stage) {
			stage = next;
			history.push({
				stage,
				reason: reasonFor(next, flags)
			});
		}
	}
	return {
		stage,
		history
	};
}
function nextStage(current, flags, label) {
	const order = [
		"contact",
		"trust_building",
		"isolation",
		"exploitation_attempt"
	];
	let idx = order.indexOf(current);
	const trust = flags.incentive || flags.secrecy || label === "grooming_risk";
	const iso = flags.isolation || flags.platform_migration;
	const exploit = flags.image_request || flags.pii_request || label === "exploitation_risk";
	if (trust) idx = Math.max(idx, 1);
	if (iso) idx = Math.max(idx, 2);
	if (exploit && (iso || flags.secrecy || flags.incentive)) idx = Math.max(idx, 3);
	if (exploit && current === "isolation") idx = 3;
	return order[idx] ?? current;
}
function reasonFor(stage, flags) {
	switch (stage) {
		case "trust_building": return flags.secrecy ? "Secrecy combined with rapport-building language" : "Incentive or grooming-rapport signal";
		case "isolation": return flags.platform_migration ? "Attempt to move the child off-platform" : "Language isolating the child from caregivers";
		case "exploitation_attempt": return "Photo, identifier, or meet-up request after earlier grooming signals";
		default: return "Initial contact";
	}
}
var DEFAULT_WEIGHTS = {
	classifier_confidence: 22,
	stage: 20,
	persistence: 12,
	secrecy: 12,
	pii_request: 12,
	image_request: 10,
	age_gap: 7,
	prior_flags: 5
};
var STAGE_POINTS = {
	contact: 8,
	trust_building: 36,
	isolation: 68,
	exploitation_attempt: 96
};
function scoreThread(turns, weights = DEFAULT_WEIGHTS, priorFlagCount = 0) {
	const { stage } = analyseProgression(turns);
	const classification = classify(turns.map((t) => t.text).join(" \n "));
	const flags = mergeFlags(turns);
	const persistence = persistenceCount(turns);
	const w = normalise(weights);
	const factors = [];
	const clsRisk = Math.max(classification.grooming_risk, classification.cyberbullying_risk, classification.exploitation_risk, 1 - classification.benign);
	factors.push({
		key: "classifier_confidence",
		label: "Classifier risk mass",
		points: Math.round(clsRisk * 100 * w.classifier_confidence)
	});
	factors.push({
		key: "stage",
		label: `Stage ${stage.replace(/_/g, " ")}`,
		points: Math.round(STAGE_POINTS[stage] * w.stage)
	});
	factors.push({
		key: "persistence",
		label: "Repeated signals",
		points: Math.round(Math.min(100, persistence * 22) * w.persistence)
	});
	const addFlag = (key, label, weightKey = key) => {
		if (typeof flags[key] === "boolean" && flags[key]) {
			const pts = Math.round(100 * (w[weightKey] ?? .08));
			factors.push({
				key: weightKey,
				label,
				points: pts
			});
		}
	};
	addFlag("secrecy", "Secrecy");
	addFlag("pii_request", "Identifier request");
	addFlag("image_request", "Image request");
	addFlag("age_gap", "Age-gap signal");
	addFlag("age_probe", "Age / identity probing");
	addFlag("trust_build", "Trust building");
	addFlag("blackmail", "Threat / blackmail");
	addFlag("unwanted_contact", "Repeated unwanted contact");
	if (flags.platform_migration) factors.push({
		key: "platform_migration",
		label: "Off-platform move",
		points: 10
	});
	if (flags.isolation) factors.push({
		key: "isolation",
		label: "Isolation",
		points: 10
	});
	if (flags.incentive) factors.push({
		key: "incentive",
		label: "Incentive",
		points: 6
	});
	if (flags.distress) factors.push({
		key: "distress",
		label: "Distress language",
		points: 8
	});
	if (classification.label === "exploitation_risk") factors.push({
		key: "exploit_label",
		label: "Exploitation label",
		points: 12
	});
	const priorPts = Math.round(Math.min(100, priorFlagCount * 12) * (w.prior_flags ?? 0));
	if (priorPts) factors.push({
		key: "prior_flags",
		label: "Prior flags on case",
		points: priorPts
	});
	const raw = factors.reduce((a, f) => a + f.points, 0);
	const score = clamp(Math.round(raw), 0, 100);
	return {
		score,
		band: bandFromScore(score),
		factors: factors.filter((f) => f.points > 0).sort((a, b) => b.points - a.points),
		flags,
		stage,
		classification
	};
}
function normalise(weights) {
	const sum = Object.values(weights).reduce((a, b) => a + Number(b), 0) || 1;
	const out = {};
	for (const [k, v] of Object.entries(weights)) out[k] = Number(v) / sum;
	return out;
}
function mergeFlags(turns) {
	const acc = extractFlags("", []);
	acc.hits = [];
	for (const t of turns) {
		const f = extractFlags(t.text, turns);
		Object.keys(acc).forEach((k) => {
			if (k === "hits") return;
			if (f[k]) acc[k] = true;
		});
		acc.hits.push(...f.hits);
	}
	const seen = /* @__PURE__ */ new Set();
	acc.hits = acc.hits.filter((h) => {
		const key = `${h.flag}:${h.label}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	return acc;
}
function persistenceCount(turns) {
	let n = 0;
	for (const t of turns) if (extractFlags(t.text, []).hits.length) n += 1;
	return n;
}
//#endregion
export { nid as a, extractFlags as i, classify as n, publicCaseId as o, cn as r, scoreThread as s, analyseProgression as t };
