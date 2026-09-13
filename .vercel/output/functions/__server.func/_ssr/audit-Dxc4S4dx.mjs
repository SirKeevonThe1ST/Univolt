import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { n as useCurrentUserState } from "./use-current-user-DeOaE_mm.mjs";
import { r as listAudit } from "./analytics-DaO-qIdF.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as useDemoStore } from "./router-DoXUK3Ja.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-Dxc4S4dx.js
var import_jsx_runtime = require_jsx_runtime();
function Audit() {
	const { user } = useCurrentUserState();
	const cases = useDemoStore((s) => s.cases);
	const q = useQuery({
		queryKey: ["audit"],
		queryFn: () => listAudit(),
		enabled: Boolean(user)
	});
	const demoRows = cases.flatMap((c) => c.audit.map((a) => ({
		id: a.id,
		at: a.at,
		actor: a.actor,
		action: a.action,
		resource: c.publicId
	}))).sort((a, b) => +new Date(b.at) - +new Date(a.at));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "Audit trail"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "Actor, time, action. Message bodies are never written here."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Demo desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditTable, { rows: demoRows.map((r) => ({
				when: r.at,
				actor: r.actor,
				action: r.action,
				resource: r.resource,
				id: r.id
			})) })] }),
			user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: "Live log"
				}),
				q.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Loading audit…"
				}),
				q.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-danger",
					children: q.error.message
				}),
				q.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditTable, { rows: q.data.rows.map((r) => ({
					id: r.id,
					when: r.created_at,
					actor: r.actor_role ?? "system",
					action: r.action,
					resource: `${r.resource_type}${r.resource_id ? ` · ${r.resource_id.slice(0, 12)}` : ""}`
				})) })
			] })
		]
	});
}
function AuditTable({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-xs uppercase tracking-wide text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "When"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Actor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Action"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Resource"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: 4,
				className: "px-4 py-8 text-center text-muted",
				children: "No entries yet."
			}) }), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/70 last:border-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2 font-mono text-xs text-muted",
						children: new Date(r.when).toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2",
						children: r.actor
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2",
						children: r.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2 text-ink-soft",
						children: r.resource
					})
				]
			}, r.id))] })]
		})
	});
}
//#endregion
export { Audit as component };
