import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-izQYYaFw.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-DaO-qIdF.js
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("40d717d7faa7e364391652b9a6420cf9b0725fbf000d5eba79ca2e35c6efb7dd"));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d434201e67e79c16af943b1897bdcc7d6935045ed8273ca6652ab2b486a60e6b"));
var getScoringConfig = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e1d29b527c2e795e3d7e4b907f4ad3e5ae707a593743c447e92fdc720c92ae58"));
var updateScoringConfig = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("dee190dc2c50b444d6b1576d366c04b64c7f9b1fbd6853789d40159684297911"));
var purgeDueCases = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("bca203d7512086d4a110c2c12d98722fbfb3b360405e6eee1c0adb543903a501"));
//#endregion
export { updateScoringConfig as a, purgeDueCases as i, getScoringConfig as n, listAudit as r, getAnalytics as t };
