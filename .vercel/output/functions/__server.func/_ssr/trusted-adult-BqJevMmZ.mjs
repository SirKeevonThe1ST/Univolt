import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Button, D as useDemoStore } from "./router-DoXUK3Ja.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trusted-adult-BqJevMmZ.js
var import_jsx_runtime = require_jsx_runtime();
var ADULTS = [
	{
		id: "parent",
		label: "Parent / Guardian"
	},
	{
		id: "teacher",
		label: "Teacher"
	},
	{
		id: "counsellor",
		label: "School counsellor"
	},
	{
		id: "relative",
		label: "Relative"
	},
	{
		id: "other",
		label: "Other trusted adult"
	}
];
function TrustedAdult() {
	const chosen = useDemoStore((s) => s.trustedAdult);
	const setAdult = useDemoStore((s) => s.setTrustedAdult);
	const create = useDemoStore((s) => s.createChildCase);
	const choice = useDemoStore((s) => s.supportChoice);
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-teal",
				children: "You choose who you trust"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-medium tracking-tight",
				children: "A trusted adult"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft leading-relaxed",
				children: "You do not have to disclose everything immediately. This only records who you might want nearby. Nothing is sent to them automatically."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-2",
				children: ADULTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAdult(a.id),
					className: `min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-medium ${chosen === a.id ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-surface"}`,
					children: a.label
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !chosen,
					onClick: () => {
						const c = create(choice ?? "help");
						navigate({
							to: "/report/done",
							search: { id: c.publicId }
						});
					},
					children: "Continue privately"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/report",
						children: "Skip — share something instead"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted",
				children: "A responder will still need to confirm any contact. The model cannot reach out on its own."
			})
		]
	}) });
}
//#endregion
export { TrustedAdult as component };
