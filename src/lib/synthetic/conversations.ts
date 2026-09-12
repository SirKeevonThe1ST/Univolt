import type { ThreadTurn } from "../nlp/types.ts";

/**
 * Labeled SYNTHETIC set. Clinical, short, non-graphic.
 * Used for seeding the demo queue and for false-positive tests.
 * Never used as a prompt to generate more predatory dialogue.
 */
export type SyntheticThread = {
  key: string;
  title: string;
  language: string;
  expectedBand: "low" | "med" | "high" | "critical";
  expectedLabel: string;
  region?: string;
  turns: ThreadTurn[];
};

export const SYNTHETIC_THREADS: SyntheticThread[] = [
  {
    key: "en-low-school",
    title: "EN · classmate chat about homework",
    language: "en",
    expectedBand: "low",
    expectedLabel: "benign",
    region: "MH",
    turns: [
      { speaker: "other", text: "Hey, did you finish the maths homework?" },
      { speaker: "child", text: "Almost. Can you send the class notes photo from the group?" },
      { speaker: "other", text: "Sure, I'll drop it in the class group after dinner." },
    ],
  },
  {
    key: "en-low-surprise",
    title: "EN · surprise party (false-positive candidate)",
    language: "en",
    expectedBand: "low",
    expectedLabel: "benign",
    region: "KA",
    turns: [
      { speaker: "other", text: "Don't tell dad — the surprise party is at 6. Secret Santa gifts too." },
      { speaker: "child", text: "Haha ok. I'll bring the cake." },
    ],
  },
  {
    key: "en-med-bully",
    title: "EN · group exclusion",
    language: "en",
    expectedBand: "med",
    expectedLabel: "cyberbullying_risk",
    region: "DL",
    turns: [
      { speaker: "other", text: "Nobody likes you in the group. We'll share this around so everyone is laughing." },
      { speaker: "child", text: "Please stop. I don't feel safe in that chat." },
    ],
  },
  {
    key: "en-high-groom",
    title: "EN · secrecy + isolation (SYNTHETIC)",
    language: "en",
    expectedBand: "high",
    expectedLabel: "grooming_risk",
    region: "GJ",
    turns: [
      { speaker: "other", text: "You can tell me anything. Your parents don't get you." },
      { speaker: "other", text: "This is just between us. Don't tell anyone at home." },
      { speaker: "child", text: "I don't know. Maybe." },
    ],
  },
  {
    key: "hi-latn-high",
    title: "Hinglish · photo + gift + off-platform (SYNTHETIC)",
    language: "hi-Latn",
    expectedBand: "high",
    expectedLabel: "grooming_risk",
    region: "UP",
    turns: [
      { speaker: "other", text: "Yaar tu bahut mature hai. Mummy papa ko mat batana." },
      { speaker: "other", text: "Pic bhejna, gift dunga. Whatsapp pe chalte hain." },
      { speaker: "child", text: "Nahi yaar, dar lag raha hai." },
    ],
  },
  {
    key: "ta-latn-critical",
    title: "Tamil-English · isolation + exploitation attempt (SYNTHETIC)",
    language: "ta-Latn",
    expectedBand: "critical",
    expectedLabel: "exploitation_risk",
    region: "TN",
    turns: [
      { speaker: "other", text: "Un family doesn't understand you. Soladhe veetla." },
      { speaker: "other", text: "Vera app la pesalam. Photo anuppu, I will send gift." },
      { speaker: "other", text: "Meet me alone after school. Don't tell anyone we met." },
      { speaker: "child", text: "I am scared. Please help me." },
    ],
  },
  {
    key: "hi-dev-med",
    title: "Hindi · secrecy (SYNTHETIC)",
    language: "hi",
    expectedBand: "med",
    expectedLabel: "grooming_risk",
    region: "RJ",
    turns: [
      { speaker: "other", text: "यह हमारे बीच की बात है। माता पिता को मत बताना।" },
      { speaker: "child", text: "मुझे डर लग रहा है।" },
    ],
  },
];
