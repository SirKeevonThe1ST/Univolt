import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SimMark, t as HumanLoopMark } from "./sim-mark-BALUNCL_.mjs";
import { S as HeartHandshake, a as TrendingUp, b as Lock, c as Shield, h as Phone, k as ArrowRight, l as ShieldCheck, n as Waypoints, w as Eye } from "../_libs/lucide-react.mjs";
import { C as Button, D as useDemoStore, a as useI18n, i as SimulationLauncher } from "./router-DoXUK3Ja.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
import { t as ResponsibleAi } from "./responsible-ai-ChLLbpAy.mjs";
import { t as PrivacyFlow } from "./privacy-flow-Cbd_D7Zf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C9Luu_RM.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		n: "01",
		title: "Detect",
		body: "AI identifies suspicious behavioural patterns across conversations — not just flagged words.",
		icon: Eye
	},
	{
		n: "02",
		title: "Understand",
		body: "The system explains why the pattern may be concerning, in language a responder can review.",
		icon: Waypoints
	},
	{
		n: "03",
		title: "Predict",
		body: "A simulated risk trajectory shows whether the pattern is escalating — before harm reaches a final stage.",
		icon: TrendingUp
	},
	{
		n: "04",
		title: "Protect",
		body: "The child receives a calm, private way to seek help. Identity stays sealed by default.",
		icon: Shield
	},
	{
		n: "05",
		title: "Human intervention",
		body: "A trained human reviews the case and decides what happens next. The model never acts alone.",
		icon: HeartHandshake
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium tracking-wide text-teal",
				children: "How it works"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-3xl font-medium tracking-tight",
				children: "Detect → Understand → Predict → Protect → Intervene"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HumanLoopMark, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
			children: STEPS.map((s, i) => {
				const Icon = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "sn-rise rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]",
					style: { animationDelay: `${i * 80}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular-nums text-muted",
								children: s.n
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-9 items-center justify-center rounded-lg bg-teal-mist text-teal-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 font-display text-xl font-medium tracking-tight",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-ink-soft",
							children: s.body
						})
					]
				}, s.title);
			})
		})]
	});
}
function Home() {
	const { t } = useI18n();
	const openSupport = useDemoStore((s) => s.openSupport);
	const unlock = useDemoStore((s) => s.unlockDesk);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChildChrome, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium tracking-wide text-teal",
						children: "Childline 1098 is always one tap away"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HumanLoopMark, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl font-medium leading-[1.12] tracking-tight text-ink sm:text-5xl",
					children: "Don’t wait for a child to report harm after it happens."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg",
					children: "An AI-powered early-warning system: detect behavioural escalation, explain the concern, protect identity, and leave the decision with a human."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: t("landingLead")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xl",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/report",
								children: [t("childPath"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xl",
							variant: "outline",
							type: "button",
							onClick: () => openSupport(true),
							children: "I don’t feel safe"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xl",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/help",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
									t("childline"),
									" · 1098"
								]
							})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 rounded-xl bg-ink px-5 py-6 text-paper sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-paper/55",
					children: "Two-minute judge walkthrough"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl",
					children: "See the full safety loop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-paper/75",
					children: [
						"Detect → Understand → Predict → Protect → Human review → Intervene. Synthetic case ",
						"",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "SRK-DEMO-2048"
						}),
						". The model never acts alone."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationLauncher, { className: "bg-paper text-ink hover:bg-paper-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "border-paper/30 bg-transparent text-paper hover:bg-paper/10",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/intelligence",
							children: "Safety intelligence"
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-14 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuietCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
					title: "No name needed",
					body: "Anonymous tips store no IP, email, or device id. Callback numbers are sealed and opened only with a supervisor’s confirm."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuietCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
					title: "Leave in one tap",
					body: "Leave quickly sits on every child screen. Esc twice, or Ctrl+Shift+X, also steps away and covers your tracks."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuietCard, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
					title: "A person decides",
					body: "The model scores and explains. It never escalates, unseals, or closes a case. A human must confirm."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-14",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyFlow, { compact: true })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-14 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsibleAi, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted",
						children: "For responders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl font-medium tracking-tight",
						children: "Child Safety Response Center"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-ink-soft",
						children: t("landingStaff")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "invert",
								onClick: () => {
									unlock();
								},
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/console",
									children: "Open demo desk"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: t("signIn")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/detect",
									children: t("howItWorks")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									children: t("privacy")
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Demo desk uses synthetic cases. Sign-in still reaches the live queue." })
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 max-w-2xl text-xs leading-relaxed text-muted",
			children: t("footerLegal")
		})
	] });
}
function QuietCard({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-9 items-center justify-center rounded-lg bg-teal-mist text-teal-deep",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-lg font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-ink-soft",
				children: body
			})
		]
	});
}
//#endregion
export { Home as component };
