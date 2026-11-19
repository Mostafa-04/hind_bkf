import { ArrowRight } from "lucide-react";

/* Animation : un seul moment au défilement — le cadre doré se décale
   derrière la photo, puis le texte apparaît. CSS pur (aucun JavaScript).
   Sans support du navigateur ou avec "réduire les animations", la page
   s'affiche simplement dans son état final. */
const animationStyles = `
  .fc-frame { --o: .75rem; transform: translate(calc(var(--o) * -1), calc(var(--o) * -1)); }
  @media (min-width: 640px) { .fc-frame { --o: 1rem; } }

  @keyframes fc-frame-out {
    from { transform: translate(0, 0); opacity: 0; }
    to   { transform: translate(calc(var(--o) * -1), calc(var(--o) * -1)); opacity: 1; }
  }
  @keyframes fc-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }

  @supports (animation-timeline: view()) {
    .fc-frame {
      animation: fc-frame-out linear both;
      animation-timeline: view();
      animation-range: entry 10% entry 60%;
    }
    .fc-rise {
      animation: fc-rise linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fc-frame, .fc-rise { animation: none; }
  }
`;

const highlights = [
  { title: "Parfums", text: "Des senteurs à découvrir" },
  { title: "Encens & bkhour", text: "L'art des belles ambiances" },
  { title: "Vêtements", text: "Des pièces choisies avec soin" },
];

const FeaturedCollectionSection = () => {
  return (
    <section
      aria-labelledby="featured-title"
      className="relative overflow-hidden bg-[#111111] py-16 sm:py-20 lg:py-28"
    >
      <style>{animationStyles}</style>

      {/* Décor : cercles discrets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-[#D4A638]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border border-[#D4A638]/10"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative mx-auto w-full max-w-md pl-3 pt-3 sm:max-w-lg sm:pl-4 sm:pt-4 lg:max-w-none">
            {/* Cadre doré décalé */}
            <div
              aria-hidden="true"
              className="fc-frame absolute inset-0 border border-[#D4A638]/50"
            />

            <figure className="group relative  overflow-hidden bg-[#292929]">
              <img
                src="/logo.png"
                alt="Flacon de parfum de la collection Luban"
                width={900}
                height={1000}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <figcaption className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
                <span className="text-sm font-medium text-[#E8C66A]">
                  Luban Edition
                </span>
                <p className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                  L'art du raffinement
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Contenu */}
          <div className="fc-rise lg:pl-4">
            <p className="text-sm font-medium text-[#D4A638]">
              Collection Signature
            </p>

            <h2
              id="featured-title"
              className="mt-4 font-serif text-4xl leading-tight text-[#F8F6F0] sm:text-5xl"
            >
              Une signature, une émotion.
            </h2>

            <div aria-hidden="true" className="my-7 h-px w-20 bg-[#D4A638] sm:my-8" />

            <p className="max-w-lg text-base leading-8 text-white/70">
              Parfums, senteurs, vêtements : une sélection de créations choisies
              une à une. Chaque détail invite à découvrir une nouvelle facette
              de l'élégance.
            </p>

            <ul className="mt-9 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:mt-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {highlights.map((item) => (
                <li key={item.title} className="py-5 sm:px-5 sm:py-6 sm:first:pl-0 sm:last:pr-0">
                  <p className="font-serif text-xl text-[#D4A638]">{item.title}</p>
                  <p className="mt-1.5 text-sm text-white/60">{item.text}</p>
                </li>
              ))}
            </ul>

            <a
              href="/collections"
              className="group mt-9 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#D4A638] px-8 py-4 text-sm font-semibold text-[#111111] transition-colors duration-300 hover:bg-[#E8C66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] sm:mt-10 sm:w-auto sm:justify-start"
            >
              Découvrir la collection
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionSection;