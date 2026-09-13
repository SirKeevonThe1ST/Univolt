import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { n as useCurrentUserState } from "./use-current-user-DeOaE_mm.mjs";
import { t as getAnalytics } from "./analytics-DaO-qIdF.mjs";
import { t as NATIONAL } from "./india-OXnUhqfX.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as Bar, i as XAxis, l as ResponsiveContainer, n as BarChart, o as CartesianGrid, r as YAxis, u as Tooltip } from "../_libs/recharts+[...].mjs";
import { D as useDemoStore } from "./router-DoXUK3Ja.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BhrTDgRe.js
var import_jsx_runtime = require_jsx_runtime();
function Analytics() {
	const { user } = useCurrentUserState();
	const cases = useDemoStore((s) => s.cases);
	const q = useQuery({
		queryKey: ["analytics"],
		queryFn: () => getAnalytics(),
		enabled: Boolean(user)
	});
	const byBand = [
		"low",
		"medium",
		"high",
		"critical"
	].map((b) => ({
		name: b,
		n: cases.filter((c) => c.band === b).length
	}));
	const byThreat = Array.from(new Set(cases.map((c) => c.threatLabel))).map((name) => ({
		name,
		n: cases.filter((c) => c.threatLabel === name).length
	}));
	const byLang = Array.from(new Set(cases.map((c) => c.languageLabel))).map((name) => ({
		name,
		n: cases.filter((c) => c.languageLabel === name).length
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "Analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "Aggregate only. Region is shown solely when the reporter opted in. No PII."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Demo desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Demo cases",
						value: cases.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reports this week (sim)",
						value: NATIONAL.reportsWeek
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pattern growth",
						value: NATIONAL.growth
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Risk band",
						data: byBand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Threat type",
						data: byThreat
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Language",
						data: byLang
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "National language mix (sim)",
						data: NATIONAL.languages
					})
				]
			}),
			user && q.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Live queue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Risk band",
						data: q.data.byBand.map((x) => ({
							name: x.risk_band,
							n: x.n
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Priority",
						data: q.data.byPriority.map((x) => ({
							name: x.priority,
							n: x.n
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Language",
						data: q.data.byLang.map((x) => ({
							name: x.language,
							n: x.n
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
						title: "Region (opt-in)",
						data: q.data.byRegion.map((x) => ({
							name: x.region_code,
							n: x.n
						}))
					})
				]
			})] })
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl tabular-nums",
			children: value
		})]
	});
}
function ChartBlock({ title, data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-display text-lg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-48",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "#E7E0D3",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "name",
							tick: {
								fontSize: 11,
								fill: "#6B7370"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							allowDecimals: false,
							tick: {
								fontSize: 11,
								fill: "#6B7370"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "#FBF8F2",
							border: "1px solid #D4CCBE",
							borderRadius: 12
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "n",
							fill: "#0E6B66",
							radius: [
								6,
								6,
								0,
								0
							]
						})
					]
				})
			})
		})]
	});
}
//#endregion
export { Analytics as component };
