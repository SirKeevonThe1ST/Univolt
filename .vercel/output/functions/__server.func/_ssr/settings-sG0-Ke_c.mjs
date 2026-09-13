import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as setStaffRole, r as listStaff } from "./staff-DLovbWU9.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { n as useCurrentUserState } from "./use-current-user-DeOaE_mm.mjs";
import { a as updateScoringConfig, i as purgeDueCases, n as getScoringConfig } from "./analytics-DaO-qIdF.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Button, D as useDemoStore } from "./router-DoXUK3Ja.mjs";
import { t as Input } from "./input-BuUSUMkL.mjs";
import { t as ResponsibleAi } from "./responsible-ai-ChLLbpAy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-sG0-Ke_c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const { user } = useCurrentUserState();
	const role = useDemoStore((s) => s.role);
	const qc = useQueryClient();
	const cfg = useQuery({
		queryKey: ["scoring"],
		queryFn: () => getScoringConfig(),
		enabled: Boolean(user)
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff(),
		enabled: Boolean(user)
	});
	const save = useMutation({
		mutationFn: (d) => updateScoringConfig({ data: d }),
		onSuccess: () => {
			toast.success("Weight saved — new cases use it immediately");
			qc.invalidateQueries({ queryKey: ["scoring"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const roleMut = useMutation({
		mutationFn: (d) => setStaffRole({ data: d }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff"] });
			toast.success("Role updated");
		},
		onError: (e) => toast.error(e.message)
	});
	const purge = useMutation({
		mutationFn: () => purgeDueCases({ data: { confirm: true } }),
		onSuccess: (r) => toast.success(`Purged ${r.purged} closed cases past retention`),
		onError: (e) => toast.error(e.message)
	});
	if (user && cfg.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Loading settings…"
	});
	const me = cfg.data?.me;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "Scoring & retention"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: [
					"Demo role on this desk: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "capitalize",
						children: role
					}),
					". Live weights apply after sign-in."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsibleAi, {}),
			!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { className: "mr-2" }), "You are in the demo desk. Sign in as a responder to edit live scoring weights."]
			}),
			cfg.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Score weights"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: cfg.data.weights.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightRow, {
						item: w,
						disabled: me?.role !== "admin" || save.isPending,
						onSave: (weight) => save.mutate({
							key: w.key,
							weight
						})
					}, w.key))
				})]
			}),
			cfg.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Retention"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: cfg.data.retention?.notes
					}),
					me?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "danger",
						size: "sm",
						disabled: purge.isPending,
						onClick: () => purge.mutate(),
						children: "Purge overdue closed cases (confirm)"
					})
				]
			}),
			staff.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Staff roles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: staff.data.staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.display_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: s.role,
							disabled: me?.role !== "admin",
							onChange: (e) => roleMut.mutate({
								userId: s.user_id,
								role: e.target.value
							}),
							className: "h-9 rounded-lg border border-border bg-paper px-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "responder",
									children: "responder"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ngo",
									children: "ngo"
								})
							]
						})]
					}, s.user_id))
				})]
			})
		]
	});
}
function WeightRow({ item, disabled, onSave }) {
	const [v, setV] = (0, import_react.useState)(item.weight);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid gap-2 sm:grid-cols-[1fr_6rem_auto] sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium capitalize",
				children: item.key.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: item.description
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: v,
				disabled,
				onChange: (e) => setV(e.target.value),
				inputMode: "decimal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				disabled,
				onClick: () => onSave(Number(v)),
				children: "Save"
			})
		]
	});
}
//#endregion
export { Settings as component };
