import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SimMark } from "./sim-mark-BALUNCL_.mjs";
import { t as ChildChrome } from "./child-chrome-sIxOLVhT.mjs";
import { t as ResponsibleAi } from "./responsible-ai-ChLLbpAy.mjs";
import { t as PrivacyFlow } from "./privacy-flow-Cbd_D7Zf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-Dq6zy4Fc.js
var import_jsx_runtime = require_jsx_runtime();
function Privacy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimMark, { children: "Protective system · human confirmation required" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl font-medium tracking-tight",
					children: "Privacy & law notes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-ink-soft leading-relaxed",
					children: "SurakshaNet is a protective, detective system. It is not a court, not a police desk, and not a substitute for Childline 1098 or a POCSO filing."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyFlow, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsibleAi, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "What we keep — and what we refuse"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Anonymous tips store no IP address, email, or device identifier." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Message text is NER-redacted (phones, emails, Aadhaar-like numbers, names) before storage." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Original text is hashed, not stored. Screenshots and voice notes are sealed vault references, never displayed." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Callback numbers live in a separate identity table, AES-256-GCM encrypted (simulated KMS), sealed by default." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Identity reveal, authority escalation, and purge require an explicit human confirm." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Access to cases is logged (who, what, when) without copying message bodies into logs." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "DPDP Act 2023"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-ink-soft",
					children: "Children’s data is treated as needing verifiable parental consent in production deployments. This preview uses purpose limitation (safety response only), data minimisation (redaction + hashes), storage limitation (configurable retention + purge), and access control (RBAC). Lawful processing for protection of children is a documented organisational decision — not something the model makes."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "POCSO evidentiary alignment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-ink-soft",
					children: [
						"Export packs are labeled ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SIMULATED" }),
						". They are not Section 65B certificates, not hash-chained e-evidence, and not a complaint under the Protection of Children from Sexual Offences Act. A designated officer must review, confirm, and file through real channels. Agency integrations in this build are stubs."
					]
				})]
			})
		]
	}) });
}
//#endregion
export { Privacy as component };
