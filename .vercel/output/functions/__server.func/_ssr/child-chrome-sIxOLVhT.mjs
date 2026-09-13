import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { h as Phone, t as X } from "../_libs/lucide-react.mjs";
import { C as Button, D as useDemoStore, a as useI18n, o as LOCALES } from "./router-DoXUK3Ja.mjs";
import { t as Wordmark } from "./logo-D965PJ-W.mjs";
import { n as triggerSafeExit, t as installPanicHotkey } from "./safe-exit-B-xFL1Y-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/child-chrome-sIxOLVhT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LangSwitcher({ compact }) {
	const { locale, setLocale, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-2 text-sm text-ink-soft",
		children: [!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: t("lang")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value: locale,
			onChange: (e) => setLocale(e.target.value),
			className: cn("h-10 rounded-xl border border-border bg-surface px-2 text-sm text-ink outline-none focus:ring-2 focus:ring-teal/30"),
			"aria-label": t("lang"),
			children: LOCALES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: l.code,
				children: l.native
			}, l.code))
		})]
	});
}
var OPTIONS = [
	{
		id: "help",
		label: "I want help"
	},
	{
		id: "talk",
		label: "I want to talk to someone"
	},
	{
		id: "report",
		label: "I want to report something"
	},
	{
		id: "danger",
		label: "I am in immediate danger"
	},
	{
		id: "unsure",
		label: "I am not sure what is happening"
	}
];
function SupportPanel() {
	const open = useDemoStore((s) => s.supportOpen);
	const choice = useDemoStore((s) => s.supportChoice);
	const setChoice = useDemoStore((s) => s.setSupportChoice);
	const close = useDemoStore((s) => s.openSupport);
	const create = useDemoStore((s) => s.createChildCase);
	const navigate = useNavigate();
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-ink/30 p-3 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "support-title",
			className: "max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-teal",
						children: "You are not in trouble"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "support-title",
						className: "mt-1 font-display text-2xl font-medium tracking-tight",
						children: "I don’t feel safe"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-10 items-center justify-center rounded-lg hover:bg-paper-2",
						onClick: () => close(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-ink-soft",
					children: "You can ask for help. You do not have to figure this out alone. You do not have to give your name."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-2",
					children: OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setChoice(o.id),
						className: `min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-medium ${choice === o.id ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-paper"}`,
						children: o.label
					}, o.id))
				}),
				choice === "danger" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalmBox, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "If you are in danger right now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Call Childline. It is free. A person will answer. This app will not call anyone for you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "tel:1098",
						className: "mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-paper",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), " Talk to someone now"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl tabular-nums",
							children: "1098"
						})]
					})
				] }),
				choice && choice !== "danger" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalmBox, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: choice === "report" ? "You can write as little or as much as you want. A person will look at it." : "A trained person can look at this. You stay anonymous unless you choose otherwise."
				}) }),
				choice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-2 sm:flex-row",
					children: [choice === "report" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => {
							close(false);
							navigate({ to: "/report" });
						},
						children: "Continue to share"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => {
							const c = create(choice);
							navigate({
								to: "/report/done",
								search: { id: c.publicId }
							});
						},
						children: "Ask for help privately"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "flex-1",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trusted-adult",
							onClick: () => close(false),
							children: "Choose a trusted adult"
						})
					})]
				})
			]
		})
	});
}
function CalmBox({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 rounded-xl bg-teal-mist/60 px-4 py-3",
		children
	});
}
function ChildChrome({ children }) {
	const { t } = useI18n();
	const openSupport = useDemoStore((s) => s.openSupport);
	(0, import_react.useEffect)(() => installPanicHotkey(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/80 bg-paper/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "SurakshaNet home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ml-4 hidden items-center gap-1 lg:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/intelligence",
									className: "rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink",
									children: "Intelligence"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/india",
									className: "rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink",
									children: "India map"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/impact",
									className: "rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink",
									children: "Impact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									className: "rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink",
									children: "Privacy"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "md",
									type: "button",
									className: "hidden sm:inline-flex",
									onClick: () => openSupport(true),
									children: "I don’t feel safe"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitcher, { compact: true }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "exit",
									size: "md",
									type: "button",
									onClick: triggerSafeExit,
									children: t("safeExit")
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "mx-auto w-full max-w-6xl flex-1 px-4 py-8",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-30 border-t border-border bg-ink text-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "tel:1098",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), t("childline")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl tabular-nums tracking-wide",
							children: t("childlineNum")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "border-paper/30 bg-transparent text-paper hover:bg-paper/10 sm:hidden",
						type: "button",
						onClick: () => openSupport(true),
						children: "I don’t feel safe"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportPanel, {})
		]
	});
}
//#endregion
export { ChildChrome as t };
