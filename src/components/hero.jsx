import { useEffect, useRef, useState } from "react";
import { MessageCircle, Pause, Play } from "lucide-react";

/* Une seule séquence au chargement : la vidéo apparaît en fondu,
   puis chaque ligne du titre se lève depuis un masque, puis le reste.
   Tout est désactivé si l'utilisateur réduit les animations. */
const animationStyles = `
  @keyframes lb-video-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes lb-line-up  { from { transform: translateY(105%); } to { transform: none; } }
  @keyframes lb-fade-up  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes lb-grow     { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes lb-slow-zoom { from { transform: scale(1); } to { transform: scale(1.06); } }

  .lb-video { animation: lb-video-in 1.6s ease-out both, lb-slow-zoom 24s ease-out both; }
  .lb-line  { display: block; animation: lb-line-up 1s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
  .lb-fade  { animation: lb-fade-up .9s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
  .lb-bar   { animation: lb-grow 1.2s cubic-bezier(.65,0,.2,1) .4s both; transform-origin: top; }

  @media (prefers-reduced-motion: reduce) {
    .lb-video, .lb-line, .lb-fade, .lb-bar { animation: none; }
  }
`;

export default function HeroSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  // Respecte "réduire les animations" : on laisse seulement l'affiche (poster).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches && videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#111111] text-[#F8F6F0]"
    >
      <style>{animationStyles}</style>

      {/* Vidéo de fond (décorative) */}
      <video
        ref={videoRef}
        className="lb-video absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Voiles pour la lisibilité : sombre à gauche et en bas, là où se trouve le texte */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111111]/90 via-[#111111]/55 to-[#111111]/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent"
      />

      {/* Filet doré vertical : ancre le texte à gauche */}
      <div
        aria-hidden="true"
        className="lb-bar absolute bottom-0 left-6 top-24 hidden w-px bg-gradient-to-b from-[#D4A638] via-[#D4A638]/40 to-transparent sm:block lg:left-8"
      />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-32 sm:pb-20 sm:pl-14 lg:px-8 lg:pb-24 lg:pl-16">
        <p
          className="lb-fade mb-6 text-base font-medium text-[#E8C66A]"
          style={{ "--d": "700ms" }}
        >
          Parfums, encens et vêtements, faits main à Casablanca
        </p>

        <h1
          id="hero-title"
          className="max-w-4xl text-balance font-serif text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="lb-line" style={{ "--d": "300ms" }}>
              L'art des sens,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="lb-line" style={{ "--d": "450ms" }}>
              l'élégance au quotidien.
            </span>
          </span>
        </h1>

        <p
          className="lb-fade mt-8 max-w-lg text-base leading-8 text-[#F8F6F0]/80 sm:text-lg"
          style={{ "--d": "900ms" }}
        >
          Parfums, bkhour et créations inspirées par l'authenticité.
          Une invitation à éveiller vos sens.
        </p>

        <div
          className="lb-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          style={{ "--d": "1050ms" }}
        >
          <a
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center bg-[#D4A638] px-8 py-4 text-sm font-semibold text-[#111111] transition-colors duration-300 hover:bg-[#E8C66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
          >
            Découvrir la boutique
          </a>

          <a
            href="/about"
            className="inline-flex min-h-12 items-center justify-center border border-[#F8F6F0]/40 bg-[#111111]/25 px-8 py-4 text-sm font-medium text-[#F8F6F0] backdrop-blur-sm transition-colors duration-300 hover:border-[#D4A638] hover:text-[#E8C66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
          >
            Notre univers
          </a>
        </div>

        <a
          href="https://wa.me/212707748943"
          target="_blank"
          rel="noopener noreferrer"
          className="lb-fade mt-8 inline-flex items-center gap-3 text-sm text-[#F8F6F0]/75 transition-colors duration-300 hover:text-[#E8C66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638]"
          style={{ "--d": "1200ms" }}
        >
          <MessageCircle size={18} aria-hidden="true" className="flex-none text-[#D4A638]" />
          Commandez simplement par WhatsApp, sans créer de compte.
        </a>
      </div>

      {/* Pause / lecture (accessibilité : une vidéo qui bouge doit pouvoir être arrêtée) */}
      <button
        type="button"
        onClick={toggleVideo}
        aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}
        className="absolute bottom-6 right-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#F8F6F0]/40 bg-[#111111]/40 text-[#F8F6F0] backdrop-blur-sm transition-colors duration-300 hover:border-[#D4A638] hover:text-[#E8C66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] sm:bottom-8 sm:right-8"
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
    </section>
  );
}