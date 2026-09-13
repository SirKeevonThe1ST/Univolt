import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-izQYYaFw.mjs";
import { t as getStorageRepository } from "./storage-DDzPOkcj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-DLovbWU9.js
async function ensureStaffProfile(userId, displayName) {
	return getStorageRepository().ensureStaffProfile(userId, displayName);
}
var getMyStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9f09d410db5c334c752af1ddd3dbbed80bdf29c7abfb801a89d88294d86c0202"));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("75c0bb018bbe390610c267c1f8ac81b296582d40f1285f01d58f1c4f282adbaa"));
var setStaffRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("3012ab40bcaf9683539f9b849297577d81ca80cc9e15d5b56188365f0bd5a719"));
//#endregion
export { setStaffRole as i, getMyStaff as n, listStaff as r, ensureStaffProfile as t };
