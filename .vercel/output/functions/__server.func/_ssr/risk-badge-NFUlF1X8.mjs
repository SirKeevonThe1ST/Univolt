import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as Badge } from "./router-DoXUK3Ja.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/risk-badge-NFUlF1X8.js
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	low: "ok",
	med: "warn",
	high: "danger",
	critical: "ink",
	P1: "ink",
	P2: "danger",
	P3: "warn",
	P4: "teal"
};
function RiskBadge({ band }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: TONE[band] ?? "neutral",
		children: band
	});
}
function PriorityBadge({ priority }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: TONE[priority] ?? "neutral",
		children: priority
	});
}
//#endregion
export { RiskBadge as n, PriorityBadge as t };
