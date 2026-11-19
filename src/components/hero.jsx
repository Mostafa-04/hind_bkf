import { ArrowRight, MessageCircle } from "lucide-react";

/* Animation : une seule séquence au chargement de la page.
   Le texte monte en cascade, la photo se dévoile de haut en bas,
   puis le cadre doré se met en place. Désactivée si l'utilisateur
   a choisi de réduire les animations. */
const animationStyles = `
  @keyframes hr-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes hr-reveal {
    from { clip-path: inset(0 0 100% 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
  @keyframes hr-frame {
    from { opacity: 0; transform: translate(-.75rem, -.75rem); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes hr-line {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  .hr-rise  { animation: hr-rise .8s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
  .hr-img   { animation: hr-reveal 1.1s cubic-bezier(.65,0,.2,1) .15s both; }
  .hr-frame { animation: hr-frame .8s cubic-bezier(.2,.7,.2,1) .9s both; }
  .hr-line  { animation: hr-line 1.4s cubic-bezier(.65,0,.2,1) .6s both; transform-origin: center; }
  @media (prefers-reduced-motion: reduce) {
    .hr-rise, .hr-img, .hr-frame, .hr-line { animation: none; }
  }
`;

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[#111111] text-[#F8F6F0]"
    >
      <style>{animationStyles}</style>

      {/* Décor : cercles discrets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-[#D4A638]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full border border-[#D4A638]/10"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 sm:py-16 lg:min-h-[640px] lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        {/* Texte : en premier sur mobile pour que le bouton soit visible */}
        <div className="relative z-10">
          <p
            className="hr-rise text-sm font-medium text-[#D4A638]"
            style={{ "--d": "0ms" }}
          >
            Parfums, encens et vêtements
          </p>

          <h1
            id="hero-title"
            className="hr-rise mt-4 max-w-xl text-balance font-serif text-4xl font-medium leading-[1.12] sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{ "--d": "120ms" }}
          >
            L'art des sens, l'élégance au quotidien.
          </h1>

          <p
            className="hr-rise mt-6 max-w-md text-base leading-8 text-[#F8F6F0]/75"
            style={{ "--d": "240ms" }}
          >
            Découvrez un univers de parfums, de bkhour et de créations inspirées
            par l'élégance et l'authenticité. Une invitation à éveiller vos sens.
          </p>

          <div
            className="hr-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={{ "--d": "360ms" }}
          >
            <a
              href="/shop"
              className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#D4A638] px-7 py-4 text-sm font-semibold text-[#111111] transition-colors duration-300 hover:bg-[#E8C66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
            >
              Découvrir la boutique
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1"
              />
            </a>

            <a
              href="/about"
              className="inline-flex min-h-12 items-center justify-center border border-[#F8F6F0]/35 px-7 py-4 text-sm font-medium text-[#F8F6F0] transition-colors duration-300 hover:border-[#D4A638] hover:text-[#D4A638] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
            >
              Notre univers
            </a>
          </div>

          <p
            className="hr-rise mt-8 flex items-center gap-3 text-sm text-[#F8F6F0]/65"
            style={{ "--d": "480ms" }}
          >
            <MessageCircle size={18} aria-hidden="true" className="flex-none text-[#D4A638]" />
            Commandez simplement par WhatsApp, sans créer de compte.
          </p>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-sm pb-3 pr-3 sm:max-w-md sm:pb-4 sm:pr-4 lg:max-w-none">
          {/* Cadre doré décalé */}
          <div
            aria-hidden="true"
            className="hr-frame absolute bottom-0 left-3 right-0 top-3 border border-[#D4A638]/50 sm:left-4 sm:top-4"
          />

          <figure className="hr-img group relative aspect-[4/5] overflow-hidden bg-[#292929] lg:aspect-auto lg:h-[560px]">
            <img
              src="/logo.png"
              alt="Flacon de parfum de la collection Luban"
              width={1000}
              height={1250}
              fetchpriority="high"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-1000 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-transparent to-transparent" />

            <figcaption className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
              <span className="text-sm font-medium text-[#E8C66A]">
                Notre sélection
              </span>
              <p className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                L'art du parfum
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Ligne dorée du bas */}
      <div
        aria-hidden="true"
        className="hr-line absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4A638]/60 to-transparent"
      />
    </section>
  );
}