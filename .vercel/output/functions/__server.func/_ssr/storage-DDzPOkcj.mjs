import { a as nid, o as publicCaseId, s as scoreThread, t as analyseProgression } from "./scoring-BbRGh4-y.mjs";
import { i as sha256Hex, n as nlpProvider, r as redactText, t as SYNTHETIC_THREADS } from "./conversations-Cw_ZHOU9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-DDzPOkcj.js
var EDGES = {
	detected: ["reported", "closed"],
	reported: ["under_review", "closed"],
	under_review: ["prioritized", "closed"],
	prioritized: ["assigned", "new"],
	new: ["assigned", "closed"],
	assigned: ["in_progress", "new"],
	in_progress: [
		"escalated_to_authorities",
		"resolved",
		"assigned"
	],
	escalated_to_authorities: ["intervention", "resolved"],
	intervention: ["follow_up", "resolved"],
	follow_up: ["resolved", "intervention"],
	resolved: ["closed"],
	closed: []
};
var HUMAN_CONFIRM_STATUSES = [
	"escalated_to_authorities",
	"intervention",
	"closed"
];
function canTransition(from, to) {
	return EDGES[from]?.includes(to) ?? false;
}
function assertTransition(from, to, confirmed) {
	if (!canTransition(from, to)) throw new Error(`Illegal status change ${from} → ${to}`);
	if (HUMAN_CONFIRM_STATUSES.includes(to) && !confirmed) throw new Error("Human confirmation required for this action");
}
var SLA_MINUTES = {
	P1: 15,
	P2: 120,
	P3: 480,
	P4: 1440
};
function prioritise(input) {
	const stale = input.minutesSinceActivity ?? 0;
	let priority = "P4";
	if (input.band === "critical" || input.distress) priority = "P1";
	else if (input.band === "high" || input.stage === "exploitation_attempt") priority = "P2";
	else if (input.band === "med" || input.stage === "isolation") priority = "P3";
	else priority = "P4";
	if (input.stage === "exploitation_attempt" && input.band !== "low") priority = bump(priority);
	if (stale > 180 && priority !== "P1") {
		if (input.band === "high" || input.band === "critical") priority = bump(priority);
	}
	return {
		priority,
		slaMinutes: SLA_MINUTES[priority]
	};
}
function slaDueAt(from, priority) {
	return new Date(from.getTime() + SLA_MINUTES[priority] * 6e4);
}
function bump(p) {
	if (p === "P4") return "P3";
	if (p === "P3") return "P2";
	if (p === "P2") return "P1";
	return "P1";
}
/**
* Re-scores the thread cumulatively after each turn so we can show how risk
* moved as the conversation progressed, not just the final number.
* This is a read-only analysis derived from the same scoring engine used for
* the live score — it does not introduce a second source of truth.
*/
function buildTimeline(turns, weights) {
	const { history } = analyseProgression(turns);
	const stageAtTurnCount = [];
	for (let i = 1; i <= turns.length; i++) {
		const partial = turns.slice(0, i);
		const { history: h } = analyseProgression(partial);
		stageAtTurnCount.push(h.length);
	}
	const points = history.map((step, idx) => {
		let turnIndex = turns.length > 0 ? turns.length - 1 : 0;
		for (let i = 0; i < stageAtTurnCount.length; i++) if (stageAtTurnCount[i] >= idx + 1) {
			turnIndex = i;
			break;
		}
		const partial = idx === history.length - 1 ? turns : turns.slice(0, turnIndex + 1);
		const scored = scoreThread(partial, weights);
		return {
			turnIndex,
			stage: step.stage,
			reason: step.reason,
			scoreAtStage: scored.score,
			band: scored.band,
			at: turns[turnIndex]?.at ?? null
		};
	});
	const startScore = points[0]?.scoreAtStage ?? 0;
	const currentScore = points.length ? points[points.length - 1].scoreAtStage : 0;
	const escalation = currentScore - startScore;
	const turnSpan = points.length > 1 ? points[points.length - 1].turnIndex - points[0].turnIndex : 0;
	const speedPointsPerTurn = turnSpan > 0 ? escalation / turnSpan : null;
	let speedLabel = "flat";
	if (speedPointsPerTurn !== null) {
		if (speedPointsPerTurn >= 15) speedLabel = "rapid";
		else if (speedPointsPerTurn >= 7) speedLabel = "escalating";
		else if (speedPointsPerTurn > 0) speedLabel = "gradual";
	} else if (escalation > 0) speedLabel = escalation >= 40 ? "rapid" : "gradual";
	return {
		points,
		startScore,
		currentScore,
		escalation,
		speedPointsPerTurn,
		speedLabel
	};
}
var g = globalThis;
function getStore() {
	if (!g.__surakshaMemoryStore__) g.__surakshaMemoryStore__ = {
		cases: /* @__PURE__ */ new Map(),
		messages: [],
		scores: [],
		flags: [],
		stageHistory: [],
		safetyCases: /* @__PURE__ */ new Map(),
		attachments: [],
		identities: /* @__PURE__ */ new Map(),
		auditLog: [],
		eventLog: [],
		staffProfiles: /* @__PURE__ */ new Map(),
		caseNotes: [],
		accessLog: [],
		scoringWeights: {
			classifier_confidence: 22,
			stage: 20,
			persistence: 12,
			secrecy: 12,
			pii_request: 12,
			image_request: 10,
			age_gap: 7,
			prior_flags: 5
		},
		isSeeded: false
	};
	return g.__surakshaMemoryStore__;
}
var MemoryStorageRepository = class {
	store = getStore();
	async createInitialReport(input) {
		const id = nid("case");
		const publicId = publicCaseId();
		const now = /* @__PURE__ */ new Date();
		const severity = input.severity ?? 1;
		const turns = input.turns.length ? input.turns : [{
			speaker: "reporter",
			text: `Severity ${severity} — no written note.`
		}];
		const joinedLang = nlpProvider.detect_language(turns.map((t) => t.text).join(" "));
		const initialPriority = severity >= 4 ? "P1" : severity === 3 ? "P2" : severity === 2 ? "P3" : "P4";
		const due = slaDueAt(now, initialPriority);
		const retainDays = input.retentionDays ?? 365;
		const retentionUntil = new Date(now.getTime() + retainDays * 864e5);
		const distress = severity >= 4;
		const caseEntity = {
			id,
			public_id: publicId,
			source: input.source,
			status: "new",
			priority: initialPriority,
			risk_score: severity >= 4 ? 80 : severity === 3 ? 55 : severity === 2 ? 30 : 15,
			risk_band: severity >= 4 ? "critical" : severity === 3 ? "high" : severity === 2 ? "med" : "low",
			stage: "contact",
			language: joinedLang,
			region_code: input.regionCode ?? null,
			callback_requested: Boolean(input.callbackRequested),
			distress_flag: distress,
			assigned_to: null,
			sla_due_at: due.toISOString(),
			last_activity_at: now.toISOString(),
			ai_generated: true,
			identity_sealed: true,
			retention_until: retentionUntil.toISOString(),
			created_at: now.toISOString(),
			updated_at: now.toISOString()
		};
		this.store.cases.set(id, caseEntity);
		let turnIndex = 0;
		for (const turn of turns) {
			const red = redactText(turn.text);
			const hash = await sha256Hex(turn.text);
			const mid = nid("msg");
			const lang = nlpProvider.detect_language(turn.text);
			this.store.messages.push({
				id: mid,
				case_id: id,
				turn_index: turnIndex,
				speaker: turn.speaker,
				lang,
				redacted_text: red.text,
				raw_hash: hash,
				created_at: now.toISOString()
			});
			turnIndex += 1;
		}
		if (input.screenshot) this.store.attachments.push({
			id: nid("att"),
			case_id: id,
			kind: "screenshot",
			storage_ref: "vault://simulated-sealed-screenshot",
			created_at: now.toISOString()
		});
		if (input.voice) this.store.attachments.push({
			id: nid("att"),
			case_id: id,
			kind: "voice",
			storage_ref: "vault://simulated-sealed-voice",
			created_at: now.toISOString()
		});
		if (input.callbackRequested && input.encryptedContact) this.store.identities.set(id, {
			id: nid("idn"),
			case_id: id,
			sealed: true,
			encrypted_blob: input.encryptedContact,
			reveal_authorized_by: null,
			reveal_authorized_at: null
		});
		await this.writeAudit({
			actorId: null,
			actorRole: "system",
			action: "report.submitted",
			resourceType: "case",
			resourceId: id,
			metadata: {
				source: input.source,
				severity: input.severity
			}
		});
		return {
			id,
			publicId
		};
	}
	async updateCaseAnalysis(caseId, analysis) {
		const existing = this.store.cases.get(caseId);
		if (!existing) throw new Error(`Case ${caseId} not found`);
		const now = /* @__PURE__ */ new Date();
		const due = slaDueAt(now, analysis.priority);
		existing.risk_score = analysis.score;
		existing.risk_band = analysis.band;
		existing.stage = analysis.stage;
		existing.priority = analysis.priority;
		existing.distress_flag = analysis.distress;
		existing.sla_due_at = due.toISOString();
		existing.last_activity_at = now.toISOString();
		existing.updated_at = now.toISOString();
		this.store.scores.push({
			id: nid("scr"),
			case_id: caseId,
			message_id: null,
			score: analysis.score,
			risk_band: analysis.band,
			contributing_factors: analysis.factors,
			created_at: now.toISOString()
		});
		for (const f of analysis.flags) this.store.flags.push({
			id: nid("flg"),
			case_id: caseId,
			message_id: null,
			flag_type: f.flag,
			present: true,
			evidence_label: f.label,
			created_at: now.toISOString()
		});
		for (const h of analysis.history) this.store.stageHistory.push({
			id: nid("stg"),
			case_id: caseId,
			stage: h.stage,
			reason: h.reason,
			entered_at: now.toISOString()
		});
		this.store.safetyCases.set(caseId, {
			id: nid("sft"),
			case_id: caseId,
			pack: analysis.pack,
			created_at: now.toISOString()
		});
		await this.writeEvent(caseId, "case.ingested", {
			publicId: existing.public_id,
			band: analysis.band,
			priority: analysis.priority,
			stage: analysis.stage,
			ai_generated: true,
			analysis_mode: analysis.analysisMode,
			model: analysis.modelName ?? null
		});
		await this.writeAudit({
			actorId: null,
			actorRole: "system",
			action: "case.ingested",
			resourceType: "case",
			resourceId: caseId,
			metadata: {
				source: existing.source,
				band: analysis.band,
				priority: analysis.priority,
				analysis_mode: analysis.analysisMode
			}
		});
		if (analysis.priority === "P1") await this.writeEvent(caseId, "alert.p1.stub", {
			channel: "simulated-realtime",
			note: "P1 real-time alert stub — no live agency webhook."
		});
	}
	async getCaseDetail(id, userId) {
		const c = this.store.cases.get(id);
		if (!c) return null;
		const me = await this.ensureStaffProfile(userId, "Responder");
		const assignedStaff = c.assigned_to ? this.store.staffProfiles.get(c.assigned_to) : null;
		const safety = this.store.safetyCases.get(id);
		const identity = this.store.identities.get(id);
		const messages = this.store.messages.filter((m) => m.case_id === id).sort((a, b) => a.turn_index - b.turn_index);
		const scores = this.store.scores.filter((s) => s.case_id === id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		const flags = this.store.flags.filter((f) => f.case_id === id).map((f) => ({
			flag_type: f.flag_type,
			evidence_label: f.evidence_label
		}));
		const stages = this.store.stageHistory.filter((s) => s.case_id === id).sort((a, b) => new Date(a.entered_at).getTime() - new Date(b.entered_at).getTime());
		const events = this.store.eventLog.filter((e) => e.case_id === id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((e) => ({
			event_type: e.event_type,
			payload: e.payload,
			created_at: e.created_at
		}));
		const notes = this.store.caseNotes.filter((n) => n.case_id === id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((n) => {
			const author = this.store.staffProfiles.get(n.author_id);
			return {
				id: n.id,
				author_id: n.author_id,
				body: n.body,
				created_at: n.created_at,
				author_name: author?.display_name ?? null
			};
		});
		const attachments = this.store.attachments.filter((a) => a.case_id === id).map((a) => ({
			kind: a.kind,
			storage_ref: a.storage_ref
		}));
		await this.writeAccess({
			actorId: userId,
			resourceType: "case",
			resourceId: id,
			purpose: "case.view"
		});
		const timeline = buildTimeline(messages.map((m) => ({
			speaker: m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other",
			text: m.redacted_text,
			at: m.created_at
		})), this.store.scoringWeights);
		return {
			me,
			case: {
				...c,
				assigned_name: assignedStaff?.display_name ?? null,
				analysis_mode: safety?.pack.analysis_mode ?? null
			},
			messages,
			scores: scores.map((s) => ({
				score: s.score,
				risk_band: s.risk_band,
				contributing_factors: s.contributing_factors,
				created_at: s.created_at
			})),
			flags,
			stages,
			events: events.map((e) => ({
				event_type: e.event_type,
				payload: e.payload,
				created_at: e.created_at
			})),
			notes,
			safetyPack: safety?.pack ?? null,
			hasSealedIdentity: Boolean(identity),
			identitySealed: identity?.sealed ?? true,
			attachments,
			timeline
		};
	}
	async listCases(userId) {
		await this.ensureSeeded();
		const me = await this.ensureStaffProfile(userId, "Responder");
		const priorityRank = {
			P1: 1,
			P2: 2,
			P3: 3,
			P4: 4
		};
		const casesList = Array.from(this.store.cases.values()).map((c) => {
			const staff = c.assigned_to ? this.store.staffProfiles.get(c.assigned_to) : null;
			const safety = this.store.safetyCases.get(c.id);
			return {
				...c,
				assigned_name: staff?.display_name ?? null,
				analysis_mode: safety?.pack.analysis_mode ?? null
			};
		}).sort((a, b) => {
			const rankDiff = (priorityRank[a.priority] || 4) - (priorityRank[b.priority] || 4);
			if (rankDiff !== 0) return rankDiff;
			return new Date(a.sla_due_at).getTime() - new Date(b.sla_due_at).getTime();
		});
		await this.writeAccess({
			actorId: userId,
			resourceType: "case_list",
			resourceId: "queue",
			purpose: "queue.view"
		});
		return {
			me,
			cases: casesList
		};
	}
	async transitionCase(id, to, userId, role, confirm) {
		const c = this.store.cases.get(id);
		if (!c) throw new Error("Case not found");
		const from = c.status;
		let assigned = c.assigned_to;
		if (to === "assigned" && from === "new") assigned = userId;
		assertTransition(from, to, confirm);
		if (to === "assigned" || to === "in_progress") c.sla_due_at = new Date(Date.now() + SLA_MINUTES[c.priority] * 6e4).toISOString();
		c.status = to;
		c.assigned_to = assigned;
		c.last_activity_at = (/* @__PURE__ */ new Date()).toISOString();
		c.updated_at = (/* @__PURE__ */ new Date()).toISOString();
		await this.writeEvent(id, "case.status", {
			from,
			to,
			confirm
		});
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: `case.${to}`,
			resourceType: "case",
			resourceId: id,
			metadata: {
				from,
				confirm
			}
		});
	}
	async addCaseNote(id, authorId, role, body) {
		const trimmed = body.trim();
		if (!trimmed) throw new Error("Note is empty");
		const c = this.store.cases.get(id);
		if (!c) throw new Error("Case not found");
		this.store.caseNotes.push({
			id: nid("nte"),
			case_id: id,
			author_id: authorId,
			body: trimmed,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		c.last_activity_at = (/* @__PURE__ */ new Date()).toISOString();
		await this.writeAudit({
			actorId: authorId,
			actorRole: role,
			action: "case.note",
			resourceType: "case",
			resourceId: id
		});
	}
	async revealIdentity(caseId, userId, role) {
		if (role === "ngo") throw new Error("NGO role cannot unseal identity");
		const c = this.store.cases.get(caseId);
		if (!c) throw new Error("Case not found");
		const idn = this.store.identities.get(caseId);
		if (!idn?.encrypted_blob) throw new Error("No sealed identity on this case");
		const { decryptField } = await import("./crypto-D95s8H0H.mjs");
		const plain = decryptField(idn.encrypted_blob);
		idn.sealed = false;
		idn.reveal_authorized_by = userId;
		idn.reveal_authorized_at = (/* @__PURE__ */ new Date()).toISOString();
		c.identity_sealed = false;
		c.updated_at = (/* @__PURE__ */ new Date()).toISOString();
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: "identity.reveal",
			resourceType: "case",
			resourceId: caseId,
			metadata: { note: "contact revealed to authorised responder; not written to logs" }
		});
		return plain;
	}
	async saveSafetyPack(caseId, pack, score, band, stage, userId, role) {
		const c = this.store.cases.get(caseId);
		if (!c) throw new Error("Case not found");
		c.risk_score = score;
		c.risk_band = band;
		c.stage = stage;
		c.updated_at = (/* @__PURE__ */ new Date()).toISOString();
		this.store.safetyCases.set(caseId, {
			id: nid("sft"),
			case_id: caseId,
			pack,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		await this.writeEvent(caseId, "safety_case.regenerated", {
			risk_score: score,
			analysis_mode: pack.analysis_mode
		});
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: "safety_case.regenerate",
			resourceType: "case",
			resourceId: caseId
		});
	}
	async getSafetyPack(caseId, userId) {
		const c = this.store.cases.get(caseId);
		if (!c) throw new Error("Case not found");
		const s = this.store.safetyCases.get(caseId);
		if (!s) throw new Error("No safety pack");
		await this.writeAccess({
			actorId: userId,
			resourceType: "case",
			resourceId: caseId,
			purpose: "export.safety_pack"
		});
		return {
			public_id: c.public_id,
			pack: s.pack
		};
	}
	async writeAudit(entry) {
		this.store.auditLog.push({
			id: nid("aud"),
			actor_id: entry.actorId ?? null,
			actor_role: entry.actorRole ?? null,
			action: entry.action,
			resource_type: entry.resourceType,
			resource_id: entry.resourceId ?? null,
			metadata: entry.metadata ?? null,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	async writeEvent(caseId, eventType, payload) {
		this.store.eventLog.push({
			id: nid("evt"),
			case_id: caseId,
			event_type: eventType,
			payload,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	async writeAccess(entry) {
		this.store.accessLog.push({
			id: nid("acc"),
			actor_id: entry.actorId,
			resource_type: entry.resourceType,
			resource_id: entry.resourceId,
			purpose: entry.purpose,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	async ensureStaffProfile(userId, displayName) {
		const existing = this.store.staffProfiles.get(userId);
		if (existing) return existing;
		const role = this.store.staffProfiles.size === 0 ? "admin" : "responder";
		const profile = {
			user_id: userId,
			role,
			display_name: displayName || "Responder",
			region: null,
			active: true
		};
		this.store.staffProfiles.set(userId, profile);
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: "staff.provision",
			resourceType: "staff",
			resourceId: userId,
			metadata: { role }
		});
		return profile;
	}
	async listStaff(userId) {
		return {
			me: await this.ensureStaffProfile(userId, "Responder"),
			staff: Array.from(this.store.staffProfiles.values())
		};
	}
	async setStaffRole(adminUserId, targetUserId, role) {
		const me = await this.ensureStaffProfile(adminUserId, "Responder");
		if (me.role !== "admin") throw new Error("Only admins can change roles");
		const target = this.store.staffProfiles.get(targetUserId);
		if (target) target.role = role;
		await this.writeAudit({
			actorId: adminUserId,
			actorRole: me.role,
			action: "staff.role_change",
			resourceType: "staff",
			resourceId: targetUserId,
			metadata: { role }
		});
	}
	async getAnalytics(userId) {
		await this.ensureSeeded();
		await this.ensureStaffProfile(userId, "Responder");
		const cases = Array.from(this.store.cases.values());
		const countBy = (arr) => {
			const counts = {};
			for (const item of arr) counts[item] = (counts[item] || 0) + 1;
			return counts;
		};
		const bandCounts = countBy(cases.map((c) => c.risk_band));
		const langCounts = countBy(cases.map((c) => c.language));
		const regionCounts = countBy(cases.map((c) => c.region_code || "unspecified"));
		const priorityCounts = countBy(cases.map((c) => c.priority));
		const statusCounts = countBy(cases.map((c) => c.status));
		const flagCounts = countBy(this.store.flags.map((f) => f.flag_type));
		const now = Date.now();
		const overdue = cases.filter((c) => new Date(c.sla_due_at).getTime() < now && c.status !== "resolved" && c.status !== "closed").length;
		await this.writeAccess({
			actorId: userId,
			resourceType: "analytics",
			resourceId: "org",
			purpose: "analytics.view"
		});
		return {
			byBand: Object.entries(bandCounts).map(([risk_band, n]) => ({
				risk_band,
				n
			})),
			byLang: Object.entries(langCounts).map(([language, n]) => ({
				language,
				n
			})),
			byRegion: Object.entries(regionCounts).map(([region_code, n]) => ({
				region_code,
				n
			})),
			byPriority: Object.entries(priorityCounts).map(([priority, n]) => ({
				priority,
				n
			})),
			byStatus: Object.entries(statusCounts).map(([status, n]) => ({
				status,
				n
			})),
			flagTypes: Object.entries(flagCounts).map(([flag_type, n]) => ({
				flag_type,
				n
			})).sort((a, b) => b.n - a.n),
			overdue
		};
	}
	async listAudit(userId) {
		return {
			me: await this.ensureStaffProfile(userId, "Responder"),
			rows: [...this.store.auditLog].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 200).map((r) => ({
				id: r.id,
				actor_id: r.actor_id,
				actor_role: r.actor_role,
				action: r.action,
				resource_type: r.resource_type,
				resource_id: r.resource_id,
				metadata: r.metadata ?? {},
				created_at: r.created_at
			}))
		};
	}
	async ensureSeeded() {
		if (this.store.isSeeded || this.store.cases.size > 0) return;
		this.store.isSeeded = true;
		for (const t of SYNTHETIC_THREADS) {
			const initial = await this.createInitialReport({
				source: "synthetic_seed",
				turns: t.turns,
				regionCode: t.region ?? null,
				callbackRequested: false,
				screenshot: false,
				voice: false,
				severity: 2
			});
			const turns = t.turns;
			const scored = nlpProvider.draft_safety_case({
				evidence: turns.map((turn) => ({
					...turn,
					text: redactText(turn.text).text
				})),
				timeline: [],
				classification: {
					grooming_risk: .8,
					cyberbullying_risk: .1,
					exploitation_risk: .1,
					benign: 0,
					label: "grooming_risk",
					confidence: .8
				},
				flags: {
					secrecy: true,
					pii_request: false,
					isolation: false,
					incentive: false,
					platform_migration: false,
					image_request: false,
					age_gap: false,
					distress: false,
					age_probe: false,
					trust_build: true,
					blackmail: false,
					unwanted_contact: false,
					hits: [{
						flag: "secrecy",
						label: "Secret keeping"
					}]
				},
				stage: "trust_building",
				score: 45,
				band: "med",
				priority: "P3",
				language: "en"
			});
			await this.updateCaseAnalysis(initial.id, {
				score: 45,
				band: "med",
				stage: "trust_building",
				priority: "P3",
				distress: false,
				factors: [{
					key: "synthetic",
					label: "Baseline Synthetic Case",
					points: 45
				}],
				flags: [{
					flag: "synthetic_seed",
					label: "Synthetic seed case"
				}],
				history: [{
					stage: "trust_building",
					reason: "Synthetic seed initial state"
				}],
				pack: {
					...scored,
					analysis_mode: "fallback",
					pocso_note: "SYNTHETIC SEED CASE — for development and verification."
				},
				analysisMode: "fallback",
				modelName: "synthetic"
			});
		}
	}
};
var poolInstance = null;
async function getPool() {
	if (!poolInstance) {
		const databaseUrl = process.env.DATABASE_URL?.trim();
		if (!databaseUrl) throw new Error("DATABASE_URL is required for PostgresStorageRepository");
		const { Pool } = await import("../_libs/pg.mjs").then((n) => n.n);
		poolInstance = new Pool({ connectionString: databaseUrl });
	}
	return poolInstance;
}
var PostgresStorageRepository = class {
	pool = getPool;
	async createInitialReport(input) {
		const id = nid("case");
		const publicId = publicCaseId();
		const now = /* @__PURE__ */ new Date();
		const severity = input.severity ?? 1;
		const turns = input.turns.length ? input.turns : [{
			speaker: "reporter",
			text: `Severity ${severity} — no written note.`
		}];
		const joinedLang = nlpProvider.detect_language(turns.map((t) => t.text).join(" "));
		const initialPriority = severity >= 4 ? "P1" : severity === 3 ? "P2" : severity === 2 ? "P3" : "P4";
		const due = slaDueAt(now, initialPriority);
		const retainDays = input.retentionDays ?? 365;
		const retentionUntil = new Date(now.getTime() + retainDays * 864e5);
		const distress = severity >= 4;
		const client = await (await this.pool()).connect();
		try {
			await client.query("BEGIN");
			await client.query(`insert into cases (
          id, public_id, source, status, priority, risk_score, risk_band, stage,
          language, region_code, callback_requested, distress_flag, assigned_to,
          sla_due_at, last_activity_at, ai_generated, identity_sealed, retention_until,
          created_at, updated_at
        ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`, [
				id,
				publicId,
				input.source,
				"new",
				initialPriority,
				severity >= 4 ? 80 : severity === 3 ? 55 : severity === 2 ? 30 : 15,
				severity >= 4 ? "critical" : severity === 3 ? "high" : severity === 2 ? "med" : "low",
				"contact",
				joinedLang,
				input.regionCode ?? null,
				Boolean(input.callbackRequested),
				distress,
				null,
				due.toISOString(),
				now.toISOString(),
				true,
				true,
				retentionUntil.toISOString(),
				now.toISOString(),
				now.toISOString()
			]);
			let turnIndex = 0;
			for (const turn of turns) {
				const red = redactText(turn.text);
				const hash = await sha256Hex(turn.text);
				const mid = nid("msg");
				const lang = nlpProvider.detect_language(turn.text);
				await client.query(`insert into messages (id, case_id, turn_index, speaker, lang, redacted_text, raw_hash, created_at)
           values ($1, $2, $3, $4, $5, $6, $7, $8)`, [
					mid,
					id,
					turnIndex,
					turn.speaker,
					lang,
					red.text,
					hash,
					now.toISOString()
				]);
				turnIndex += 1;
			}
			if (input.screenshot) await client.query(`insert into attachments (id, case_id, kind, storage_ref, created_at)
           values ($1, $2, $3, $4, $5)`, [
				nid("att"),
				id,
				"screenshot",
				"vault://simulated-sealed-screenshot",
				now.toISOString()
			]);
			if (input.voice) await client.query(`insert into attachments (id, case_id, kind, storage_ref, created_at)
           values ($1, $2, $3, $4, $5)`, [
				nid("att"),
				id,
				"voice",
				"vault://simulated-sealed-voice",
				now.toISOString()
			]);
			if (input.callbackRequested && input.encryptedContact) await client.query(`insert into reporter_identity (id, case_id, sealed, encrypted_blob)
           values ($1, $2, $3, $4)`, [
				nid("idn"),
				id,
				true,
				input.encryptedContact
			]);
			await client.query(`insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata, created_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`, [
				nid("aud"),
				null,
				"system",
				"report.submitted",
				"case",
				id,
				JSON.stringify({
					source: input.source,
					severity: input.severity
				}),
				now.toISOString()
			]);
			await client.query("COMMIT");
			return {
				id,
				publicId
			};
		} catch (err) {
			await client.query("ROLLBACK").catch(() => void 0);
			throw err;
		} finally {
			client.release();
		}
	}
	async updateCaseAnalysis(caseId, analysis) {
		const client = await (await this.pool()).connect();
		try {
			await client.query("BEGIN");
			const now = /* @__PURE__ */ new Date();
			const due = slaDueAt(now, analysis.priority);
			await client.query(`update cases set
          risk_score = $1, risk_band = $2, stage = $3, priority = $4,
          distress_flag = $5, sla_due_at = $6, last_activity_at = $7, updated_at = $8
         where id = $9`, [
				analysis.score,
				analysis.band,
				analysis.stage,
				analysis.priority,
				analysis.distress,
				due.toISOString(),
				now.toISOString(),
				now.toISOString(),
				caseId
			]);
			await client.query(`insert into scores (id, case_id, message_id, score, risk_band, contributing_factors, created_at)
         values ($1, $2, $3, $4, $5, $6, $7)`, [
				nid("scr"),
				caseId,
				null,
				analysis.score,
				analysis.band,
				JSON.stringify(analysis.factors),
				now.toISOString()
			]);
			for (const f of analysis.flags) await client.query(`insert into flags (id, case_id, message_id, flag_type, present, evidence_label, created_at)
           values ($1, $2, $3, $4, $5, $6, $7)`, [
				nid("flg"),
				caseId,
				null,
				f.flag,
				true,
				f.label,
				now.toISOString()
			]);
			for (const h of analysis.history) await client.query(`insert into stage_history (id, case_id, stage, reason, entered_at)
           values ($1, $2, $3, $4, $5)`, [
				nid("stg"),
				caseId,
				h.stage,
				h.reason,
				now.toISOString()
			]);
			await client.query(`insert into safety_cases (id, case_id, pack, created_at)
         values ($1, $2, $3, $4)
         on conflict (case_id) do update set pack = excluded.pack, created_at = excluded.created_at`, [
				nid("sft"),
				caseId,
				JSON.stringify(analysis.pack),
				now.toISOString()
			]);
			await client.query(`insert into event_log (id, case_id, event_type, payload, created_at)
         values ($1, $2, $3, $4, $5)`, [
				nid("evt"),
				caseId,
				"case.ingested",
				JSON.stringify({
					band: analysis.band,
					priority: analysis.priority,
					stage: analysis.stage,
					ai_generated: true,
					analysis_mode: analysis.analysisMode,
					model: analysis.modelName ?? null
				}),
				now.toISOString()
			]);
			await client.query(`insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata, created_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`, [
				nid("aud"),
				null,
				"system",
				"case.ingested",
				"case",
				caseId,
				JSON.stringify({
					band: analysis.band,
					priority: analysis.priority,
					analysis_mode: analysis.analysisMode
				}),
				now.toISOString()
			]);
			await client.query("COMMIT");
		} catch (err) {
			await client.query("ROLLBACK").catch(() => void 0);
			throw err;
		} finally {
			client.release();
		}
	}
	async getCaseDetail(id, userId) {
		const me = await this.ensureStaffProfile(userId, "Responder");
		const row = (await (await this.pool()).query(`select
        c.id, c.public_id, c.source, c.status, c.priority, c.risk_score, c.risk_band,
        c.stage, c.language, c.region_code, c.callback_requested, c.distress_flag,
        c.assigned_to, c.sla_due_at::text as sla_due_at,
        c.last_activity_at::text as last_activity_at, c.ai_generated, c.identity_sealed,
        c.created_at::text as created_at,
        s.display_name as assigned_name
      from cases c
      left join staff_profiles s on s.user_id = c.assigned_to
      where c.id = $1`, [id])).rows[0];
		if (!row) return null;
		const msgRes = await (await this.pool()).query(`select id, turn_index, speaker, lang, redacted_text, created_at::text as created_at
       from messages where case_id = $1 order by turn_index`, [id]);
		const scoreRes = await (await this.pool()).query(`select score, risk_band, contributing_factors, created_at::text as created_at
       from scores where case_id = $1 order by created_at`, [id]);
		const flagRes = await (await this.pool()).query(`select flag_type, evidence_label from flags where case_id = $1`, [id]);
		const stageRes = await (await this.pool()).query(`select stage, reason, entered_at::text as entered_at
       from stage_history where case_id = $1 order by entered_at`, [id]);
		const eventRes = await (await this.pool()).query(`select event_type, payload, created_at::text as created_at
       from event_log where case_id = $1 order by created_at`, [id]);
		const noteRes = await (await this.pool()).query(`select n.id, n.author_id, n.body, n.created_at::text as created_at, s.display_name as author_name
       from case_notes n
       left join staff_profiles s on s.user_id = n.author_id
       where n.case_id = $1 order by n.created_at`, [id]);
		const safetyRes = await (await this.pool()).query(`select pack from safety_cases where case_id = $1`, [id]);
		const idnRes = await (await this.pool()).query(`select sealed from reporter_identity where case_id = $1`, [id]);
		const attRes = await (await this.pool()).query(`select kind, storage_ref from attachments where case_id = $1`, [id]);
		await this.writeAccess({
			actorId: userId,
			resourceType: "case",
			resourceId: id,
			purpose: "case.view"
		});
		const timeline = buildTimeline(msgRes.rows.map((m) => ({
			speaker: m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other",
			text: m.redacted_text,
			at: m.created_at
		})), {
			classifier_confidence: 22,
			stage: 20,
			persistence: 12,
			secrecy: 12,
			pii_request: 12,
			image_request: 10,
			age_gap: 7,
			prior_flags: 5
		});
		return {
			me,
			case: row,
			messages: msgRes.rows,
			scores: scoreRes.rows,
			flags: flagRes.rows,
			stages: stageRes.rows,
			events: eventRes.rows,
			notes: noteRes.rows,
			safetyPack: safetyRes.rows[0]?.pack ?? null,
			hasSealedIdentity: Boolean(idnRes.rows[0]),
			identitySealed: idnRes.rows[0]?.sealed ?? true,
			attachments: attRes.rows,
			timeline
		};
	}
	async listCases(userId) {
		await this.ensureSeeded();
		const me = await this.ensureStaffProfile(userId, "Responder");
		const res = await (await this.pool()).query(`select
        c.id, c.public_id, c.source, c.status, c.priority, c.risk_score, c.risk_band,
        c.stage, c.language, c.region_code, c.callback_requested, c.distress_flag,
        c.assigned_to, c.sla_due_at::text as sla_due_at,
        c.last_activity_at::text as last_activity_at, c.ai_generated, c.identity_sealed,
        c.created_at::text as created_at,
        s.display_name as assigned_name,
        sc.pack ->> 'analysis_mode' as analysis_mode
      from cases c
      left join staff_profiles s on s.user_id = c.assigned_to
      left join safety_cases sc on sc.case_id = c.id
      order by
        case c.priority when 'P1' then 1 when 'P2' then 2 when 'P3' then 3 else 4 end,
        c.sla_due_at asc`);
		await this.writeAccess({
			actorId: userId,
			resourceType: "case_list",
			resourceId: "queue",
			purpose: "queue.view"
		});
		return {
			me,
			cases: res.rows
		};
	}
	async transitionCase(id, to, userId, role, confirm) {
		const row = (await (await this.pool()).query(`select status, assigned_to, priority from cases where id = $1`, [id])).rows[0];
		if (!row) throw new Error("Case not found");
		const from = row.status;
		let assigned = row.assigned_to;
		if (to === "assigned" && from === "new") assigned = userId;
		assertTransition(from, to, confirm);
		let sla = null;
		if (to === "assigned" || to === "in_progress") sla = new Date(Date.now() + SLA_MINUTES[row.priority] * 6e4).toISOString();
		await (await this.pool()).query(`update cases set
        status = $1, assigned_to = $2, sla_due_at = coalesce($3::timestamptz, sla_due_at),
        last_activity_at = now(), updated_at = now()
       where id = $4`, [
			to,
			assigned,
			sla,
			id
		]);
		await this.writeEvent(id, "case.status", {
			from,
			to,
			confirm
		});
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: `case.${to}`,
			resourceType: "case",
			resourceId: id,
			metadata: {
				from,
				confirm
			}
		});
	}
	async addCaseNote(id, authorId, role, body) {
		const trimmed = body.trim();
		if (!trimmed) throw new Error("Note is empty");
		await (await this.pool()).query(`insert into case_notes (id, case_id, author_id, body)
       values ($1, $2, $3, $4)`, [
			nid("nte"),
			id,
			authorId,
			trimmed
		]);
		await (await this.pool()).query(`update cases set last_activity_at = now() where id = $1`, [id]);
		await this.writeAudit({
			actorId: authorId,
			actorRole: role,
			action: "case.note",
			resourceType: "case",
			resourceId: id
		});
	}
	async revealIdentity(caseId, userId, role) {
		if (role === "ngo") throw new Error("NGO role cannot unseal identity");
		const row = (await (await this.pool()).query(`select encrypted_blob from reporter_identity where case_id = $1`, [caseId])).rows[0];
		if (!row?.encrypted_blob) throw new Error("No sealed identity on this case");
		const { decryptField } = await import("./crypto-D95s8H0H.mjs");
		const plain = decryptField(row.encrypted_blob);
		await (await this.pool()).query(`update reporter_identity set sealed = false, reveal_authorized_by = $1, reveal_authorized_at = now()
       where case_id = $2`, [userId, caseId]);
		await (await this.pool()).query(`update cases set identity_sealed = false, updated_at = now() where id = $1`, [caseId]);
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: "identity.reveal",
			resourceType: "case",
			resourceId: caseId,
			metadata: { note: "contact revealed to authorised responder; not written to logs" }
		});
		return plain;
	}
	async saveSafetyPack(caseId, pack, score, band, stage, userId, role) {
		await (await this.pool()).query(`update cases set risk_score = $1, risk_band = $2, stage = $3, updated_at = now() where id = $4`, [
			score,
			band,
			stage,
			caseId
		]);
		await (await this.pool()).query(`insert into safety_cases (id, case_id, pack)
       values ($1, $2, $3)
       on conflict (case_id) do update set pack = excluded.pack, created_at = now()`, [
			nid("sft"),
			caseId,
			JSON.stringify(pack)
		]);
		await this.writeEvent(caseId, "safety_case.regenerated", {
			risk_score: score,
			analysis_mode: pack.analysis_mode
		});
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: "safety_case.regenerate",
			resourceType: "case",
			resourceId: caseId
		});
	}
	async getSafetyPack(caseId, userId) {
		const res = await (await this.pool()).query(`select s.pack, c.public_id
       from safety_cases s join cases c on c.id = s.case_id
       where s.case_id = $1`, [caseId]);
		if (!res.rows[0]) throw new Error("No safety pack");
		await this.writeAccess({
			actorId: userId,
			resourceType: "case",
			resourceId: caseId,
			purpose: "export.safety_pack"
		});
		return {
			public_id: res.rows[0].public_id,
			pack: res.rows[0].pack
		};
	}
	async writeAudit(entry) {
		await (await this.pool()).query(`insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata)
       values ($1, $2, $3, $4, $5, $6, $7)`, [
			nid("aud"),
			entry.actorId ?? null,
			entry.actorRole ?? null,
			entry.action,
			entry.resourceType,
			entry.resourceId ?? null,
			JSON.stringify(entry.metadata ?? {})
		]);
	}
	async writeEvent(caseId, eventType, payload) {
		await (await this.pool()).query(`insert into event_log (id, case_id, event_type, payload)
       values ($1, $2, $3, $4)`, [
			nid("evt"),
			caseId,
			eventType,
			JSON.stringify(payload)
		]);
	}
	async writeAccess(entry) {
		await (await this.pool()).query(`insert into access_log (id, actor_id, resource_type, resource_id, purpose)
       values ($1, $2, $3, $4, $5)`, [
			nid("acc"),
			entry.actorId,
			entry.resourceType,
			entry.resourceId,
			entry.purpose
		]);
	}
	async ensureStaffProfile(userId, displayName) {
		const existing = await (await this.pool()).query(`select user_id, role, display_name, region, active from staff_profiles where user_id = $1`, [userId]);
		if (existing.rows[0]) return existing.rows[0];
		const role = ((await (await this.pool()).query(`select count(*)::int as n from staff_profiles`)).rows[0]?.n ?? 0) === 0 ? "admin" : "responder";
		await (await this.pool()).query(`insert into staff_profiles (user_id, role, display_name, region, active)
       values ($1, $2, $3, $4, $5)`, [
			userId,
			role,
			displayName || "Responder",
			null,
			true
		]);
		await this.writeAudit({
			actorId: userId,
			actorRole: role,
			action: "staff.provision",
			resourceType: "staff",
			resourceId: userId,
			metadata: { role }
		});
		return {
			user_id: userId,
			role,
			display_name: displayName || "Responder",
			region: null,
			active: true
		};
	}
	async listStaff(userId) {
		return {
			me: await this.ensureStaffProfile(userId, "Responder"),
			staff: (await (await this.pool()).query(`select user_id, role, display_name, region, active from staff_profiles order by created_at asc`)).rows
		};
	}
	async setStaffRole(adminUserId, targetUserId, role) {
		const me = await this.ensureStaffProfile(adminUserId, "Responder");
		if (me.role !== "admin") throw new Error("Only admins can change roles");
		await (await this.pool()).query(`update staff_profiles set role = $1 where user_id = $2`, [role, targetUserId]);
		await this.writeAudit({
			actorId: adminUserId,
			actorRole: me.role,
			action: "staff.role_change",
			resourceType: "staff",
			resourceId: targetUserId,
			metadata: { role }
		});
	}
	async getAnalytics(userId) {
		await this.ensureSeeded();
		await this.ensureStaffProfile(userId, "Responder");
		const byBand = (await (await this.pool()).query(`select risk_band, count(*)::int as n from cases group by risk_band`)).rows;
		const byLang = (await (await this.pool()).query(`select language, count(*)::int as n from cases group by language`)).rows;
		const byRegion = (await (await this.pool()).query(`select coalesce(region_code, 'unspecified') as region_code, count(*)::int as n from cases group by 1`)).rows;
		const byPriority = (await (await this.pool()).query(`select priority, count(*)::int as n from cases group by priority`)).rows;
		const byStatus = (await (await this.pool()).query(`select status, count(*)::int as n from cases group by status`)).rows;
		const flagTypes = (await (await this.pool()).query(`select flag_type, count(*)::int as n from flags group by flag_type order by n desc`)).rows;
		const overdue = (await (await this.pool()).query(`select count(*)::int as n from cases where sla_due_at < now() and status not in ('resolved', 'closed')`)).rows[0]?.n ?? 0;
		await this.writeAccess({
			actorId: userId,
			resourceType: "analytics",
			resourceId: "org",
			purpose: "analytics.view"
		});
		return {
			byBand,
			byLang,
			byRegion,
			byPriority,
			byStatus,
			flagTypes,
			overdue
		};
	}
	async listAudit(userId) {
		return {
			me: await this.ensureStaffProfile(userId, "Responder"),
			rows: (await (await this.pool()).query(`select id, actor_id, actor_role, action, resource_type, resource_id, metadata,
              created_at::text as created_at
       from audit_log
       order by created_at desc
       limit 200`)).rows
		};
	}
	async ensureSeeded() {
		if (((await (await this.pool()).query(`select count(*)::int as n from cases`)).rows[0]?.n ?? 0) > 0) return;
		for (const t of SYNTHETIC_THREADS) {
			const initial = await this.createInitialReport({
				source: "synthetic_seed",
				turns: t.turns,
				regionCode: t.region ?? null,
				callbackRequested: false,
				screenshot: false,
				voice: false,
				severity: 2
			});
			const turns = t.turns;
			const scored = nlpProvider.draft_safety_case({
				evidence: turns.map((turn) => ({
					...turn,
					text: redactText(turn.text).text
				})),
				timeline: [],
				classification: {
					grooming_risk: .8,
					cyberbullying_risk: .1,
					exploitation_risk: .1,
					benign: 0,
					label: "grooming_risk",
					confidence: .8
				},
				flags: {
					secrecy: true,
					pii_request: false,
					isolation: false,
					incentive: false,
					platform_migration: false,
					image_request: false,
					age_gap: false,
					distress: false,
					age_probe: false,
					trust_build: true,
					blackmail: false,
					unwanted_contact: false,
					hits: [{
						flag: "secrecy",
						label: "Secret keeping"
					}]
				},
				stage: "trust_building",
				score: 45,
				band: "med",
				priority: "P3",
				language: "en"
			});
			await this.updateCaseAnalysis(initial.id, {
				score: 45,
				band: "med",
				stage: "trust_building",
				priority: "P3",
				distress: false,
				factors: [{
					key: "synthetic",
					label: "Baseline Synthetic Case",
					points: 45
				}],
				flags: [{
					flag: "synthetic_seed",
					label: "Synthetic seed case"
				}],
				history: [{
					stage: "trust_building",
					reason: "Synthetic seed initial state"
				}],
				pack: {
					...scored,
					analysis_mode: "fallback",
					pocso_note: "SYNTHETIC SEED CASE — for development and verification."
				},
				analysisMode: "fallback",
				modelName: "synthetic"
			});
		}
	}
};
var repoInstance = null;
function getStorageRepository() {
	if (!repoInstance) {
		if (process.env.DATABASE_URL?.trim()) repoInstance = new PostgresStorageRepository();
		else repoInstance = new MemoryStorageRepository();
	}
	return repoInstance;
}
//#endregion
export { prioritise as n, getStorageRepository as t };
