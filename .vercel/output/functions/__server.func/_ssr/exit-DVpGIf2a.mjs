import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as triggerSafeExit } from "./safe-exit-B-xFL1Y-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exit-DVpGIf2a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Exit() {
	(0, import_react.useEffect)(() => {
		triggerSafeExit();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Leaving…"
		})
	});
}
//#endregion
export { Exit as component };
