import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Lock, Shield, Sparkles, X, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../convex/_generated/api";
import {
  accuracyReassurance,
  bonuses,
  criticalPositioning,
  offerBullets,
  productTransition,
  questions,
  resultsData,
  typeLabels,
  typeSpecificCTAs,
  valueStack,
} from "./data";

type Screen =
  | "landing"
  | "pre-quiz-email"
  | "quiz"
  | "loading"
  | "results"
  | "offer";
type Scores = { A: number; B: number; C: number; D: number };
type TypeKey = "A" | "B" | "C" | "D";

/* ── Per-question selection tracking for scoring ── */
interface QuestionSelection {
  primary: TypeKey | null;
  secondary: TypeKey | null;
}

const CHECKOUT_URL = "https://thedayofbirth.mysamcart.com/the-day-your-child-was-born-es5no/";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

/* ═══════════════════════════ SCROLL RESET ═══════════════════════════ */

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    // Double-fire after AnimatePresence exit to ensure we're at top
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 50);
    return () => clearTimeout(t);
  }, []);
}

/* ═══════════════════════════ SCORING SYSTEM ═══════════════════════════ */

/**
 * Calculate final weighted scores.
 * Primary selection = +2 points × question weight
 * Secondary selection = +1 point × question weight
 */
function calculateWeightedScores(selections: QuestionSelection[]): Scores {
  const scores: Scores = { A: 0, B: 0, C: 0, D: 0 };
  const quizQuestions = questions.filter((q) => !q.isDate);

  quizQuestions.forEach((q, idx) => {
    const sel = selections[idx];
    if (!sel) return;
    if (sel.primary) {
      scores[sel.primary] += 2 * q.weight;
    }
    if (sel.secondary) {
      scores[sel.secondary] += 1 * q.weight;
    }
  });

  return scores;
}

/**
 * Get primary and secondary types with tie-breaking:
 * 1. Count PRIMARY selections only
 * 2. If still tied, prioritize earlier weighted questions
 */
function getResultTypes(
  scores: Scores,
  selections: QuestionSelection[]
): { primary: TypeKey; secondary: TypeKey } {
  const types: TypeKey[] = ["A", "B", "C", "D"];

  // Count primary selections per type
  const primaryCounts: Record<TypeKey, number> = { A: 0, B: 0, C: 0, D: 0 };
  selections.forEach((sel) => {
    if (sel.primary) primaryCounts[sel.primary]++;
  });

  // Calculate earliest weighted question index for each type (lower = earlier = higher priority)
  const earliestQuestion: Record<TypeKey, number> = { A: 999, B: 999, C: 999, D: 999 };
  selections.forEach((sel, idx) => {
    if (sel.primary && idx < earliestQuestion[sel.primary]) {
      earliestQuestion[sel.primary] = idx;
    }
  });

  // Sort by: score desc → primary count desc → earliest question asc
  const sorted = [...types].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    if (primaryCounts[b] !== primaryCounts[a]) return primaryCounts[b] - primaryCounts[a];
    return earliestQuestion[a] - earliestQuestion[b];
  });

  return { primary: sorted[0], secondary: sorted[1] };
}

/* ═══════════════════════════ SOCIAL PROOF ═══════════════════════════ */

const PROOF_NAMES = [
  "Joseph C.", "Patricia R.", "Tina A.", "Marcus W.", "Stephanie L.",
  "Daniel M.", "Heather K.", "Brian S.", "Amanda J.", "Kevin P.",
  "Rachel F.", "Chris B.", "Lisa N.", "Andrew T.", "Jennifer H.",
  "Robert G.", "Michelle E.", "David Y.", "Nicole V.", "James O.",
];

const PROOF_PHRASES = [
  "just unlocked their child's blueprint",
  "just discovered their child's type",
  "just started understanding their child",
];

