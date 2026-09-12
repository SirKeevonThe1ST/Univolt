import type { AnalysisLang, DemoMessage, Severity, ThreatKind } from "./types";

export type ScenarioPack = {
  kind: ThreatKind;
  severity: Severity;
  lang: AnalysisLang;
  title: string;
  messages: DemoMessage[];
  normalized: string;
};

const GROOM_EN: DemoMessage[] = [
  { speaker: "other", text: "What's your name?", day: "Day 1", gloss: "Asks the child's name." },
  { speaker: "child", text: "why do you want to know?", day: "Day 1" },
  { speaker: "other", text: "What school do you go to?", day: "Day 3", gloss: "Asks for the school name." },
  { speaker: "other", text: "Do your parents check your phone?", day: "Day 5", gloss: "Checks whether trusted adults can see the chat." },
  { speaker: "other", text: "Don't tell anyone we're talking.", day: "Day 7", gloss: "Asks the child to keep the chat secret." },
  { speaker: "other", text: "Send me a picture.", day: "Day 8", gloss: "Asks for a private image." },
];

const GROOM_HI_LATN: DemoMessage[] = [
  { speaker: "other", text: "kya kar rahi ho?", day: "Day 1", gloss: "What are you doing?" },
  { speaker: "child", text: "homework. tum kaun ho?", day: "Day 1", gloss: "Homework. Who are you?" },
  { speaker: "other", text: "school kaha hai?", day: "Day 3", gloss: "Where is your school?" },
  { speaker: "other", text: "mummy papa phone check karte hain kya?", day: "Day 5", gloss: "Do your parents check your phone?" },
  { speaker: "other", text: "kisi ko mat batana", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "photo bhejo", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_HI: DemoMessage[] = [
  { speaker: "other", text: "तुम कितने साल की हो?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "child", text: "क्यों पूछ रहे हो?", day: "Day 1", gloss: "Why are you asking?" },
  { speaker: "other", text: "स्कूल कहाँ है?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "माता-पिता फ़ोन देखते हैं?", day: "Day 5", gloss: "Do parents check the phone?" },
  { speaker: "other", text: "किसी को मत बताना", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "फ़ोटो भेजो", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_MR: DemoMessage[] = [
  { speaker: "other", text: "तू किती वर्षांची आहेस?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "शाळा कुठे आहे?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "आई-बाबांना सांगू नकोस", day: "Day 7", gloss: "Don't tell your parents." },
  { speaker: "other", text: "फोटो पाठव", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_BN: DemoMessage[] = [
  { speaker: "other", text: "তোর বয়স কত?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "স্কুল কোথায়?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "কাউকে বলিস না", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "ছবি পাঠা", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_TA: DemoMessage[] = [
  { speaker: "other", text: "உன் வயசு என்ன?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "ஸ்கூல் எங்க?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "யாருக்கும் சொல்லாதே", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "போட்டோ அனுப்பு", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_TE: DemoMessage[] = [
  { speaker: "other", text: "నీ వయసు ఎంత?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "స్కూల్ ఎక్కడ?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "ఎవరికీ చెప్పకు", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "ఫోటో పంపు", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_KN: DemoMessage[] = [
  { speaker: "other", text: "ನಿನ್ನ ವಯಸ್ಸು ಎಷ್ಟು?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "ಶಾಲೆ ಎಲ್ಲಿ?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "ಯಾರಿಗೂ ಹೇಳಬೇಡ", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "ಫೋಟೋ ಕಳುಹಿಸು", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_ML: DemoMessage[] = [
  { speaker: "other", text: "നിന്റെ വയസ്സ് എത്ര?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "സ്കൂൾ എവിടെ?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "ആരോടും പറയരുത്", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "ഫോട്ടോ അയക്ക്", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_GU: DemoMessage[] = [
  { speaker: "other", text: "તારી ઉંમર કેટલી છે?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "સ્કૂલ ક્યાં છે?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "કોઈને કહેતો નહીં", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "ફોટો મોકલ", day: "Day 8", gloss: "Send a photo." },
];

const GROOM_PA: DemoMessage[] = [
  { speaker: "other", text: "ਤੇਰੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?", day: "Day 1", gloss: "How old are you?" },
  { speaker: "other", text: "ਸਕੂਲ ਕਿੱਥੇ ਹੈ?", day: "Day 3", gloss: "Where is the school?" },
  { speaker: "other", text: "ਕਿਸੇ ਨੂੰ ਨਾ ਦੱਸੀਂ", day: "Day 7", gloss: "Don't tell anyone." },
  { speaker: "other", text: "ਫੋਟੋ ਭੇਜ", day: "Day 8", gloss: "Send a photo." },
];

const GROOM: Record<AnalysisLang, DemoMessage[]> = {
  en: GROOM_EN,
  hi: GROOM_HI,
  "hi-Latn": GROOM_HI_LATN,
  mr: GROOM_MR,
  bn: GROOM_BN,
  ta: GROOM_TA,
  te: GROOM_TE,
  kn: GROOM_KN,
  ml: GROOM_ML,
  gu: GROOM_GU,
  pa: GROOM_PA,
};

const BULLY_EN: DemoMessage[] = [
  { speaker: "other", text: "nobody likes you in the group", day: "Day 1", gloss: "Group exclusion." },
  { speaker: "other", text: "we'll share this around so everyone is laughing", day: "Day 3", gloss: "Threat to circulate humiliation." },
  { speaker: "child", text: "please stop. I don't feel safe in that chat", day: "Day 3" },
  { speaker: "other", text: "too late. everyone already saw it", day: "Day 5", gloss: "Continues after the child asks to stop." },
];

const BLACKMAIL_EN: DemoMessage[] = [
  { speaker: "other", text: "i still have that picture you sent last week", day: "Day 1", gloss: "Claims to hold an image." },
  { speaker: "other", text: "send more or i will post it", day: "Day 3", gloss: "Threatens to publish unless more images are sent." },
  { speaker: "child", text: "please don't. i'm scared", day: "Day 3" },
  { speaker: "other", text: "then do what i say and don't tell anyone", day: "Day 5", gloss: "Pairs coercion with secrecy." },
];

const THREAT_EN: DemoMessage[] = [
  { speaker: "other", text: "i know where your school is", day: "Day 1", gloss: "Claims knowledge of location." },
  { speaker: "other", text: "if you tell a teacher i will wait outside", day: "Day 3", gloss: "Threat tied to disclosure." },
  { speaker: "child", text: "leave me alone", day: "Day 3" },
];

const SUSPICIOUS_EN: DemoMessage[] = [
  { speaker: "other", text: "you seem mature for your class", day: "Day 1", gloss: "Age-inappropriate compliment." },
  { speaker: "other", text: "want to talk somewhere else? this app is boring", day: "Day 3", gloss: "Suggests moving off-platform." },
  { speaker: "child", text: "i don't think so", day: "Day 3" },
];

function clone(kind: ThreatKind, lang: AnalysisLang, messages: DemoMessage[]): ScenarioPack {
  return {
    kind,
    severity: kind === "suspicious" ? "medium" : kind === "cyberbullying" ? "high" : "critical",
    lang,
    title: `${kind} · ${lang}`,
    messages,
    normalized: messages
      .filter((m) => m.gloss)
      .map((m) => `${m.text} → ${m.gloss}`)
      .join(" · "),
  };
}

export function getScenario(kind: ThreatKind, lang: AnalysisLang, severity: Severity): ScenarioPack {
  if (kind === "grooming") {
    const pack = clone("grooming", lang, GROOM[lang] ?? GROOM.en);
    pack.severity = severity;
    pack.normalized =
      "The other account probes identity and school, checks whether parents can see the phone, asks for secrecy, then requests a picture.";
    return pack;
  }
  if (kind === "cyberbullying") {
    const pack = clone("cyberbullying", lang, lang === "en" ? BULLY_EN : localizeFallback(BULLY_EN, lang));
    pack.severity = severity;
    pack.normalized = "A group chat is used to exclude, humiliate, and continue after the child asks to stop.";
    return pack;
  }
  if (kind === "blackmail") {
    const pack = clone("blackmail", lang, lang === "en" ? BLACKMAIL_EN : localizeFallback(BLACKMAIL_EN, lang));
    pack.severity = severity;
    pack.normalized = "The other account claims to hold an image and threatens to publish it unless more are sent, while demanding secrecy.";
    return pack;
  }
  if (kind === "threat") {
    const pack = clone("threat", lang, lang === "en" ? THREAT_EN : localizeFallback(THREAT_EN, lang));
    pack.severity = severity;
    pack.normalized = "The other account claims knowledge of the school and threatens contact if the child tells a trusted adult.";
    return pack;
  }
  const pack = clone("suspicious", lang, lang === "en" ? SUSPICIOUS_EN : localizeFallback(SUSPICIOUS_EN, lang));
  pack.severity = severity;
  pack.normalized = "Compliment about maturity plus an attempt to move the conversation off this platform.";
  return pack;
}

function localizeFallback(en: DemoMessage[], lang: AnalysisLang): DemoMessage[] {
  if (lang === "hi-Latn") {
    return en.map((m) => ({ ...m, text: m.gloss ? `${m.gloss} (demo mix)` : m.text }));
  }
  return en;
}

export const DEFAULT_GROOMING = getScenario("grooming", "en", "critical");
