"""
SurakshaNet NLP microservice — STUB / swappable backend.

Implements the NLPProvider contract:
  classify(text, lang_hint) -> {grooming_risk, cyberbullying_risk, exploitation_risk, benign, confidence}
  detect_language(text) -> lang_code
  extract_flags(turn, context) -> flags
  explain(case) -> {top_factors, plain_summary}
  draft_safety_case(evidence, timeline) -> case_json

The live preview uses the TypeScript hybrid in src/lib/nlp/.
This service is the production-shaped sibling: same I/O, no generative
predatory dialogue, no auto-retraining.
"""

from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="SurakshaNet NLP", version="0.1.0")

SECRECY = ["don't tell", "dont tell", "mat bata", "soladhe", "our secret"]
PII = ["phone", "address", "school", "number bhejo"]
IMAGE = ["pic bhejo", "photo", "selfie"]
ISO = ["parents don't get you", "only one who cares"]
INC = ["gift", "paise", "recharge"]
MIG = ["telegram", "whatsapp pe", "vera app"]


class ClassifyIn(BaseModel):
    text: str
    lang_hint: str | None = "auto"


class FlagIn(BaseModel):
    turn: str
    context: list[str] = Field(default_factory=list)


@app.get("/health")
def health():
    return {"ok": True, "provider": "rule-hybrid-stub"}


@app.post("/classify")
def classify(body: ClassifyIn):
    t = body.text.lower()
    grooming = 0.2 * sum(w in t for w in SECRECY + ISO + MIG)
    exploit = 0.25 * sum(w in t for w in IMAGE + PII)
    bullying = 0.3 * ("nobody likes you" in t)
    benign = max(0.1, 1 - grooming - exploit - bullying)
    scores = {
        "grooming_risk": round(min(grooming, 1), 2),
        "cyberbullying_risk": round(min(bullying, 1), 2),
        "exploitation_risk": round(min(exploit, 1), 2),
        "benign": round(min(benign, 1), 2),
    }
    label = max(scores, key=scores.get)
    return {**scores, "label": label, "confidence": scores[label]}


@app.post("/detect_language")
def detect_language(body: ClassifyIn):
    t = body.text
    if any("\u0b80" <= ch <= "\u0bff" for ch in t):
        return {"lang_code": "ta"}
    if any("\u0900" <= ch <= "\u097f" for ch in t):
        return {"lang_code": "hi"}
    low = t.lower()
    if "yaar" in low or "mat " in low:
        return {"lang_code": "hi-Latn"}
    if "soladhe" in low or "anuppu" in low:
        return {"lang_code": "ta-Latn"}
    return {"lang_code": "en"}


@app.post("/extract_flags")
def extract_flags(body: FlagIn):
    t = body.turn.lower()
    flags = {
        "secrecy": any(x in t for x in SECRECY),
        "pii_request": any(x in t for x in PII),
        "image_request": any(x in t for x in IMAGE),
        "isolation": any(x in t for x in ISO),
        "incentive": any(x in t for x in INC),
        "platform_migration": any(x in t for x in MIG),
        "age_gap": False,
        "distress": "scared" in t or "help me" in t,
    }
    hits = [{"flag": k, "label": k} for k, v in flags.items() if v]
    return {**flags, "hits": hits}


@app.post("/explain")
def explain(body: dict):
    return {
        "top_factors": [{"label": "stub-hybrid", "weight": 1, "direction": "up"}],
        "plain_summary": "AI-generated stub. A human must review. No intervention decided.",
    }


@app.post("/draft_safety_case")
def draft_safety_case(body: dict):
    return {
        "ai_generated": True,
        "label": "AI-generated — human review required",
        "human_confirmation_required": True,
        "pocso_note": "SIMULATED pack — not a filing.",
        "incident_summary": body.get("summary", "See TypeScript provider for the full pack."),
    }
