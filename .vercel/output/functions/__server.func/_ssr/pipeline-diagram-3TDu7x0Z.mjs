import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as ArrowDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pipeline-diagram-3TDu7x0Z.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"User evidence",
	"OCR / speech-to-text",
	"LLM",
	"Structured safety signals",
	"Deterministic risk engine",
	"Explainable result",
	"Human review"
];
function PipelineDiagram({ compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Technical path"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-lg",
				children: compact ? "How analysis runs" : "AI-assisted, human-controlled"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2",
				children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-lg border border-border bg-paper px-3 py-2 text-xs font-medium",
						children: s
					}), i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3.5 shrink-0 text-muted sm:-rotate-90" })]
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "The model extracts signals. Application logic scores risk. A person decides."
			})
		]
	});
}
//#endregion
export { PipelineDiagram as t };
