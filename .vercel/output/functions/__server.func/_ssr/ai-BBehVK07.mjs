import { r as createServerFn } from "./ssr.mjs";
import { r as parseConversation } from "./parse-conversation-CqsiqhAG.mjs";
import { a as extractConversationFromImages, i as copilotAsk, l as simulateWhatIf, n as analyzeConversation, o as generateBriefing, s as resolveProvider, t as aiRuntime, u as transcribeVoiceNote } from "./analyze-B7-LGu4J.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-BBehVK07.js
var analyzeEvidence_createServerFn_handler = createServerRpc({
	id: "23613fa5c5ec9d091e7fc11f563ec7f3dc3c99a1b539079c465cb0908513a481",
	name: "analyzeEvidence",
	filename: "src/lib/server/ai.ts"
}, (opts) => analyzeEvidence.__executeServer(opts));
var analyzeEvidence = createServerFn({ method: "POST" }).validator((d) => d).handler(analyzeEvidence_createServerFn_handler, async ({ data }) => {
	const fromPaste = data.pastedText?.trim() ? parseConversation(data.pastedText, "Pasted text") : [];
	const provided = (data.messages ?? []).map((m) => ({
		speaker: m.speaker,
		text: m.text,
		gloss: m.gloss,
		day: m.day,
		source: m.source,
		sourceLabel: m.sourceLabel
	}));
	const messages = provided.length ? provided : fromPaste;
	return analyzeConversation({
		messages,
		images: data.images?.slice(0, 6),
		isSynthetic: data.isSynthetic,
		transcriptionNote: data.transcriptionNote
	});
});
var extractScreenshots_createServerFn_handler = createServerRpc({
	id: "ac75ccc586c5f974a3ceb2d99581759dcc6f968eaac408e876c3d9e4d48a8aff",
	name: "extractScreenshots",
	filename: "src/lib/server/ai.ts"
}, (opts) => extractScreenshots.__executeServer(opts));
var extractScreenshots = createServerFn({ method: "POST" }).validator((d) => d).handler(extractScreenshots_createServerFn_handler, async ({ data }) => extractConversationFromImages(data.images.slice(0, 6)));
var transcribeVoice_createServerFn_handler = createServerRpc({
	id: "efb4637100b8e30a5e1592cea90da261dbf48b8889f256fdd880abcd6e324cff",
	name: "transcribeVoice",
	filename: "src/lib/server/ai.ts"
}, (opts) => transcribeVoice.__executeServer(opts));
var transcribeVoice = createServerFn({ method: "POST" }).validator((d) => d).handler(transcribeVoice_createServerFn_handler, async ({ data }) => transcribeVoiceNote(data));
var askCopilot_createServerFn_handler = createServerRpc({
	id: "df10cdd3de9db6ae165740322dca73f5fb0e6314f4a1cb138c1b9bc710948077",
	name: "askCopilot",
	filename: "src/lib/server/ai.ts"
}, (opts) => askCopilot.__executeServer(opts));
var askCopilot = createServerFn({ method: "POST" }).validator((d) => d).handler(askCopilot_createServerFn_handler, async ({ data }) => copilotAsk(data));
var requestBriefing_createServerFn_handler = createServerRpc({
	id: "03275d8e2cedc9376ecd1ec83a8f097b3450152085232e17c190c46af342798c",
	name: "requestBriefing",
	filename: "src/lib/server/ai.ts"
}, (opts) => requestBriefing.__executeServer(opts));
var requestBriefing = createServerFn({ method: "POST" }).validator((d) => d).handler(requestBriefing_createServerFn_handler, async ({ data }) => generateBriefing(data));
var requestWhatIf_createServerFn_handler = createServerRpc({
	id: "808003d5e3c22ceaaf3216bb7139cef97bc58df899a92db4a92436e36ec7bdf0",
	name: "requestWhatIf",
	filename: "src/lib/server/ai.ts"
}, (opts) => requestWhatIf.__executeServer(opts));
var requestWhatIf = createServerFn({ method: "POST" }).validator((d) => d).handler(requestWhatIf_createServerFn_handler, async ({ data }) => simulateWhatIf(data));
var getAiHealth_createServerFn_handler = createServerRpc({
	id: "d65db909f09208a7a75e671266470f4d8bd4c87c240e789e4d8053067b9f0159",
	name: "getAiHealth",
	filename: "src/lib/server/ai.ts"
}, (opts) => getAiHealth.__executeServer(opts));
var getAiHealth = createServerFn({ method: "GET" }).handler(getAiHealth_createServerFn_handler, async () => {
	const p = resolveProvider();
	return {
		connected: Boolean(p.apiKey),
		provider: p.id,
		model: p.model || "unconfigured",
		vision: p.vision,
		stt: p.stt,
		lastOk: aiRuntime.lastOk,
		lastAt: aiRuntime.lastAt,
		lastLatencyMs: aiRuntime.lastLatencyMs,
		lastError: aiRuntime.lastError ? "previous call failed" : null,
		riskEngine: "operational",
		audit: "operational",
		humanReview: "required"
	};
});
//#endregion
export { analyzeEvidence_createServerFn_handler, askCopilot_createServerFn_handler, extractScreenshots_createServerFn_handler, getAiHealth_createServerFn_handler, requestBriefing_createServerFn_handler, requestWhatIf_createServerFn_handler, transcribeVoice_createServerFn_handler };
