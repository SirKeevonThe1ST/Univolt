import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as getSql } from "./db-B1-Vy_C7.mjs";
import { t as authMiddleware } from "./middleware-izQYYaFw.mjs";
import { t as getStorageRepository } from "./storage-DDzPOkcj.mjs";
import { t as ensureStaffProfile } from "./staff-DLovbWU9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-2QDtnxIl.js
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "40d717d7faa7e364391652b9a6420cf9b0725fbf000d5eba79ca2e35c6efb7dd",
	name: "getAnalytics",
	filename: "src/lib/server/analytics.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAnalytics_createServerFn_handler, async ({ context }) => {
	return getStorageRepository().getAnalytics(context.userId);
});
var listAudit_createServerFn_handler = createServerRpc({
	id: "d434201e67e79c16af943b1897bdcc7d6935045ed8273ca6652ab2b486a60e6b",
	name: "listAudit",
	filename: "src/lib/server/analytics.ts"
}, (opts) => listAudit.__executeServer(opts));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAudit_createServerFn_handler, async ({ context }) => {
	return getStorageRepository().listAudit(context.userId);
});
var getScoringConfig_createServerFn_handler = createServerRpc({
	id: "e1d29b527c2e795e3d7e4b907f4ad3e5ae707a593743c447e92fdc720c92ae58",
	name: "getScoringConfig",
	filename: "src/lib/server/analytics.ts"
}, (opts) => getScoringConfig.__executeServer(opts));
var getScoringConfig = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getScoringConfig_createServerFn_handler, async ({ context }) => {
	const me = await ensureStaffProfile(context.userId, "Responder");
	const sql = await getSql();
	return {
		me,
		weights: await sql`
      select key, weight::text as weight, description from scoring_config order by key
    `,
		retention: (await sql`
      select retain_days, notes from retention_policy where id = 1
    `)[0] ?? null
	};
});
var updateScoringConfig_createServerFn_handler = createServerRpc({
	id: "dee190dc2c50b444d6b1576d366c04b64c7f9b1fbd6853789d40159684297911",
	name: "updateScoringConfig",
	filename: "src/lib/server/analytics.ts"
}, (opts) => updateScoringConfig.__executeServer(opts));
var updateScoringConfig = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateScoringConfig_createServerFn_handler, async ({ context, data }) => {
	if ((await ensureStaffProfile(context.userId, "Responder")).role !== "admin") throw new Error("Only admins can change scoring weights");
	await (await getSql())`
      update scoring_config set weight = ${data.weight}, updated_at = now()
      where key = ${data.key}
    `;
	return { ok: true };
});
var purgeDueCases_createServerFn_handler = createServerRpc({
	id: "bca203d7512086d4a110c2c12d98722fbfb3b360405e6eee1c0adb543903a501",
	name: "purgeDueCases",
	filename: "src/lib/server/analytics.ts"
}, (opts) => purgeDueCases.__executeServer(opts));
var purgeDueCases = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(purgeDueCases_createServerFn_handler, async ({ context, data }) => {
	if (!data.confirm) throw new Error("Human confirmation required");
	if ((await ensureStaffProfile(context.userId, "Responder")).role !== "admin") throw new Error("Only admins can purge");
	const sql = await getSql();
	const due = await sql`
      select id from cases where status = 'closed' and retention_until < now()
    `;
	for (const row of due) await sql`delete from cases where id = ${row.id}`;
	return { purged: due.length };
});
//#endregion
export { getAnalytics_createServerFn_handler, getScoringConfig_createServerFn_handler, listAudit_createServerFn_handler, purgeDueCases_createServerFn_handler, updateScoringConfig_createServerFn_handler };
