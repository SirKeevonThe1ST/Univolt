import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BuUSUMkL.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-xl border border-border bg-paper px-3 text-base text-ink placeholder:text-muted outline-none transition-shadow focus:ring-2 focus:ring-teal/30", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-32 w-full rounded-xl border border-border bg-paper px-3 py-3 text-base text-ink placeholder:text-muted outline-none transition-shadow focus:ring-2 focus:ring-teal/30", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-sm font-medium text-ink-soft", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
