import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLeaf, FaGem, FaHeart, FaStar } from "react-icons/fa";

/* ---------- Animation au scroll ---------- */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // une seule fois
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const hiddenState = {
  up: "translate-y-10",
  left: "-translate-x-10",
  right: "translate-x-10",
  none: "",
};

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
        inView
          ? "translate-x-0 translate-y-0 opacity-100"
          : `opacity-0 ${hiddenState[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Données ---------- */
const values = [
  {
    icon: FaGem,
    title: "Qualité Premium",
    description:
      "Nous sélectionnons avec soin nos encens et parfums pour offrir une expérience exceptionnelle.",
  },
  {
    icon: FaLeaf,
    title: "Authenticité",
    description:
      "Nous valorisons les traditions, le fait main et le savoir-faire.",
  },
  {
    icon: FaHeart,
    title: "Passion",
    description:
      "Chaque détail est pensé avec passion pour vous proposer le meilleur.",
  },
];

const highlights = [
  "L'élégance au quotidien",
  "Le souci de chaque détail",
  "Une expérience unique",
];

/* ---------- Page ---------- */
export default function AboutPage() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className="overflow-x-clip bg-[#F8F5EF] text-[#29251F]">
      {/* HERO */}
      <section className="relative flex min-h-[75svh] items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1800"
          alt="Collection LUBAN"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[2500ms] ease-out motion-reduce:transition-none ${
            heroLoaded ? "scale-100" : "scale-110"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1A14]/70 via-[#1F1A14]/60 to-[#1F1A14]/80" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 text-center text-white sm:px-6 md:py-32">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4A638] sm:text-xs">
              Notre histoire
            </span>
          </Reveal>

          <Reveal delay={150}>
            <h1 className="mt-5 font-serif text-4xl leading-[1.1] sm:text-5xl md:mt-6 md:text-7xl">
              <span className="block">L'élégance dans</span>
              <span className="block text-[#D4A638]">chaque détail.</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8 md:mt-7">
              Bienvenue dans l'univers LUBAN, une marque d'encens et de
              parfums inspirée par la beauté, l'élégance et l'authenticité.
            </p>
          </Reveal>
        </div>
      </section>

      {/* NOTRE HISTOIRE */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal direction="left">
            <div className="relative">
              <div className="group overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000"
                  alt="Notre univers"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:aspect-auto md:h-[520px]"
                />
              </div>

              <div className="absolute bottom-0 right-0 bg-[#D4A638] p-5 sm:p-6 md:-bottom-6 md:-right-6 md:p-8">
                <p className="font-serif text-2xl text-[#1F1A14] md:text-3xl">
                  LUBAN
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-[#1F1A14]/80 md:text-xs">
                  Fait main • Casablanca
                </p>
              </div>
            </div>
          </Reveal>

          <div className="md:pl-8">
            <Reveal direction="right">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B18A32]">
                Qui sommes-nous ?
              </span>

              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl md:mt-5 md:text-5xl">
                Une vision de la beauté et de l'élégance.
              </h2>

              <div className="my-6 h-[2px] w-16 bg-[#D4A638] md:my-7" />
            </Reveal>

            <Reveal direction="right" delay={150}>
              <p className="mb-5 leading-7 text-[#6B6258] md:leading-8">
                LUBAN est un univers dédié à celles et ceux qui apprécient
                l'élégance, la qualité et les belles choses. Notre ambition
                est de proposer une sélection d'encens, de parfums et de
                créations qui associe esthétique, caractère et raffinement.
              </p>

              <p className="mb-8 leading-7 text-[#6B6258] md:leading-8">
                Nous croyons que le luxe se trouve dans les détails : le choix
                des matières, la présentation et l'expérience que chaque
                produit procure.
              </p>
            </Reveal>

            <Reveal direction="right" delay={300}>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-4 bg-[#1F1A14] px-7 py-4 text-xs uppercase tracking-widest text-white transition hover:bg-[#D4A638] hover:text-[#1F1A14] sm:px-8"
              >
                Découvrir la boutique
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="bg-[#1F1A14] py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4A638]">
                Nos engagements
              </span>

              <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:mt-5 md:text-5xl">
                Les valeurs qui nous définissent
              </h2>

              <p className="mt-5 leading-7 text-white/60">
                Chaque choix reflète notre engagement envers une expérience
                authentique et raffinée.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 150}
                className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <div className="group h-full border border-white/10 p-8 text-center transition duration-500 hover:-translate-y-2 hover:border-[#D4A638] hover:bg-white/[0.03] md:p-10">
                  <div className="mb-6 flex justify-center text-3xl text-[#D4A638] transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110 motion-reduce:transform-none md:mb-7">
                    <Icon />
                  </div>

                  <h3 className="mb-4 font-serif text-xl md:text-2xl">
                    {title}
                  </h3>

                  <p className="text-sm leading-7 text-white/60">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHIE */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <Reveal direction="left">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B18A32]">
                Notre philosophie
              </span>

              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl md:mt-5 md:text-5xl">
                Le luxe n'est pas seulement une apparence.
              </h2>

              <div className="my-6 h-[2px] w-16 bg-[#D4A638] md:my-7" />

              <p className="mb-6 leading-7 text-[#6B6258] md:leading-8">
                C'est une sensation, une attention particulière et une
                expérience qui reste dans les mémoires.
              </p>
            </Reveal>

            <ul className="space-y-5">
              {highlights.map((text, i) => (
                <Reveal key={text} direction="left" delay={150 + i * 120}>
                  <li className="flex items-center gap-4">
                    <FaStar className="shrink-0 text-xl text-[#D4A638]" />
                    <span className="text-sm tracking-wide">{text}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal direction="right" className="order-1 md:order-2">
            <div className="group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000"
                alt="Notre philosophie"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:aspect-auto md:h-[520px]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#D4A638] px-5 py-16 text-center sm:px-6 md:py-20">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-[#1F1A14]/70">
            L'univers LUBAN
          </span>

          <h2 className="mt-4 font-serif text-3xl text-[#1F1A14] sm:text-4xl md:mt-5 md:text-5xl">
            Découvrez notre sélection.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#1F1A14]/70">
            Explorez notre collection d'encens et de parfums et trouvez ceux
            qui correspondent à votre style.
          </p>

          <Link
            to="/shop"
            className="group mt-8 inline-flex items-center gap-4 bg-[#1F1A14] px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:bg-white hover:text-[#1F1A14] md:px-9"
          >
            Explorer la boutique
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}