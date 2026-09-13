//#region node_modules/.nitro/vite/services/ssr/assets/language-D_fIYyd4.js
var DEVANAGARI = /[\u0900-\u097F]/;
var TAMIL = /[\u0B80-\u0BFF]/;
var BENGALI = /[\u0980-\u09FF]/;
var GURMUKHI = /[\u0A00-\u0A7F]/;
var GUJARATI = /[\u0A80-\u0AFF]/;
var TELUGU = /[\u0C00-\u0C7F]/;
var KANNADA = /[\u0C80-\u0CFF]/;
var MALAYALAM = /[\u0D00-\u0D7F]/;
var MARATHI_MARKERS = /[ळऱय़]/;
var HINGLISH = [
	"hai",
	"nahi",
	"nahin",
	"kya",
	"kyun",
	"mat",
	"bata",
	"batana",
	"bhejo",
	"bhejna",
	"yaar",
	"accha",
	"achha",
	"theek",
	"tum",
	"tera",
	"meri",
	"mera",
	"aap",
	"pic",
	"photo",
	"mummy",
	"papa",
	"ghar",
	"school",
	"dost",
	"baat",
	"chalo",
	"chalte",
	"whatsapp",
	"secret",
	"rahi",
	"raha"
];
var MARATHI_LATN = [
	"ahe",
	"nahi",
	"kay",
	"tu",
	"mala",
	"sang",
	"photo",
	"ghar",
	"nako"
];
var TAMIL_LATN = [
	"illa",
	"inga",
	"unga",
	"sollu",
	"soladhe",
	"anuppu",
	"photo",
	"appa",
	"amma",
	"vera",
	"pesalam",
	"venum"
];
var BENGALI_LATN = [
	"koro",
	"kothay",
	"tumi",
	"bolish",
	"na",
	"photo",
	"pathao",
	"baba",
	"ma"
];
var TELUGU_LATN = [
	"ela",
	"undi",
	"cheppu",
	"vaddu",
	"photo",
	"pampu",
	"school",
	"nanna"
];
var KANNADA_LATN = [
	"hege",
	"ide",
	"heli",
	"beda",
	"photo",
	"kaluhisu",
	"school"
];
var MALAYALAM_LATN = [
	"entha",
	"undu",
	"parayu",
	"venda",
	"photo",
	"ayakku",
	"school"
];
var GUJARATI_LATN = [
	"shu",
	"che",
	"nahi",
	"kaho",
	"photo",
	"moklo",
	"school"
];
var PUNJABI_LATN = [
	"ki",
	"hai",
	"nahi",
	"dass",
	"photo",
	"bhej",
	"school",
	"yaar"
];
var LANG_LABELS = {
	en: "English",
	hi: "Hindi",
	"hi-Latn": "Hinglish",
	mr: "Marathi",
	"mr-Latn": "Marathi (Roman)",
	ta: "Tamil",
	"ta-Latn": "Tamil-English",
	bn: "Bengali",
	"bn-Latn": "Bengali (Roman)",
	te: "Telugu",
	"te-Latn": "Telugu (Roman)",
	kn: "Kannada",
	"kn-Latn": "Kannada (Roman)",
	ml: "Malayalam",
	"ml-Latn": "Malayalam (Roman)",
	gu: "Gujarati",
	"gu-Latn": "Gujarati (Roman)",
	pa: "Punjabi",
	"pa-Latn": "Punjabi (Roman)",
	und: "Undetermined"
};
function detectLanguage(text) {
	const t = text.trim();
	if (!t) return "und";
	if (TAMIL.test(t)) return "ta";
	if (MALAYALAM.test(t)) return "ml";
	if (KANNADA.test(t)) return "kn";
	if (TELUGU.test(t)) return "te";
	if (GUJARATI.test(t)) return "gu";
	if (GURMUKHI.test(t)) return "pa";
	if (BENGALI.test(t)) return "bn";
	if (DEVANAGARI.test(t)) return MARATHI_MARKERS.test(t) ? "mr" : "hi";
	const tokens = t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
	if (tokens.length === 0) return "und";
	const hit = (lex) => tokens.filter((w) => lex.includes(w)).length / Math.max(1, tokens.length);
	const scores = [
		["ta-Latn", hit(TAMIL_LATN)],
		["mr-Latn", hit(MARATHI_LATN)],
		["bn-Latn", hit(BENGALI_LATN)],
		["te-Latn", hit(TELUGU_LATN)],
		["kn-Latn", hit(KANNADA_LATN)],
		["ml-Latn", hit(MALAYALAM_LATN)],
		["gu-Latn", hit(GUJARATI_LATN)],
		["pa-Latn", hit(PUNJABI_LATN)],
		["hi-Latn", hit(HINGLISH)]
	];
	scores.sort((a, b) => b[1] - a[1]);
	const [best, bestScore] = scores[0];
	if (bestScore >= .12) return best;
	if ((t.match(/[A-Za-z]/g) ?? []).length > (t.match(/[^\sA-Za-z0-9.,!?'"()-]/g) ?? []).length) return "en";
	return "und";
}
//#endregion
export { detectLanguage as n, LANG_LABELS as t };
