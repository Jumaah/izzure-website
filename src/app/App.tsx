import { useState, useEffect } from "react";
import { translations, type Lang, type Translations } from "./i18n";
import imgLogo from "../assets/Logo.png";
import imgHeroProduct from "../assets/imgHero.png";
import imgHeroTree from "../assets/HeroTree.png";
import imgGoldSplatter from "../assets/GoldSplatter.png";
import imgBadge from "../assets/Badge.png";
import imgProductCard from "../assets/ProductCard.png";
import imgStory1 from "../assets/Story1.png";
import imgStory2 from "../assets/Story2.png";
import imgStory3 from "../assets/Story3.png";
import imgStory4 from "../assets/Story4.png";
import imgContactDecor from "../assets/ContactDecor.png";
import svgPaths from "../imports/Grid-1/svg-u0yi2z99jn";

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS & HELPERS
───────────────────────────────────────────────────────────────── */

interface LangProps {
  t: Translations;
  isRTL: boolean;
  lang: Lang;
}

// 1. Typography System
const bodyFont = (r: boolean) => (r ? "'Markazi Text', serif" : "'Jost', sans-serif");
const headFont = (r: boolean) => (r ? "'Changa', sans-serif" : "'Fraunces', serif");
const btnFont = (r: boolean) => (r ? "'Tajawal', sans-serif" : "'Inter', sans-serif");

// Helper to scale Arabic Markazi font to match English Jost readability
const scaleSize = (r: boolean, baseSize: string) => {
  if (!r) return baseSize;
  const num = parseInt(baseSize);
  return isNaN(num) ? baseSize : `${Math.round(num * 1.3)}px`;
};

