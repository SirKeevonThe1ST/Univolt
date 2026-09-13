import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as PipelineDiagram } from "./pipeline-diagram-3TDu7x0Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/architecture-CubzbZ9v.js
var import_jsx_runtime = require_jsx_runtime();
function Architecture() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "Architecture"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-ink-soft",
				children: "User evidence is processed on the server: OCR / speech-to-text, then a live LLM extracts behavioural signals as structured JSON. A deterministic risk engine scores those signals. A human reviews every consequential action. AI-assisted, human-controlled."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineDiagram, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto rounded-xl border border-border bg-ink p-4 text-xs leading-relaxed text-paper",
				children: `USER EVIDENCE
        ↓
FRONTEND
        ↓
SECURE SERVER / API ROUTE
        ↓
OCR / SPEECH-TO-TEXT / IMAGE PROCESSING
        ↓
LLM PROVIDER (structured JSON)
        ↓
SCHEMA VALIDATION
        ↓
DETERMINISTIC RISK ENGINE
        ↓
EXPLAINABLE SAFETY RESULT
        ↓
RESPONDER CASE
        ↓
HUMAN REVIEW`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "OpenAPI-style routes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "POST analyzeEvidence — live LLM analysis (no auth)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "POST extractScreenshots — vision OCR reconstruction" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "POST transcribeVoice — speech-to-text" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "POST askCopilot / requestBriefing / requestWhatIf" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "POST /report — anonymous tip (no auth)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "GET /console — priority queue (staff or demo desk)" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "API keys stay on the server. The model never contacts police, parents, or authorities."
			})
		]
	});
}
//#endregion
export { Architecture as component };
