import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { n as getMyStaff } from "./staff-DLovbWU9.mjs";
import "./client-C_SNNFs7.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-DeOaE_mm.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { O as ChartNoAxesGantt, T as ClipboardList, c as Shield, d as Scale, u as Settings2, y as Map } from "../_libs/lucide-react.mjs";
import { i as hasGateSessionMarker } from "./server-CZenviKC.mjs";
import { C as Button, D as useDemoStore, i as SimulationLauncher } from "./router-DoXUK3Ja.mjs";
import { t as Wordmark } from "./logo-D965PJ-W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-VOEkRmQ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	(0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			false
		]
	});
}
var NAV = [
	{
		to: "/console",
		label: "Queue",
		icon: ClipboardList
	},
	{
		to: "/console/analytics",
		label: "Analytics",
		icon: ChartNoAxesGantt
	},
	{
		to: "/india",
		label: "India map",
		icon: Map
	},
	{
		to: "/console/audit",
		label: "Audit",
		icon: Scale
	},
	{
		to: "/console/settings",
		label: "Settings",
		icon: Settings2
	},
	{
		to: "/console/architecture",
		label: "Architecture",
		icon: Shield
	}
];
function ConsoleShell({ children, role, demo }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const setRole = useDemoStore((s) => s.setRole);
	const current = useDemoStore((s) => s.role);
	const displayRole = role ?? current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs text-muted sm:inline",
						children: "Child Safety Response Center"
					}),
					displayRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-teal-mist px-2 py-0.5 text-xs font-medium capitalize text-teal-deep",
						children: [displayRole, demo ? " · demo" : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationLauncher, { className: "hidden sm:inline-flex" }), demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-sm text-ink-soft underline-offset-4 hover:underline",
							children: "Sign in"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-x-auto",
					children: NAV.map((item) => {
						const active = item.to === "/console" ? pathname === "/console" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-10 items-center gap-2 rounded-xl px-3 text-sm", active ? "bg-teal-mist text-teal-deep" : "text-ink-soft hover:bg-paper-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto flex items-center gap-1",
					children: [
						"responder",
						"counsellor",
						"supervisor"
					].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: current === r ? "default" : "ghost",
						className: "capitalize",
						onClick: () => setRole(r),
						children: r
					}, r))
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children
		})]
	});
}
function ConsoleLayout() {
	const { user, isPending } = useCurrentUserState();
	const deskUnlocked = useDemoStore((s) => s.deskUnlocked);
	const demoRole = useDemoStore((s) => s.role);
	const unlock = useDemoStore((s) => s.unlockDesk);
	const staff = useQuery({
		queryKey: ["staff", "me"],
		queryFn: () => getMyStaff(),
		enabled: Boolean(user)
	});
	if (isPending && !deskUnlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-xl bg-paper-2" })
	});
	if (!user && !deskUnlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium",
					children: "Child Safety Response Center"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-ink-soft",
					children: "Open the demo desk with synthetic cases, or sign in as a responder to the live queue. Children never need an account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => unlock(),
							children: "Enter demo response center"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Sign in as responder"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Back to child path"
							})
						})
					]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsoleShell, {
		role: staff.data?.role ?? demoRole,
		demo: !user,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { ConsoleLayout as component };