function txt(
  r: boolean,
  opts: { size?: string; weight?: number; lh?: number; ls?: string } = {}
) {
  return {
    fontFamily: bodyFont(r),
    fontSize: scaleSize(r, opts.size ?? "16px"),
    fontWeight: opts.weight ?? 400,
    lineHeight: opts.lh ?? (r ? 1.7 : 1.75),
    letterSpacing: opts.ls ?? (r ? "0" : "0.025em"),
    textAlign: "start" as const,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
interface NavbarProps extends LangProps {
  onSwitch: (l: Lang) => void;
}

const observedSectionIds = ["hero", "collection", "story", "contact"] as const;
type ObservedSectionId = (typeof observedSectionIds)[number];

function Navbar({ t, isRTL, lang, onSwitch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<ObservedSectionId>("hero");

  const navLinks = [
    { label: t.nav.collection, href: "#collection" },
    { label: t.nav.story, href: "#story" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (activeEntry && observedSectionIds.includes(activeEntry.target.id as ObservedSectionId)) {
          setActiveSection(activeEntry.target.id as ObservedSectionId);
        }
      },
      { threshold: 0.5 }
    );

    const sections = observedSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="w-full sticky top-0 z-50 border-b transition-all duration-300 ease-in-out"
      style={{
        background: isScrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
        backdropFilter: `blur(${isScrolled ? 16 : 10}px)`,
        WebkitBackdropFilter: `blur(${isScrolled ? 16 : 10}px)`,
        borderColor: isScrolled ? "rgba(125,178,173,0.15)" : "transparent",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-[64px] md:h-[72px] flex items-center justify-between gap-4">

        <div className="flex-shrink-0">
          <a
            href="#hero"
            aria-label="Back to top"
            className="flex-shrink-0 transition-opacity duration-300 hover:opacity-80 cursor-pointer"
          >
            <img src={imgLogo} alt="IZZURE" className="h-[22px] object-contain" />
          </a>
        </div>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => {
            const sectionId = item.href.slice(1) as ObservedSectionId;
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-all duration-300 ease-in-out hover:opacity-100"
                  style={{
                    color: isActive ? "#23a5c2" : "#333",
                    opacity: isActive ? 1 : 0.7,
                    fontFamily: btnFont(isRTL),
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: isRTL ? "0" : "0.04em",
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div
          className="flex items-center gap-1 select-none flex-shrink-0"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.08em" }}
        >
          {(["ar", "en"] as Lang[]).map((code, i) => (
            <span key={code} className="flex items-center">
              {i === 1 && <span className="text-[#ccc] px-1">|</span>}
              <button
                onClick={() => onSwitch(code)}
                aria-label={code === "ar" ? "Switch to Arabic" : "Switch to English"}
                className="px-2 py-1 rounded transition-all duration-200 uppercase"
                style={{
                  color: lang === code ? "#26635e" : "#888",
                  fontWeight: lang === code ? 600 : 400,
                  background: lang === code ? "rgba(38,99,94,0.06)" : "transparent",
                }}
              >
                {code}
              </button>
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero({ t, isRTL }: LangProps) {
  return (
    <section id="hero" className="relative bg-[#eff6f6] min-h-[100svh] md:min-h-[750px] lg:min-h-[850px] flex items-center overflow-hidden">
      <style>
        {`
          @keyframes aura-1 {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(10vw, -10vh) scale(1.3); }
            66% { transform: translate(-10vw, 10vh) scale(0.8); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes aura-2 {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-12vw, 12vh) scale(1.2); }
            66% { transform: translate(12vw, -12vh) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes aura-3 {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(8vw, 8vh) scale(1.4); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up-1 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-fade-up-2 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
          .animate-fade-up-3 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
          @keyframes hero-scroll-breathe {
            0%, 100% { transform: scale(0.9); opacity: 0.45; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          @keyframes hero-scroll-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
        `}
      </style>

      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#eff6f6]">
        <div
          className="absolute top-[-10%] left-[-10%] w-[60vw] max-w-[600px] aspect-square rounded-full mix-blend-multiply opacity-[0.55]"
          style={{ background: "#d0ffdfff", filter: "blur(80px)", willChange: "transform", animation: "aura-1 14s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[20%] right-[-10%] w-[50vw] max-w-[500px] aspect-square rounded-full mix-blend-multiply opacity-[0.45]"
          style={{ background: "#ffecc7ff", filter: "blur(90px)", willChange: "transform", animation: "aura-2 18s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[-15%] left-[20%] w-[70vw] max-w-[700px] aspect-square rounded-full mix-blend-multiply opacity-[0.4]"
          style={{ background: "#c7fff8ff", filter: "blur(100px)", willChange: "transform", animation: "aura-3 20s ease-in-out infinite" }}
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 isolate max-w-[1380px] mx-auto px-5 md:px-8 lg:px-12 w-full py-16 md:py-14 flex flex-col md:flex-row items-center gap-8 md:gap-5 lg:gap-6">

        {/* TEXT BLOCK */}
        <div className="w-full max-w-[560px] md:max-w-none md:w-[48%] min-w-0 relative z-10 flex flex-col items-start gap-5 md:gap-6 pt-0 md:pt-6 pb-0 md:pb-10">

          <div className="relative z-10 w-[64px] h-[64px] md:w-[92px] md:h-[92px] flex-shrink-0 animate-fade-up-1">
            <img
              src={imgBadge}
              alt="IZZURE"
              className="w-full h-full object-contain opacity-70"
            />
          </div>

          <h1
            className="text-start text-[#1a1a1a] animate-fade-up-1"
            style={{
              fontFamily: headFont(isRTL),
              fontSize: "clamp(30px, 7.5vw, 60px)",
              fontWeight: isRTL ? 600 : 400,
              lineHeight: isRTL ? 1.5 : 1.22,
              letterSpacing: isRTL ? "0" : "0.01em",
              maxWidth: "640px",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {t.hero.headlineBefore}
            <em style={{ color: "#23a5c2", fontStyle: "normal" }}>
              {t.hero.headlineAccent}
            </em>
            {t.hero.headlineAfter}
          </h1>

          <p
            className="text-start text-[#4a4d4d] animate-fade-up-2"
            style={{
              ...txt(isRTL, { size: "16px", weight: 300 }),
              maxWidth: "500px",
            }}
          >
            {t.hero.subtext}
          </p>

          <a
            href="#collection"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-3.5 mt-2 rounded-xl text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.02] md:mt-0 shadow-[0_8px_20px_rgba(38,99,94,0.25)] animate-fade-up-3"
            style={{
              background: "#5b9690ff",
              fontFamily: btnFont(isRTL),
              fontSize: "15px",
              fontWeight: isRTL ? 500 : 400,
              letterSpacing: isRTL ? "0" : "0.06em",
            }}
          >
            {t.hero.cta}
          </a>
        </div>

        {/* IMAGE BLOCK */}
        <div className="hidden md:flex w-full md:w-[52%] min-w-0 relative justify-center items-center flex-shrink-0 mt-8 md:mt-0">

          {/* السر هنا: صغرنا حجم الحاوية لتتناسب مع شاشات اللابتوب بدلاً من الأحجام الضخمة */}
          <div className="relative w-[86vw] max-w-[340px] min-[400px]:max-w-[370px] aspect-square md:w-[540px] md:h-[540px] md:max-w-none lg:w-[640px] lg:h-[640px] xl:w-[720px] xl:h-[720px] flex items-center justify-center animate-fade-up-2">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img src={imgGoldSplatter} alt="" className="w-full h-full object-contain opacity-[0.65] mix-blend-exclusion" style={{ transform: "rotate(-90deg)" }} />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img src={imgHeroTree} alt="" className="relative z-10 w-full max-w-[88%] min-[400px]:max-w-[90%] md:max-w-[95%] h-auto object-contain scale-[0.9] min-[400px]:scale-[0.96] md:scale-[1.12] lg:scale-[1.18] xl:scale-[1.22]" style={{ transform: "rotate(4.6deg)" }} />
            </div>

            <img src={imgHeroProduct} alt="IZZURE Fragrance" className="relative z-10 w-full max-w-[88%] min-[400px]:max-w-[90%] md:max-w-[95%] h-auto object-contain scale-[0.9] min-[400px]:scale-[0.96] md:scale-[1.12] lg:scale-[1.18] xl:scale-[1.22]" style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.25))" }} />

          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <button
          type="button"
          aria-label="Scroll to collection"
          className="absolute bottom-4 md:bottom-6 left-1/2 z-20 flex h-[56px] w-[36px] -translate-x-1/2 items-start justify-center bg-transparent animate-fade-up-3"
          onClick={() => document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="relative mt-2 flex h-[36px] w-[10px] justify-center" style={{ animation: "hero-scroll-float 2s ease-in-out infinite" }}>
            <span className="absolute top-0 h-[10px] w-[10px] rounded-full bg-[#7db2ad]/80" style={{ animation: "hero-scroll-breathe 2s ease-in-out infinite", boxShadow: "0 0 15px rgba(125, 178, 173, 0.6)" }} />
            <span className="absolute top-[14px] h-[26px] w-[2px] rounded-full bg-gradient-to-b from-[#7db2ad]/50 to-transparent" />
          </span>
        </button>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT / COLLECTION
═══════════════════════════════════════════════════════════════ */
function ProductSection({ t, isRTL }: LangProps) {
  return (
    <section id="collection" className="bg-[#fafcff] py-16 md:py-28 lg:py-40 md:min-h-[90vh] flex flex-col justify-center relative">
      <div className="max-w-[1380px] mx-auto px-5 md:px-8 lg:px-12 w-full">
        <div className={`grid grid-cols-1 ${isRTL ? "md:grid-cols-[1fr_1.2fr]" : "md:grid-cols-[1.2fr_1fr]"} items-center gap-2 md:gap-16 lg:gap-20`}>

          {/* IMAGE */}
          <div className="relative flex items-center justify-center w-full min-h-[220px] md:min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[200px] h-[200px] md:w-[600px] md:h-[600px] rounded-full bg-[#7db2ad]/10 blur-[60px] md:blur-[120px]" />
            </div>
            <img
              src={imgProductCard}
              alt="IZHAR Fragrance"
              className="relative z-10 w-full max-w-[85%] md:max-w-[900px] lg:max-w-[1000px] h-auto object-contain scale-[1] md:scale-[1.05]"
              style={{ filter: "drop-shadow(0 30px 60px rgba(38,99,94,0.18))", animation: "floatSoft 6s ease-in-out infinite" }}
            />
          </div>

          {/* TEXT */}
          <div className="flex flex-col items-center md:items-start gap-6 md:gap-8 text-center md:text-start w-full relative z-20">

            <div className="flex flex-col items-center md:items-start gap-2">
              <span
                className="text-[#be9a39]"
                style={{
                  fontFamily: btnFont(isRTL),
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: isRTL ? "0.04em" : "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {t.product.label}
              </span>
              <div className="h-px w-16 bg-[#be9a39] opacity-60" />
            </div>

            <h2
              className="text-[#21ae7d]"
              style={{
                fontFamily: headFont(isRTL),
                fontSize: "clamp(42px, 12vw, 96px)",
                fontWeight: isRTL ? 600 : 400,
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {t.product.name}
            </h2>

            <div className="flex flex-col gap-4 md:gap-4 w-full" style={{ maxWidth: "560px" }}>
              {[t.product.desc1, t.product.desc2].map((para, i) => (
                <p key={i} className="text-[#373636]" style={{ ...txt(isRTL, { size: "16px", weight: 300 }), textAlign: "inherit" }}>
                  {para}
                </p>
              ))}
            </div>

            <div className="h-px w-full bg-[#c9dede] opacity-50 my-1 md:my-2" />

            {/* SPECS */}
            <div className="flex flex-row items-center md:items-start justify-center md:justify-start w-full max-w-[520px] mt-2">
              {t.product.specs.map((spec, i) => (
                <div key={spec.label} className="flex items-center">

                  {/* جعلنا المحاذاة في المنتصف دائماً للغتين (العربية والإنجليزية) */}
                  <div className="flex flex-col items-center text-center gap-1">
                    <span
                      className="text-[#606060]"
                      style={{
                        fontFamily: btnFont(isRTL),
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: isRTL ? "0.03em" : "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      className="text-[#606060]"
                      style={{
                        fontFamily: btnFont(isRTL),
                        fontSize: "14px",
                        fontWeight: 400
                      }}
                    >
                      {spec.value}
                    </span>
                  </div>

                  {i < t.product.specs.length - 1 && (
                    <div className="block w-px h-10 bg-[#606060] opacity-20 mx-4 md:mx-8" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center md:items-start gap-4 mt-3 md:mt-4 w-full">
              <a
                href="https://wa.me/963937387728"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-3.5 rounded-xl text-white transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "#5b9690ff",
                  fontFamily: btnFont(isRTL),
                  fontSize: "15px",
                  fontWeight: isRTL ? 500 : 500,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                {t.product.cta}
              </a>
            </div>

          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes floatSoft {
            0%,100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <div className="w-full flex flex-col items-center justify-center mt-16 md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 px-5">
        <div className="w-24 h-px bg-[#be9a39]/30 mb-3"></div>
        <p
          className="text-[#D6C090]/80 text-center"
          style={{
            fontFamily: btnFont(isRTL),
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: isRTL ? "0.05em" : "0.22em",
            textTransform: "uppercase",
          }}
        >
          {t.product.comingSoon}
        </p>
      </div>

    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STORY
═══════════════════════════════════════════════════════════════ */

const storyImages = [imgStory1, imgStory2, imgStory3, imgStory4];

function StorySection({ t, isRTL, lang }: LangProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    setVisibleSteps([]);
    setActiveStep(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const step = Number((entry.target as HTMLElement).dataset.storyStep);
          if (entry.isIntersecting) {
            setActiveStep(step);
            setVisibleSteps((current) => current.includes(step) ? current : [...current, step]);
          }
        });
      },
      { threshold: 0.5 }
    );

    const timeoutId = setTimeout(() => {
      const steps = document.querySelectorAll<HTMLElement>("[data-story-step]");
      steps.forEach((step) => observer.observe(step));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [lang]);

  return (
    <section id="story" className="relative overflow-hidden bg-[#eff6f6] py-16 md:py-28">
      <div className="relative max-w-[1380px] mx-auto px-5 md:px-8 lg:px-10">

        <div className="mb-12 md:mb-20 flex flex-col items-center gap-4 text-center">
          <span
            className="text-[#be9a39]"
            style={{
              fontFamily: btnFont(isRTL),
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: isRTL ? "0.05em" : "0.18em",
              textTransform: "uppercase",
            }}
          >
            {t.story.sectionLabel}
          </span>
          <div className="h-px w-20 bg-[#be9a39]/30" />
        </div>

        <div className="relative" dir="ltr">
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#cfdede]" />

          {t.story.blocks.map((block, idx) => {
            const isPrimary = idx === 0;
            const isActive = activeStep === idx;
            const isVisible = visibleSteps.includes(idx);
            const isRightSide = isRTL ? idx % 2 === 0 : idx % 2 === 1;

            const cardSideClass = isRightSide
              ? "md:col-start-3 md:justify-self-start"
              : "md:col-start-1 md:justify-self-end";

            const slideClass = isVisible
              ? "translate-x-0 opacity-100"
              : isRightSide
                ? "translate-x-8 opacity-0"
                : "-translate-x-8 opacity-0";

            return (
              <div key={block.title} data-story-step={idx} className="relative grid grid-cols-1 pb-10 last:pb-0 md:min-h-[420px] md:grid-cols-[1fr_auto_1fr] md:gap-x-12 md:pb-[140px]">

                <div className="relative z-10 hidden justify-center md:col-start-2 md:flex md:w-10">
                  <span className={`mt-10 block rounded-full border border-white bg-[#7db2ad] transition-all duration-500 ease-in-out md:mt-12 ${isActive ? "h-[18px] w-[18px] shadow-[0_0_26px_rgba(35,165,194,0.46)]" : "h-[11px] w-[11px] opacity-65"}`} />
                </div>

                <div className={`w-full md:row-start-1 md:max-w-[500px] ${cardSideClass}`}>
                  <div className={`group relative overflow-hidden rounded-2xl bg-white/80 p-5 shadow-[0_18px_60px_rgba(38,99,94,0.10)] ring-1 ring-white/70 backdrop-blur-sm transition-all duration-700 ease-out md:p-8 ${isPrimary ? "bg-white/90 shadow-[0_24px_70px_rgba(38,99,94,0.16)]" : ""} ${isActive ? "shadow-[0_24px_80px_rgba(35,165,194,0.14)]" : ""} ${slideClass}`}>

                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-[0.035]">
                      <span style={{ fontSize: "120px", fontWeight: 300, letterSpacing: "0.1em", color: "#367771ff" }}>IZZURE</span>
                    </span>

                    <div className="overflow-hidden rounded-xl bg-[#dfecec]">
                      <img src={storyImages[idx]} alt={block.title} className="h-[210px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[300px]" />
                    </div>

                    <div className="flex flex-col items-start gap-4 pt-6 md:gap-5 md:pt-7" dir={isRTL ? "rtl" : "ltr"}>
                      <span
                        className="text-[#23a5c2]"
                        style={{
                          fontFamily: btnFont(isRTL),
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: isRTL ? "0.02em" : "0.14em",
                          textTransform: "uppercase",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      <h3
                        className="text-[#1f2b2a]"
                        style={{
                          fontFamily: headFont(isRTL),
                          fontSize: isPrimary ? "clamp(28px, 8vw, 48px)" : "clamp(24px, 7vw, 36px)",
                          fontWeight: isRTL ? 600 : 400,
                          lineHeight: isRTL ? 1.4 : 1.2,
                          textAlign: isRTL ? "right" : "left",
                          WebkitFontSmoothing: "antialiased",
                        }}
                      >
                        {block.title}
                      </h3>

                      <div className="flex max-w-[460px] flex-col gap-3">
                        {block.body.slice(0, 2).map((para, i) => (
                          <p key={i} className="text-[#465352]" style={{ ...txt(isRTL, { size: "15px", weight: 300 }), textAlign: isRTL ? "right" : "left" }}>
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════ */
function ContactSection({ t, isRTL }: LangProps) {
  const contactRows = [
    {
      key: "email",
      icon: <svg width="28" height="28" viewBox="0 0 46.5196 46.5196" fill="none"><path d={svgPaths.p2fc58e00} fill="white" /></svg>,
      label: t.contact.emailLabel,
      value: "jumaa@gmail.com",
    },
    {
      key: "phone",
      icon: <svg width="28" height="28" viewBox="0 0 46.5196 46.5196" fill="none"><path d={svgPaths.p6774bb0} fill="white" /></svg>,
      label: t.contact.phoneLabel,
      value: "+963937387728",
    },
    {
      key: "location",
      icon: <svg width="28" height="28" viewBox="0 0 46.5196 46.5196" fill="none"><path clipRule="evenodd" d={svgPaths.p10cb08c0} fill="white" fillRule="evenodd" /></svg>,
      label: t.contact.locationLabel,
      value: t.contact.locationValue,
    },
  ];

  return (
    <section id="contact" className="bg-[#fafcff] py-16 md:py-24">
      <div className="max-w-[1380px] mx-auto px-5 md:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          <div className="flex-[3] min-w-0 flex flex-col items-start gap-6 md:gap-7 w-full">
            <div className="flex flex-col items-start gap-1">
              <span
                className="text-[#be9a39]"
                style={{
                  fontFamily: btnFont(isRTL),
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: isRTL ? "0.04em" : "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {t.contact.label}
              </span>
              <div className="h-px w-12 bg-[#be9a39] opacity-60" />
            </div>

            <h2
              className="text-[#1a1a1a] text-start"
              style={{
                fontFamily: headFont(isRTL),
                fontSize: "clamp(30px, 8vw, 56px)",
                fontWeight: isRTL ? 600 : 400,
                lineHeight: isRTL ? 1.5 : 1.2,
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {t.contact.heading}
            </h2>

            <p
              className="text-[#504d4d] text-start"
              style={{
                ...txt(isRTL, { size: "16px", weight: 300 }),
                maxWidth: "520px",
              }}
            >
              {t.contact.subtext}
            </p>

            <div className="flex flex-col items-start gap-5 w-full md:max-w-[520px]">
              {contactRows.map((row) => (
                <div key={row.key} className="flex items-center justify-start gap-4 text-start">
                  <div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#26635e" }}>
                    {row.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span style={{ fontFamily: btnFont(isRTL), fontSize: "13px", fontWeight: 600, letterSpacing: isRTL ? "0.02em" : "0.08em", textTransform: "uppercase" }}>
                      {row.label}
                    </span>
                    <span className="text-[#555]" style={{ fontFamily: btnFont(isRTL), fontSize: "15px", fontWeight: 400 }}>
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/963937387728"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full md:w-auto px-7 py-3 rounded-xl text-[#e8f9f4] transition-all duration-200 hover:opacity-85 hover:scale-[1.03] mt-2"
              style={{
                background: "#26635e",
                fontFamily: btnFont(isRTL),
                fontSize: "15px",
                fontWeight: isRTL ? 500 : 500,
              }}
            >
              {t.contact.cta}
            </a>

            <div className="flex items-center justify-start gap-2 mt-3 w-full">
              <svg width="15" height="15" viewBox="0 0 26.4992 26.4992" fill="none"><path d={svgPaths.p2608d500} fill="#be9a39" /></svg>
              <span className="text-[#be9a39]" style={{ fontFamily: btnFont(isRTL), fontSize: "13px", fontWeight: 400 }}>
                {t.contact.responseTime}
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-[3] items-center justify-center w-full">
            <img src={imgContactDecor} alt="IZZURE" className="w-full max-w-[300px] md:max-w-[520px] lg:max-w-[600px] xl:max-w-[660px] object-contain scale-[0.95] md:scale-[0.98] lg:scale-[1]" />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer({ t, isRTL }: LangProps) {
  return (
    <footer className="bg-[#222] py-10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <a
            href="#hero"
            aria-label="Back to top"
            className="flex-shrink-0 transition-opacity duration-300 hover:opacity-80 cursor-pointer"
          >

            <img src={imgLogo} alt="IZZURE" className="h-[20px] object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </a>

          <div className="flex items-center gap-8">
            {t.footer.links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[rgba(255,255,255,0.50)] hover:text-white transition-colors duration-200"
                style={{ fontFamily: btnFont(isRTL), fontSize: "14px", fontWeight: 400, letterSpacing: isRTL ? "0" : "0.06em" }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[rgba(255,255,255,0.40)]" style={{ fontFamily: btnFont(isRTL), fontSize: "13px", letterSpacing: isRTL ? "0" : "0.08em" }}>
              {t.footer.followUs}
            </span>
            <a href="#" aria-label="Instagram" className="opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" /></svg>
            </a>
            <a href="#" aria-label="Facebook" className="opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 640 640" fill="rgba(255,255,255,0.85)"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z" /></svg>
            </a>
            <a href="#" aria-label="X" className="opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)"><path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-4.25-5.56L5.9 22H3l7-8L2 2h6.828l3.85 5.05L18.244 2zm-2.4 18h1.9L8.1 4H6.2l9.644 16z" /></svg>
            </a>
          </div>
        </div>

        <div className="mt-8 h-px bg-white opacity-[0.08]" />

        <p
          className="mt-6 text-center text-[rgba(255,255,255,0.30)]"
          style={{
            fontFamily: btnFont(isRTL),
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: isRTL ? "0" : "0.06em",
          }}
        >
          {t.footer.copyright}
        </p>

      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [lang, setLang] = useState<Lang>("ar");
  const [visible, setVisible] = useState(true);

  const t = translations[lang];
  const isRTL = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [lang, isRTL]);

  const switchLang = (newLang: Lang) => {
    if (newLang === lang) return;
    setVisible(false);
    setTimeout(() => {
      setLang(newLang);
      setVisible(true);
    }, 220);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#eff6f6",
        opacity: visible ? 1 : 0,
        transition: "opacity 220ms ease",
      }}
    >
      <Navbar t={t} isRTL={isRTL} lang={lang} onSwitch={switchLang} />
      <Hero t={t} isRTL={isRTL} lang={lang} />
      <ProductSection t={t} isRTL={isRTL} lang={lang} />
      <StorySection t={t} isRTL={isRTL} lang={lang} />
      <ContactSection t={t} isRTL={isRTL} lang={lang} />
      <Footer t={t} isRTL={isRTL} lang={lang} />
    </div>
  );
}