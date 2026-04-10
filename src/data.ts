/* ══════════════════════════════════════════════════════════════
   DATA — The Day Your Child Was Born (Upgraded Quiz System)
   ══════════════════════════════════════════════════════════════ */

export interface QuizOption {
  text: string;
  type: "A" | "B" | "C" | "D";
}

export interface Question {
  q: string;
  options?: QuizOption[];
  isDate?: boolean;
  weight: number;
}

/* ── Type Labels (behavior-based ONLY) ── */
export const typeLabels: Record<string, string> = {
  A: "The Emotional Reactor",
  B: "The Internal Processor",
  C: "The High Energy Mover",
  D: "The Control Driver",
};

/* ── Type-Specific CTAs (result pages ONLY) ── */
export const typeSpecificCTAs: Record<string, string> = {
  A: "Show Me How To Calm My Child Without Escalating",
  B: "Show Me How To Help My Child Open Up",
  C: "Show Me How To Channel My Child's Energy",
  D: "Show Me How To Stop The Power Struggles",
};

/* ── Quiz Questions ── */
export const questions: Question[] = [
  {
    q: "When your child gets upset, what do they usually do first?",
    options: [
      { text: "Cry or become very emotional right away", type: "A" },
      { text: "Go quiet and pull away from everyone", type: "B" },
      { text: "Get restless, move around, or act out physically", type: "C" },
      { text: "Argue, push back, or refuse to cooperate", type: "D" },
    ],
    weight: 3,
  },
  {
    q: "How does your child handle a sudden change in plans?",
    options: [
      { text: "Gets anxious or tearful about the change", type: "A" },
      { text: "Seems fine on the surface but shuts down later", type: "B" },
      { text: "Gets excited or frustrated depending on the change", type: "C" },
      { text: "Demands to know why and pushes for control", type: "D" },
    ],
    weight: 2,
  },
  {
    q: "In a group of kids, your child is most likely to…",
    options: [
      { text: "Stay close to a trusted adult or one friend", type: "A" },
      { text: "Watch from the side before joining in", type: "B" },
      { text: "Jump right in and take charge of the game", type: "C" },
      { text: "Try to set the rules or lead the group", type: "D" },
    ],
    weight: 2,
  },
  {
    q: "When your child does not get what they want, they usually…",
    options: [
      { text: "Get deeply hurt and take it personally", type: "A" },
      { text: "Go silent and seem to shut down", type: "B" },
      { text: "Quickly move on to something else", type: "C" },
      { text: "Negotiate, argue, or find a way around it", type: "D" },
    ],
    weight: 2,
  },
  {
    q: "What best describes your child at bedtime?",
    options: [
      { text: "Needs extra comfort, closeness, or reassurance", type: "A" },
      { text: "Prefers quiet alone time before falling asleep", type: "B" },
      { text: "Still full of energy and resists winding down", type: "C" },
      { text: "Wants to control the routine their own way", type: "D" },
    ],
    weight: 1,
  },
  {
    q: "",
    isDate: true,
    weight: 0,
  },
];

/* ══════════════════════════════════════════════════════════════
   RESULT PAGE DATA — Type-Specific Descriptions
   ══════════════════════════════════════════════════════════════ */

export interface ResultData {
  emoji: string;
  /** Intro/empathy paragraphs shown right after the title */
  intro: string[];
  /** "You may notice:" bullet items */
  youMayNotice: string[];
  /** Frustration / what you've tried section */
  frustration: string[];
  /** Type-specific "does NOT tell you" items for curiosity gap */
  doesNotTellYou: string[];
  /** Testimonial for social proof */
  testimonial: {
    headline: string;
    stars: string;
    body: string;
    name: string;
  };
}

