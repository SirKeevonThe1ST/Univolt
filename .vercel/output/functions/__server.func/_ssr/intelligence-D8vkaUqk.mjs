import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as ANALYSIS_LANGS } from "./intelligence-Dr71N71v.mjs";
import { r as parseConversation, t as combineMessageLists } from "./parse-conversation-CqsiqhAG.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { t as HumanLoopMark } from "./sim-mark-BALUNCL_.mjs";
import { C as FileText, p as Plus, r as Type, v as Mic, x as ImagePlus } from "../_libs/lucide-react.mjs";
import { t as PipelineDiagram } from "./pipeline-diagram-3TDu7x0Z.mjs";
import { C as Button, D as useDemoStore, E as getScenario, S as SafetyIntelligence, _ as ExplainableAi, b as AnalysisModeMark, g as CrossConversation, h as BehaviouralRiskChain, i as SimulationLauncher, l as extractScreenshots, m as PrivacyDashboard, p as transcribeVoice, s as analyzeEvidence, v as LanguageAnalysis, w as analyseMessages, x as RiskTrajectory, y as Badge } from "./router-DoXUK3Ja.mjs";
import { r as Textarea } from "./input-BuUSUMkL.mjs";
import { n as SafetyCopilot, r as WhatIfSimulator, t as InterventionEngine } from "./what-if-simulator-C_kFmMNT.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
import { t as ResponsibleAi } from "./responsible-ai-ChLLbpAy.mjs";
import { n as VoiceRecorder, t as ScreenshotUploader } from "./voice-recorder-Cv-wGxAY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intelligence-D8vkaUqk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	{
		id: "grooming",
		label: "Grooming"
	},
	{
		id: "cyberbullying",
		label: "Cyberbullying"
	},
	{
		id: "blackmail",
		label: "Blackmail"
	},
	{
		id: "threat",
		label: "Threat"
	},
	{
		id: "suspicious",
		label: "Suspicious contact"
	}
];
var SEV = [
	"low",
	"medium",
	"high",
	"critical"
];
function DemoControls({ onGenerate }) {
	const kind = useDemoStore((s) => s.scenarioKind);
	const severity = useDemoStore((s) => s.scenarioSeverity);
	const lang = useDemoStore((s) => s.scenarioLang);
	const setScenario = useDemoStore((s) => s.setScenario);
	const generate = useDemoStore((s) => s.generateScenario);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-dashed border-border bg-paper/80 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Demo controls · judges"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Scenario",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: kind,
							onChange: (e) => setScenario({ kind: e.target.value }),
							className: "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm",
							children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k.id,
								children: k.label
							}, k.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Severity",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: severity,
							onChange: (e) => setScenario({ severity: e.target.value }),
							className: "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm capitalize",
							children: SEV.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Language",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: lang,
							onChange: (e) => setScenario({ lang: e.target.value }),
							className: "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm",
							children: ANALYSIS_LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: l.code,
								children: l.native
							}, l.code))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: () => {
					generate();
					onGenerate?.();
				},
				children: "Generate safety scenario"
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-xs font-medium text-ink-soft",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
var STAGES = [
	{
		id: "message",
		label: "Message analysis"
	},
	{
		id: "behaviour",
		label: "Behaviour detection"
	},
	{
		id: "accumulation",
		label: "Risk accumulation"
	},
	{
		id: "assessment",
		label: "Safety assessment"
	}
];
function AnalysisStages({ stage }) {
	const idx = STAGES.findIndex((s) => s.id === stage);
	const done = stage === "done";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid gap-2 sm:grid-cols-4",
		children: STAGES.map((s, i) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-xl border px-3 py-3 text-sm", done || i <= idx ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-surface text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block font-mono text-[11px] tabular-nums opacity-70",
					children: ["0", i + 1]
				}), s.label]
			}, s.id);
		})
	});
}
function OcrReview({ messages, onChange, lowConfidence, onConfirm, busy }) {
	function update(i, patch) {
		onChange(messages.map((m, idx) => idx === i ? {
			...m,
			...patch
		} : m));
	}
	function remove(i) {
		onChange(messages.filter((_, idx) => idx !== i));
	}
	function move(i, dir) {
		const j = i + dir;
		if (j < 0 || j >= messages.length) return;
		const next = [...messages];
		const tmp = next[i];
		next[i] = next[j];
		next[j] = tmp;
		onChange(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Reconstructed conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 font-display text-xl",
				children: "Review extracted messages"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "Correct speaker, wording, or order before analysis. Original screenshots stay attached as evidence."
			}),
			lowConfidence && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-lg bg-[#f3e6c8] px-3 py-2 text-sm text-warn",
				children: "Some text could not be read confidently."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 space-y-3",
				children: messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-paper p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: m.speaker,
								onChange: (e) => update(i, { speaker: e.target.value }),
								className: "h-9 rounded-lg border border-border bg-surface px-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "other",
									children: "OTHER"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "child",
									children: "CHILD"
								})]
							}),
							m.sourceLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase tracking-wide text-muted",
								children: m.sourceLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										onClick: () => move(i, -1),
										children: "Up"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										onClick: () => move(i, 1),
										children: "Down"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										onClick: () => remove(i),
										children: "Remove"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-2 min-h-16",
						value: m.text,
						onChange: (e) => update(i, { text: e.target.value })
					})]
				}, `${m.text}-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				size: "lg",
				disabled: busy || messages.length === 0,
				onClick: onConfirm,
				children: busy ? "Analyzing…" : "Confirm & analyze"
			})
		]
	});
}
var PLACEHOLDER = `Paste an entire conversation here...
Example:
OTHER:
hey how old are you?
CHILD:
why do you want to know?
OTHER:
what school do you go to?
OTHER:
do your parents check your phone?
OTHER:
don't tell them we're talking
OTHER:
send me a picture`;
function EvidenceComposer({ onAnalyze, analyzing, initialText }) {
	const [tab, setTab] = (0, import_react.useState)("paste");
	const [paste, setPaste] = (0, import_react.useState)(initialText ?? "");
	const [extraPastes, setExtraPastes] = (0, import_react.useState)([]);
	const [shots, setShots] = (0, import_react.useState)([]);
	const [fileTexts, setFileTexts] = (0, import_react.useState)([]);
	const [voice, setVoice] = (0, import_react.useState)(null);
	const [transcription, setTranscription] = (0, import_react.useState)(null);
	const [sttUnavailable, setSttUnavailable] = (0, import_react.useState)(false);
	const [transcribing, setTranscribing] = (0, import_react.useState)(false);
	const [ocrMessages, setOcrMessages] = (0, import_react.useState)(null);
	const [ocrLow, setOcrLow] = (0, import_react.useState)(false);
	const [ocrError, setOcrError] = (0, import_react.useState)(null);
	const [extracting, setExtracting] = (0, import_react.useState)(false);
	const [synthetic, setSynthetic] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	async function onTranscribe(note) {
		setTranscribing(true);
		setSttUnavailable(false);
		try {
			const res = await transcribeVoice({ data: {
				base64: note.base64,
				mime: note.mime
			} });
			if (res.ok) setTranscription(res.text);
			else {
				setSttUnavailable(true);
				setTranscription(null);
			}
		} catch {
			setSttUnavailable(true);
		} finally {
			setTranscribing(false);
		}
	}
	async function extractShots() {
		if (!shots.length) return;
		setExtracting(true);
		setOcrError(null);
		try {
			const res = await extractScreenshots({ data: { images: shots.map((s) => ({
				name: s.name,
				dataUrl: s.dataUrl
			})) } });
			if (!res.ok) {
				setOcrError(res.error);
				return;
			}
			setOcrLow(res.extract.low_confidence || res.extract.ocr_confidence < .55);
			setOcrMessages(res.extract.messages.map((m) => ({
				speaker: m.speaker,
				text: m.text,
				source: "screenshot",
				sourceLabel: m.source_label || "Screenshot"
			})));
		} catch (e) {
			setOcrError(e instanceof Error ? e.message : "Could not extract text from screenshots.");
		} finally {
			setExtracting(false);
		}
	}
	async function onFile(files) {
		if (!files) return;
		const next = [];
		for (const file of [...files]) {
			if (!/\.(txt|md|csv|json)$/i.test(file.name) && file.type && !file.type.startsWith("text/")) continue;
			next.push({
				name: file.name,
				text: await file.text()
			});
		}
		setFileTexts((prev) => [...prev, ...next]);
		setSynthetic(false);
	}
	function collectMessages() {
		const lists = [];
		if (paste.trim()) lists.push(parseConversation(paste, "Pasted text"));
		for (const extra of extraPastes) if (extra.trim()) lists.push(parseConversation(extra, "Pasted text"));
		for (const f of fileTexts) lists.push(parseConversation(f.text, f.name));
		if (ocrMessages?.length) lists.push(ocrMessages);
		if (transcription?.trim()) lists.push([{
			speaker: "child",
			text: transcription.trim(),
			source: "voice",
			sourceLabel: "Voice note"
		}]);
		return combineMessageLists(lists);
	}
	function analyzeNow(messages = collectMessages()) {
		onAnalyze({
			messages,
			images: shots.map((s) => ({
				name: s.name,
				dataUrl: s.dataUrl
			})),
			transcriptionNote: voice ? transcription ? void 0 : "Voice note attached. Automatic transcription unavailable." : void 0,
			isSynthetic: synthetic
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted",
				children: "Conversation evidence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl font-medium tracking-tight",
				children: "Add evidence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft",
				children: "Add messages, screenshots, voice notes, or an exported conversation for safety analysis."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [[
					{
						id: "paste",
						label: "Paste conversation",
						icon: Type
					},
					{
						id: "shots",
						label: "Upload screenshots",
						icon: ImagePlus
					},
					{
						id: "file",
						label: "Upload file",
						icon: FileText
					},
					{
						id: "voice",
						label: "Voice note",
						icon: Mic
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: tab === t.id ? "default" : "outline",
					onClick: () => setTab(t.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, {}),
						" ",
						t.label
					]
				}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: () => {
						setTab("paste");
						setExtraPastes((p) => [...p, ""]);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Add another source"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					tab === "paste" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-56 font-mono text-sm",
							value: paste,
							placeholder: PLACEHOLDER,
							onChange: (e) => {
								setPaste(e.target.value);
								setSynthetic(false);
							}
						}), extraPastes.map((text, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-32 font-mono text-sm",
							value: text,
							placeholder: `Additional source ${i + 2}…`,
							onChange: (e) => setExtraPastes((prev) => prev.map((x, idx) => idx === i ? e.target.value : x))
						}, i))]
					}),
					tab === "shots" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotUploader, {
								shots,
								onChange: (s) => {
									setShots(s);
									setSynthetic(false);
									setOcrMessages(null);
								}
							}),
							shots.length > 0 && !ocrMessages && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								disabled: extracting,
								onClick: () => void extractShots(),
								children: extracting ? "Extracting text…" : "Reconstruct conversation"
							}),
							ocrError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								children: ocrError
							})
						]
					}),
					tab === "file" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".txt,.md,.csv,.json,text/plain",
								multiple: true,
								className: "sr-only",
								onChange: (e) => void onFile(e.target.files)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {}), " Choose exported conversation"]
							}),
							fileTexts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									"Loaded ",
									f.name,
									" (",
									f.text.length,
									" characters)"
								]
							}, f.name))
						]
					}),
					tab === "voice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceRecorder, {
						note: voice,
						onChange: (n) => {
							setVoice(n);
							if (!n) {
								setTranscription(null);
								setSttUnavailable(false);
							}
						},
						onTranscribe: (n) => void onTranscribe(n),
						transcription,
						transcribing,
						transcriptionUnavailable: sttUnavailable
					})
				]
			}),
			ocrMessages && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OcrReview, {
					messages: ocrMessages,
					onChange: setOcrMessages,
					lowConfidence: ocrLow,
					busy: analyzing,
					onConfirm: () => analyzeNow()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					disabled: analyzing,
					onClick: () => analyzeNow(),
					className: cn(analyzing && "opacity-80"),
					children: analyzing ? "Analyzing evidence…" : "Analyze evidence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "AI-assisted, human-controlled. Nothing is sent to authorities."
				})]
			})
		]
	});
}
var STAGE_ORDER = [
	"message",
	"behaviour",
	"accumulation",
	"assessment",
	"done"
];
function Intelligence() {
	const analysis = useDemoStore((s) => s.analysis);
	const stage = useDemoStore((s) => s.analysisStage);
	const kind = useDemoStore((s) => s.scenarioKind);
	const severity = useDemoStore((s) => s.scenarioSeverity);
	const lang = useDemoStore((s) => s.scenarioLang);
	const setStage = useDemoStore((s) => s.setAnalysisStage);
	const create = useDemoStore((s) => s.createCaseFromAnalysis);
	const applyLive = useDemoStore((s) => s.applyLiveAnalysis);
	const addAudit = useDemoStore((s) => s.addAudit);
	const navigate = useNavigate();
	const [running, setRunning] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [seed, setSeed] = (0, import_react.useState)({
		text: "",
		key: 0,
		synthetic: false
	});
	const [reveal, setReveal] = (0, import_react.useState)(0);
	function loadSynthetic() {
		const text = getScenario(kind, lang, severity).messages.map((m) => `${m.speaker.toUpperCase()}: ${m.text}`).join("\n");
		setSeed({
			text,
			key: Date.now(),
			synthetic: true
		});
		setStage("idle");
		setError(null);
	}
	async function runBundle(bundle) {
		if (!bundle.messages.length && !bundle.images.length) {
			setError("Paste a conversation or attach evidence first.");
			return;
		}
		setRunning(true);
		setError(null);
		setReveal(0);
		setStage("message");
		const started = Date.now();
		let i = 0;
		const tick = window.setInterval(() => {
			i += 1;
			const next = STAGE_ORDER[Math.min(i, STAGE_ORDER.length - 1)];
			setStage(next);
			setReveal((n) => n + 1);
			if (next === "assessment") window.clearInterval(tick);
		}, 550);
		try {
			const res = await analyzeEvidence({ data: {
				messages: bundle.messages,
				images: bundle.images,
				isSynthetic: bundle.isSynthetic || seed.synthetic,
				transcriptionNote: bundle.transcriptionNote
			} });
			window.clearInterval(tick);
			if (!res.ok) {
				const fallback = analyseMessages(bundle.messages, { curated: false });
				fallback.analysisMode = "fallback";
				fallback.confidenceLabel = "Fallback";
				fallback.modelStatus = "Unavailable";
				fallback.isSynthetic = bundle.isSynthetic || seed.synthetic;
				fallback.latencyMs = Date.now() - started;
				applyLive(fallback);
				setStage("done");
				setReveal(99);
				setError(`${res.error} Showing labelled demo fallback — not live AI.`);
				return;
			}
			applyLive(res.result);
			setStage("done");
			setReveal(99);
		} catch (e) {
			window.clearInterval(tick);
			const fallback = analyseMessages(bundle.messages, { curated: false });
			fallback.analysisMode = "fallback";
			fallback.confidenceLabel = "Fallback";
			fallback.modelStatus = "Unavailable";
			applyLive(fallback);
			setStage("done");
			setError(e instanceof Error ? `${e.message} Showing labelled demo fallback — not live AI.` : "AI service unavailable.");
		} finally {
			setRunning(false);
		}
	}
	const result = analysis;
	const done = result && stage === "done";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-teal",
								children: "Safety intelligence"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisModeMark, {
								mode: result?.analysisMode,
								isSynthetic: result?.isSynthetic
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HumanLoopMark, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl font-medium tracking-tight",
						children: "Detect → Understand → Protect"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-ink-soft leading-relaxed",
						children: "Paste a conversation or upload screenshots, voice notes, or an exported conversation. A live model extracts behavioural signals. A deterministic engine scores risk. A human decides."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationLauncher, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineDiagram, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceComposer, {
				initialText: seed.text,
				analyzing: running,
				onAnalyze: (b) => void runBundle({
					...b,
					isSynthetic: b.isSynthetic || seed.synthetic
				})
			}, seed.key),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "rounded-xl border border-dashed border-border bg-paper/80 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-sm font-medium",
						children: "Load a synthetic demo conversation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Synthetic demo · not a real child. Analysis still goes through the live model."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoControls, { onGenerate: loadSynthetic }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "outline",
							onClick: loadSynthetic,
							children: "Load into evidence editor"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: "Evidence preview"
					}), result?.messages?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 space-y-3",
						children: result.messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed", m.speaker === "other" ? "rounded-tl-md bg-paper-2" : "ml-auto rounded-tr-md bg-teal-mist text-teal-deep"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-[11px] uppercase tracking-wide opacity-70",
								children: [m.sourceLabel ? `[${m.sourceLabel}] ` : "", m.speaker]
							}), m.text]
						}, `${m.text}-${i}`))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Submitted evidence will appear here after analysis."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisStages, { stage }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl border border-warn/30 bg-[#f3e6c8]/60 px-4 py-3 text-sm text-warn",
							children: error
						}),
						result && stage !== "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-wide text-muted",
									children: result.analysisMode === "live" ? "Risk · deterministic engine" : "Risk · labelled fallback"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-end gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-6xl tabular-nums leading-none",
											children: done ? result.risk : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "pb-1 text-muted",
											children: "/ 100"
										}),
										done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: result.band === "critical" ? "ink" : result.band === "high" ? "danger" : result.band === "medium" ? "warn" : "ok",
											children: result.band
										})
									]
								}),
								done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone: "teal",
												children: result.languageLabel
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: result.threatLabel }),
											result.modelName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: result.modelName }),
											typeof result.latencyMs === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [(result.latencyMs / 1e3).toFixed(1), "s"] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-sm text-ink-soft",
										children: [
											"Detected language: ",
											result.languageLabel,
											"."
										]
									}),
									typeof result.modelConfidence === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											"Model confidence ",
											result.modelConfidence,
											"% — model-reported; not a validated safety probability."
										]
									}),
									result.visionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted",
										children: result.visionNote
									})
								] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-dashed border-border bg-surface px-5 py-12 text-center text-sm text-muted",
							children: "Run analysis to see the behavioural risk chain, trajectory, and why the system is concerned."
						})
					]
				})]
			}),
			result && stage !== "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BehaviouralRiskChain, {
				stages: result.chain,
				revealUpTo: stage === "done" ? result.chain.length : Math.max(1, reveal + 1)
			}),
			done && result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyIntelligence, { result }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrossConversation, {
						sessions: result.sessions,
						patterns: result.crossPatterns,
						caseRisk: result.risk
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageAnalysis, { result })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTrajectory, {
					points: result.timeline,
					current: result.risk,
					projected: result.projectedRisk,
					band: result.band,
					direction: result.trajectory
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainableAi, {
						result,
						indicators: result.indicators
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterventionEngine, { band: result.band })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyDashboard, { metrics: result.privacy }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyCopilot, { result }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatIfSimulator, { result })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							const c = create("analysis");
							addAudit(c.id, "LLM analysis requested", "system");
							addAudit(c.id, `Risk engine calculated ${result.risk}`, "risk-engine");
							navigate({
								to: "/console/cases/$caseId",
								params: { caseId: c.id }
							});
						},
						children: "Create responder review case"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "self-center text-xs text-muted",
						children: "Human review required. Nothing is sent to authorities."
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsibleAi, {})
		]
	}) });
}
//#endregion
export { Intelligence as component };
