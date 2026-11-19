import React from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaArrowRight,
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaRegCheckCircle,
  FaShoppingBag,
  FaChevronUp,
} from "react-icons/fa";
import { SITE } from "../config/site";

/* Coordonnées : une seule source (SITE), avec valeurs de secours */
const WHATSAPP = SITE?.whatsapp || "212600000000";
const INSTAGRAM = SITE?.instagram || "https://www.instagram.com/";
const ADDRESS = SITE?.address || "Casablanca, Maroc";

/* Animations : apparition au défilement en CSS pur (sans JavaScript),
   uniquement sur les navigateurs qui le supportent. Désactivée si
   l'utilisateur préfère moins de mouvement. */
const animationStyles = `
  @keyframes ft-reveal {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: none; }
  }
  @supports (animation-timeline: view()) {
    .ft-reveal {
      animation: ft-reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ft-reveal { animation: none; }
  }
`;

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1A14]";

/* Lien de pied de page : soulignement doré qui se dessine au survol */
const footerLink =
  `inline-block py-1 text-sm text-white/70 transition-colors duration-300 hover:text-[#D4A638] ` +
  `bg-[linear-gradient(#D4A638,#D4A638)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat ` +
  `[@media(hover:hover)]:hover:bg-[length:100%_1px] transition-[background-size,color] ` +
  `motion-reduce:transition-none ${focusRing}`;

const socialButton =
  `flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#D4A638] ` +
  `transition-[background-color,color,border-color,transform] duration-300 hover:border-[#D4A638] ` +
  `hover:bg-[#D4A638] hover:text-[#1F1A14] [@media(hover:hover)]:hover:-translate-y-0.5 ` +
  `motion-reduce:transition-none ${focusRing}`;

const quickLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/shop" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const categories = [
  { label: "Parfums", href: "/shop?category=parfums" },
  { label: "Encens", href: "/shop?category=encens" },
  { label: "Oud", href: "/shop?category=oud" },
  { label: "Collections", href: "/collections" },
];

/* Points de réassurance : décrivent le fonctionnement réel de la commande
   (panier → message WhatsApp → confirmation). À ajuster avec la cliente. */
const reassurance = [
  {
    icon: <FaShoppingBag aria-hidden="true" />,
    title: "Commande simple",
    text: "Votre panier part directement sur WhatsApp.",
  },
  {
    icon: <FaRegCheckCircle aria-hidden="true" />,
    title: "Disponibilité confirmée",
    text: "Nous vérifions votre commande avant de la valider.",
  },
  {
    icon: <FaRegCommentDots aria-hidden="true" />,
    title: "Conseils personnalisés",
    text: "Une question sur un parfum ? Écrivez-nous.",
  },
];

const NewsletterFooter = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="bg-[#1F1A14] text-[#F8F5EF]">
      <style>{animationStyles}</style>

      {/* Réassurance */}
      <section
        aria-label="Nos engagements"
        className="border-b border-white/10"
      >
        <ul className="mx-auto grid max-w-7xl gap-px px-6 py-10 sm:grid-cols-3 sm:gap-8 lg:px-12 lg:py-12">
          {reassurance.map((item) => (
            <li
              key={item.title}
              className="ft-reveal flex items-start gap-4 py-3 sm:py-0"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[#D4A638]/40 text-[#D4A638]">
                {item.icon}
              </span>
              <span>
                <span className="block font-medium text-[#F8F5EF]">{item.title}</span>
                <span className="mt-1 block text-sm leading-6 text-white/65">
                  {item.text}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Appel à l'action : WhatsApp et Instagram (là où se font les ventes) */}
      <section className="relative overflow-hidden border-b border-[#D4A638]/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#D4A638]/5 blur-3xl"
        />

        <div className="ft-reveal relative mx-auto max-w-7xl px-6 py-16 text-center sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Une question, une commande ?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-white/70">
              Écrivez-nous sur WhatsApp pour commander ou être conseillé. Suivez
              aussi nos nouveautés sur Instagram.
            </p>

            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex min-h-12 items-center justify-center gap-3 bg-[#D4A638] px-8 py-4 text-sm font-semibold text-[#1F1A14] transition-colors duration-300 hover:bg-[#E8C66A] ${focusRing}`}
              >
                <FaWhatsapp aria-hidden="true" className="text-lg" />
                Écrire sur WhatsApp
                <FaArrowRight
                  aria-hidden="true"
                  className="text-sm transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1"
                />
              </a>

              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex min-h-12 items-center justify-center gap-3 border border-white/30 px-8 py-4 text-sm font-medium text-[#F8F5EF] transition-colors duration-300 hover:border-[#D4A638] hover:text-[#D4A638] ${focusRing}`}
              >
                <FaInstagram aria-hidden="true" className="text-lg" />
                Voir Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-10">
          {/* Marque */}
          <div className="col-span-2 lg:col-span-4">
            <a href="/" aria-label="Luban BK, accueil" className={`inline-block ${focusRing}`}>
                <img
                  src="/logo1.png"
                  alt="Logo de Luban"
                  width={50}
                  height={60}
                  className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                />
            </a>

            <p className="mt-6 max-w-sm text-sm leading-8 text-white/65">
              Parfums, encens et créations inspirées de l'Orient : l'élégance, le
              raffinement et la tradition réunis.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={socialButton}
              >
                <FaInstagram size={18} aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className={socialButton}
              >
                <FaWhatsapp size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation" className="col-span-1 lg:col-span-2">
            <h3 className="mb-5 text-sm font-semibold text-[#D4A638]">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={footerLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collections */}
          <nav aria-label="Collections" className="col-span-1 lg:col-span-2">
            <h3 className="mb-5 text-sm font-semibold text-[#D4A638]">Collections</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.label}>
                  <a href={category.href} className={footerLink}>
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-4">
            <h3 className="mb-5 text-sm font-semibold text-[#D4A638]">Contact</h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <FaMapMarkerAlt aria-hidden="true" className="mt-1 flex-none text-[#D4A638]" />
                <div>
                  <p className="text-sm font-medium text-white/85">Notre boutique</p>
                  <p className="mt-1.5 text-sm leading-6 text-white/65">{ADDRESS}</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <FaWhatsapp aria-hidden="true" className="mt-1 flex-none text-[#D4A638]" />
                <div>
                  <p className="text-sm font-medium text-white/85">Commandes et questions</p>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${footerLink} mt-1`}
                  >
                    Discuter sur WhatsApp
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between lg:px-12">
          <p className="text-center text-xs text-white/55">
            © {currentYear} LUBAN BK. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <a href="/mentions-legales" className={`${footerLink} text-xs`}>
              Mentions légales
            </a>
            <a href="/politique-confidentialite" className={`${footerLink} text-xs`}>
              Politique de confidentialité
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={`group inline-flex min-h-11 items-center gap-2 text-xs text-white/70 transition-colors duration-300 hover:text-[#D4A638] ${focusRing}`}
          >
            Retour en haut
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-[#D4A638]">
              <FaChevronUp
                aria-hidden="true"
                className="text-[11px] transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default NewsletterFooter;