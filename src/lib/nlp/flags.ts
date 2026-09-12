import { containsAny, preprocess } from "./preprocess.ts";
import {
  AGE_GAP,
  AGE_PROBE,
  BENIGN_SECRECY,
  BLACKMAIL,
  DISTRESS,
  GROOMING_TRUST,
  IMAGE_REQUEST,
  INCENTIVE,
  ISOLATION,
  PII_REQUEST,
  PLATFORM_MIGRATION,
  SECRECY,
  UNWANTED,
} from "./lexicon.ts";
import type { ExtractedFlags, FlagName, ThreadTurn } from "./types.ts";

function hit(
  text: string,
  needles: readonly string[],
  benign?: readonly string[],
): string | null {
  if (benign && containsAny(text, benign)) return null;
  return containsAny(text, needles);
}

export function extractFlags(turn: string, context: ThreadTurn[] = []): ExtractedFlags {
  const p = preprocess(turn);
  const joined = `${p.gloss} ${context.map((c) => c.text).join(" ")}`;
  const hits: { flag: FlagName; label: string }[] = [];

  const push = (flag: FlagName, label: string, found: string | null) => {
    if (found) hits.push({ flag, label });
  };

  push("secrecy", "Request to hide the conversation", hit(p.gloss, SECRECY, BENIGN_SECRECY));
  push("pii_request", "Request for personal identifiers", hit(p.gloss, PII_REQUEST));
  push("image_request", "Request for photos or media", hit(p.gloss, IMAGE_REQUEST));
  push("isolation", "Attempt to cut the child off from caregivers", hit(joined, ISOLATION));
  push("incentive", "Offer of gifts, money, or game credit", hit(p.gloss, INCENTIVE));
  push("platform_migration", "Attempt to move off this platform", hit(p.gloss, PLATFORM_MIGRATION));
  push("age_gap", "Adult-minor age-gap linguistic signal", hit(joined, AGE_GAP));
  push("distress", "Distress or fear language from the reporter", hit(p.gloss, DISTRESS));
  push("age_probe", "Age or identity probing", hit(p.gloss, AGE_PROBE));
  push("trust_build", "Trust-building / special-bond language", hit(p.gloss, GROOMING_TRUST));
  push("blackmail", "Threat or blackmail language", hit(p.gloss, BLACKMAIL));

  const otherTurns = context.filter((t) => t.speaker === "other").length;
  if (otherTurns >= 4 && hit(joined, UNWANTED)) {
    push("unwanted_contact", "Repeated unwanted contact", "repeat");
  }

  const present = (f: FlagName) => hits.some((h) => h.flag === f);

  return {
    secrecy: present("secrecy"),
    pii_request: present("pii_request"),
    isolation: present("isolation"),
    incentive: present("incentive"),
    platform_migration: present("platform_migration"),
    image_request: present("image_request"),
    age_gap: present("age_gap"),
    distress: present("distress"),
    age_probe: present("age_probe"),
    trust_build: present("trust_build"),
    blackmail: present("blackmail"),
    unwanted_contact: present("unwanted_contact"),
    hits,
  };
}
