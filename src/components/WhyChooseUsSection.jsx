import { Award, Sparkles, MessageCircle, PackageCheck, ArrowUpRight } from "lucide-react";
import { SITE } from "../config/site";

const WHATSAPP = SITE?.whatsapp || "212600000000";

/* Animation : les cartes apparaissent l'une après l'autre au défilement,
   en CSS pur (--i = position de la carte). Sans support du navigateur
   ou avec "réduire les animations", tout s'affiche simplement. */
const animationStyles = `
  @keyframes wc-reveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }
  @supports (animation-timeline: view()) {
    .wc-reveal {
      animation: wc-reveal linear both;
      animation-timeline: view();
      animation-range:
        entry calc(var(--i, 0) * 6%)
        entry calc(40% + var(--i, 0) * 6%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .wc-reveal { animation: none; }
  }
`;

const advantages = [
  {
    id: "selection",
    icon: Award,
    title: "Une sélection soignée",
    description:
      "Parfums, encens et vêtements choisis un par un, pour vous faire découvrir de belles pièces.",
  },
  {
    id: "commande",
    icon: MessageCircle,
    title: "Commande par WhatsApp",
    description:
      "Remplissez votre panier : votre commande est envoyée directement, sans créer de compte.",
  },
  {
    id: "disponibilite",
    icon: PackageCheck,
    title: "Disponibilité confirmée",
    description:
      "Nous vérifions votre commande et la livraison avec vous avant de la valider.",
  },
  {
    id: "conseils",
    icon: Sparkles,
    title: "Des conseils personnalisés",
    description:
      "Un doute sur une senteur ou une taille ? Posez vos questions, nous vous répondons.",
  },
];

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F6F0]";

const WhyChooseUsSection = () => {
  return (
    <section
      aria-labelledby="why-title"
      className="relative overflow-hidden bg-[#F8F6F0] py-16 sm:py-20 lg:py-28"
    >
      <style>{animationStyles}</style>

      {/* Décor : cercles discrets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full border border-[#D4A638]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-32 h-56 w-56 rounded-full border border-[#D4A638]/15"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Titre */}
        <header className="wc-reveal mx-auto mb-10 max-w-2xl text-center sm:mb-14 lg:mb-16">
          <h2
            id="why-title"
            className="text-balance font-serif text-3xl leading-tight text-[#111111] sm:text-4xl md:text-5xl"
          >
            Pourquoi choisir Luban ?
          </h2>

          <div aria-hidden="true" className="mx-auto my-6 h-px w-20 bg-[#D4A638] sm:my-7" />

          <p className="text-base leading-8 text-[#292929]/75">
            Plus qu'une boutique : un accompagnement simple, de la découverte
            du produit jusqu'à la confirmation de votre commande.
          </p>
        </header>

        {/* Avantages */}
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {advantages.map((item, index) => {
            const Icon = item.icon;

            return (
              <li
                key={item.id}
                className="wc-reveal group relative flex gap-5 border border-[#D4A638]/25 bg-white/70 p-5 transition-[transform,background-color,border-color] duration-500 sm:block sm:p-7 lg:p-8 motion-reduce:transition-none [@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:border-[#D4A638] [@media(hover:hover)]:hover:bg-[#111111]"
                style={{ "--i": index }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 flex-none items-center justify-center border border-[#D4A638]/40 bg-[#D4A638]/10 transition-colors duration-500 sm:mb-7 sm:h-14 sm:w-14 [@media(hover:hover)]:group-hover:bg-[#D4A638]"
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-[#A47C20] transition-colors duration-500 [@media(hover:hover)]:group-hover:text-[#111111]"
                  />
                </span>

                <div>
                  <h3 className="font-serif text-xl text-[#111111] transition-colors duration-500 sm:mb-1 [@media(hover:hover)]:group-hover:text-[#F8F6F0]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#292929]/70 transition-colors duration-500 sm:mt-3 [@media(hover:hover)]:group-hover:text-white/70">
                    {item.description}
                  </p>

                  <div
                    aria-hidden="true"
                    className="mt-5 hidden h-px w-10 bg-[#D4A638] transition-[width] duration-500 sm:mt-7 sm:block [@media(hover:hover)]:group-hover:w-20"
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {/* Appel à l'action */}
        <div className="wc-reveal mt-12 flex flex-col items-center justify-between gap-7 border-t border-[#D4A638]/30 pt-10 text-center sm:mt-16 md:flex-row md:text-left">
          <div>
            <p className="font-serif text-2xl text-[#111111] md:text-3xl">
              Prête à choisir votre prochaine pièce ?
            </p>
            <p className="mt-2 text-sm text-[#292929]/70 sm:text-base">
              Parcourez la boutique ou écrivez-nous pour être conseillée.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <a
              href="/shop"
              className={`group inline-flex min-h-12 items-center justify-center gap-3 bg-[#111111] px-8 py-4 text-sm font-semibold text-[#D4A638] transition-colors duration-300 hover:bg-[#D4A638] hover:text-[#111111] ${focusRing}`}
            >
              Explorer la boutique
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-12 items-center justify-center gap-3 border border-[#111111]/30 px-8 py-4 text-sm font-medium text-[#111111] transition-colors duration-300 hover:border-[#D4A638] hover:text-[#A47C20] ${focusRing}`}
            >
              <MessageCircle size={18} aria-hidden="true" />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;