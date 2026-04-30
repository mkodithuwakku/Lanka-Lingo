import type { Phrase, Scenario } from "../domain/types.ts";

const beginnerPhrases: Phrase[] = [
  {
    id: "phrase-hello",
    romanizedSinhala: "ayubowan",
    sinhalaScript: "ආයුබෝවන්",
    english: "hello",
    level: 0,
    tags: ["greeting"]
  },
  {
    id: "phrase-how-are-you",
    romanizedSinhala: "kohomada?",
    sinhalaScript: "කොහොමද?",
    english: "how are you?",
    level: 0,
    tags: ["greeting", "question"]
  },
  {
    id: "phrase-im-good",
    romanizedSinhala: "mama hondin",
    sinhalaScript: "මම හොඳින්",
    english: "I am good",
    level: 0,
    tags: ["greeting", "reply"]
  },
  {
    id: "phrase-my-name",
    romanizedSinhala: "mage nama ...",
    sinhalaScript: "මගේ නම ...",
    english: "my name is ...",
    level: 1,
    tags: ["introduction"]
  },
  {
    id: "phrase-learning",
    romanizedSinhala: "mama sinhala igena gannawa",
    sinhalaScript: "මම සිංහල ඉගෙන ගන්නවා",
    english: "I am learning Sinhala",
    level: 1,
    tags: ["learning", "introduction"]
  }
];

function phrase(...ids: string[]): Phrase[] {
  return ids.map((id) => {
    const found = beginnerPhrases.find((candidate) => candidate.id === id);
    if (!found) {
      throw new Error(`Missing phrase fixture: ${id}`);
    }
    return found;
  });
}

export const initialScenarios: Scenario[] = [
  {
    id: "greeting-respectfully",
    title: "Greeting someone respectfully",
    level: 0,
    mode: "guided",
    objective: "Greet someone and ask how they are.",
    setting: "A first conversation with a Sinhala-speaking relative.",
    targetPhrases: phrase("phrase-hello", "phrase-how-are-you", "phrase-im-good"),
    culturalNotes: ["Ayubowan is respectful and works well when meeting someone."],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "introducing-yourself",
    title: "Introducing yourself",
    level: 1,
    mode: "guided",
    objective: "Say your name and explain that you are learning Sinhala.",
    setting: "Meeting a family friend.",
    targetPhrases: phrase("phrase-hello", "phrase-my-name", "phrase-learning"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "asking-how-someone-is",
    title: "Asking how someone is",
    level: 0,
    mode: "guided",
    objective: "Ask and answer a simple wellbeing question.",
    setting: "A quick phone call.",
    targetPhrases: phrase("phrase-how-are-you", "phrase-im-good"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "family-dinner",
    title: "At a family dinner",
    level: 1,
    mode: "roleplay",
    objective: "Greet relatives and respond politely.",
    setting: "Dinner with aunties, uncles, and cousins.",
    targetPhrases: phrase("phrase-hello", "phrase-im-good"),
    culturalNotes: ["Use a gentle tone when speaking with elders."],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "ordering-tea",
    title: "Ordering tea or food",
    level: 1,
    mode: "roleplay",
    objective: "Ask for a simple item politely.",
    setting: "A cafe or small shop.",
    targetPhrases: phrase("phrase-hello"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "asking-directions",
    title: "Asking for directions",
    level: 2,
    mode: "roleplay",
    objective: "Ask where something is and respond to a short answer.",
    setting: "Finding a place in Colombo.",
    targetPhrases: phrase("phrase-hello"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "buying-at-shop",
    title: "Buying something at a shop",
    level: 2,
    mode: "roleplay",
    objective: "Ask for an item and handle a price question.",
    setting: "A neighborhood shop.",
    targetPhrases: phrase("phrase-hello"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "likes-dislikes",
    title: "Saying what you like or dislike",
    level: 2,
    mode: "guided",
    objective: "Say one thing you like and one thing you do not like.",
    setting: "Casual conversation.",
    targetPhrases: phrase("phrase-im-good"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "where-you-live",
    title: "Talking about where you live",
    level: 1,
    mode: "guided",
    objective: "Say where you live and ask one follow-up.",
    setting: "Meeting someone new.",
    targetPhrases: phrase("phrase-my-name"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  },
  {
    id: "explaining-learning",
    title: "Explaining that you are learning Sinhala",
    level: 1,
    mode: "repeat-and-repair",
    objective: "Tell someone you are learning Sinhala and ask them to speak slowly.",
    setting: "A supportive practice conversation.",
    targetPhrases: phrase("phrase-learning"),
    culturalNotes: [],
    releaseStatus: "draft",
    reviewerApprovals: []
  }
];
