import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-D965PJ-W.js
var import_jsx_runtime = require_jsx_runtime();
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className: cn("text-teal", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "48",
				height: "48",
				rx: "12",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 10c6 4 10 5 12 5v11c0 8-5.2 13.4-12 16-6.8-2.6-12-8-12-16V15c2 0 6-1 12-5z",
				fill: "#F3EEE4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 16c4 2.4 7 3 8.5 3v7.2c0 5.2-3.4 8.7-8.5 10.6-5.1-1.9-8.5-5.4-8.5-10.6V19c1.5 0 4.5-.6 8.5-3z",
				fill: "none",
				stroke: "#0A524E",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "25",
				r: "2.2",
				fill: "#0A524E"
			})
		]
	});
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2 text-ink", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-lg font-medium tracking-tight",
			children: "SurakshaNet"
		})]
	});
}
//#endregion
export { Wordmark as t };
