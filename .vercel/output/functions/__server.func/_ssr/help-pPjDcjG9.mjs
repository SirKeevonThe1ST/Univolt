import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Button, a as useI18n } from "./router-DoXUK3Ja.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-pPjDcjG9.js
var import_jsx_runtime = require_jsx_runtime();
function Help() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: t("helpTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 leading-relaxed text-ink-soft",
				children: t("helpLead")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "tel:1098",
				className: "mt-8 flex items-center justify-between rounded-xl bg-ink px-6 py-6 text-paper",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: t("childline")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-4xl tabular-nums",
					children: "1098"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-ink-soft",
				children: t("panicHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.childlineindia.org",
						rel: "noreferrer",
						children: "childlineindia.org"
					})
				})
			})
		]
	}) });
}
//#endregion
export { Help as component };
