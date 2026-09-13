import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { m as statusLabel } from "./intelligence-Dr71N71v.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { n as useCurrentUserState } from "./use-current-user-DeOaE_mm.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Button, D as useDemoStore, S as SafetyIntelligence, _ as ExplainableAi, b as AnalysisModeMark, g as CrossConversation, h as BehaviouralRiskChain, m as PrivacyDashboard, n as Route, v as LanguageAnalysis, w as analyseMessages, x as RiskTrajectory, y as Badge } from "./router-DoXUK3Ja.mjs";
import { c as transitionCase, n as exportSafetyPack, o as regenerateSafetyCase, r as getCase, s as revealIdentity, t as addNote } from "./cases-CREEghXe.mjs";
import { n as RiskBadge, t as PriorityBadge } from "./risk-badge-NFUlF1X8.mjs";
import { r as Textarea } from "./input-BuUSUMkL.mjs";
import { n as SafetyCopilot, r as WhatIfSimulator, t as InterventionEngine } from "./what-if-simulator-C_kFmMNT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases._caseId-BYlK4Vaq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGE_LABEL = {
	contact: "Contact",
	trust_building: "Trust Building",
	isolation: "Isolation",
	exploitation_attempt: "Exploitation Attempt"
};
var SPEED_LABEL = {
	flat: "Flat",
	gradual: "Gradual",
	escalating: "Escalating",
	rapid: "Rapid"
};
var SPEED_TONE = {
	flat: "neutral",
	gradual: "teal",
	escalating: "warn",
	rapid: "danger"
};
/**
* Visual behavioural-progression timeline. Renders one node per stage
* transition the engine actually detected — never invents stages the
* conversation doesn't support.
*/
function StageTimeline({ timeline }) {
	const { points, startScore, currentScore, escalation, speedLabel } = timeline;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface p-4 text-center sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Risk started at",
					value: `${startScore}/100`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Current risk",
					value: `${currentScore}/100`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Escalation",
					value: `${escalation >= 0 ? "+" : ""}${escalation} pts`,
					emphasis: escalation > 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: "Escalation speed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: SPEED_TONE[speedLabel],
							children: SPEED_LABEL[speedLabel]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: "Speed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: SPEED_TONE[speedLabel],
							children: SPEED_LABEL[speedLabel]
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "relative space-y-0 border-l border-border pl-6",
			children: points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "relative pb-6 last:pb-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute -left-[29px] top-1 flex size-4 items-center justify-center rounded-full border-2", i === points.length - 1 ? "border-teal bg-teal" : "border-teal bg-surface") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							p.at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: new Date(p.at).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-medium",
								children: STAGE_LABEL[p.stage] ?? p.stage.replace(/_/g, " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: p.band }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs tabular-nums text-muted",
								children: [p.scoreAtStage, "/100"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: p.reason
					})
				]
			}, i))
		})]
	});
}
function Stat({ label, value, emphasis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs uppercase tracking-wide text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("mt-1 font-display text-lg font-medium tabular-nums", emphasis && "text-danger"),
		children: value
	})] });
}
var Dialog = Dialog$1;
function DialogContent({ className, children, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-xl font-medium tracking-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "flex size-9 items-center justify-center rounded-lg text-muted hover:bg-paper-2 hover:text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children
		})]
	})] });
}
function ConfirmAction({ label, description, confirmLabel = "Confirm", danger, disabled, requiredRole, role, onConfirm }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const blocked = requiredRole && role !== requiredRole && role !== "supervisor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "sm",
		variant: danger ? "danger" : "outline",
		disabled: disabled || blocked,
		onClick: () => setOpen(true),
		title: blocked ? `Requires ${requiredRole}` : void 0,
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			title: "Human confirmation required",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-ink-soft",
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted",
					children: "The model cannot take this step. It does not contact authorities or expose identity on its own."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: danger ? "danger" : "default",
						onClick: () => {
							onConfirm();
							setOpen(false);
						},
						children: confirmLabel
					})]
				})
			]
		})
	})] });
}
var POS = {
	child: {
		x: 160,
		y: 36
	},
	"acc-a": {
		x: 160,
		y: 140
	},
	"acc-b": {
		x: 56,
		y: 232
	},
	"acc-c": {
		x: 264,
		y: 232
	}
};
function ThreatGraph({ nodes, edges }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl font-medium",
				children: "Relationship graph"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "Risk may exist in patterns across interactions, not just a single message. Fictional IDs only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 320 280",
				className: "mt-4 w-full",
				role: "img",
				"aria-label": "Anonymized account graph",
				children: [edges.map((e) => {
					const a = POS[e.from];
					const b = POS[e.to];
					if (!a || !b) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: a.x,
						y1: a.y + 16,
						x2: b.x,
						y2: b.y - 16,
						stroke: "#0E6B66",
						strokeOpacity: .35 + e.strength * .5,
						strokeWidth: 1 + e.strength * 4
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: (a.x + b.x) / 2 + 10,
						y: (a.y + b.y) / 2,
						fill: "#6B7370",
						fontSize: "9",
						children: e.label
					})] }, `${e.from}-${e.to}`);
				}), nodes.map((n) => {
					const p = POS[n.id];
					if (!p) return null;
					const child = n.kind === "child";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${p.x},${p.y})`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: child ? 22 : 20,
								fill: child ? "#1A2422" : "#D5E8E6",
								stroke: child ? "#1A2422" : "#0E6B66"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								textAnchor: "middle",
								y: "4",
								fill: child ? "#F3EEE4" : "#0A524E",
								fontSize: "8",
								fontWeight: "600",
								children: n.label
							}),
							!child && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
								textAnchor: "middle",
								y: "36",
								fill: "#6B7370",
								fontSize: "9",
								children: ["risk ", n.risk]
							})
						]
					}, n.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Interaction frequency encoded as connection strength. No personal identities."
			})
		]
	});
}
function EvidenceView({ c }) {
	const shots = c.screenshots ?? [];
	const voice = c.voiceNote;
	const textOn = c.messages.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Evidence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-xl",
				children: "Original evidence vs AI extraction"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Text",
						on: textOn,
						detail: textOn ? `${c.messages.length} messages` : "None"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Screenshots",
						on: shots.length > 0,
						detail: shots.length ? `${shots.length} attached` : "None"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Voice note",
						on: Boolean(voice),
						detail: voice ? "1 attached" : "None"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						label: "Transcription",
						on: Boolean(voice?.transcription),
						detail: voice?.transcription ? "Available" : voice ? "Unavailable" : "None"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Original evidence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 max-h-72 space-y-2 overflow-auto rounded-xl bg-paper p-3 text-sm",
					children: c.messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] uppercase text-muted",
						children: [m.sourceLabel ? `[${m.sourceLabel}] ` : "", m.speaker]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-ink-soft",
						children: [
							"“",
							m.text,
							"”"
						]
					})] }, `${m.text}-${i}`))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: "AI extracted information"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-ink-soft",
						children: c.normalizedMeaning
					}),
					shots.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: shots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							className: "w-24",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.dataUrl,
								alt: s.name,
								className: "h-24 w-24 rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
								className: "mt-1 truncate text-[10px] text-muted",
								children: s.name
							})]
						}, s.name))
					}),
					voice?.transcription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-ink-soft",
						children: [
							"Voice: “",
							voice.transcription,
							"”"
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] uppercase tracking-wide text-muted",
				children: "AI analysis is separate from original evidence and is never a finding of guilt."
			})
		]
	});
}
function Flag({ label, on, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-paper px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: "mt-1 text-sm font-medium",
			children: [on ? "Available" : "Not attached", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-xs font-normal text-muted",
				children: detail
			})]
		})]
	});
}
function DemoCaseWorkspace({ c }) {
	const role = useDemoStore((s) => s.role);
	const update = useDemoStore((s) => s.updateCase);
	const addAudit = useDemoStore((s) => s.addAudit);
	const storeResult = useDemoStore((s) => s.analysis);
	const result = storeResult && storeResult.messages === c.messages ? storeResult : analyseMessages(c.messages, {
		kind: c.threatType,
		severity: c.band,
		lang: c.language,
		curated: c.source !== "analysis"
	});
	const live = {
		...result,
		analysisMode: c.analysisMode ?? result.analysisMode,
		isSynthetic: c.isSynthetic ?? result.isSynthetic,
		modelConfidence: c.modelConfidence ?? result.modelConfidence,
		uncertainty: c.uncertainty ?? result.uncertainty,
		summary: c.summary,
		recommendation: c.recommendation,
		indicators: c.indicators.length ? c.indicators : result.indicators,
		messages: c.messages
	};
	function act(action, patch) {
		if (patch) update(c.id, patch);
		addAudit(c.id, action, role);
		toast.success(`${action} · recorded in audit`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm text-muted",
						children: c.publicId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium tracking-tight",
						children: "Case intelligence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: c.band === "medium" ? "med" : c.band }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [c.risk, " / 100"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "teal",
								children: c.languageLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.threatLabel }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.ageBand }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: statusLabel(c.status) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisModeMark, {
								mode: c.analysisMode,
								isSynthetic: c.isSynthetic ?? c.source !== "analysis"
							})
						]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-teal-mist px-4 py-3 text-sm text-teal-deep",
				children: "AI-generated — human review required. The model cannot escalate, unseal, or close this case."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyIntelligence, { demoCase: c }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceView, { c }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Recommended next step"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-lg",
						children: c.recommendation
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-ink-soft",
						children: c.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAction, {
								role,
								label: "Review case",
								description: "Record that a trained responder has opened and reviewed the evidence. This does not accuse anyone.",
								onConfirm: () => act("Case reviewed by human")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAction, {
								role,
								label: "Assign counsellor",
								description: "Open a support pathway. The counsellor still reviews before any contact.",
								onConfirm: () => act("Counsellor assigned", { status: "counsellor" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAction, {
								role,
								label: "Request more information",
								description: "Ask the pipeline for additional context. No message is sent to the child automatically.",
								onConfirm: () => act("More information requested")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAction, {
								role,
								label: "Escalate for human review",
								description: "Confirm human escalation? The system will not contact police, parents, or external organisations.",
								confirmLabel: "Confirm",
								onConfirm: () => act("Escalated for human review", { status: "human_review" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAction, {
								role,
								label: "Close case",
								danger: true,
								requiredRole: "supervisor",
								description: "Closing is irreversible in this prototype. Confirm only if a human has completed the review.",
								confirmLabel: "Confirm close",
								onConfirm: () => act("Case closed", { status: "closed" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BehaviouralRiskChain, { stages: c.chain }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrossConversation, {
					sessions: c.sessions,
					patterns: c.crossPatterns,
					caseRisk: c.risk
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTrajectory, {
				points: c.timeline,
				current: c.risk,
				projected: c.projectedRisk,
				band: c.band,
				direction: c.trajectory
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainableAi, {
					result: live,
					indicators: c.indicators
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageAnalysis, { result: live })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyCopilot, { result: live }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatIfSimulator, { result: live })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyDashboard, { metrics: c.privacy }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreatGraph, {
					nodes: c.graph.nodes,
					edges: c.graph.edges
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterventionEngine, { band: c.band })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Audit trail"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Every human decision is recorded. The model cannot write an intervention."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-2 font-mono text-xs text-ink-soft",
						children: c.audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-muted",
									children: new Date(a.at).toLocaleTimeString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.action }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: a.actor
								})
							]
						}, a.id))
					})
				]
			})
		]
	});
}
function CaseDetail() {
	const { caseId } = Route.useParams();
	const demoCase = useDemoStore((s) => s.cases.find((c) => c.id === caseId || c.publicId === caseId));
	if (demoCase) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoCaseWorkspace, { c: demoCase });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCase, { caseId });
}
function LiveCase({ caseId }) {
	const { user } = useCurrentUserState();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["case", caseId],
		queryFn: () => getCase({ data: caseId }),
		enabled: Boolean(user)
	});
	const [note, setNote] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [revealed, setRevealed] = (0, import_react.useState)(null);
	const [summaryDraft, setSummaryDraft] = (0, import_react.useState)(null);
	const [editingSummary, setEditingSummary] = (0, import_react.useState)(false);
	const regen = useMutation({
		mutationFn: () => regenerateSafetyCase({ data: caseId }),
		onSuccess: (r) => {
			setSummaryDraft(null);
			setEditingSummary(false);
			toast.success(`Safety case regenerated — risk ${r.pack.risk_score}/100`);
			qc.invalidateQueries({ queryKey: ["case", caseId] });
			qc.invalidateQueries({ queryKey: ["cases"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const saveSummaryEdit = useMutation({
		mutationFn: () => addNote({ data: {
			id: caseId,
			body: `Responder-edited AI summary:\n${summaryDraft ?? ""}`
		} }),
		onSuccess: () => {
			toast.success("Edit saved as a case note — original AI pack is untouched");
			setEditingSummary(false);
			qc.invalidateQueries({ queryKey: ["case", caseId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const move = useMutation({
		mutationFn: (to) => transitionCase({ data: {
			id: caseId,
			to,
			confirm: confirm === to
		} }),
		onSuccess: () => {
			setConfirm("");
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["case", caseId] });
			qc.invalidateQueries({ queryKey: ["cases"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const noteMut = useMutation({
		mutationFn: () => addNote({ data: {
			id: caseId,
			body: note
		} }),
		onSuccess: () => {
			setNote("");
			qc.invalidateQueries({ queryKey: ["case", caseId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const reveal = useMutation({
		mutationFn: () => revealIdentity({ data: {
			id: caseId,
			confirm: true
		} }),
		onSuccess: (r) => {
			setRevealed(r.contact);
			toast.success("Identity unsealed for this session");
			qc.invalidateQueries({ queryKey: ["case", caseId] });
		},
		onError: (e) => toast.error(e.message)
	});
	async function onExport() {
		try {
			const pack = await exportSafetyPack({ data: caseId });
			const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${pack.public_id}-simulated-pocso.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Simulated pack downloaded");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Export failed");
		}
	}
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Sign in to open live cases, or pick a demo case from the queue."
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Loading case…"
	});
	if (q.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-danger",
		children: q.error.message
	});
	const data = q.data;
	if (!data) return null;
	const c = data.case;
	const pack = data.safetyPack;
	const needsConfirm = (to) => to === "escalated_to_authorities" || to === "intervention" || to === "closed";
	const actions = [];
	if (c.status === "detected") actions.push({
		to: "reported",
		label: "Mark reported"
	});
	if (c.status === "reported") actions.push({
		to: "under_review",
		label: "Start review"
	});
	if (c.status === "under_review") actions.push({
		to: "prioritized",
		label: "Mark prioritized"
	});
	if (c.status === "prioritized") actions.push({
		to: "new",
		label: "Queue for assignment"
	});
	if (c.status === "new") actions.push({
		to: "assigned",
		label: "Assign to me"
	});
	if (c.status === "assigned") actions.push({
		to: "in_progress",
		label: "Accept case"
	});
	if (c.status === "in_progress") {
		actions.push({
			to: "escalated_to_authorities",
			label: "Escalate to authorities"
		});
		actions.push({
			to: "resolved",
			label: "Mark resolved"
		});
	}
	if (c.status === "escalated_to_authorities") {
		actions.push({
			to: "intervention",
			label: "Mark intervention started"
		});
		actions.push({
			to: "resolved",
			label: "Mark resolved"
		});
	}
	if (c.status === "intervention") actions.push({
		to: "follow_up",
		label: "Schedule follow-up"
	});
	if (c.status === "follow_up") {
		actions.push({
			to: "resolved",
			label: "Resolve case"
		});
		actions.push({
			to: "intervention",
			label: "Back to intervention"
		});
	}
	if (c.status === "resolved") actions.push({
		to: "closed",
		label: "Close case"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 print:max-w-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm text-muted",
						children: c.public_id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium tracking-tight",
						children: "Case review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: c.priority }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: c.risk_band }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [c.risk_score, "/100"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "teal",
								children: c.language
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.stage.replace(/_/g, " ") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.status.replace(/_/g, " ") }),
							c.distress_flag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "danger",
								children: "distress"
							}),
							c.ai_generated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "AI-generated" })
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onExport,
						children: "Export JSON"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => window.print(),
						children: "Print / PDF"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-teal-mist px-4 py-3 text-sm text-teal-deep",
				children: "AI-generated — human review required. The model cannot escalate, unseal, or close this case."
			}),
			pack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg",
								children: "AI-assisted safety case"
							}), pack.analysis_mode === "fallback" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "danger",
								children: "DEMO FALLBACK — AI SERVICE UNAVAILABLE"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: "teal",
								children: ["LIVE LLM ANALYSIS", pack.model ? ` · ${pack.model}` : ""]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: regen.isPending,
							onClick: () => regen.mutate(),
							children: regen.isPending ? "Generating…" : "Regenerate safety case"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-teal-deep",
							children: "Detected evidence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-2 space-y-2 text-sm",
							children: pack.redacted_evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-ink-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs text-muted",
										children: [
											"#",
											e.turn,
											" ",
											e.speaker
										]
									}),
									" ",
									e.excerpt
								]
							}, e.turn))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-wide text-teal-deep",
									children: "AI interpretation — review before acting"
								}), !editingSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setSummaryDraft(pack.incident_summary);
										setEditingSummary(true);
									},
									children: "Edit"
								})]
							}),
							editingSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: summaryDraft ?? "",
									onChange: (e) => setSummaryDraft(e.target.value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										disabled: saveSummaryEdit.isPending,
										onClick: () => saveSummaryEdit.mutate(),
										children: "Save edit as note"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setEditingSummary(false),
										children: "Cancel"
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-ink-soft",
								children: pack.incident_summary
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-ink-soft",
								children: pack.explanation.plain_summary
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-1 text-sm",
								children: pack.explanation.top_factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums text-muted",
										children: [f.direction === "up" ? "+" : "−", f.weight]
									})]
								}, f.label))
							})
						]
					}),
					pack.indicators && pack.indicators.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-teal-deep",
							children: "Why was this flagged?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: pack.indicators.map((ind) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-paper p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: ind.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted",
											children: [
												Math.round(ind.confidence * 100),
												"% confidence · +",
												ind.contribution
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-ink-soft",
										children: ind.why_it_matters
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-mono text-xs text-muted",
										children: [
											"\"",
											ind.evidence,
											"\" — ",
											ind.source
										]
									})
								]
							}, ind.type))
						})]
					}),
					pack.uncertainty && pack.uncertainty.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: ["Uncertainty: ", pack.uncertainty.join("; ")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted",
						children: pack.pocso_note
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Grooming progression timeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageTimeline, { timeline: data.timeline })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Redacted evidence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-3",
						children: data.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-teal-deep",
								children: [
									m.speaker,
									" · ",
									m.lang
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-ink-soft",
								children: m.redacted_text
							})]
						}, m.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 text-xs text-muted",
						children: data.events.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							e.event_type,
							" · ",
							new Date(e.created_at).toLocaleString()
						] }, i))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Responder actions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: actions.map((a) => {
							const lock = needsConfirm(a.to);
							const armed = !lock || confirm === a.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [lock && confirm !== a.to && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setConfirm(a.to),
									children: [a.label, " (confirm)"]
								}), armed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: lock ? "danger" : "default",
									disabled: move.isPending,
									onClick: () => move.mutate(a.to),
									children: lock ? `Confirm ${a.label}` : a.label
								})]
							}, a.to);
						})
					}),
					data.hasSealedIdentity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink-soft",
							children: "A callback number is sealed on this case. Unsealing is logged."
						}), revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-sm",
							children: revealed
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-2",
							variant: "danger",
							size: "sm",
							disabled: reveal.isPending || data.me.role === "ngo",
							onClick: () => reveal.mutate(),
							children: "Reveal sealed identity"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: [data.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: n.author_name ?? n.author_id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: n.body })] }, n.id)), data.notes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: "No notes yet."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "Internal note — do not paste unredacted child data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						size: "sm",
						disabled: !note.trim() || noteMut.isPending,
						onClick: () => noteMut.mutate(),
						children: "Add note"
					})
				]
			})
		]
	});
}
//#endregion
export { CaseDetail as component };
