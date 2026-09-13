import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-B-FFAJW6.js
var submitAnonymousReport_createServerFn_handler = createServerRpc({
	id: "44b8c02dee01140de1d71b4bd58791b382b7d86bba16367ddf64549fad7637c4",
	name: "submitAnonymousReport",
	filename: "src/lib/server/report.ts"
}, (opts) => submitAnonymousReport.__executeServer(opts));
var submitAnonymousReport = createServerFn({ method: "POST" }).validator((d) => d).handler(submitAnonymousReport_createServerFn_handler, async ({ data }) => {
	const { handleAnonymousReport } = await import("./report-handler-DCp_4Or0.mjs");
	return handleAnonymousReport(data);
});
//#endregion
export { submitAnonymousReport_createServerFn_handler };
