import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { n as STATE_TRENDS, r as intensity, t as NATIONAL } from "./india-OXnUhqfX.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/india-BaWPeTko.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AGES = [
	"all",
	"10–12",
	"13–15",
	"14–16"
];
var PERIODS = ["this week", "this month"];
function IndiaMap() {
	const [risk, setRisk] = (0, import_react.useState)("all");
	const [age, setAge] = (0, import_react.useState)("all");
	const [period, setPeriod] = (0, import_react.useState)("this week");
	const [lang, setLang] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(STATE_TRENDS[0]);
	const langs = (0, import_react.useMemo)(() => ["all", ...Array.from(new Set(STATE_TRENDS.map((s) => s.topLang)))], []);
	const shown = STATE_TRENDS.filter((s) => {
		if (age !== "all" && s.ageBand !== age) return false;
		if (lang !== "all" && s.topLang !== lang) return false;
		return true;
	});
	const max = Math.max(...shown.map((s) => intensity(s, risk)), 1);
	const factor = period === "this month" ? 3.4 : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: "India safety intelligence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Anonymised statewide trends. No individual child locations."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Simulated data — for prototype demonstration" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
							label: "Risk type",
							value: risk,
							onChange: (v) => setRisk(v),
							options: [
								"all",
								"grooming",
								"cyberbullying",
								"blackmail",
								"other"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
							label: "Age group",
							value: age,
							onChange: (v) => setAge(v),
							options: [...AGES]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
							label: "Language",
							value: lang,
							onChange: setLang,
							options: langs
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
							label: "Time period",
							value: period,
							onChange: (v) => setPeriod(v),
							options: [...PERIODS]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 420 460",
					className: "mt-4 w-full",
					role: "img",
					"aria-label": "India aggregated trend map",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M198 18c22 6 48 18 58 42 10 22 28 28 42 48 12 16 18 38 10 58 14 18 22 32 18 54-6 22-8 40-28 52 6 22 2 40-10 62-8 16-6 34-18 50-12 18-22 40-40 52-20 14-28 32-48 36-22 4-36-10-52-6-18 4-28 22-48 18-16-4-28-18-32-34-10 4-28-6-34-22-8-18 2-34 8-50-16-12-22-32-16-50 6-16 8-34-2-48 14-16 22-34 20-54 24-8 36-24 42-42 8-22 32-28 52-36 12-6 18-18 32-24z",
						fill: "#E7E0D3",
						stroke: "#D4CCBE"
					}), shown.map((s) => {
						const t = intensity(s, risk) * (period === "this month" ? 1 : 1) / max;
						const r = 8 + t * 14;
						const fill = t > .75 ? "#0A524E" : t > .45 ? "#0E6B66" : t > .2 ? "#7AA8A4" : "#D5E8E6";
						const active = selected.code === s.code;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: s.x,
							cy: s.y,
							r,
							fill,
							opacity: .9,
							stroke: active ? "#1A2422" : "transparent",
							strokeWidth: active ? 2 : 0,
							className: "cursor-pointer",
							onClick: () => setSelected(s)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: s.x,
							y: s.y + r + 11,
							textAnchor: "middle",
							fontSize: "8",
							fill: "#3D4A47",
							className: "pointer-events-none",
							children: s.code
						})] }, s.code);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						"Circle size encodes report volume (",
						period,
						factor > 1 ? ", scaled" : "",
						"). Colour encodes relative intensity. ",
						shown.length,
						" states in filter."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reports this week",
						value: NATIONAL.reportsWeek
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "High-risk growth",
						value: `+${NATIONAL.growth}%`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Most common threat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: NATIONAL.topThreat
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs uppercase tracking-wide text-muted",
							children: "Language distribution"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1",
							children: NATIONAL.languages.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink-soft",
									children: l.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [l.n, "%"]
								})]
							}, l.name))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Selected state"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl",
							children: selected.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Grooming",
									v: `${selected.mix.grooming}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Cyberbullying",
									v: `${selected.mix.cyberbullying}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Blackmail",
									v: `${selected.mix.blackmail}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Other",
									v: `${selected.mix.other}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Reports / week",
									v: String(selected.reportsWeek)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Pattern growth",
									v: `+${selected.growth}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Top language",
									v: selected.topLang
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Age band",
									v: selected.ageBand
								})
							]
						})
					]
				})
			]
		})]
	});
}
function Filter({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs font-medium text-ink-soft",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: cn("mt-1 h-10 w-full rounded-xl border border-border bg-paper px-2 text-sm capitalize"),
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o,
				children: o
			}, o))
		})]
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
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-ink-soft",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: v
		})]
	});
}
function IndiaPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChildChrome, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-teal",
					children: "Aggregated trends"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Simulated data — for prototype demonstration" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-medium tracking-tight",
				children: "India Safety Intelligence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-ink-soft",
				children: "Statewide patterns only. This map never plots a child, a school, or a home."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndiaMap, {})] });
}
//#endregion
export { IndiaPage as component };
