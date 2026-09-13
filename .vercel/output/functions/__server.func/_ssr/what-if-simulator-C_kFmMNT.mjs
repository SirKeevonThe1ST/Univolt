import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { t as HumanLoopMark } from "./sim-mark-BALUNCL_.mjs";
import { A as ArrowDown } from "../_libs/lucide-react.mjs";
import { C as Button, c as askCopilot, d as requestBriefing, f as requestWhatIf } from "./router-DoXUK3Ja.mjs";
import { r as Textarea } from "./input-BuUSUMkL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/what-if-simulator-C_kFmMNT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TREE = {
	low: {
		title: "Low — guidance",
		steps: [
			"No urgent intervention",
			"Safety guidance for the child",
			"Door stays open"
		],
		tone: "border-ok/30 bg-ok/5"
	},
	medium: {
		title: "Medium — trusted adult",
		steps: [
			"Encourage a trusted adult",
			"Safety education",
			"Human review available"
		],
		tone: "border-warn/30 bg-[#f3e6c8]/40"
	},
	high: {
		title: "High — support pathway",
		steps: [
			"Offer counsellor / trusted adult",
			"Create responder review case",
			"No automatic authority contact"
		],
		tone: "border-danger/30 bg-danger/5"
	},
	critical: {
		title: "Critical — urgent human review",
		steps: [
			"Urgent human review",
			"Evidence preservation (redacted)",
			"Support pathway opened"
		],
		tone: "border-ink/40 bg-ink text-paper"
	}
};
function InterventionEngine({ band }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Safety Response Engine"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-xl font-medium",
				children: "Recommended next step"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "The engine never contacts police or authorities. A person confirms every irreversible action."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 space-y-2",
				children: [
					"low",
					"medium",
					"high",
					"critical"
				].map((key) => {
					const node = TREE[key];
					const active = key === band;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("rounded-xl border px-4 py-3 transition-colors", active ? node.tone : "border-border bg-paper/60 opacity-60"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: node.title
						}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm opacity-90",
							children: node.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", s] }, s))
						})]
					}), key !== "critical" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center py-1 text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3.5" })
					})] }, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted",
				children: "Human review required before any case movement."
			})
		]
	});
}
var PRESETS = [
	"Why is this case high risk?",
	"Summarize the escalation.",
	"What indicators were detected across sessions?",
	"What information is still missing?",
	"Generate a 30-second responder briefing.",
	"What intervention options should a human reviewer consider?"
];
function SafetyCopilot({ result }) {
	const [question, setQuestion] = (0, import_react.useState)(PRESETS[0]);
	const [answer, setAnswer] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)([]);
	const [briefing, setBriefing] = (0, import_react.useState)(result.briefing ?? null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function ask(q = question) {
		setBusy(true);
		setError(null);
		try {
			const res = await askCopilot({ data: {
				result,
				question: q
			} });
			if (!res.ok) {
				setError("error" in res ? res.error : "Copilot unavailable.");
				return;
			}
			setAnswer(res.answer);
			setMissing(res.missing_information ?? []);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Copilot unavailable.");
		} finally {
			setBusy(false);
		}
	}
	async function briefingNow() {
		setBusy(true);
		setError(null);
		try {
			const res = await requestBriefing({ data: { result } });
			if (!res.ok) {
				setError("error" in res ? String(res.error) : "Briefing unavailable.");
				return;
			}
			setBriefing(res.briefing);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Briefing unavailable.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "Safety Copilot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-xl",
					children: "Ask about this case"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HumanLoopMark, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "AI assistance. Human judgment required. The copilot cannot take safeguarding actions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: question === p ? "default" : "outline",
					onClick: () => setQuestion(p),
					children: p
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-3 min-h-20",
				value: question,
				onChange: (e) => setQuestion(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => void ask(),
					children: busy ? "Thinking…" : "Ask copilot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: busy,
					onClick: () => void briefingNow(),
					children: "Generate briefing"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: error
			}),
			answer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "Copilot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: answer
					}),
					missing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 list-disc pl-5 text-xs",
						children: missing.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: m }, m))
					})
				]
			}),
			briefing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-xl border border-teal/30 bg-teal-mist/40 px-4 py-3 text-sm leading-relaxed text-teal-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide",
					children: "AI-generated briefing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1",
					children: briefing
				})]
			})
		]
	});
}
var OPTIONS = [
	{
		id: "continue",
		label: "Continue interaction"
	},
	{
		id: "block",
		label: "Block contact"
	},
	{
		id: "tell_adult",
		label: "Tell trusted adult"
	},
	{
		id: "counsellor",
		label: "Request counsellor support"
	}
];
function WhatIfSimulator({ result }) {
	const [choice, setChoice] = (0, import_react.useState)("tell_adult");
	const [out, setOut] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function run() {
		setBusy(true);
		setError(null);
		try {
			const res = await requestWhatIf({ data: {
				result,
				scenario: choice
			} });
			if (!res.ok) {
				setError("error" in res ? String(res.error) : "Simulator unavailable.");
				return;
			}
			setOut({
				scenario: res.scenario,
				plausible_description: res.plausible_description,
				illustrative_projection: res.illustrative_projection
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Simulator unavailable.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "What-if safety simulator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-xl",
				children: "Simulate next step"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "Plausible scenario. Illustrative projection. Not a guaranteed prediction."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: choice === o.id ? "default" : "outline",
					onClick: () => setChoice(o.id),
					children: o.label
				}, o.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				variant: "outline",
				disabled: busy,
				onClick: () => void run(),
				children: busy ? "Simulating…" : "Run scenario"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: error
			}),
			out && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2 rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-wide text-muted",
						children: out.scenario
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: out.plausible_description }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: out.illustrative_projection
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "Not a scientifically validated prediction."
					})
				]
			})
		]
	});
}
//#endregion
export { SafetyCopilot as n, WhatIfSimulator as r, InterventionEngine as t };
