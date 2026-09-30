export interface ConversationPrompt {
  sinhala: string;
  romanized: string;
  english: string;
  replies: Array<{
    sinhala: string;
    romanized: string;
    english: string;
  }>;
}

export interface ConversationTopic {
  id: string;
  title: string;
  description: string;
  prompts: ConversationPrompt[];
}

export const conversationTopics: ConversationTopic[] = [
  {
    id: "daily-life",
    title: "Everyday life",
    description: "Talk about your day, routines, and plans.",
    prompts: [
      {
        sinhala: "අද දවස කොහොමද ගියේ?",
        romanized: "ada dawasa kohomada giye?",
        english: "How did your day go?",
        replies: [
          { sinhala: "අද දවස හොඳයි.", romanized: "ada dawasa hondai.", english: "Today was good." },
          { sinhala: "අද ටිකක් වැඩ වැඩියි.", romanized: "ada tikak weda wediyi.", english: "Today was a little busy." }
        ]
      },
      {
        sinhala: "අද උදේ මොනවද කළේ?",
        romanized: "ada ude monawada kale?",
        english: "What did you do this morning?",
        replies: [
          { sinhala: "මම වැඩ කළා.", romanized: "mama weda kala.", english: "I worked." },
          { sinhala: "මම ගෙදර හිටියා.", romanized: "mama gedara hitiya.", english: "I stayed home." }
        ]
      },
      {
        sinhala: "හෙට මොනවද කරන්න ඉන්නේ?",
        romanized: "heta monawada karanna inne?",
        english: "What are you going to do tomorrow?",
        replies: [
          { sinhala: "හෙට මම වැඩට යනවා.", romanized: "heta mama wedata yanawa.", english: "Tomorrow I am going to work." },
          { sinhala: "තවම තීරණය කරලා නැහැ.", romanized: "thawama theeranaya karala nehe.", english: "I have not decided yet." }
        ]
      }
    ]
  },
  {
    id: "family",
    title: "Family",
    description: "Talk about relatives and time together.",
    prompts: [
      {
        sinhala: "ඔයාගේ පවුලේ කවුද ඉන්නේ?",
        romanized: "oyage paule kawuda inne?",
        english: "Who is in your family?",
        replies: [
          { sinhala: "මට අක්කා කෙනෙක් ඉන්නවා.", romanized: "mata akka kenek innawa.", english: "I have an older sister." },
          { sinhala: "අපේ පවුල ටිකක් ලොකුයි.", romanized: "ape paula tikak lokuyi.", english: "Our family is fairly big." }
        ]
      },
      {
        sinhala: "ඔයා වැඩිපුරම කතා කරන්නේ කා එක්කද?",
        romanized: "oya wedipurama katha karanne ka ekkada?",
        english: "Who do you talk with most?",
        replies: [
          { sinhala: "මම වැඩිපුරම අම්මා එක්ක කතා කරනවා.", romanized: "mama wedipurama amma ekka katha karanawa.", english: "I talk with my mother most." },
          { sinhala: "මම හැමෝම එක්ක කතා කරනවා.", romanized: "mama hemoma ekka katha karanawa.", english: "I talk with everyone." }
        ]
      },
      {
        sinhala: "ඔයාලා එකට ඉන්නකොට මොනවද කරන්නේ?",
        romanized: "oyala ekata innakota monawada karanne?",
        english: "What do you do when you are together?",
        replies: [
          { sinhala: "අපි එකට කෑම කනවා.", romanized: "api ekata kema kanawa.", english: "We eat together." },
          { sinhala: "අපි ගොඩක් කතා කරනවා.", romanized: "api godak katha karanawa.", english: "We talk a lot." }
        ]
      }
    ]
  },
  {
    id: "food",
    title: "Food",
    description: "Discuss favourite meals and cooking.",
    prompts: [
      {
        sinhala: "ඔයා කන්න වැඩියෙන්ම කැමති මොනවද?",
        romanized: "oya kanna wediyenma kemathi monawada?",
        english: "What do you most like to eat?",
        replies: [
          { sinhala: "මම බත් කන්න කැමතියි.", romanized: "mama bath kanna kemathiyi.", english: "I like to eat rice." },
          { sinhala: "මම කොත්තු කන්න කැමතියි.", romanized: "mama koththu kanna kemathiyi.", english: "I like to eat kottu." }
        ]
      },
      {
        sinhala: "ඔයාට සැර කෑම කැමතිද?",
        romanized: "oyata sera kema kemathida?",
        english: "Do you like spicy food?",
        replies: [
          { sinhala: "ඔව්, මම සැර කෑමට කැමතියි.", romanized: "ow, mama sera kemata kemathiyi.", english: "Yes, I like spicy food." },
          { sinhala: "නැහැ, මට සැර වැඩියි.", romanized: "nehe, mata sera wediyi.", english: "No, it is too spicy for me." }
        ]
      },
      {
        sinhala: "ඔයා උයන්න දන්නවද?",
        romanized: "oya uyanna dannawada?",
        english: "Do you know how to cook?",
        replies: [
          { sinhala: "ඔව්, මට ටිකක් උයන්න පුළුවන්.", romanized: "ow, mata tikak uyanna puluwan.", english: "Yes, I can cook a little." },
          { sinhala: "නැහැ, ඒත් ඉගෙන ගන්න කැමතියි.", romanized: "nehe, eth igena ganna kemathiyi.", english: "No, but I would like to learn." }
        ]
      }
    ]
  },
  {
    id: "travel",
    title: "Travel",
    description: "Talk about Sri Lanka and future trips.",
    prompts: [
      {
        sinhala: "ඔයා ලංකාවේ කොහෙද යන්න කැමති?",
        romanized: "oya Lankawe koheda yanna kemathi?",
        english: "Where would you like to go in Sri Lanka?",
        replies: [
          { sinhala: "මම කොළඹ යන්න කැමතියි.", romanized: "mama Kolamba yanna kemathiyi.", english: "I would like to go to Colombo." },
          { sinhala: "මම නුවර යන්න කැමතියි.", romanized: "mama Nuwara yanna kemathiyi.", english: "I would like to go to Kandy." }
        ]
      },
      {
        sinhala: "ඔයා මුහුදු වෙරළට යන්න කැමතිද?",
        romanized: "oya muhudu weralata yanna kemathida?",
        english: "Do you like going to the beach?",
        replies: [
          { sinhala: "ඔව්, මම මුහුදට හරි කැමතියි.", romanized: "ow, mama muhudata hari kemathiyi.", english: "Yes, I really like the sea." },
          { sinhala: "මම කඳුකරයට වැඩියෙන් කැමතියි.", romanized: "mama kandukarayata wediyen kemathiyi.", english: "I prefer the hill country." }
        ]
      },
      {
        sinhala: "ගමනකට යනකොට ඔයා අරගෙන යන්නේ මොනවද?",
        romanized: "gamanakata yanakota oya aragena yanne monawada?",
        english: "What do you take when you go on a trip?",
        replies: [
          { sinhala: "මම කැමරාව අරගෙන යනවා.", romanized: "mama kemarawa aragena yanawa.", english: "I take my camera." },
          { sinhala: "මම වැඩිය දේවල් අරගෙන යන්නේ නැහැ.", romanized: "mama wadiya dewal aragena yanne nehe.", english: "I do not take many things." }
        ]
      }
    ]
  },
  {
    id: "childhood",
    title: "Childhood",
    description: "Recall games, school, and memories.",
    prompts: [
      {
        sinhala: "පොඩි කාලේ ඔයා මොනවද කරන්න කැමති වුණේ?",
        romanized: "podi kale oya monawada karanna kemathi une?",
        english: "What did you like to do as a child?",
        replies: [
          { sinhala: "මම යාළුවෝ එක්ක සෙල්ලම් කළා.", romanized: "mama yaluwo ekka sellam kala.", english: "I played with friends." },
          { sinhala: "මම පොත් කියවන්න කැමති වුණා.", romanized: "mama poth kiyawanna kemathi una.", english: "I liked to read books." }
        ]
      },
      {
        sinhala: "ඉස්කෝලේ ඔයා කැමතිම විෂය මොකක්ද?",
        romanized: "iskole oya kemathima wishaya mokakda?",
        english: "What was your favourite subject at school?",
        replies: [
          { sinhala: "මම ගණිතයට කැමති වුණා.", romanized: "mama ganithayata kemathi una.", english: "I liked mathematics." },
          { sinhala: "මම ඉතිහාසයට කැමති වුණා.", romanized: "mama ithihasayata kemathi una.", english: "I liked history." }
        ]
      },
      {
        sinhala: "පොඩි කාලේ මතකයක් කියන්න පුළුවන්ද?",
        romanized: "podi kale mathakayak kiyanna puluwanda?",
        english: "Can you share a childhood memory?",
        replies: [
          { sinhala: "මට එක ලස්සන මතකයක් තියෙනවා.", romanized: "mata eka lassana mathakayak thiyenawa.", english: "I have a lovely memory." },
          { sinhala: "මට දැන් හරියට මතක නැහැ.", romanized: "mata den hariyata mathaka nehe.", english: "I do not remember clearly now." }
        ]
      }
    ]
  }
];

