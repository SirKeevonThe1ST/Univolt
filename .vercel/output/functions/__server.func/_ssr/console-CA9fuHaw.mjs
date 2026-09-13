import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as statusLabel } from "./intelligence-Dr71N71v.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { n as useCurrentUserState } from "./use-current-user-DeOaE_mm.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Button, D as useDemoStore, S as SafetyIntelligence, T as caseKpis, u as getAiHealth, y as Badge } from "./router-DoXUK3Ja.mjs";
import { a as listCases, i as ingestDemoThread } from "./cases-CREEghXe.mjs";
import { n as RiskBadge, t as PriorityBadge } from "./risk-badge-NFUlF1X8.mjs";
import { r as Textarea } from "./input-BuUSUMkL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-CA9fuHaw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SystemHealth() {
	const h = useQuery({
		queryKey: ["ai-health"],
		queryFn: () => getAiHealth(),
		staleTime: 15e3
	}).data;
	const connected = h?.connected;
	const nodes = [
		{
			name: "LLM status",
			state: connected ? "Connected" : "Unavailable",
			kind: connected ? "ok" : "warn"
		},
		{
			name: "Model",
			state: h?.model ?? "Checking…",
			kind: "info"
		},
		{
			name: "Last analysis",
			state: h?.lastAt ? new Date(h.lastAt).toLocaleTimeString() : "None yet",
			kind: "info"
		},
		{
			name: "Latency",
			state: typeof h?.lastLatencyMs === "number" ? `${(h.lastLatencyMs / 1e3).toFixed(1)}s` : "—",
			kind: "info"
		},
		{
			name: "Risk engine",
			state: "Operational",
			kind: "ok"
		},
		{
			name: "OCR",
			state: h?.vision ? "Operational" : "Unavailable",
			kind: h?.vision ? "ok" : "warn"
		},
		{
			name: "Speech-to-text",
			state: h?.stt ? "Operational" : "Unavailable",
			kind: h?.stt ? "ok" : "warn"
		},
		{
			name: "Audit log",
			state: "Operational",
			kind: "ok"
		},
		{
			name: "Human review",
			state: "Required",
			kind: "info"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-medium",
				children: "System health"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: connected ? "Live model connected. Keys stay on the server." : "AI features are unavailable until a provider key is present."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-ink-soft",
						children: n.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 text-xs font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: n.kind === "ok" ? "size-1.5 rounded-full bg-ok" : n.kind === "warn" ? "size-1.5 rounded-full bg-warn" : "size-1.5 rounded-full bg-teal" }), n.state]
					})]
				}, n.name))
			})
		]
	});
}
function Queue() {
	const { user } = useCurrentUserState();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const demoCases = useDemoStore((s) => s.cases);
	const q = useQuery({
		queryKey: ["cases"],
		queryFn: () => listCases(),
		enabled: Boolean(user)
	});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [lab, setLab] = (0, import_react.useState)("");
	const ingest = useMutation({
		mutationFn: () => ingestDemoThread({ data: { text: lab } }),
		onSuccess: (res) => {
			toast.success(`Thread ingested as ${res.publicId} — risk ${res.score}/100 (${res.band}). Opening case…`);
			setLab("");
			qc.invalidateQueries({ queryKey: ["cases"] });
			navigate({
				to: "/console/cases/$caseId",
				params: { caseId: res.id }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const kpis = caseKpis(demoCases);
	const live = q.data?.cases ?? [];
	const spotlight = demoCases.find((c) => c.id === "demo-srk-2048") ?? demoCases[0];
	const shownDemo = (0, import_react.useMemo)(() => {
		return demoCases.filter((c) => {
			if (filter === "review") return c.status === "human_review";
			if (filter === "P1") return c.band === "critical";
			return true;
		});
	}, [demoCases, filter]);
	const now = Date.now();
	const shownLive = (0, import_react.useMemo)(() => {
		return live.filter((c) => {
			if (filter === "P1") return c.priority === "P1";
			if (filter === "overdue") return new Date(c.sla_due_at).getTime() < now && c.status !== "resolved" && c.status !== "closed";
			return true;
		});
	}, [
		live,
		filter,
		now
	]);
	const overdueN = live.filter((c) => new Date(c.sla_due_at).getTime() < now && c.status !== "resolved" && c.status !== "closed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Child Safety Response Center"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium tracking-tight",
						children: "Case queue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Synthetic demo cases plus live anonymous reports when signed in."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Demo data clearly marked" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Critical cases",
						value: kpis.critical
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "High risk",
						value: kpis.high
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Pending human review",
						value: kpis.pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Active support cases",
						value: kpis.support
					})
				]
			}),
			spotlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyIntelligence, { demoCase: spotlight }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemHealth, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Demo case queue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"all",
						"review",
						"P1"
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: filter === f ? "default" : "outline",
						onClick: () => setFilter(f),
						children: f === "review" ? "Human review" : f === "P1" ? "Critical" : "All"
					}, f))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseTable, { cases: shownDemo })] }),
			user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Live queue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: filter === "overdue" ? "default" : "outline",
					onClick: () => setFilter("overdue"),
					children: [
						"Overdue (",
						overdueN,
						")"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs uppercase tracking-wide text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Case"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Pri"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Risk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Stage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Lang"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "SLA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [shownLive.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "px-4 py-10 text-center text-muted",
						children: q.isPending ? "Loading queue…" : "No cases in this filter."
					}) }), shownLive.map((c) => {
						const overdue = new Date(c.sla_due_at).getTime() < now && c.status !== "resolved" && c.status !== "closed";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0 hover:bg-paper/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/console/cases/$caseId",
										params: { caseId: c.id },
										className: "font-mono text-sm text-teal-deep underline-offset-4 hover:underline",
										children: c.public_id
									}), c.analysis_mode === "fallback" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "danger",
											children: "fallback"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: c.priority })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: c.risk_band }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-muted",
											children: c.risk_score
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 capitalize",
									children: c.stage.replace(/_/g, " ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: c.language
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: overdue ? "text-danger" : "text-ink-soft",
										children: [overdue ? "Overdue · " : "", formatDue(c.sla_due_at)]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.status.replace(/_/g, " ") })
								})
							]
						}, c.id);
					})] })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: "AI Threat Analyzer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Paste a conversation to run it through the live pipeline. Use only synthetic or authorised evidence — this is a detector, not a generator."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: lab,
						onChange: (e) => setLab(e.target.value),
						placeholder: "other: You can tell me anything.\nchild: I am not sure."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						disabled: !lab.trim() || ingest.isPending || !user,
						onClick: () => ingest.mutate(),
						children: ingest.isPending ? "Analyzing…" : user ? "Analyze into live queue" : "Sign in to ingest live"
					})
				]
			})
		]
	});
}
function CaseTable({ cases }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[800px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-xs uppercase tracking-wide text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Case ID"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Risk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Threat type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Age band"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Language"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Last activity"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [cases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: 7,
				className: "px-4 py-10 text-center text-muted",
				children: "No demo cases in this filter."
			}) }), cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: c.id === "demo-srk-2048" ? "border-b border-border/70 bg-teal-mist/30 last:border-0" : "border-b border-border/70 last:border-0 hover:bg-paper/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/console/cases/$caseId",
							params: { caseId: c.id },
							className: "font-mono text-sm text-teal-deep underline-offset-4 hover:underline",
							children: c.publicId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [
								c.source,
								" · ",
								c.region
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: c.band === "medium" ? "med" : c.band }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [c.risk, " / 100"]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: c.threatLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: c.ageBand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: c.languageLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: statusLabel(c.status) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-xs text-muted",
						children: new Date(c.lastActivity).toLocaleTimeString()
					})
				]
			}, c.id))] })]
		})
	});
}
function Kpi({ label, value }) {
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
function formatDue(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	const mins = Math.round((d.getTime() - Date.now()) / 6e4);
	if (mins < 0) return `${Math.abs(mins)}m late`;
	if (mins < 120) return `${mins}m`;
	return `${Math.round(mins / 60)}h`;
}
//#endregion
export { Queue as component };
