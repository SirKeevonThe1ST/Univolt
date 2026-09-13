import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Button, a as useI18n, r as Route$2 } from "./router-DoXUK3Ja.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report_.done-BIXZfHSi.js
var import_jsx_runtime = require_jsx_runtime();
function Done() {
	const { t } = useI18n();
	const { id } = Route$2.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: t("doneTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 leading-relaxed text-ink-soft",
				children: t("doneBody")
			}),
			id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-border bg-surface px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted",
					children: t("caseId")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xl tracking-wider text-ink",
					children: id
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "tel:1098",
						children: "1098"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/report",
						children: t("another")
					})
				})]
			})
		]
	}) });
}
//#endregion
export { Done as component };