export const customTopicFallback: ConversationTopic = {
  id: "custom",
  title: "Your topic",
  description: "A general conversation about the subject you chose.",
  prompts: [
    {
      sinhala: "ඒ ගැන ඔයාට හිතෙන්නේ මොකක්ද?",
      romanized: "e gena oyata hithenne mokakda?",
      english: "What do you think about that?",
      replies: [
        { sinhala: "මම ඒකට ගොඩක් කැමතියි.", romanized: "mama ekata godak kemathiyi.", english: "I like it a lot." },
        { sinhala: "මම ඒ ගැන තව හිතනවා.", romanized: "mama e gena thawa hithanawa.", english: "I am still thinking about it." }
      ]
    },
    {
      sinhala: "ඒ ගැන තව ටිකක් කියන්න.",
      romanized: "e gena thawa tikak kiyanna.",
      english: "Tell me a little more about that.",
      replies: [
        { sinhala: "ඒක මට වැදගත්.", romanized: "eka mata wedagath.", english: "It is important to me." },
        { sinhala: "ඒක විනෝදයි.", romanized: "eka winodayi.", english: "It is fun." }
      ]
    },
    {
      sinhala: "ඊළඟට ඔයා මොනවද කරන්න කැමති?",
      romanized: "eelangata oya monawada karanna kemathi?",
      english: "What would you like to do next?",
      replies: [
        { sinhala: "මම ඒක දිගටම කරන්න කැමතියි.", romanized: "mama eka digatama karanna kemathiyi.", english: "I would like to keep doing it." },
        { sinhala: "මට තවම විශ්වාස නැහැ.", romanized: "mata thawama wishwasa nehe.", english: "I am not sure yet." }
      ]
    }
  ]
};

export function getTopicById(id: string): ConversationTopic | undefined {
  return conversationTopics.find((topic) => topic.id === id);
}

export function getTopicOfTheDay(date = new Date()): ConversationTopic {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return conversationTopics[dayNumber % conversationTopics.length];
}
