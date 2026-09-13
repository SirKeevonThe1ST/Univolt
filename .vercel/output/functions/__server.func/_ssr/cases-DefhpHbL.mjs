import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-izQYYaFw.mjs";
import { s as scoreThread } from "./scoring-BbRGh4-y.mjs";
import { n as nlpProvider } from "./conversations-Cw_ZHOU9.mjs";
import { t as getStorageRepository } from "./storage-DDzPOkcj.mjs";
import { t as ensureStaffProfile } from "./staff-DLovbWU9.mjs";
import { r as loadWeights, t as ingestThread } from "./ingest-BiAA7xhw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-DefhpHbL.js
async function ensureSeeded() {
	await getStorageRepository().ensureSeeded();
}
var listCases_createServerFn_handler = createServerRpc({
	id: "cc376cb1bc11e5b6d8c51b9331f1f851d235c8f65f0cc62df3fe5ba62f48f33d",
	name: "listCases",
	filename: "src/lib/server/cases.ts"
}, (opts) => listCases.__executeServer(opts));
var listCases = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCases_createServerFn_handler, async ({ context }) => {
	await ensureSeeded();
	return getStorageRepository().listCases(context.userId);
});
var getCase_createServerFn_handler = createServerRpc({
	id: "0172ae324f36b82b7be830b5d0da3f7fe23f741ad27ae7d6d59b9751c923fdc3",
	name: "getCase",
	filename: "src/lib/server/cases.ts"
}, (opts) => getCase.__executeServer(opts));
var getCase = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getCase_createServerFn_handler, async ({ context, data: id }) => {
	await ensureSeeded();
	const detail = await getStorageRepository().getCaseDetail(id, context.userId);
	if (!detail) throw new Error("Case not found");
	return detail;
});
var transitionCase_createServerFn_handler = createServerRpc({
	id: "4e7f1aaffbb4654f929712d4df137eeb6014a92389a4b7a045f5124e980bed21",
	name: "transitionCase",
	filename: "src/lib/server/cases.ts"
}, (opts) => transitionCase.__executeServer(opts));
var transitionCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(transitionCase_createServerFn_handler, async ({ context, data }) => {
	const me = await ensureStaffProfile(context.userId, "Responder");
	await getStorageRepository().transitionCase(data.id, data.to, context.userId, me.role, data.confirm);
	return { ok: true };
});
var addNote_createServerFn_handler = createServerRpc({
	id: "4a9bea48585a4fb72923d1f6ebd039b97508bd7b5bb180e2598b00361bba4dbd",
	name: "addNote",
	filename: "src/lib/server/cases.ts"
}, (opts) => addNote.__executeServer(opts));
var addNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addNote_createServerFn_handler, async ({ context, data }) => {
	const me = await ensureStaffProfile(context.userId, "Responder");
	await getStorageRepository().addCaseNote(data.id, context.userId, me.role, data.body);
	return { ok: true };
});
var revealIdentity_createServerFn_handler = createServerRpc({
	id: "041767d7cf8dd31fdbb4f81fcb9498ebf30bcd8ece1b6c40bbae32c2d688e245",
	name: "revealIdentity",
	filename: "src/lib/server/cases.ts"
}, (opts) => revealIdentity.__executeServer(opts));
var revealIdentity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(revealIdentity_createServerFn_handler, async ({ context, data }) => {
	if (!data.confirm) throw new Error("Human confirmation required");
	const me = await ensureStaffProfile(context.userId, "Responder");
	return { contact: await getStorageRepository().revealIdentity(data.id, context.userId, me.role) };
});
var regenerateSafetyCase_createServerFn_handler = createServerRpc({
	id: "fcf395f5a08d7d447d41d3745ea5847ebcc943cc88abb347dd14938a6d01b0c8",
	name: "regenerateSafetyCase",
	filename: "src/lib/server/cases.ts"
}, (opts) => regenerateSafetyCase.__executeServer(opts));
var regenerateSafetyCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(regenerateSafetyCase_createServerFn_handler, async ({ context, data: id }) => {
	const me = await ensureStaffProfile(context.userId, "Responder");
	const repo = getStorageRepository();
	const detail = await repo.getCaseDetail(id, context.userId);
	if (!detail) throw new Error("Case not found");
	if (!detail.messages.length) throw new Error("No evidence on this case to build a pack from");
	const turns = detail.messages.map((m) => ({
		speaker: m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other",
		text: m.redacted_text
	}));
	const { analyzeConversation } = await import("./analyze-B7-LGu4J.mjs").then((n) => n.r).then((n) => n.n);
	const { scoreAnalysis } = await import("./analyze-B7-LGu4J.mjs").then((n) => n.r).then((n) => n.c);
	const { buildLiveSafetyCasePack } = await import("./ingest-BiAA7xhw.mjs").then((n) => n.n).then((n) => n.r);
	let live = {
		ok: false,
		error: "AI unavailable",
		code: "no_key"
	};
	try {
		live = await analyzeConversation({ messages: turns.map((t) => ({
			speaker: t.speaker === "other" ? "other" : "child",
			text: t.text
		})) });
	} catch (err) {
		console.warn("[ai] analyzeConversation error during regenerate:", err);
	}
	const weights = await loadWeights();
	let pack;
	let score;
	let band;
	let stage;
	if (live.ok) {
		const risk = scoreAnalysis(live.analysis);
		pack = buildLiveSafetyCasePack({
			analysis: live.analysis,
			risk,
			turns,
			modelName: live.result.modelName ?? "unknown"
		});
		score = risk.score;
		band = pack.risk_band;
		stage = pack.stage;
	} else {
		const scored = scoreThread(turns, weights);
		pack = {
			...nlpProvider.draft_safety_case({
				evidence: turns,
				timeline: detail.stages.map((s) => ({
					at: s.entered_at,
					event: `${s.stage}: ${s.reason}`
				})),
				classification: scored.classification,
				flags: scored.flags,
				stage: scored.stage,
				score: scored.score,
				band: scored.band,
				priority: detail.case.priority,
				language: detail.case.language
			}),
			analysis_mode: "fallback",
			pocso_note: `DEMO FALLBACK — AI SERVICE UNAVAILABLE. ${live.error ?? ""} This pack was built from the offline rule/lexicon classifier, not a live model call. SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. A designated human officer must confirm before any irreversible step.`
		};
		score = scored.score;
		band = scored.band;
		stage = scored.stage;
	}
	await repo.saveSafetyPack(id, pack, score, band, stage, context.userId, me.role);
	return { pack };
});
var exportSafetyPack_createServerFn_handler = createServerRpc({
	id: "448282251d762627fd382b2d05ce0cae9044ef466d7a34efb06248dcc5c3879c",
	name: "exportSafetyPack",
	filename: "src/lib/server/cases.ts"
}, (opts) => exportSafetyPack.__executeServer(opts));
var exportSafetyPack = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(exportSafetyPack_createServerFn_handler, async ({ context, data: id }) => {
	await ensureStaffProfile(context.userId, "Responder");
	const { public_id, pack } = await getStorageRepository().getSafetyPack(id, context.userId);
	return {
		format: "simulated-pocso-e-evidence-v0",
		disclaimer: "SIMULATED. Not a legal filing, not hash-chained e-evidence, and not submitted to any agency.",
		public_id,
		pack
	};
});
var ingestDemoThread_createServerFn_handler = createServerRpc({
	id: "a11bf8a5eec8af5da5c03ee44feb07cf391d1e1f5841623ddc10ab4fe7fd9ef2",
	name: "ingestDemoThread",
	filename: "src/lib/server/cases.ts"
}, (opts) => ingestDemoThread.__executeServer(opts));
var ingestDemoThread = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(ingestDemoThread_createServerFn_handler, async ({ context, data }) => {
	await ensureStaffProfile(context.userId, "Responder");
	await ensureSeeded();
	const turns = data.text.split(/\n+/).map((l) => l.trim()).filter(Boolean).map((line) => {
		const m = line.match(/^(other|child|reporter)\s*:\s*(.*)$/i);
		if (m) return {
			speaker: m[1].toLowerCase(),
			text: m[2]
		};
		return {
			speaker: "other",
			text: line
		};
	});
	return ingestThread({
		source: "ingested_thread",
		turns
	});
});
//#endregion
export { addNote_createServerFn_handler, exportSafetyPack_createServerFn_handler, getCase_createServerFn_handler, ingestDemoThread_createServerFn_handler, listCases_createServerFn_handler, regenerateSafetyCase_createServerFn_handler, revealIdentity_createServerFn_handler, transitionCase_createServerFn_handler };