export const resultsData: Record<string, ResultData> = {
  /* ── THE EMOTIONAL REACTOR ── */
  A: {
    emoji: "🌿",
    intro: [
      "If you feel like your child's emotions go from zero to one hundred almost instantly…",
      "You're not imagining it.",
      "And you're not doing anything wrong.",
      "Some children experience the world at a much higher intensity.",
      "Small moments don't feel small to them.",
      "A minor disappointment…",
      "A change in routine…",
      "The wrong tone of voice…",
      "It all hits harder.",
      "Which is why what looks like an overreaction…",
      "Is often just overwhelm.",
    ],
    youMayNotice: [
      "They melt down quickly when things don't go as expected",
      "They struggle to calm down once upset",
      "They react strongly to things other kids brush off",
      "They need more reassurance and emotional support",
    ],
    frustration: [
      "And this is where it gets frustrating.",
      "Because you've probably tried:",
      "Being more patient",
      "Being more understanding",
      "Talking things through",
      "And sometimes…",
      "It still escalates.",
      "Not because you're doing it wrong.",
      "But because this type of child doesn't respond to logic when their nervous system is overwhelmed.",
    ],
    doesNotTellYou: [
      "What specifically triggers these reactions",
      "The exact words that calm them instantly",
      "How to guide them without causing pushback",
      "What their brain actually needs in stressful moments",
    ],
    testimonial: {
      headline:
        "\"My child used to melt down over the smallest things and I felt helpless.\"",
      stars: "★★★★★",
      body: "I thought I was doing something wrong. Once I understood her blueprint, I realized she was not overreacting. She was overwhelmed. Now I know how to calm her before it escalates. Our home feels so much more peaceful.",
      name: "Sarah M.",
    },
  },

  /* ── THE INTERNAL PROCESSOR ── */
  B: {
    emoji: "🌙",
    intro: [
      "If your child tends to shut down instead of speak up…",
      "This will feel very familiar.",
      "Some children don't express what they're feeling right away.",
      "Not because they don't have emotions.",
      "But because they process them internally first.",
    ],
    youMayNotice: [
      "They go quiet when something is wrong",
      "They struggle to explain how they feel",
      "They need time before opening up",
      "They avoid confrontation or pressure",
    ],
    frustration: [
      "And as a parent…",
      "That can feel confusing.",
      "You ask what's wrong…",
      "And get silence.",
      "You try to help…",
      "And they pull away.",
      "So you start wondering:",
      "\"Am I missing something?\"",
      "The truth is…",
      "You are not missing effort.",
      "You are missing the pattern.",
    ],
    doesNotTellYou: [
      "What specifically triggers these reactions",
      "The exact words that help them open up",
      "How to guide them without pressure",
      "What they need to feel safe communicating",
    ],
    testimonial: {
      headline:
        "\"I felt like I could not reach my child no matter what I tried.\"",
      stars: "★★★★★",
      body: "He would shut down and not talk. This helped me understand he needs space first, not pressure. Now he actually opens up to me. That changed everything.",
      name: "Jason T.",
    },
  },

  /* ── THE HIGH ENERGY MOVER ── */
  C: {
    emoji: "⚡",
    intro: [
      "If your child feels like they're always \"on\"…",
      "You're not alone.",
      "Some children are wired for constant movement, stimulation, and activity.",
      "Stillness feels unnatural to them.",
    ],
    youMayNotice: [
      "They have endless energy",
      "They struggle to sit still or focus",
      "They jump quickly from one thing to another",
      "They act before thinking",
    ],
    frustration: [
      "And it can feel exhausting.",
      "Because no matter how much structure you create…",
      "It doesn't seem to stick.",
      "You try routines.",
      "You try consistency.",
      "You try keeping them on track.",
      "And somehow…",
      "It still feels chaotic.",
      "That's not because structure doesn't work.",
      "It's because this type of child needs a different approach to how structure is applied.",
    ],
    doesNotTellYou: [
      "What actually helps them focus",
      "How to channel their energy productively",
      "What triggers their restlessness",
      "How to guide them without constant correction",
    ],
    testimonial: {
      headline: "\"My child never stopped moving and nothing worked.\"",
      stars: "★★★★★",
      body: "I used to think something was wrong. This showed me how his brain works. Now I work with his energy instead of fighting it. Everything is easier.",
      name: "Emily R.",
    },
  },

  /* ── THE CONTROL DRIVER ── */
  D: {
    emoji: "🔥",
    intro: [
      "If your child pushes back… argues… or resists being told what to do…",
      "This is going to feel very accurate.",
      "Some children have a strong internal drive for independence.",
      "They don't just want direction.",
      "They want ownership.",
    ],
    youMayNotice: [
      "They challenge instructions",
      "They resist control",
      "They want things their way",
      "They escalate when they feel forced",
    ],
    frustration: [
      "And over time…",
      "It can feel like everything turns into a battle.",
      "You try being more firm…",
      "They push harder.",
      "You try being more patient…",
      "They still resist.",
      "And you start to wonder:",
      "\"Why is everything a struggle?\"",
      "It's not because they're difficult.",
      "It's because they are wired differently.",
    ],
    doesNotTellYou: [
      "What triggers power struggles",
      "How to guide them without resistance",
      "What makes them feel respected instead of controlled",
      "How to turn conflict into cooperation",
    ],
    testimonial: {
      headline: "\"Everything felt like a battle every single day.\"",
      stars: "★★★★★",
      body: "My child pushed back on everything. I thought I needed to be stricter. Turns out I needed a different approach. Now I can guide him without constant power struggles.",
      name: "Michael D.",
    },
  },
};

/* ── Accuracy Reassurance (EXACT text — same for all types) ── */
export const accuracyReassurance = [
  "Most parents see parts of their child in more than one pattern.",
  "",
  "That's completely normal.",
  "",
  "But one pattern usually shows up more often — and that's what we've identified here.",
];

/* ── Critical Positioning (same for all types) ── */
export const criticalPositioning = [
  "This is how your child tends to respond on the surface.",
  "But there is a deeper blueprint behind these patterns.",
];

/* ── Product Transition (same for all types) ── */
export const productTransition = [
  "The quiz shows you HOW your child behaves.",
  "",
  "But your full blueprint reveals WHY.",
  "",
  "Based on the exact day your child was born.",
];

/* ── Offer Bullets ── */
export const offerBullets: string[] = [
  "Why your child melts down over small things and what is actually happening in their brain",
  "The 10 second shift that can stop emotional explosions before they start",
  "The exact phrases that calm your child in seconds instead of escalating the situation",
  "How to guide your child without triggering resistance or shutdown",
  "Why being more patient or more strict both fail with certain children",
];

/* ── Value Stack ── */
export const valueStack: string[] = [
  "Your child's full blueprint (127 page guide)",
];

export const bonuses: string[] = [
  "How to stop meltdowns without yelling or repeating yourself",
  "The exact way to connect with your child so they actually open up",
  "Simple ways to improve focus, behavior, and emotional balance naturally",
  "A step by step system to build confidence and emotional control",
];
