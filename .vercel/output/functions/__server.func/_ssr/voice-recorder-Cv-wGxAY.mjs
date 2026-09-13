import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./scoring-BbRGh4-y.mjs";
import { f as RotateCcw, g as Pause, m as Play, o as Trash2, s as Square, t as X, v as Mic, x as ImagePlus } from "../_libs/lucide-react.mjs";
import { C as Button } from "./router-DoXUK3Ja.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/voice-recorder-Cv-wGxAY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_DIM = 1280;
var MAX_BYTES = 18e5;
var ALLOWED = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
]);
function isAllowedImage(file) {
	const type = file.type.toLowerCase();
	if (!ALLOWED.has(type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) return "Please choose a JPG, PNG, or WEBP image.";
	if (file.size > 8388608) return "This file is too large. Please choose a smaller image.";
	return null;
}
async function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read this file."));
		reader.onload = () => resolve(String(reader.result));
		reader.readAsDataURL(file);
	});
}
async function resizeImageFile(file) {
	const err = isAllowedImage(file);
	if (err) throw new Error(err);
	const dataUrl = await fileToDataUrl(file);
	const img = await loadImage(dataUrl);
	const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
	const w = Math.max(1, Math.round(img.width * scale));
	const h = Math.max(1, Math.round(img.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return {
		name: file.name,
		dataUrl,
		mime: file.type || "image/jpeg"
	};
	ctx.drawImage(img, 0, 0, w, h);
	let quality = .72;
	let out = canvas.toDataURL("image/jpeg", quality);
	while (out.length > MAX_BYTES && quality > .4) {
		quality -= .1;
		out = canvas.toDataURL("image/jpeg", quality);
	}
	return {
		name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
		dataUrl: out,
		mime: "image/jpeg"
	};
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("This image could not be read."));
		img.src = src;
	});
}
async function blobToBase64(blob) {
	const buf = await blob.arrayBuffer();
	const bytes = new Uint8Array(buf);
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
function formatClock(totalSec) {
	const s = Math.max(0, Math.floor(totalSec));
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function ScreenshotUploader({ shots, onChange, compact }) {
	const inputRef = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [drag, setDrag] = (0, import_react.useState)(false);
	async function addFiles(files) {
		setError(null);
		const list = [...files];
		if (!list.length) return;
		setBusy(true);
		const next = [...shots];
		try {
			for (const file of list) {
				const err = isAllowedImage(file);
				if (err) {
					setError(err);
					continue;
				}
				const resized = await resizeImageFile(file);
				next.push({
					id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
					name: resized.name,
					dataUrl: resized.dataUrl
				});
			}
			onChange(next);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not attach that image.");
		} finally {
			setBusy(false);
		}
	}
	function onInput(e) {
		if (e.target.files) addFiles(e.target.files);
		e.target.value = "";
	}
	function onDrop(e) {
		e.preventDefault();
		setDrag(false);
		if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/png,image/jpeg,image/jpg,image/webp",
				multiple: true,
				className: "sr-only",
				onChange: onInput
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => inputRef.current?.click(),
				onDragOver: (e) => {
					e.preventDefault();
					setDrag(true);
				},
				onDragLeave: () => setDrag(false),
				onDrop,
				className: cn("flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors", drag ? "border-teal bg-teal-mist/70" : "border-border bg-paper hover:border-teal/50", compact && "py-5"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-6 text-teal" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm font-medium",
						children: "+ Add conversation evidence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Drag screenshots here or click to browse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] uppercase tracking-wide text-muted",
						children: "PNG · JPG · WEBP"
					})
				]
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Preparing images…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}),
			shots.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "Attached evidence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 grid gap-2 sm:grid-cols-2",
					children: shots.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-surface p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.dataUrl,
								alt: "",
								className: "size-14 rounded-lg object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-medium",
									children: ["Screenshot ", i + 1]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-muted",
									children: s.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								"aria-label": "Remove screenshot",
								onClick: () => onChange(shots.filter((x) => x.id !== s.id)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
							})
						]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "mt-2",
					onClick: () => inputRef.current?.click(),
					children: "+ Add another screenshot"
				})
			] })
		]
	});
}
var MAX_SEC = 120;
function VoiceRecorder({ note, onChange, onTranscribe, transcription, transcribing, transcriptionUnavailable }) {
	const [supported, setSupported] = (0, import_react.useState)(true);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const recRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const streamRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) setSupported(false);
		return () => stopTracks();
	}, []);
	(0, import_react.useEffect)(() => {
		if (note && phase === "idle") setPhase("recorded");
		if (!note && phase !== "recording") setPhase("idle");
	}, [note, phase]);
	function stopTracks() {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		if (timerRef.current) window.clearInterval(timerRef.current);
	}
	async function start() {
		setError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			const mime = pickMime();
			const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
			chunksRef.current = [];
			rec.ondataavailable = (e) => {
				if (e.data.size) chunksRef.current.push(e.data);
			};
			rec.onstop = async () => {
				stopTracks();
				const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
				const base64 = await blobToBase64(blob);
				const objectUrl = URL.createObjectURL(blob);
				const next = {
					blob,
					mime: blob.type,
					durationSec: elapsedRef.current,
					objectUrl,
					base64
				};
				onChange(next);
				setPhase("recorded");
				onTranscribe?.(next);
			};
			recRef.current = rec;
			elapsedRef.current = 0;
			setElapsed(0);
			rec.start(200);
			setPhase("recording");
			timerRef.current = window.setInterval(() => {
				elapsedRef.current += 1;
				setElapsed(elapsedRef.current);
				if (elapsedRef.current >= MAX_SEC) stop();
			}, 1e3);
		} catch {
			setError("Microphone permission was denied. You can still type your report.");
			setPhase("idle");
		}
	}
	const elapsedRef = (0, import_react.useRef)(0);
	function stop() {
		recRef.current?.stop();
		recRef.current = null;
		if (timerRef.current) window.clearInterval(timerRef.current);
	}
	function cancel() {
		recRef.current?.stop();
		recRef.current = null;
		stopTracks();
		chunksRef.current = [];
		setPhase("idle");
		setElapsed(0);
		onChange(null);
	}
	function remove() {
		if (note?.objectUrl) URL.revokeObjectURL(note.objectUrl);
		onChange(null);
		setPhase("idle");
		setElapsed(0);
	}
	function togglePlay() {
		const el = audioRef.current;
		if (!el) return;
		if (phase === "playing") {
			el.pause();
			setPhase("recorded");
		} else {
			el.play();
			setPhase("playing");
		}
	}
	if (!supported) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-xl border border-border bg-paper px-4 py-3 text-sm text-ink-soft",
		children: "Voice recording is not supported on this browser. You can continue by typing your report."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded-xl border border-border bg-paper p-4",
		children: [
			phase === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => void start(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), " Record a voice note"]
			}),
			phase === "recording" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 text-sm font-medium text-danger",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 animate-pulse rounded-full bg-danger" }), "Recording"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-sm tabular-nums",
						children: [
							formatClock(elapsed),
							" / ",
							formatClock(MAX_SEC)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						onClick: stop,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), " Stop"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "ghost",
						onClick: cancel,
						children: "Cancel"
					})
				]
			}),
			(phase === "recorded" || phase === "playing") && note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wide text-muted",
						children: "Voice note recorded"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums",
								children: formatClock(note.durationSec)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: togglePlay,
								children: [
									phase === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}),
									" ",
									phase === "playing" ? "Pause" : "Play"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => {
									remove();
									start();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), " Re-record"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: remove,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), " Delete"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						ref: audioRef,
						src: note.objectUrl,
						onEnded: () => setPhase("recorded"),
						className: "hidden"
					}),
					transcribing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Transcribing…"
					}),
					transcription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-surface px-3 py-2 text-sm text-ink-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wide text-muted",
							children: "Voice transcription"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1",
							children: [
								"“",
								transcription,
								"”"
							]
						})]
					}),
					transcriptionUnavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Voice note attached. Automatic transcription unavailable."
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			})
		]
	});
}
function pickMime() {
	return [
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/mp4"
	].find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
}
//#endregion
export { VoiceRecorder as n, ScreenshotUploader as t };
