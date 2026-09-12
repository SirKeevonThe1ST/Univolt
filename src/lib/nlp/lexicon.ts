/**
 * Protective lexicons. Patterns are clinical and short.
 * SYNTHETIC / DETECTIVE use only — never used to generate dialogue.
 */

export const SECRECY = [
  "don't tell", "dont tell", "do not tell", "keep this between us", "our secret",
  "keep it secret", "parents wouldn't understand", "parents wouldnt understand",
  "they don't need to know", "nobody has to know", "delete this chat",
  "mat bata", "mat batana", "mat bataana", "kisi ko mat", "gupt rakh",
  "secret rakh", "mummy papa ko mat", "ghar walon ko mat", "chhupa ke",
  "சொல்லாதே", "soladhe", "veetla solladhe", "yaarukittayum solladhe",
  "कोई मत बताना", "रहस्य", "गोपनीय", "माता पिता को मत",
] as const;

export const BENIGN_SECRECY = [
  "surprise party", "secret santa", "secret base", "birthday surprise",
  "surprise gift", "don't tell dad the cake", "dont tell dad the cake",
  "secret recipe", "project secret", "spoilers",
] as const;

export const PII_REQUEST = [
  "phone number", "mobile number", "whatsapp number", "home address",
  "school name", "which school", "where do you live", "send your number",
  "number bhejo", "address bhejo", "school ka naam", "ghar ka address",
  "roll number", "class section", "pin code", "pincode",
  "फ़ोन", "मोबाइल", "पता भेजो", "स्कूल का नाम",
  "number kudunga", "address anuppu", "school peru",
] as const;

export const IMAGE_REQUEST = [
  "send a pic", "send a photo", "send me a picture", "pic bhejo",
  "photo bhejo", "selfie bhejo", "photo anuppu", "pic anuppu",
  "send nudes", "undress", "without clothes", "body pic",
  "फोटो भेजो", "सेल्फी", "புகைப்படம் அனுப்பு",
] as const;

export const ISOLATION = [
  "your parents don't get you", "parents dont get you", "they don't understand you",
  "i'm the only one who cares", "im the only one who cares", "your friends are fake",
  "nobody else understands", "you can only trust me", "they're against you",
  "akela hai tu", "sirf main samajhta", "dost dhokha", "ghar wale nahi samajhte",
  "only i understand you", "don't listen to them", "dont listen to them",
] as const;

export const INCENTIVE = [
  "gift card", "i'll buy you", "ill buy you", "free recharge", "free game",
  "paise dunga", "gift dunga", "recharge kar dunga", "i will send money",
  "amazon voucher", "i'll pay", "ill pay", "treat dunga",
  "gift anuppuven", "money send", "₹", "rupees for you",
] as const;

export const PLATFORM_MIGRATION = [
  "move to telegram", "add me on telegram", "message me on whatsapp",
  "switch to discord", "talk on snap", "dusre app", "doosre app",
  "whatsapp pe chalte", "telegram pe aao", "instagram pe dm",
  "vera app la", "vera app la pesalam", "inkeya app",
  "leave this app", "this app is not safe to talk",
] as const;

export const GROOMING_TRUST = [
  "you can tell me anything", "you're so mature", "youre so mature",
  "older than your age", "special bond", "i care more than they do",
  "late night chat", "can't sleep thinking of you",
] as const;

export const AGE_GAP = [
  "i'm 28", "im 28", "i am 30", "i'm 24", "im 24", "i'm 32", "im 32",
  "college khatam", "i have a job", "i drive", "my wife", "my girlfriend left",
  "you're just a kid but", "youre just a kid but",
] as const;

export const EXPLOITATION = [
  "meet me alone", "akele mil", "pick you up", "come to my house",
  "don't tell anyone we met", "hotel", "send more photos",
  "if you don't i will", "if you dont i will", "i have your photos",
  "or i will post", "blackmail", "meet after school",
] as const;

export const BULLYING = [
  "nobody likes you", "loser", "ugly", "fatso", "we'll share this around",
  "well share this around", "everyone is laughing", "group se nikaal",
  "tu pagal hai", "shame you", "post this and tag", "you're worthless",
  "youre worthless", "kill your reputation", "class mein fail",
] as const;

export const DISTRESS = [
  "i want to disappear", "i can't take this", "i cant take this",
  "help me please", "i'm scared", "im scared", "dar lag raha",
  "bachao", "please help me", "i don't feel safe", "i dont feel safe",
] as const;

export const BENIGN_SCHOOL = [
  "homework", "class notes", "project", "exam", "tuition", "cricket",
  "minecraft", "roblox", "birthday", "festival", "diwali", "holi",
  "school picnic", "teacher", "assignment",
] as const;

export const AGE_PROBE = [
  "how old are you", "how old r u", "what age", "kitne saal", "kitni umar",
  "umar kya", "what school", "which school", "school kaha", "school kahaan",
  "what class", "which class", "what grade", "kaunsi class", "school peru",
  "school naam", "where do you study",
] as const;

export const BLACKMAIL = [
  "i have your photos", "i have your pictures", "i will post", "i'll post",
  "ill post", "or i will send", "everyone will see", "send more or",
  "nahi to post", "warna daal dunga", "blackmail", "i'll tell everyone",
  "ill tell everyone", "or else",
] as const;

export const UNWANTED = [
  "why aren't you replying", "why arent you replying", "answer me now",
  "i messaged you 10 times", "stop ignoring", "reply instantly",
  "abhi reply", "turant jawab",
] as const;
