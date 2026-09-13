//#region node_modules/.nitro/vite/services/ssr/assets/parse-conversation-CqsiqhAG.js
var SPEAKER_RE = /^(?:\[(?<src>[^\]]+)\]\s*)?(?:(?<spk>other|child|me|them|unknown|adult|stranger|user|friend|reporter|kid|teen)\s*[:\-–]\s*)(?<rest>.*)$/i;
var SESSION_RE = /^\s*(?:session|day)\s*(\d+)\s*[:.-]?\s*$/i;
function parseConversation(raw, sourceLabel = "Pasted text") {
	const text = raw.replace(/\r\n/g, "\n").trim();
	if (!text) return [];
	const lines = text.split("\n");
	const messages = [];
	let pendingSrc = sourceLabel;
	let pendingDay;
	let lastSpeaker = null;
	const push = (speaker, body, src = pendingSrc, day = pendingDay) => {
		const trimmed = body.trim();
		if (!trimmed) return;
		messages.push({
			speaker,
			text: trimmed,
			day,
			source: src.toLowerCase().includes("screenshot") ? "screenshot" : src.toLowerCase().includes("voice") ? "voice" : src.toLowerCase().includes("file") ? "file" : "paste",
			sourceLabel: src
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
			push(normaliseSpeaker(m.groups.spk), m.groups.rest ?? "", pendingSrc);
			continue;
		}
		if (messages.length && lastSpeaker && /^["“']/.test(line)) {
			messages[messages.length - 1].text += ` ${line.replace(/^["“']|["”']$/g, "")}`;
			continue;
		}
		push(lastSpeaker === "other" && looksLikeChild(line) ? "child" : lastSpeaker === "child" ? "other" : "other", line, pendingSrc);
	}
	return dedupeMessages(messages);
}
function formatConversation(messages) {
	return messages.map((m) => {
		return `${m.sourceLabel ? `[${m.sourceLabel}]\n` : ""}${m.speaker.toUpperCase()}: ${m.text}`;
	}).join("\n");
}
function dedupeMessages(messages) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const m of messages) {
		const key = `${m.speaker}:${m.text.toLowerCase().replace(/\s+/g, " ").trim()}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(m);
	}
	return out;
}
function combineMessageLists(lists) {
	return dedupeMessages(lists.flat());
}
function normaliseSpeaker(raw) {
	const s = raw.toLowerCase();
	if (s === "child" || s === "me" || s === "kid" || s === "teen") return "child";
	return "other";
}
function looksLikeChild(line) {
	return /^(why|kya|nahi|no |i don't|i dont|stop|leave me|kaun|who are)/i.test(line);
}
//#endregion
export { formatConversation as n, parseConversation as r, combineMessageLists as t };