function SocialProofPopups({ active }: { active: boolean }) {
  const [current, setCurrent] = useState<{ name: string; phrase: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const usedNames = useRef<Set<string>>(new Set());
  const showCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNext = useCallback(() => {
    if (showCount.current >= 5) return;

    const available = PROOF_NAMES.filter((n) => !usedNames.current.has(n));
    if (available.length === 0) return;

    const name = available[Math.floor(Math.random() * available.length)];
    const phrase = PROOF_PHRASES[Math.floor(Math.random() * PROOF_PHRASES.length)];
    usedNames.current.add(name);
    showCount.current++;

    setCurrent({ name, phrase });
    setVisible(true);

    setTimeout(() => setVisible(false), 4000);

    const next = 45000 + Math.random() * 45000;
    timerRef.current = setTimeout(showNext, next);
  }, []);

  useEffect(() => {
    if (!active) return;
    const initial = 15000 + Math.random() * 15000;
    timerRef.current = setTimeout(showNext, initial);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, showNext]);

  if (!current) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-40 bg-white shadow-lg border border-[#EEE] rounded-lg px-4 py-3 max-w-[280px]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2F4F3F]/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#2F4F3F]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A1A1A] leading-tight">
                {current.name}
              </p>
              <p className="text-xs text-[#888] leading-tight mt-0.5">
                {current.phrase}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════ BEHAVIORAL TRIGGERS ═══════════════════════════ */

interface SlideUpProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  hasStickyCta?: boolean;
}

function SlideUp({ children, visible, onClose, hasStickyCta }: SlideUpProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35 }}
          className={`fixed left-3 right-3 z-[45] bg-white shadow-xl border border-[#E5E5E5] rounded-xl p-5 ${
            hasStickyCta ? "bottom-[88px] md:bottom-6" : "bottom-4"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-[#BBB] hover:text-[#666] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useBehavioralTriggers(screen: Screen) {
  const [exitIntent, setExitIntent] = useState(false);
  const [engagementNudge, setEngagementNudge] = useState(false);
  const [checkoutHesitation, setCheckoutHesitation] = useState(false);
  const [quizAbandonment, setQuizAbandonment] = useState(false);

  const exitFired = useRef(false);
  const engageFired = useRef(false);
  const checkoutFired = useRef(false);
  const quizFired = useRef(false);
  const lastTriggerTime = useRef(0);

  const canTrigger = () => Date.now() - lastTriggerTime.current > 30000;

  const fire = (setter: (v: boolean) => void) => {
    lastTriggerTime.current = Date.now();
    setter(true);
  };

  useEffect(() => {
    if (screen === "quiz" || screen === "loading" || exitFired.current) return;

    let lastY = window.scrollY;
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!exitFired.current && canTrigger()) {
          exitFired.current = true;
          fire(setExitIntent);
        }
      }, 45000);
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = lastY - currentY;
      lastY = currentY;

      if (delta > 300 && currentY > 200 && !exitFired.current && canTrigger()) {
        exitFired.current = true;
        fire(setExitIntent);
      }
      resetInactivity();
    };

    const onTouch = () => resetInactivity();

    resetInactivity();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("click", onTouch);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("click", onTouch);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "results" && screen !== "offer") return;
    if (engageFired.current) return;

    let idleTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const pct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (pct > 0.5 && !engageFired.current && canTrigger()) {
        engageFired.current = true;
        fire(setEngagementNudge);
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!engageFired.current && canTrigger()) {
          engageFired.current = true;
          fire(setEngagementNudge);
        }
      }, 60000);
    };

    idleTimer = setTimeout(() => {
      if (!engageFired.current && canTrigger()) {
        engageFired.current = true;
        fire(setEngagementNudge);
      }
    }, 60000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "offer" || checkoutFired.current) return;

    const timer = setTimeout(() => {
      if (!checkoutFired.current && canTrigger()) {
        checkoutFired.current = true;
        fire(setCheckoutHesitation);
      }
    }, 20000);

    const onClick = () => {
      clearTimeout(timer);
    };

    window.addEventListener("click", onClick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", onClick);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "quiz" || quizFired.current) return;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!quizFired.current) {
          quizFired.current = true;
          fire(setQuizAbandonment);
        }
      }, 30000);
    };

    reset();
    window.addEventListener("click", reset);
    window.addEventListener("touchstart", reset, { passive: true });
    window.addEventListener("scroll", reset, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", reset);
      window.removeEventListener("touchstart", reset);
      window.removeEventListener("scroll", reset);
    };
  }, [screen]);

  return {
    exitIntent,
    setExitIntent,
    engagementNudge,
    setEngagementNudge,
    checkoutHesitation,
    setCheckoutHesitation,
    quizAbandonment,
    setQuizAbandonment,
  };
}

/* ═══════════════════════════ APP ═══════════════════════════ */

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [scores, setScores] = useState<Scores>({ A: 0, B: 0, C: 0, D: 0 });
  const [selections, setSelections] = useState<QuestionSelection[]>([]);
  const [email, setEmail] = useState("");
  const [_leadId, setLeadId] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");

  const saveLead = useMutation(api.leads.saveLead);
  const saveQuizResults = useMutation(api.leads.saveQuizResults);

  const resultTypes = getResultTypes(scores, selections);

  const triggers = useBehavioralTriggers(screen);
  const showSocialProof = screen === "results" || screen === "offer";
  const showStickyCta = screen === "results" || screen === "offer";

  const goToOffer = () => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setScreen("offer");
  };
  const goToQuiz = () => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setScreen("quiz");
  };

  const handleSaveEmail = async (stage: string) => {
    if (email) {
      try {
        const id = await saveLead({
          email,
          stage,
          ...(scores.A + scores.B + scores.C + scores.D > 0
            ? { quizScores: scores, primaryType: resultTypes.primary }
            : {}),
          ...(birthDate ? { birthDate } : {}),
        });
        setLeadId(id as unknown as string);
      } catch {
        /* silent */
      }
    }
  };

  const handleQuizComplete = async (
    s: Scores,
    sels: QuestionSelection[],
    date: string
  ) => {
    setScores(s);
    setSelections(sels);
    setBirthDate(date);
    setScreen("loading");
    const rt = getResultTypes(s, sels);
    try {
      await saveQuizResults({
        quizScores: s,
        primaryType: rt.primary,
        ...(date ? { birthDate: date } : {}),
      });
    } catch {
      /* silent */
    }
  };

  const openCheckout = () => {
    if (CHECKOUT_URL) window.open(CHECKOUT_URL, "_blank");
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <LandingScreen key="l" onStart={() => setScreen("pre-quiz-email")} />
        )}
        {screen === "pre-quiz-email" && (
          <PreQuizEmailScreen
            key="e"
            email={email}
            setEmail={setEmail}
            onNext={() => {
              handleSaveEmail("pre-quiz");
              setScreen("quiz");
            }}
            onSkip={() => setScreen("quiz")}
          />
        )}
        {screen === "quiz" && (
          <QuizScreen key="q" onComplete={handleQuizComplete} />
        )}
        {screen === "loading" && (
          <LoadingScreen key="ld" onComplete={() => setScreen("results")} />
        )}
        {screen === "results" && (
          <ResultsScreen
            key="r"
            scores={scores}
            selections={selections}
            email={email}
            setEmail={setEmail}
            onSaveEmail={() => handleSaveEmail("post-results")}
            onNext={() => setScreen("offer")}
          />
        )}
        {screen === "offer" && <OfferScreen key="o" onCheckout={openCheckout} />}
      </AnimatePresence>

      {/* Social proof popups */}
      <SocialProofPopups active={showSocialProof} />

      {/* Sticky CTA — only on offer page (global CTA rules) */}
      {showStickyCta && screen === "offer" && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#EEE] px-5 py-3 z-50">
          <CtaButton onClick={openCheckout} className="w-full mb-1.5">
            Get My Child's Full Blueprint Now - $47
          </CtaButton>
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#999]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secure
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> Instant
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Safe
            </span>
          </div>
        </div>
      )}

      {/* ── TRIGGER 1: Exit Intent ── */}
      <SlideUp
        visible={triggers.exitIntent}
        onClose={() => triggers.setExitIntent(false)}
        hasStickyCta={showStickyCta && screen === "offer"}
      >
        <div className="pr-4">
          <p className="text-sm font-bold text-[#1A1A1A] mb-2">
            WAIT... before you go...
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-1">
            If you're even a little unsure about your child...
          </p>
          <p className="text-sm leading-[1.6] text-[#333] font-semibold mb-3">
            This might be the most important thing you see today.
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-1">
            Right now, you're still guessing.
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-1">
            And that feeling? It doesn't go away on its own.
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-3">
            But in the next few minutes... you could finally understand what
            your child actually needs from you.
          </p>
          <div className="flex flex-col gap-2 mt-3">
            <CtaButton onClick={() => { triggers.setExitIntent(false); goToOffer(); }} className="text-sm">
              Show Me My Child's Blueprint
            </CtaButton>
            <button
              onClick={() => triggers.setExitIntent(false)}
              className="text-sm text-[#999] py-2"
            >
              Close
            </button>
          </div>
        </div>
      </SlideUp>

      {/* ── TRIGGER 2: Engagement Nudge ── */}
      <SlideUp
        visible={triggers.engagementNudge}
        onClose={() => triggers.setEngagementNudge(false)}
        hasStickyCta={showStickyCta && screen === "offer"}
      >
        <div className="pr-4">
          <p className="text-xs font-semibold text-[#D4725C] uppercase tracking-wider mb-2">
            Quick reminder
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-1">
            You're not doing anything wrong.
          </p>
          <p className="text-sm leading-[1.6] text-[#333] font-semibold mb-3">
            You're just missing the one thing most parents never get...
          </p>
          <p className="text-sm leading-[1.6] text-[#666]">
            A clear way to understand how their child is wired.
          </p>
          <button
            onClick={() => triggers.setEngagementNudge(false)}
            className="text-xs text-[#999] mt-3 py-1"
          >
            Close
          </button>
        </div>
      </SlideUp>

      {/* ── TRIGGER 3: Checkout Hesitation ── */}
      <SlideUp
        visible={triggers.checkoutHesitation}
        onClose={() => triggers.setCheckoutHesitation(false)}
        hasStickyCta={true}
      >
        <div className="pr-4">
          <p className="text-sm font-bold text-[#1A1A1A] mb-2">
            Still thinking it over?
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-1">
            That's completely normal.
          </p>
          <p className="text-sm leading-[1.6] text-[#333] font-semibold mb-3">
            But just imagine how it will feel... to finally understand your
            child instead of guessing.
          </p>
          <CtaButton
            onClick={() => { triggers.setCheckoutHesitation(false); openCheckout(); }}
            className="text-sm w-full"
          >
            Get My Child's Full Blueprint Now
          </CtaButton>
        </div>
      </SlideUp>

      {/* ── TRIGGER 4: Quiz Abandonment ── */}
      <SlideUp
        visible={triggers.quizAbandonment}
        onClose={() => triggers.setQuizAbandonment(false)}
        hasStickyCta={false}
      >
        <div className="pr-4">
          <p className="text-sm font-bold text-[#1A1A1A] mb-2">
            Almost there...
          </p>
          <p className="text-sm leading-[1.6] text-[#666] mb-1">
            Your child's results are just a few questions away.
          </p>
          <p className="text-sm leading-[1.6] text-[#333] font-semibold mb-3">
            Most parents say this is the moment everything starts to make sense.
          </p>
          <CtaButton onClick={() => { triggers.setQuizAbandonment(false); goToQuiz(); }} className="text-sm w-full">
            Finish My Child's Results
          </CtaButton>
        </div>
      </SlideUp>
    </div>
  );
}

/* ═══════════════════════════ CTA BUTTON ═══════════════════════════ */

function CtaButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#D4725C] hover:bg-[#C4624C] text-white font-semibold rounded-full min-h-[48px] px-8 py-3.5 text-base transition-colors duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════ LANDING ═══════════════════════════ */

function LandingScreen({ onStart }: { onStart: () => void }) {
  useScrollToTop();

  return (
    <motion.div {...fade}>
      {/* ── Hero (centered) ── */}
      <section className="bg-[#2F4F3F] text-white">
        <div className="max-w-xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-white/50 mb-8">
            60-Second Quiz
          </p>

          <p className="text-base leading-[1.6] text-white/70 mb-6">
            If you've ever thought...
          </p>

          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-[40px] font-bold leading-[1.2] text-white mb-10">
            "Why does nothing I try seem to work with THIS child?"
          </h1>

          <p className="text-lg leading-[1.6] text-white/60 mb-10">
            You're not alone.
          </p>

          <CtaButton onClick={onStart}>
            Take the Free Quiz
            <ChevronRight className="w-4 h-4" />
          </CtaButton>
        </div>
      </section>

      {/* ── Empathy (centered) ── */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-[1.2] text-[#1A1A1A] mb-10">
            Same home. Same parents. Same love.
          </h2>

          <p className="text-base leading-[1.6] text-[#666] mb-2">
            So why does one child listen...
          </p>
          <p className="text-base leading-[1.6] text-[#666] mb-8">
            while the other pushes back, shuts down, or explodes?
          </p>

          <p className="text-lg font-semibold text-[#D4725C] mb-2">
            That's not random.
          </p>
          <p className="text-lg font-semibold text-[#D4725C]">
            And it's not your fault.
          </p>
        </div>
      </section>

      {/* ── Pain points (left-aligned) ── */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-5 mb-12">
            <p className="text-base leading-[1.6] text-[#333]">
              <span className="font-semibold">You try being more patient</span>... it doesn't work.
            </p>
            <p className="text-base leading-[1.6] text-[#333]">
              <span className="font-semibold">You try being more firm</span>... it backfires.
            </p>
            <p className="text-base leading-[1.6] text-[#333]">
              <span className="font-semibold">You follow advice</span>... but your child doesn't respond the same way.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-12">
            <p className="text-base leading-[1.6] text-[#666] mb-2">And slowly...</p>
            <p className="text-xl font-bold text-[#D4725C]">
              You start to feel like you're guessing.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pain Amplification ── */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-5">
            <p className="text-base leading-[1.6] text-[#333] font-semibold">
              And the hardest part?
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              You start wondering if it's you.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              If you're missing something.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              If you're doing this wrong.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              Because no matter what you try...
            </p>
            <p className="text-base leading-[1.6] text-[#333] font-semibold">
              Nothing works the way it should.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              And that feeling...
            </p>
            <p className="text-lg font-bold text-[#D4725C]">
              It stays with you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Quiz CTA ── */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20 text-center">
          <CtaButton onClick={onStart}>
            Find Your Child's Blueprint in 60 Seconds
            <ChevronRight className="w-4 h-4" />
          </CtaButton>
          <p className="text-sm text-[#999] mt-4">
            Free. No signup required.
          </p>
        </div>
      </section>
    </motion.div>
  );
}

/* ═══════════════════════════ PRE-QUIZ EMAIL ═══════════════════════════ */

function PreQuizEmailScreen({
  email,
  setEmail,
  onNext,
  onSkip,
}: {
  email: string;
  setEmail: (e: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  useScrollToTop();

  return (
    <motion.div
      {...fade}
      className="min-h-[100dvh] bg-white flex items-center justify-center"
    >
      <div className="w-full max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-[#2F4F3F]/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-[#2F4F3F]" />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-[1.2] text-[#1A1A1A] mb-3">
            Want me to send your child's results to your email?
          </h2>
          <p className="text-base leading-[1.6] text-[#666]">
            We'll send a copy so you can reference them anytime.
          </p>
        </div>

        <input
          type="email"
          placeholder="your@email.com"
          className="w-full p-4 border border-[#DDD] rounded-lg text-base bg-white focus:border-[#2F4F3F] focus:outline-none transition-colors mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CtaButton onClick={onNext} className="w-full mb-3">
          Continue to Quiz
        </CtaButton>

        <button
          onClick={onSkip}
          className="w-full text-sm text-[#999] hover:text-[#666] py-3 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ QUIZ ═══════════════════════════ */

function QuizScreen({
  onComplete,
}: {
  onComplete: (s: Scores, sels: QuestionSelection[], bd: string) => void;
}) {
  useScrollToTop();

  const [idx, setIdx] = useState(0);
  const [allSelections, setAllSelections] = useState<QuestionSelection[]>([]);
  const [primarySel, setPrimarySel] = useState<number | null>(null);
  const [secondarySel, setSecondarySel] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [bd, setBd] = useState("");

  const q = questions[idx];
  const total = questions.length;
  const pct = ((idx + 1) / total) * 100;
  const isRegularQuestion = !q.isDate;

  const handleOptionClick = (optionIndex: number) => {
    if (confirmed) return;

    if (primarySel === null) {
      setPrimarySel(optionIndex);
    } else if (primarySel === optionIndex) {
      if (secondarySel !== null) {
        setPrimarySel(secondarySel);
        setSecondarySel(null);
      } else {
        setPrimarySel(null);
      }
    } else if (secondarySel === optionIndex) {
      setSecondarySel(null);
    } else if (secondarySel === null) {
      setSecondarySel(optionIndex);
    } else {
      setSecondarySel(optionIndex);
    }
  };

  const handleConfirm = () => {
    if (primarySel === null || !q.options) return;

    setConfirmed(true);

    const sel: QuestionSelection = {
      primary: q.options[primarySel].type as TypeKey,
      secondary: secondarySel !== null ? (q.options[secondarySel].type as TypeKey) : null,
    };

    const newSelections = [...allSelections, sel];
    setAllSelections(newSelections);

    setTimeout(() => {
      setPrimarySel(null);
      setSecondarySel(null);
      setConfirmed(false);

      if (idx < total - 1) {
        setIdx(idx + 1);
      } else {
        const finalScores = calculateWeightedScores(newSelections);
        onComplete(finalScores, newSelections, bd);
      }
    }, 400);
  };

  const handleDateSubmit = () => {
    const finalScores = calculateWeightedScores(allSelections);
    onComplete(finalScores, allSelections, bd);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [idx]);

  return (
    <motion.div {...fade} className="min-h-[100dvh] bg-white flex flex-col">
      {/* Progress */}
      <div className="border-b border-[#EEE]">
        <div className="max-w-xl mx-auto px-6 py-4">
          <div className="flex justify-between text-xs font-medium text-[#999] mb-2">
            <span>
              Question {idx + 1} of {total}
            </span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-1 bg-[#EEE] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#2F4F3F] rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Child Clarity Notice — shown above first question */}
      {idx === 0 && isRegularQuestion && (
        <div className="max-w-xl mx-auto px-6 pt-6">
          <div className="bg-[#FAFAF8] border border-[#EEE] rounded-lg p-4 mb-2">
            <p className="text-sm leading-[1.6] text-[#666] text-center">
              If you have multiple children, answer based on ONE child you want to better understand right now.
            </p>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="flex-1 flex items-start justify-center px-6 py-10 md:py-16">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold leading-[1.2] text-[#1A1A1A] mb-4">
                {q.isDate
                  ? "One last thing. Your child's birth date."
                  : q.q}
              </h2>

              {/* Instruction text below question */}
              {isRegularQuestion && (
                <p className="text-sm leading-[1.6] text-[#999] mb-6">
                  Choose what happens MOST often. You can choose a second if needed.
                </p>
              )}

              {q.isDate ? (
                <div>
                  <p className="text-sm text-[#999] mb-4 leading-[1.6]">
                    Optional. Helps personalize your results.
                  </p>
                  <input
                    type="date"
                    className="w-full p-4 border border-[#DDD] rounded-lg text-base bg-white focus:border-[#2F4F3F] focus:outline-none transition-colors mb-6"
                    value={bd}
                    onChange={(e) => setBd(e.target.value)}
                  />
                  <CtaButton
                    onClick={handleDateSubmit}
                    className="w-full"
                  >
                    <Sparkles className="w-5 h-5" />
                    Reveal My Child's Blueprint
                  </CtaButton>
                </div>
              ) : (
                <div>
                  <div className="space-y-3">
                    {q.options?.map((opt, i) => {
                      const isPrimary = primarySel === i;
                      const isSecondary = secondarySel === i;
                      const isSelected = isPrimary || isSecondary;

                      return (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleOptionClick(i)}
                          className={`w-full p-4 rounded-lg text-left text-base leading-[1.6] transition-all duration-200 flex items-center gap-4 ${
                            isPrimary
                              ? "bg-[#2F4F3F] text-white"
                              : isSecondary
                              ? "bg-[#2F4F3F]/70 text-white"
                              : "bg-white border border-[#DDD] hover:border-[#999]"
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-[#F5F5F3] text-[#999]"
                            }`}
                          >
                            {isPrimary ? (
                              <Check className="w-4 h-4" />
                            ) : isSecondary ? (
                              <span className="text-xs">2</span>
                            ) : (
                              String.fromCharCode(65 + i)
                            )}
                          </span>
                          <span className="font-medium flex-1">{opt.text}</span>
                          {isPrimary && (
                            <span className="text-xs text-white/70 uppercase tracking-wider font-medium">
                              Primary
                            </span>
                          )}
                          {isSecondary && (
                            <span className="text-xs text-white/70 uppercase tracking-wider font-medium">
                              2nd
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Confirm button */}
                  <AnimatePresence>
                    {primarySel !== null && !confirmed && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-6"
                      >
                        <CtaButton onClick={handleConfirm} className="w-full">
                          {secondarySel !== null ? "Confirm Choices" : "Next Question"}
                          <ChevronRight className="w-4 h-4" />
                        </CtaButton>
                        {secondarySel === null && (
                          <p className="text-xs text-[#999] text-center mt-2">
                            Or tap a second option if another also applies
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ LOADING ═══════════════════════════ */

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useScrollToTop();

  const [ti, setTi] = useState(0);
  const texts = [
    "Analyzing behavioral patterns...",
    "Identifying nervous system responses...",
    "Generating your child's blueprint...",
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      setTi((p) => {
        if (p < texts.length - 1) return p + 1;
        clearInterval(iv);
        return p;
      });
    }, 1300);
    const to = setTimeout(onComplete, 4200);
    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [onComplete, texts.length]);

  return (
    <motion.div
      {...fade}
      className="min-h-[100dvh] bg-[#2F4F3F] flex items-center justify-center"
    >
      <div className="text-center px-6">
        <div className="relative w-16 h-16 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/80 animate-spin" />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={ti}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-white text-base font-medium leading-[1.6]"
          >
            {texts[ti]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ SECTION DIVIDER ═══════════════════════════ */

function SectionDivider() {
  return (
    <div className="max-w-md mx-auto py-2">
      <div className="h-px bg-[#E5E5E5]" />
    </div>
  );
}

/* ═══════════════════════════ RESULTS ═══════════════════════════ */

function ResultsScreen({
  scores,
  selections,
  email,
  setEmail,
  onSaveEmail,
  onNext,
}: {
  scores: Scores;
  selections: QuestionSelection[];
  email: string;
  setEmail: (e: string) => void;
  onSaveEmail: () => void;
  onNext: () => void;
}) {
  useScrollToTop();

  const { primary, secondary } = getResultTypes(scores, selections);
  const data = resultsData[primary];
  const primaryLabel = typeLabels[primary];
  const secondaryLabel = typeLabels[secondary];
  const ctaText = typeSpecificCTAs[primary];

  return (
    <motion.div {...fade}>
      {/* ═══ Result hero — Title ═══ */}
      <section className="bg-[#2F4F3F] text-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-5xl mb-6"
          >
            {data.emoji}
          </motion.div>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-white/50 mb-3">
            Your child's pattern
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-[1.2] mb-4">
            Your child most closely aligns with {primaryLabel}, with strong traits of {secondaryLabel}.
          </h1>
        </div>
      </section>

      {/* ═══ Intro / Empathy (type-specific) ═══ */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-4">
            {data.intro.map((line, i) => (
              <p key={i} className="text-base leading-[1.6] text-[#444]">
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ "You may notice:" (type-specific bullets) ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-[1.2] text-[#1A1A1A] mb-8 max-w-md mx-auto">
            You may notice:
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            {data.youMayNotice.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4725C] mt-[10px] shrink-0" />
                <p className="text-base leading-[1.6] text-[#333]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Frustration / What you've tried (type-specific) ═══ */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-4">
            {data.frustration.map((line, i) => (
              <p key={i} className="text-base leading-[1.6] text-[#444]">
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
          <SectionDivider />

          {/* ═══ Accuracy Reassurance (same for all) ═══ */}
          <div className="max-w-md mx-auto text-center space-y-3 mt-6">
            {accuracyReassurance.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-2" />
              ) : (
                <p key={i} className="text-base leading-[1.6] text-[#444]">
                  {line}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER + Critical Positioning (same for all) ═══ */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-12 md:py-16">
          <SectionDivider />

          <div className="max-w-md mx-auto space-y-5 mt-6">
            {criticalPositioning.map((line, i) => (
              <p
                key={i}
                className={`text-base leading-[1.6] ${
                  i === 0
                    ? "text-[#444]"
                    : "text-[#333] font-semibold"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Testimonial ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto">
            <p className="text-base leading-[1.6] text-[#333] font-semibold italic mb-4">
              {data.testimonial.headline}
            </p>
            <p className="text-[#D4725C] text-lg mb-4">{data.testimonial.stars}</p>
            <p className="text-base leading-[1.6] text-[#666] mb-4">
              {data.testimonial.body}
            </p>
            <p className="text-sm font-semibold text-[#333]">
              {data.testimonial.name}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER + Curiosity Gap (type-specific "does NOT tell you") ═══ */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <SectionDivider />

          <div className="max-w-md mx-auto mt-6">
            <p className="text-base leading-[1.6] text-[#333] font-semibold mb-4">
              But here's what most parents miss…
            </p>

            <p className="text-base leading-[1.6] text-[#666] mb-2">
              This explains how your child behaves.
            </p>
            <p className="text-base leading-[1.6] text-[#666] mb-6">
              But it does <strong className="font-semibold text-[#1A1A1A]">NOT</strong> tell you:
            </p>

            <div className="space-y-4 mb-8">
              {data.doesNotTellYou.map((item, i) => (
                <p key={i} className="text-base leading-[1.6] text-[#333]">
                  {item}
                </p>
              ))}
            </div>

            <p className="text-base leading-[1.6] text-[#666] mb-2">
              And without that…
            </p>
            <p className="text-xl font-bold text-[#D4725C]">
              You are still guessing.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER + Product Transition (same for all) ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <SectionDivider />

          <div className="max-w-md mx-auto text-center space-y-3 mt-6">
            {productTransition.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-2" />
              ) : (
                <p
                  key={i}
                  className={`text-base leading-[1.6] ${
                    line.startsWith("Based on")
                      ? "text-lg font-bold text-[#D4725C]"
                      : line.startsWith("But your full")
                      ? "text-[#333] font-semibold"
                      : "text-[#444]"
                  }`}
                >
                  {line}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══ TYPE-SPECIFIC CTA (result page ONLY — overrides global CTA) ═══ */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-12 text-center">
          <p className="text-sm text-[#999] mb-4">
            Based on your child's pattern…
          </p>
          <CtaButton onClick={() => { onSaveEmail(); onNext(); }}>
            {ctaText}
            <ChevronRight className="w-4 h-4" />
          </CtaButton>
        </div>
      </section>

      {/* ═══ Email capture ═══ */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-[1.2] text-[#1A1A1A] mb-3">
              You've just unlocked part of your child's blueprint...
            </h2>
            <p className="text-lg font-semibold text-[#D4725C]">
              Want to see what most parents miss?
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your best email"
              className="w-full p-4 border border-[#DDD] rounded-lg text-base bg-white focus:border-[#2F4F3F] focus:outline-none transition-colors mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CtaButton
              onClick={() => {
                onSaveEmail();
                onNext();
              }}
              className="w-full"
            >
              Show Me the Full Results
            </CtaButton>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

/* ═══════════════════════════ OFFER / CHECKOUT ═══════════════════════════ */

function OfferScreen({ onCheckout }: { onCheckout: () => void }) {
  useScrollToTop();

  return (
    <motion.div {...fade}>
      {/* Transition */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-base leading-[1.6] text-[#666]">
              Now that you've seen part of your child's blueprint...
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              You understand why they act the way they do.
            </p>
            <p className="text-base leading-[1.6] text-[#333] font-semibold">
              But partial understanding creates partial results.
            </p>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-[1.2] text-[#1A1A1A] mb-10 max-w-md mx-auto">
            Inside This Guide, You'll Discover:
          </h2>

          <div className="max-w-md mx-auto space-y-5 mb-10">
            {offerBullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#2F4F3F] shrink-0 mt-1" />
                <p className="text-base leading-[1.6] text-[#333]">{b}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <CtaButton onClick={onCheckout}>
              Get My Child's Full Blueprint Now
              <ChevronRight className="w-4 h-4" />
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Checkout section */}
      <section className="bg-[#2F4F3F] text-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-[1.2] mb-3">
            You're One Step Away From Finally Understanding Your Child
          </h2>
          <p className="text-base leading-[1.6] text-white/50 max-w-sm mx-auto mb-10">
            You're about to get the full blueprint that explains how your child is wired so you can stop guessing and start knowing exactly what to do.
          </p>

          {/* Value stack */}
          <div className="text-left max-w-md mx-auto mb-10">
            <p className="text-sm font-semibold text-white/80 mb-4">
              Today, you'll get:
            </p>
            {valueStack.map((v, i) => (
              <div key={i} className="flex items-start gap-3 mb-3">
                <Check className="w-4 h-4 text-white/60 shrink-0 mt-1" />
                <p className="text-base leading-[1.6] text-white/80 font-semibold">{v}</p>
              </div>
            ))}

            <div className="mt-6 space-y-3">
              {bonuses.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#D4725C] shrink-0 mt-1" />
                  <p className="text-base leading-[1.6] text-white/70">
                    <span className="font-semibold text-[#D4725C]">FREE BONUS: </span>
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-10">
            <p className="font-[family-name:var(--font-heading)] text-[42px] font-bold leading-[1.2] mb-1">
              $47
            </p>
            <p className="text-sm text-white/40">
              One-time payment. Instant access.
            </p>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <CtaButton onClick={onCheckout} className="w-full max-w-md">
              Get My Child's Full Blueprint Now - $47
              <ChevronRight className="w-4 h-4" />
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#2F4F3F]" />
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold leading-[1.2] text-[#1A1A1A]">
                14-Day Guarantee
              </h2>
            </div>
            <p className="text-base leading-[1.6] text-[#666] mb-2">
              Try it for 14 days.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              If it does not give you more clarity and confidence, you get your money back.
            </p>
          </div>
        </div>
      </section>

      {/* Micro testimonial */}
      <section className="bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto">
            <p className="text-[#D4725C] text-lg mb-4">★★★★★</p>
            <p className="text-base leading-[1.6] text-[#333] italic mb-4">
              "This was the best 47 dollars I've ever spent on my family. Everything finally makes sense now."
            </p>
          </div>
        </div>
      </section>

      {/* Urgency */}
      <section className="bg-white">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-base leading-[1.6] text-[#666]">
              The longer you wait, the longer you stay stuck guessing.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              And your child is growing every day.
            </p>
            <p className="text-base leading-[1.6] text-[#333] font-semibold">
              Every missed moment of understanding is a missed opportunity to connect.
            </p>
          </div>
        </div>
      </section>

      {/* Emotional close */}
      <section className="bg-[#FAFAF8] pb-28 md:pb-0">
        <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-md mx-auto space-y-4 mb-10">
            <p className="text-base leading-[1.6] text-[#333] font-semibold">
              Right now, you have two choices.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              Keep guessing and hoping something works.
            </p>
            <p className="text-base leading-[1.6] text-[#666]">
              Or finally understand your child in a way that actually changes everything.
            </p>
          </div>

          {/* Desktop final CTA */}
          <div className="hidden md:block text-center">
            <CtaButton onClick={onCheckout}>
              Get My Child's Full Blueprint Now - $47
              <ChevronRight className="w-4 h-4" />
            </CtaButton>

            {/* Trust elements */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#999]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Instant access
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Safe payment
              </span>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
