import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as useDemoStore } from "./router-DoXUK3Ja.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-Bc3bY26l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SupportPage() {
	const open = useDemoStore((s) => s.openSupport);
	(0, import_react.useEffect)(() => {
		open(true);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChildChrome, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl font-medium tracking-tight",
		children: "I don’t feel safe"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 max-w-xl text-ink-soft leading-relaxed",
		children: "You are not in trouble. You can ask for help. You do not have to figure this out alone."
	})] });
}
//#endregion
export { SupportPage as component };
