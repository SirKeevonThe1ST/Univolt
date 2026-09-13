import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn, s as scoreThread, t as analyseProgression } from "./scoring-BbRGh4-y.mjs";
import { n as nlpProvider, t as SYNTHETIC_THREADS } from "./conversations-Cw_ZHOU9.mjs";
import { C as Button, y as Badge } from "./router-DoXUK3Ja.mjs";
import { n as RiskBadge } from "./risk-badge-NFUlF1X8.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/detect-DHjNUzzj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Detect() {
	const [key, setKey] = (0, import_react.useState)(SYNTHETIC_THREADS[0].key);
	const thread = SYNTHETIC_THREADS.find((t) => t.key === key) ?? SYNTHETIC_THREADS[0];
	const scored = (0, import_react.useMemo)(() => scoreThread(thread.turns), [thread]);
	const prog = (0, import_react.useMemo)(() => analyseProgression(thread.turns), [thread]);
	const lang = nlpProvider.detect_language(thread.turns.map((t) => t.text).join(" "));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-teal",
				children: "Labeled synthetic set only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-medium tracking-tight",
				children: "How detection works"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-ink-soft leading-relaxed",
				children: "Click a prepared example. The engine classifies language, extracts behavioural flags, advances a stage machine, and scores 0–100. No live predatory dialogue is generated. AI never decides an intervention."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/intelligence",
					children: "Open the full Safety Intelligence demo"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: SYNTHETIC_THREADS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: t.key === key ? "default" : "outline",
					onClick: () => setKey(t.key),
					children: t.title
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Redacted thread"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 space-y-3",
							children: thread.turns.map((turn, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-teal-deep",
									children: turn.speaker
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-ink-soft",
									children: [" — ", turn.text]
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted",
							children: "SYNTHETIC · labeled for tests · not a real child"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: scored.band }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [scored.score, "/100"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "teal",
									children: lang
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: prog.stage.replace(/_/g, " ") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-ink-soft",
							children: [
								"Classifier: ",
								scored.classification.label.replace(/_/g, " "),
								" (",
								Math.round(scored.classification.confidence * 100),
								"%)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1 text-sm",
							children: scored.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink-soft",
									children: f.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: f.points
								})]
							}, f.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1 pt-2",
							children: scored.flags.hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "warn",
								children: h.flag.replace(/_/g, " ")
							}, h.flag + h.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "AI-generated explanation. A human still decides."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 grid gap-2 text-sm text-ink-soft sm:grid-cols-4",
				children: [
					"contact",
					"trust building",
					"isolation",
					"exploitation attempt"
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("rounded-xl border px-3 py-3", prog.stage.replace(/_/g, " ") === s || prog.stage === "trust_building" && s === "trust building" || prog.stage === "exploitation_attempt" && s === "exploitation attempt" ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: i + 1
					}), s]
				}, s))
			})
		]
	}) });
}
//#endregion
export { Detect as component };
