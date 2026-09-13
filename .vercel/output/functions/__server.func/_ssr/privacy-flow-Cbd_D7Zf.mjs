import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as DEMO_PRIVACY_REDACTED, r as DEMO_PRIVACY_ORIGINAL } from "./intelligence-Dr71N71v.mjs";
import { A as ArrowDown } from "../_libs/lucide-react.mjs";
import { m as PrivacyDashboard } from "./router-DoXUK3Ja.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-flow-Cbd_D7Zf.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"Raw input",
	"PII detection",
	"Redaction",
	"Safety analysis",
	"Encrypted / controlled access",
	"Human review"
];
var FALLBACK = {
	piiDetected: 3,
	redacted: 3,
	identityExposed: false,
	autonomousEscalation: false,
	humanApproval: true,
	originalSample: DEMO_PRIVACY_ORIGINAL,
	redactedSample: DEMO_PRIVACY_REDACTED
};
function PrivacyFlow({ metrics, compact }) {
	const m = metrics ?? FALLBACK;
	if (!compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyDashboard, { metrics: m });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Privacy by design"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-xl font-medium",
				children: "How data moves"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 flex flex-col items-stretch gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2",
				children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-lg border border-border bg-paper px-3 py-2 text-xs font-medium sm:text-sm",
						children: s
					}), i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3.5 text-muted sm:-rotate-90" })]
				}, s))
			})
		]
	});
}
//#endregion
export { PrivacyFlow as t };
