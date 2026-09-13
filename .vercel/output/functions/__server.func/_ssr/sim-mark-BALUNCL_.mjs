import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sim-mark-BALUNCL_.js
var import_jsx_runtime = require_jsx_runtime();
function SimMark({ children = "Simulated · prototype data", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted", className),
		children
	});
}
function HumanLoopMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-teal-mist px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-teal-deep", className),
		children: "AI-assisted. Human decision required."
	});
}
//#endregion
export { SimMark as n, HumanLoopMark as t };
