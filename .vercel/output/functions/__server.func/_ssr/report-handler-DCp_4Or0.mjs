import { t as getStorageRepository } from "./storage-DDzPOkcj.mjs";
import { t as ingestThread } from "./ingest-BiAA7xhw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-handler-DCp_4Or0.js
async function handleAnonymousReport(data) {
	try {
		await getStorageRepository().ensureSeeded();
		const text = (data.text ?? "").trim();
		const severity = Math.max(1, Math.min(4, Number(data.severity) || 1));
		let encrypted = null;
		if (data.callback && data.contact && data.contact.trim()) {
			const { encryptField } = await import("./crypto-D95s8H0H.mjs");
			encrypted = encryptField(data.contact.trim());
		}
		return {
			publicId: (await ingestThread({
				source: data.callback ? "anonymous_callback" : "anonymous_tip",
				turns: text ? [{
					speaker: "reporter",
					text
				}] : [{
					speaker: "reporter",
					text: `Severity ${severity} — no written note.`
				}],
				regionCode: data.region || null,
				callbackRequested: Boolean(data.callback),
				encryptedContact: encrypted,
				screenshot: Boolean(data.screenshot),
				voice: Boolean(data.voice),
				severity
			})).publicId,
			received: true
		};
	} catch (err) {
		console.error("[report] Report submission error:", err);
		throw new Error("We couldn't send this right now. Please try again.");
	}
}
//#endregion
export { handleAnonymousReport };
