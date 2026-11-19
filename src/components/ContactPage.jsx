import React, { useRef, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaArrowRight,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";
import { SITE } from "../config/site";

/* Coordonnées : centralisées ici, avec valeurs de secours */
const WHATSAPP = SITE?.whatsapp || "212600000000";
const EMAIL = SITE?.email || "contact@lubanbk.com";
const INSTAGRAM = SITE?.instagram || "https://instagram.com/";
const PHONE_DISPLAY = SITE?.phoneDisplay || "+212 6XX XX XX XX";
const CITY = "Casablanca, Maroc";

/* Animations : une entrée orchestrée pour le hero, et une révélation
   au défilement uniquement sur les navigateurs qui la supportent
   (aucun JavaScript). Tout est désactivé si "réduire les animations". */
const animationStyles = `
  @keyframes ct-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: none; }
  }
  .ct-rise {
    animation: ct-rise .7s cubic-bezier(.2,.7,.2,1) both;
    animation-delay: var(--d, 0ms);
  }
  @keyframes ct-reveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }
  @supports (animation-timeline: view()) {
    .ct-reveal {
      animation: ct-reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 35%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ct-rise, .ct-reveal { animation: none; }
  }
`;

const inputClass =
  "w-full border border-[#E8E1D5] bg-[#F8F5EF] px-4 py-3.5 text-base text-[#29251F] " +
  "placeholder:text-[#9C9388] outline-none transition-[border-color,box-shadow,background-color] duration-200 " +
  "focus:border-[#D4A638] focus:bg-white focus:ring-2 focus:ring-[#D4A638]/25";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2";

const contactInfo = [
  {
    icon: <FaPhoneAlt />,
    title: "Téléphone",
    value: PHONE_DISPLAY,
    link: `tel:+${WHATSAPP}`,
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    value: EMAIL,
    link: `mailto:${EMAIL}`,
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Adresse",
    value: CITY,
    link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CITY)}`,
    external: true,
  },
];

const ContactPage = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sentVia, setSentVia] = useState(null); // "whatsapp" | "email" | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (sentVia) setSentVia(null);
  };

  const buildText = () =>
    [
      `Nom : ${form.name.trim()}`,
      `Email : ${form.email.trim()}`,
      `Sujet : ${form.subject.trim()}`,
      "",
      "Message :",
      form.message.trim(),
    ].join("\n");

  /* Canal principal : WhatsApp (c'est là que se font les commandes) */
  const handleWhatsApp = (e) => {
    e.preventDefault();
    const text = `Bonjour, je vous contacte depuis le site.\n\n${buildText()}`;
    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSentVia("whatsapp");
  };

  /* Canal secondaire : email */
  const handleEmail = () => {
    if (!formRef.current?.reportValidity()) return;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      form.subject.trim()
    )}&body=${encodeURIComponent(buildText())}`;
    setSentVia("email");
  };

  return (
    <main className="overflow-x-hidden bg-[#F8F5EF] text-[#29251F]">
      <style>{animationStyles}</style>

      {/* HERO */}
      <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
        <img
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1600&q=70&auto=format"
          alt=""
          width={1600}
          height={900}
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1A14]/75 via-[#1F1A14]/65 to-[#1F1A14]/80" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center text-white sm:py-24">
          <p className="ct-rise text-sm font-medium tracking-wide text-[#E8C66A]">
            Nous contacter
          </p>

          <h1
            className="ct-rise mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ "--d": "120ms" }}
          >
            Parlons ensemble.
          </h1>

          <p
            className="ct-rise mx-auto mt-5 max-w-xl text-sm leading-7 text-white/80 sm:mt-6 sm:text-base"
            style={{ "--d": "240ms" }}
          >
            Une question, un conseil ou une demande particulière ? Écrivez-nous,
            nous vous répondons rapidement.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className={`ct-rise mt-8 inline-flex min-h-12 items-center gap-3 bg-[#D4A638] px-7 py-3 text-sm font-semibold text-[#1F1A14] transition-colors hover:bg-[#E8C66A] ${focusRing}`}
            style={{ "--d": "360ms" }}
          >
            <FaWhatsapp aria-hidden="true" className="text-lg" />
            Écrire sur WhatsApp
          </a>
        </div>
      </section>

      {/* COORDONNÉES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="ct-reveal mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">
            Nous sommes à votre écoute
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#756D63] sm:text-base">
            Choisissez le moyen qui vous convient le mieux.
          </p>
        </div>

        <ul className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {contactInfo.map((item) => (
            <li key={item.title} className="ct-reveal">
              <a
                href={item.link}
                {...(item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className={`group flex h-full items-center gap-5 border border-[#E8E1D5] bg-white p-5 transition-[border-color,transform] duration-300 hover:border-[#D4A638] sm:p-7 md:flex-col md:justify-center md:p-9 md:text-center [@media(hover:hover)]:hover:-translate-y-1 motion-reduce:transition-none ${focusRing}`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#F8F5EF] text-lg text-[#A47C20] transition-colors duration-300 group-hover:bg-[#D4A638] group-hover:text-[#1F1A14] md:h-14 md:w-14 md:text-xl"
                >
                  {item.icon}
                </span>

                <span className="min-w-0">
                  <span className="block font-serif text-lg sm:text-xl">
                    {item.title}
                  </span>
                  <span className="mt-1 block break-words text-sm text-[#756D63] md:mt-3">
                    {item.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* FORMULAIRE + INFORMATIONS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="ct-reveal grid bg-white shadow-sm lg:grid-cols-2">
          {/* Formulaire : en premier sur mobile */}
          <div className="order-1 p-6 sm:p-10 lg:order-2 lg:p-14">
            <h2 className="mb-2 font-serif text-3xl sm:text-4xl">Écrivez-nous</h2>
            <p className="mb-8 text-sm text-[#756D63] sm:mb-10">
              Les champs marqués d'un * sont obligatoires.
            </p>

            <div role="status" aria-live="polite">
              {sentVia && (
                <div className="ct-rise mb-6 border border-[#D4A638] bg-[#F8F5EF] p-4 text-sm">
                  {sentVia === "whatsapp"
                    ? "WhatsApp s'ouvre avec votre message prêt à envoyer."
                    : "Votre application email s'ouvre avec votre message prêt à envoyer."}
                </div>
              )}
            </div>

            <form
              ref={formRef}
              onSubmit={handleWhatsApp}
              className="space-y-5 sm:space-y-6"
            >
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Nom complet <span className="text-[#A47C20]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Adresse email <span className="text-[#A47C20]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                  Sujet <span className="text-[#A47C20]">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Objet de votre message"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Votre message <span className="text-[#A47C20]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <button
                  type="submit"
                  className={`group flex min-h-12 flex-1 items-center justify-center gap-3 bg-[#1F1A14] px-6 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#D4A638] hover:text-[#1F1A14] ${focusRing}`}
                >
                  <FaWhatsapp aria-hidden="true" className="text-lg" />
                  Envoyer par WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleEmail}
                  className={`flex min-h-12 flex-1 items-center justify-center gap-3 border border-[#1F1A14] px-6 py-4 text-sm font-semibold text-[#1F1A14] transition-colors duration-300 hover:bg-[#1F1A14] hover:text-white ${focusRing}`}
                >
                  <FaPaperPlane aria-hidden="true" />
                  Envoyer par email
                </button>
              </div>
            </form>
          </div>

          {/* Informations */}
          <div className="order-2 bg-[#1F1A14] p-6 text-white sm:p-10 lg:order-1 lg:p-14">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              Nous serions ravis de vous entendre.
            </h2>

            <p className="mt-5 max-w-md leading-8 text-white/70 sm:mt-6">
              Conseils sur nos parfums, encens et vêtements, suivi de commande,
              demande personnalisée : nous vous accompagnons à chaque étape.
            </p>

            <dl className="mt-10 space-y-8 sm:mt-12">
              <div className="flex items-start gap-5">
                <FaClock aria-hidden="true" className="mt-1 flex-none text-xl text-[#D4A638]" />
                <div>
                  <dt className="font-medium">Horaires d'ouverture</dt>
                  <dd className="mt-2 text-sm text-white/65">
                    Lundi – Samedi : 09:00 – 18:00
                  </dd>
                  <dd className="mt-1 text-sm text-white/65">Dimanche : fermé</dd>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <FaMapMarkerAlt aria-hidden="true" className="mt-1 flex-none text-xl text-[#D4A638]" />
                <div>
                  <dt className="font-medium">Notre localisation</dt>
                  <dd className="mt-2 text-sm text-white/65">{CITY}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-10 border-t border-white/15 pt-8 sm:mt-14">
              <p className="text-sm text-white/65">Suivez-nous</p>

              <div className="mt-5 flex gap-4">
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#D4A638] hover:text-[#1F1A14] ${focusRing}`}
                >
                  <FaInstagram aria-hidden="true" />
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#D4A638] hover:text-[#1F1A14] ${focusRing}`}
                >
                  <FaWhatsapp aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="bg-[#D4A638] px-5 py-14 text-center sm:py-16">
        <div className="ct-reveal mx-auto max-w-xl">
          <FaWhatsapp aria-hidden="true" className="mx-auto text-4xl text-[#1F1A14]" />

          <h2 className="mt-5 font-serif text-3xl text-[#1F1A14] md:text-4xl">
            Besoin d'une réponse rapide ?
          </h2>

          <p className="mt-4 text-[#1F1A14]/75">
            Discutez directement avec nous sur WhatsApp.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className={`group mt-7 inline-flex min-h-12 items-center gap-3 bg-[#1F1A14] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#1F1A14] ${focusRing}`}
          >
            Discuter sur WhatsApp
            <FaArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;