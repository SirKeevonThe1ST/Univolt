import{t as e}from"./jsx-runtime-0vZSBttN.js";import{t}from"./pipeline-diagram-DG4bLO1U.js";var n=e();function r(){return(0,n.jsxs)(`article`,{className:`max-w-3xl space-y-6`,children:[(0,n.jsx)(`h1`,{className:`font-display text-3xl font-medium tracking-tight`,children:`Architecture`}),(0,n.jsx)(`p`,{className:`text-sm leading-relaxed text-ink-soft`,children:`User evidence is processed on the server: OCR / speech-to-text, then a live LLM extracts behavioural signals as structured JSON. A deterministic risk engine scores those signals. A human reviews every consequential action. AI-assisted, human-controlled.`}),(0,n.jsx)(t,{}),(0,n.jsx)(`pre`,{className:`overflow-x-auto rounded-xl border border-border bg-ink p-4 text-xs leading-relaxed text-paper`,children:`USER EVIDENCE
        ↓
FRONTEND
        ↓
SECURE SERVER / API ROUTE
        ↓
OCR / SPEECH-TO-TEXT / IMAGE PROCESSING
        ↓
LLM PROVIDER (structured JSON)
        ↓
SCHEMA VALIDATION
        ↓
DETERMINISTIC RISK ENGINE
        ↓
EXPLAINABLE SAFETY RESULT
        ↓
RESPONDER CASE
        ↓
HUMAN REVIEW`}),(0,n.jsxs)(`section`,{className:`space-y-2 text-sm text-ink-soft`,children:[(0,n.jsx)(`h2`,{className:`font-display text-xl text-ink`,children:`OpenAPI-style routes`}),(0,n.jsxs)(`ul`,{className:`space-y-1 font-mono text-xs`,children:[(0,n.jsx)(`li`,{children:`POST analyzeEvidence — live LLM analysis (no auth)`}),(0,n.jsx)(`li`,{children:`POST extractScreenshots — vision OCR reconstruction`}),(0,n.jsx)(`li`,{children:`POST transcribeVoice — speech-to-text`}),(0,n.jsx)(`li`,{children:`POST askCopilot / requestBriefing / requestWhatIf`}),(0,n.jsx)(`li`,{children:`POST /report — anonymous tip (no auth)`}),(0,n.jsx)(`li`,{children:`GET /console — priority queue (staff or demo desk)`})]})]}),(0,n.jsx)(`p`,{className:`text-xs text-muted`,children:`API keys stay on the server. The model never contacts police, parents, or authorities.`})]})}export{r as component};