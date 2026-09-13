import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-izQYYaFw.mjs";
import { t as getStorageRepository } from "./storage-DDzPOkcj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-DZXqalpx.js
async function ensureStaffProfile(userId, displayName) {
	return getStorageRepository().ensureStaffProfile(userId, displayName);
}
var getMyStaff_createServerFn_handler = createServerRpc({
	id: "9f09d410db5c334c752af1ddd3dbbed80bdf29c7abfb801a89d88294d86c0202",
	name: "getMyStaff",
	filename: "src/lib/server/staff.ts"
}, (opts) => getMyStaff.__executeServer(opts));
var getMyStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyStaff_createServerFn_handler, async ({ context }) => {
	return ensureStaffProfile(context.userId, "Responder");
});
var listStaff_createServerFn_handler = createServerRpc({
	id: "75c0bb018bbe390610c267c1f8ac81b296582d40f1285f01d58f1c4f282adbaa",
	name: "listStaff",
	filename: "src/lib/server/staff.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaff_createServerFn_handler, async ({ context }) => {
	return getStorageRepository().listStaff(context.userId);
});
var setStaffRole_createServerFn_handler = createServerRpc({
	id: "3012ab40bcaf9683539f9b849297577d81ca80cc9e15d5b56188365f0bd5a719",
	name: "setStaffRole",
	filename: "src/lib/server/staff.ts"
}, (opts) => setStaffRole.__executeServer(opts));
var setStaffRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setStaffRole_createServerFn_handler, async ({ context, data }) => {
	await getStorageRepository().setStaffRole(context.userId, data.userId, data.role);
	return { ok: true };
});
//#endregion
export { getMyStaff_createServerFn_handler, listStaff_createServerFn_handler, setStaffRole_createServerFn_handler };
