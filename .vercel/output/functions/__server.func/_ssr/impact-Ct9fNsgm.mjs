import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { C as Button, i as SimulationLauncher } from "./router-DoXUK3Ja.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/impact-Ct9fNsgm.js
var import_jsx_runtime = require_jsx_runtime();
var CAPS = [
	{
		title: "Faster risk identification",
		body: "Behaviour accumulates across turns so a desk can see a pattern forming, not only a single flagged phrase."
	},
	{
		title: "Explainable decisions",
		body: "Every score ships with human-readable reasons. Responders can disagree, edit, and record that disagreement."
	},
	{
		title: "Privacy-preserving workflow",
		body: "PII is detected and redacted before analysis. Identity stays sealed. Access is logged."
	},
	{
		title: "Multilingual support",
		body: "English, Hindi, Hinglish, and other Indian languages — child safety cannot depend on formal English alone."
	},
	{
		title: "Human-in-the-loop intervention",
		body: "Recommended next steps only. No autonomous accusation, no automatic call to police, no irreversible action without confirm."
	}
];
function Impact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChildChrome, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Prototype capabilities — not real-world impact claims" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-4xl font-medium tracking-tight",
			children: "What this prototype is built to show"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 max-w-2xl text-ink-soft leading-relaxed",
			children: "SurakshaNet is an AI-powered child safety early-warning and intervention platform. These are capabilities of the prototype, not statistics from a live deployment."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-4 sm:grid-cols-2",
			children: CAPS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: c.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-ink-soft",
					children: c.body
				})]
			}, c.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationLauncher, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/intelligence",
					children: "Open safety intelligence"
				})
			})]
		})
	] });
}
//#endregion
export { Impact as component };
