//#region node_modules/.nitro/vite/services/ssr/assets/safe-exit-B-xFL1Y-.js
var DECOY = "https://www.google.com/search?q=today+weather+india";
/** 1-tap leave: overwrite history, then replace with a mundane decoy. */
function triggerSafeExit() {
	try {
		if (typeof window === "undefined") return;
		for (let i = 0; i < 12; i += 1) window.history.pushState(null, "", "/");
		window.location.replace(DECOY);
	} catch {
		window.location.href = DECOY;
	}
}
function installPanicHotkey() {
	let last = 0;
	const onKey = (e) => {
		if (e.key === "Escape") {
			const now = Date.now();
			if (now - last < 900) {
				e.preventDefault();
				triggerSafeExit();
			}
			last = now;
		}
		if (e.key === "x" && e.shiftKey && e.ctrlKey) {
			e.preventDefault();
			triggerSafeExit();
		}
	};
	window.addEventListener("keydown", onKey);
	return () => window.removeEventListener("keydown", onKey);
}
//#endregion
export { triggerSafeExit as n, installPanicHotkey as t };
