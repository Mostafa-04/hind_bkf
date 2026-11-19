import { ArrowUpRight } from "lucide-react";
import { categories } from "../data/categories";

export default function CategoriesSection() {
  return (
    <section
      aria-labelledby="categories-title"
      className="bg-[#F8F6F0] px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center sm:mb-14">
          <div className="mb-4 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-8 bg-[#D4A638] sm:w-10" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#D4A638]" />
            <span className="h-px w-8 bg-[#D4A638] sm:w-10" />
          </div>

          <h2
            id="categories-title"
            className="font-serif text-3xl font-medium leading-tight text-[#111111] sm:text-4xl lg:text-5xl"
          >
            Nos catégories
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-[#292929]/70 sm:text-base">
            Parfums, encens, vêtements : des créations choisies avec soin,
            entre élégance et tradition.
          </p>
        </header>

        {/* Grille : 2 colonnes sur mobile, 4 sur grand écran */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={category.href}
                aria-label={`Découvrir ${category.name}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-[#292929] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F6F0]"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  width={600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
                />

                {/* Dégradé pour la lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Contenu */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-6">
                  {category.subtitle && (
                    <span className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#E8C66A] sm:mb-2 sm:text-xs">
                      {category.subtitle}
                    </span>
                  )}

                  <h3 className="font-serif text-lg font-medium leading-snug text-[#F8F6F0] transition-colors duration-300 sm:text-xl lg:text-2xl [@media(hover:hover)]:group-hover:text-[#E8C66A]">
                    {category.name}
                  </h3>

                  {/* Description : toujours visible dès sm sur tactile,
                      révélée au survol sur ordinateur */}
                  {category.description && (
                    <p className="mt-2 hidden text-xs leading-6 text-[#F8F6F0]/80 sm:block [@media(hover:hover)]:max-h-0 [@media(hover:hover)]:overflow-hidden [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-all [@media(hover:hover)]:duration-500 [@media(hover:hover)]:group-hover:max-h-24 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:max-h-24 [@media(hover:hover)]:group-focus-visible:opacity-100 motion-reduce:transition-none">
                      {category.description}
                    </p>
                  )}

                  {/* Lien */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#F8F6F0]/25 pt-3 sm:mt-4">
                    <span className="text-xs font-medium text-[#F8F6F0] sm:text-sm">
                      Découvrir
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4A638] text-[#D4A638] transition-colors duration-300 sm:h-9 sm:w-9 [@media(hover:hover)]:group-hover:bg-[#D4A638] [@media(hover:hover)]:group-hover:text-[#111111]"
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Lien général */}
        <div className="mt-10 text-center sm:mt-12">
          <a
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 border-b border-[#D4A638] pb-1 text-sm font-medium text-[#111111] transition-colors hover:text-[#A47C20] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F6F0]"
          >
            Voir toutes les collections
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}