import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-izQYYaFw.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-CREEghXe.js
var listCases = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cc376cb1bc11e5b6d8c51b9331f1f851d235c8f65f0cc62df3fe5ba62f48f33d"));
var getCase = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("0172ae324f36b82b7be830b5d0da3f7fe23f741ad27ae7d6d59b9751c923fdc3"));
var transitionCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("4e7f1aaffbb4654f929712d4df137eeb6014a92389a4b7a045f5124e980bed21"));
var addNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("4a9bea48585a4fb72923d1f6ebd039b97508bd7b5bb180e2598b00361bba4dbd"));
var revealIdentity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("041767d7cf8dd31fdbb4f81fcb9498ebf30bcd8ece1b6c40bbae32c2d688e245"));
var regenerateSafetyCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("fcf395f5a08d7d447d41d3745ea5847ebcc943cc88abb347dd14938a6d01b0c8"));
var exportSafetyPack = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("448282251d762627fd382b2d05ce0cae9044ef466d7a34efb06248dcc5c3879c"));
var ingestDemoThread = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("a11bf8a5eec8af5da5c03ee44feb07cf391d1e1f5841623ddc10ab4fe7fd9ef2"));
//#endregion
export { listCases as a, transitionCase as c, ingestDemoThread as i, exportSafetyPack as n, regenerateSafetyCase as o, getCase as r, revealIdentity as s, addNote as t };
