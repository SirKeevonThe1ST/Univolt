import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { C as Button, D as useDemoStore, a as useI18n, p as transcribeVoice, s as analyzeEvidence } from "./router-DoXUK3Ja.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BuUSUMkL.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
import { n as VoiceRecorder, t as ScreenshotUploader } from "./voice-recorder-Cv-wGxAY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-DtLpBEwe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FACES = [
	{
		value: 1,
		key: "sev1",
		svg: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 48",
			className: "size-10",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r: "20",
					fill: "#D5E8E6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "17",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "31",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 30c2.5 3 13.5 3 16 0",
					fill: "none",
					stroke: "#1A2422",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		value: 2,
		key: "sev2",
		svg: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 48",
			className: "size-10",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r: "20",
					fill: "#E7E0D3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "17",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "31",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M17 31h14",
					fill: "none",
					stroke: "#1A2422",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		value: 3,
		key: "sev3",
		svg: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 48",
			className: "size-10",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r: "20",
					fill: "#F3E6C8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "17",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "31",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M18 33c3-3 9-3 12 0",
					fill: "none",
					stroke: "#1A2422",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			]
		})
	},
	{
		value: 4,
		key: "sev4",
		svg: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 48",
			className: "size-10",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r: "20",
					fill: "#F0D9D6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "17",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "31",
					cy: "21",
					r: "2",
					fill: "#1A2422"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M17 34c4-5 10-5 14 0",
					fill: "none",
					stroke: "#1A2422",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			]
		})
	}
];
function SeverityPicker({ value, onChange }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
		children: FACES.map((f) => {
			const selected = value === f.value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChange(f.value),
				className: cn("flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors", selected ? "border-teal bg-teal-mist ring-2 ring-teal/30" : "border-border bg-surface hover:bg-paper-2"),
				"aria-pressed": selected,
				children: [f.svg, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-ink",
					children: t(f.key)
				})]
			}, f.value);
		})
	});
}
var submitAnonymousReport = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("44b8c02dee01140de1d71b4bd58791b382b7d86bba16367ddf64549fad7637c4"));
var STATES = [
	"AN",
	"AP",
	"AR",
	"AS",
	"BR",
	"CH",
	"CT",
	"DL",
	"GA",
	"GJ",
	"HP",
	"HR",
	"JH",
	"JK",
	"KA",
	"KL",
	"LA",
	"LD",
	"MH",
	"ML",
	"MN",
	"MP",
	"MZ",
	"NL",
	"OD",
	"PB",
	"PY",
	"RJ",
	"SK",
	"TN",
	"TS",
	"TR",
	"UK",
	"UP",
	"WB"
];
function Report() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const ingest = useDemoStore((s) => s.ingestChildReport);
	const [severity, setSeverity] = (0, import_react.useState)(2);
	const [text, setText] = (0, import_react.useState)("");
	const [callback, setCallback] = (0, import_react.useState)(false);
	const [contact, setContact] = (0, import_react.useState)("");
	const [region, setRegion] = (0, import_react.useState)("");
	const [shots, setShots] = (0, import_react.useState)([]);
	const [voice, setVoice] = (0, import_react.useState)(null);
	const [transcription, setTranscription] = (0, import_react.useState)(null);
	const [sttUnavailable, setSttUnavailable] = (0, import_react.useState)(false);
	const [transcribing, setTranscribing] = (0, import_react.useState)(false);
	const [showShots, setShowShots] = (0, import_react.useState)(false);
	const [showVoice, setShowVoice] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleTranscribe(note) {
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
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const combined = [text.trim(), transcription ? `Voice: ${transcription}` : ""].filter(Boolean).join("\n");
			const res = await submitAnonymousReport({ data: {
				text: combined,
				severity,
				callback,
				contact: callback ? contact : void 0,
				region: region || null,
				screenshot: shots.length > 0,
				voice: Boolean(voice)
			} });
			let analysis = null;
			if (combined) {
				const ai = await analyzeEvidence({ data: {
					messages: [{
						speaker: "child",
						text: combined,
						source: "paste",
						sourceLabel: "Child report"
					}],
					images: shots.map((s) => ({
						name: s.name,
						dataUrl: s.dataUrl
					})),
					transcriptionNote: voice && !transcription ? "Voice note attached. Automatic transcription unavailable." : void 0
				} });
				if (ai.ok) analysis = ai.result;
			}
			ingest({
				text: combined || `Severity ${severity} — no written note.`,
				analysis,
				screenshots: shots.map((s) => ({
					name: s.name,
					dataUrl: s.dataUrl
				})),
				voice: voice ? {
					durationSec: voice.durationSec,
					mime: voice.mime,
					transcription: transcription ?? void 0
				} : void 0,
				region: region || void 0,
				anonymous: !callback
			});
			await navigate({
				to: "/report/done",
				search: { id: res.publicId }
			});
		} catch {
			setError("We couldn't send this right now. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "mx-auto max-w-xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: t("reportTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft leading-relaxed",
				children: t("reportLead")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-medium text-ink",
					children: t("feelTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPicker, {
					value: severity,
					onChange: setSeverity
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "what",
					children: t("whatHappened")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "what",
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: t("placeholder"),
					maxLength: 4e3
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: showShots || shots.length ? "default" : "outline",
					onClick: () => setShowShots((v) => !v),
					children: [t("attachPhoto"), shots.length > 0 ? ` · ${shots.length}` : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: showVoice || voice ? "default" : "outline",
					onClick: () => setShowVoice((v) => !v),
					children: [t("attachVoice"), voice ? " · recorded" : ""]
				})]
			}),
			showShots && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotUploader, {
				shots,
				onChange: setShots,
				compact: true
			}),
			showVoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceRecorder, {
				note: voice,
				onChange: (n) => {
					setVoice(n);
					if (!n) {
						setTranscription(null);
						setSttUnavailable(false);
					}
				},
				onTranscribe: (n) => void handleTranscribe(n),
				transcription,
				transcribing,
				transcriptionUnavailable: sttUnavailable
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						selected: !callback,
						onClick: () => setCallback(false),
						label: t("stayAnon")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						selected: callback,
						onClick: () => setCallback(true),
						label: t("wantCallback")
					})]
				}), callback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: t("callbackHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contact",
							children: t("contactLabel")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "contact",
							inputMode: "tel",
							autoComplete: "off",
							value: contact,
							onChange: (e) => setContact(e.target.value),
							required: callback
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "region",
					children: t("regionLabel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "region",
					value: region,
					onChange: (e) => setRegion(e.target.value),
					className: "h-11 w-full rounded-xl border border-border bg-paper px-3 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("regionSkip")
					}), STATES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: s
					}, s))]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-danger",
					children: error
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "outline",
					size: "sm",
					className: "text-xs",
					disabled: busy,
					children: "Try again"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "xl",
				className: "w-full",
				disabled: busy,
				children: busy ? t("sending") : t("send")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: t("panicHint")
			})
		]
	}) });
}
function Toggle({ selected, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-12 rounded-xl border px-3 py-2 text-sm font-medium", selected ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-paper"),
		"aria-pressed": selected,
		children: label
	});
}
//#endregion
export { Report as component };
