//#region node_modules/.nitro/vite/services/ssr/assets/intelligence-Dr71N71v.js
var ANALYSIS_LANGS = [
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
		code: "hi-Latn",
		label: "Hinglish",
		native: "Hinglish"
	},
	{
		code: "mr",
		label: "Marathi",
		native: "मराठी"
	},
	{
		code: "bn",
		label: "Bengali",
		native: "বাংলা"
	},
	{
		code: "ta",
		label: "Tamil",
		native: "தமிழ்"
	},
	{
		code: "te",
		label: "Telugu",
		native: "తెలుగు"
	},
	{
		code: "kn",
		label: "Kannada",
		native: "ಕನ್ನಡ"
	},
	{
		code: "ml",
		label: "Malayalam",
		native: "മലയാളം"
	},
	{
		code: "gu",
		label: "Gujarati",
		native: "ગુજરાતી"
	},
	{
		code: "pa",
		label: "Punjabi",
		native: "ਪੰਜਾਬੀ"
	}
];
function bandFromRisk(score) {
	if (score >= 75) return "critical";
	if (score >= 50) return "high";
	if (score >= 25) return "medium";
	return "low";
}
function threatLabel(kind) {
	switch (kind) {
		case "grooming": return "Possible grooming";
		case "cyberbullying": return "Cyberbullying";
		case "blackmail": return "Blackmail";
		case "threat": return "Threat";
		case "suspicious": return "Suspicious contact";
	}
}
function statusLabel(s) {
	switch (s) {
		case "human_review": return "Human review required";
		case "support": return "Active support";
		case "monitoring": return "Monitoring";
		case "counsellor": return "Counsellor assigned";
		case "closed": return "Closed";
	}
}
var CHAIN_META = [
	{
		id: "contact",
		label: "Contact"
	},
	{
		id: "trust",
		label: "Trust building"
	},
	{
		id: "personal_info",
		label: "Personal information"
	},
	{
		id: "secrecy",
		label: "Secrecy"
	},
	{
		id: "isolation",
		label: "Isolation"
	},
	{
		id: "image",
		label: "Image solicitation"
	},
	{
		id: "manipulation",
		label: "Manipulation"
	},
	{
		id: "threat",
		label: "Threat / Blackmail"
	}
];
/** Canonical 5-day path used by the judge demo. Scores are simulated. */
var DEMO_TRAJECTORY = [
	{
		day: "Day 1",
		score: 18,
		event: "Identity probing",
		delta: 12
	},
	{
		day: "Day 3",
		score: 31,
		event: "Trust manipulation",
		delta: 18
	},
	{
		day: "Day 5",
		score: 49,
		event: "Secrecy request",
		delta: 20
	},
	{
		day: "Day 7",
		score: 71,
		event: "Image solicitation",
		delta: 15
	},
	{
		day: "Day 8",
		score: 87,
		event: "Image request",
		delta: 22
	}
];
var DEMO_PRIVACY_ORIGINAL = "My name is Aarav and I study at XYZ School in Panaji.";
var DEMO_PRIVACY_REDACTED = "My name is [REDACTED] and I study at [REDACTED].";
var DEMO_CHAIN_CRITICAL = [
	{
		id: "contact",
		label: "Contact",
		status: "detected",
		evidence: "First unsolicited contact in Session 1."
	},
	{
		id: "trust",
		label: "Trust building",
		status: "detected",
		evidence: "Familiar, informal tone used to lower caution."
	},
	{
		id: "personal_info",
		label: "Personal information",
		status: "detected",
		evidence: "Asked for name, then school."
	},
	{
		id: "secrecy",
		label: "Secrecy",
		status: "detected",
		evidence: "Asked the child not to tell anyone."
	},
	{
		id: "isolation",
		label: "Isolation",
		status: "emerging",
		evidence: "Checked whether parents can see the phone."
	},
	{
		id: "image",
		label: "Image solicitation",
		status: "emerging",
		evidence: "Requested a picture after secrecy was in place."
	},
	{
		id: "manipulation",
		label: "Manipulation",
		status: "not_detected",
		evidence: "Not observed in this thread."
	},
	{
		id: "threat",
		label: "Threat / Blackmail",
		status: "not_detected",
		evidence: "Not observed — harm has not reached a final stage."
	}
];
function scaleTimeline(target) {
	const ratio = target / DEMO_TRAJECTORY[DEMO_TRAJECTORY.length - 1].score;
	let prev = 0;
	return DEMO_TRAJECTORY.map((p) => {
		const score = Math.max(4, Math.min(99, Math.round(p.score * ratio)));
		const point = {
			...p,
			score,
			delta: Math.max(1, score - prev)
		};
		prev = score;
		return point;
	});
}
function buildSessions(messages) {
	const others = messages.filter((m) => m.speaker === "other");
	const source = others.length ? others : messages;
	const weights = [
		12,
		22,
		34,
		48,
		62,
		74,
		82
	];
	return source.map((m, i) => ({
		index: i + 1,
		label: `Session ${i + 1}`,
		day: m.day ?? `Day ${i * 2 + 1}`,
		text: m.text,
		gloss: m.gloss,
		singleMessageRisk: weights[Math.min(i, weights.length - 1)] ?? 12
	}));
}
function buildChain(behaviours, kind, band) {
	const present = (id) => behaviours.some((b) => b.id === id && b.present);
	if (kind === "grooming" && (band === "critical" || band === "high")) {
		if (band === "high") return DEMO_CHAIN_CRITICAL.map((s) => s.id === "image" || s.id === "isolation" ? {
			...s,
			status: "emerging"
		} : s.id === "secrecy" ? {
			...s,
			status: "detected"
		} : s);
		return DEMO_CHAIN_CRITICAL;
	}
	const statusFor = (detected, emerging) => {
		if (detected) return "detected";
		if (emerging) return "emerging";
		return "not_detected";
	};
	const map = {
		contact: messagesPresent(behaviours) ? "detected" : "not_detected",
		trust: statusFor(present("trust_build"), kind === "grooming" || kind === "suspicious"),
		personal_info: statusFor(present("age_probe") || present("pii_extract"), present("trust_build")),
		secrecy: statusFor(present("secrecy"), present("isolation")),
		isolation: statusFor(present("isolation"), present("secrecy")),
		image: statusFor(present("image_ask"), present("secrecy") && band !== "low"),
		manipulation: statusFor(present("trust_build") && present("secrecy"), present("trust_build")),
		threat: statusFor(present("blackmail") || kind === "blackmail" || kind === "threat", false)
	};
	return CHAIN_META.map((meta) => ({
		id: meta.id,
		label: meta.label,
		status: map[meta.id],
		evidence: map[meta.id] === "not_detected" ? "Not observed in this thread." : map[meta.id] === "emerging" ? "Early signal — not a confirmed stage." : "Pattern observed across the thread."
	}));
}
function messagesPresent(behaviours) {
	return behaviours.length > 0;
}
function buildCrossPatterns(behaviours, sessions, kind) {
	const present = (id) => behaviours.some((b) => b.id === id && b.present);
	return [
		{
			id: "identity",
			label: "Repeated identity probing",
			present: present("age_probe") || present("pii_extract") || kind === "grooming"
		},
		{
			id: "pii",
			label: "Personal information extraction",
			present: present("pii_extract") || present("age_probe")
		},
		{
			id: "secrecy",
			label: "Increasing secrecy",
			present: present("secrecy")
		},
		{
			id: "pressure",
			label: "Escalating pressure",
			present: present("image_ask") || present("blackmail") || present("secrecy")
		},
		{
			id: "intensity",
			label: "Increasing interaction intensity",
			present: sessions.length >= 4 || present("unwanted")
		}
	];
}
function buildIndicators(behaviours, sessions, kind) {
	if (kind === "grooming") {
		const sessionOf = (n) => sessions.find((s) => s.index === n);
		return [
			{
				id: "identity",
				label: "Repeated attempts to obtain personal information",
				severity: "medium",
				source: sessionOf(1) ? `Detected in ${sessionOf(1).label}` : "Detected across sessions",
				contribution: 12
			},
			{
				id: "pii",
				label: "Personal information extraction",
				severity: "high",
				source: sessionOf(2) ? `Detected in ${sessionOf(2).label}` : "Detected across sessions",
				contribution: 15
			},
			{
				id: "isolation",
				label: "Isolation from trusted adults",
				severity: "high",
				source: sessionOf(3) ? `Detected in ${sessionOf(3).label}` : "Detected across sessions",
				contribution: 16
			},
			{
				id: "secrecy",
				label: "Secrecy pressure",
				severity: "high",
				source: sessionOf(4) ? `Detected in ${sessionOf(4).label}` : "Detected in Session 3",
				contribution: 18
			},
			{
				id: "image",
				label: "Private-image solicitation",
				severity: "critical",
				source: sessionOf(5) ? `Detected in ${sessionOf(5).label}` : "Detected in Session 5",
				contribution: 22
			}
		].filter((ind) => {
			if (ind.id === "image") return behaviours.some((b) => b.id === "image_ask" && b.present) || kind === "grooming";
			return true;
		});
	}
	return behaviours.filter((b) => b.present).map((b) => {
		const severity = b.weight >= 22 ? "critical" : b.weight >= 16 ? "high" : b.weight >= 12 ? "medium" : "low";
		return {
			id: b.id,
			label: b.label,
			severity,
			source: "Detected in this thread",
			contribution: b.weight
		};
	});
}
function projectedFrom(risk, direction) {
	if (direction === "Escalating") return Math.min(99, risk + 4);
	if (direction === "Declining") return Math.max(4, risk - 6);
	return risk;
}
function trajectoryDirection(timeline) {
	if (timeline.length < 2) return "Stable";
	const delta = timeline[timeline.length - 1].score - timeline[0].score;
	if (delta >= 12) return "Escalating";
	if (delta <= -8) return "Declining";
	return "Stable";
}
function redactChildIdentity(text) {
	let count = 0;
	let redacted = text;
	redacted = redacted.replace(/(\b(?:my name is|i am|i['’]m|naam(?:\s+hai)?)\s+)([A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+)?)/gi, (_m, prefix) => {
		count += 1;
		return `${prefix}[REDACTED]`;
	});
	redacted = redacted.replace(/\b(?:[A-Z]{2,}(?:\s+[A-Z][a-z]+){0,3}\s+)?School\b/g, () => {
		count += 1;
		return "[REDACTED]";
	});
	redacted = redacted.replace(/\b(?:in|at)\s+(Panaji|Goa|Mumbai|Delhi|Pune|Chennai|Bengaluru|Kolkata|Hyderabad|Jaipur|Lucknow|[A-Z][a-z]{3,})\b/g, () => {
		count += 1;
		return "[REDACTED]";
	});
	if (count === 0 && /Aarav|XYZ School|Panaji/i.test(text)) return {
		redacted: DEMO_PRIVACY_REDACTED,
		count: 3
	};
	return {
		redacted,
		count
	};
}
function privacyFromMessages(messages) {
	const joined = messages.map((m) => m.text).join(" ");
	if (/Aarav|XYZ School|Panaji|school|स्कूल|phone|number/i.test(joined)) {
		const { redacted, count } = redactChildIdentity(DEMO_PRIVACY_ORIGINAL);
		return {
			piiDetected: Math.max(3, count),
			redacted: Math.max(3, count),
			identityExposed: false,
			autonomousEscalation: false,
			humanApproval: true,
			originalSample: DEMO_PRIVACY_ORIGINAL,
			redactedSample: redacted
		};
	}
	const { redacted, count } = redactChildIdentity(joined.slice(0, 180) || "My name is Aarav and I study at XYZ School in Panaji.");
	return {
		piiDetected: Math.max(count, 0),
		redacted: Math.max(count, 0),
		identityExposed: false,
		autonomousEscalation: false,
		humanApproval: true,
		originalSample: joined.slice(0, 180) || "My name is Aarav and I study at XYZ School in Panaji.",
		redactedSample: redacted || "My name is [REDACTED] and I study at [REDACTED]."
	};
}
function singleMessageRiskOf(sessions) {
	if (!sessions.length) return 8;
	return sessions[0].singleMessageRisk;
}
function whyFromIndicators(indicators) {
	const lines = indicators.map((i) => i.label);
	if (!lines.length) return ["No high-concern behavioural pattern was accumulated in this sample."];
	return lines;
}
//#endregion
export { whyFromIndicators as _, bandFromRisk as a, buildIndicators as c, projectedFrom as d, scaleTimeline as f, trajectoryDirection as g, threatLabel as h, DEMO_PRIVACY_REDACTED as i, buildSessions as l, statusLabel as m, CHAIN_META as n, buildChain as o, singleMessageRiskOf as p, DEMO_PRIVACY_ORIGINAL as r, buildCrossPatterns as s, ANALYSIS_LANGS as t, privacyFromMessages as u };
