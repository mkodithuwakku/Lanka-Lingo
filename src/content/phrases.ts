import { conversationTopics } from "./topics.ts";

export interface StarterPhrase {
  id: string;
  sinhala: string;
  romanized: string;
  english: string;
  keywords: string[];
}

export const starterPhrases: StarterPhrase[] = [
  {
    id: "how-are-you",
    sinhala: "කොහොමද?",
    romanized: "kohomada?",
    english: "How are you?",
    keywords: ["how are you", "how are you doing"]
  },
  {
    id: "i-am-well",
    sinhala: "මම හොඳින් ඉන්නවා.",
    romanized: "mama hondin innawa.",
    english: "I am doing well.",
    keywords: ["i am good", "i'm good", "doing well", "i am well"]
  },
  {
    id: "learning-sinhala",
    sinhala: "මම සිංහල ඉගෙන ගන්නවා.",
    romanized: "mama sinhala igena gannawa.",
    english: "I am learning Sinhala.",
    keywords: ["learning sinhala", "learn sinhala"]
  },
  {
    id: "say-again",
    sinhala: "ආයෙත් කියන්න පුළුවන්ද?",
    romanized: "aayeth kiyanna puluwanda?",
    english: "Can you say that again?",
    keywords: ["say that again", "repeat", "say it again", "can you repeat that", "can you say that again", "please tell me how to say that again"]
  },
  {
    id: "speak-slowly",
    sinhala: "ටිකක් හෙමින් කතා කරන්න පුළුවන්ද?",
    romanized: "tikak hemin katha karanna puluwanda?",
    english: "Can you speak a little more slowly?",
    keywords: ["speak slowly", "more slowly", "slow down", "can you speak slowly", "can you slow down", "please speak slowly"]
  },
  {
    id: "what-does-mean",
    sinhala: "ඒකේ තේරුම මොකක්ද?",
    romanized: "eke theruma mokakda?",
    english: "What does that mean?",
    keywords: ["what does that mean", "what is the meaning"]
  },
  {
    id: "where-bathroom",
    sinhala: "වැසිකිළිය කොහෙද?",
    romanized: "wesikiliya koheda?",
    english: "Where is the bathroom?",
    keywords: ["where is the bathroom", "bathroom", "washroom"]
  },
  {
    id: "tea-please",
    sinhala: "මට තේ එකක් දෙන්න, කරුණාකරලා.",
    romanized: "mata the ekak denna, karunakarala.",
    english: "Please give me a tea.",
    keywords: ["tea please", "a tea", "give me tea", "order tea"]
  }
];

export interface LibraryPhrase extends StarterPhrase {
  category: string;
}

// Reuse the existing content instead of inventing unreviewed translations.
export const phraseLibrary: LibraryPhrase[] = [
  ...starterPhrases.map((phrase) => ({ ...phrase, category: "Everyday essentials" })),
  ...conversationTopics.flatMap((topic) => topic.prompts.flatMap((prompt, promptIndex) =>
    prompt.replies.map((reply, replyIndex) => ({
      ...reply,
      id: `${topic.id}-${promptIndex}-${replyIndex}`,
      keywords: [],
      category: topic.title
    }))
  ))
];

export function stripEnglishHelpPrefix(input: string): string {
  const framed = /^\s*(how\s+do\s+i\s+say|how\s+would\s+i\s+say|what(?:['’]s|\s+is)\s+the\s+sinhala\s+for)\s+/i;
  const hasFrame = framed.test(input);
  let result = input.replace(framed, "").trim();
  result = result.replace(/\s+in sinhala\s*[?.!]*$/i, "");
  if (hasFrame && !/say (?:that |it )?again[?.!]*$/i.test(result)) {
    result = result.replace(/\s+again\s*[?.!]*$/i, "");
  }
  return result.trim();
}

function normalizeEnglish(input: string): string {
  return stripEnglishHelpPrefix(input).toLowerCase().replace(/[’']/g, "'")
    .replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ").trim();
}

export function findStarterPhrase(input: string): LibraryPhrase | undefined {
  const normalized = normalizeEnglish(input);
  return phraseLibrary.find((phrase) =>
    [phrase.english, ...phrase.keywords].some((candidate) => normalizeEnglish(candidate) === normalized)
  );
}

export function searchPhraseLibrary(query: string, category = "All phrases"): LibraryPhrase[] {
  const terms = query.normalize("NFC").toLowerCase().trim().split(/\s+/).filter(Boolean);
  return phraseLibrary.filter((phrase) => {
    const haystack = [phrase.english, phrase.romanized, phrase.sinhala, ...phrase.keywords]
      .join(" ").normalize("NFC").toLowerCase();
    return (category === "All phrases" || phrase.category === category) && terms.every((term) => haystack.includes(term));
  });
}
