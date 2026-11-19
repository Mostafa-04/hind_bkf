import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingBag, Eye, Star } from "lucide-react";
import Reveal from "./Reveal";
import { getBestSellers, formatPrice, getDiscount, getWhatsAppUrl } from "../utils/products";

const products = getBestSellers(4);


export default function BestSellersSection() {
  return (
    <section className="overflow-x-clip bg-[#111111] px-4 py-16 sm:px-8 md:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal>
          <div className="mb-10 flex flex-col items-center text-center md:mb-14">
            <div className="mb-4 flex items-center gap-3 md:mb-5">
              <span className="h-px w-8 bg-[#D4A638] md:w-10" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4A638] sm:text-xs">
                Nos incontournables
              </span>
              <span className="h-px w-8 bg-[#D4A638] md:w-10" />
            </div>

            <h2 className="font-serif text-3xl font-medium text-[#F8F6F0] sm:text-4xl md:text-5xl">
              Nos
              <span className="ml-3 italic text-[#D4A638]">best-sellers</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#F8F6F0]/55 md:mt-5">
              Découvrez les créations préférées de nos clientes, sélectionnées
              pour leur élégance et leur caractère unique.
            </p>
          </div>
        </Reveal>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
          {products.map((product, index) => {
            const discount = getDiscount(product.price, product.oldPrice);

            return (
              <Reveal key={product.id} delay={(index % 4) * 120}>
                <article className="group relative">
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#292929]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/50 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                    {/* Lien produit sur toute l'image */}
                    <Link
                      to={`/product/${product.id}`}
                      aria-label={`Voir ${product.name}`}
                      className="absolute inset-0 z-[1]"
                    />

                    {/* Badge */}
                    <span className="absolute left-2.5 top-2.5 z-[2] bg-[#D4A638] px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-[#111111] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[9px]">
                      {product.badge}
                    </span>

                    {/* Voir le produit (visible sur mobile, au survol sur desktop) */}
                    <Link
                      to={`/product/${product.id}`}
                      aria-label={`Voir le détail de ${product.name}`}
                      className="absolute right-2.5 top-2.5 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F6F0] text-[#111111] transition-all duration-300 hover:bg-[#D4A638] focus-visible:translate-x-0 focus-visible:opacity-100 sm:right-4 sm:top-4 sm:h-10 sm:w-10 lg:translate-x-3 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100"
                    >
                      <Eye size={16} />
                    </Link>

                    {/* Commander : overlay desktop uniquement */}
                    <a
                      href={getWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 left-4 right-4 z-[2] hidden translate-y-4 items-center justify-center gap-2 bg-[#D4A638] py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#111111] opacity-0 transition-all duration-300 hover:bg-[#E8C66A] focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
                    >
                      <ShoppingBag size={15} />
                      Commander
                    </a>
                  </div>

                  {/* Product Info */}
                  <div className="pt-4 sm:pt-5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4A638]/80 sm:text-[10px]">
                        {product.category}
                      </span>

                      {product.rating > 0 && (
                        <div
                          className="flex items-center gap-0.5"
                          role="img"
                          aria-label={`Note : ${product.rating} sur 5`}
                        >
                          {Array.from({ length: product.rating }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              fill="#D4A638"
                              stroke="#D4A638"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-lg leading-snug text-[#F8F6F0] transition-colors group-hover:text-[#D4A638] sm:text-xl">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-3">
                      <span className="text-sm font-semibold text-[#D4A638]">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice && (
                        <>
                          <span className="text-xs text-[#F8F6F0]/35 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                          <span className="text-[10px] font-semibold text-[#E8C66A]">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Commander : mobile / tablette */}
                    <a
                      href={getWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 border border-[#D4A638] py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A638] transition-colors hover:bg-[#D4A638] hover:text-[#111111] active:bg-[#D4A638] active:text-[#111111] lg:hidden"
                    >
                      <ShoppingBag size={14} />
                      Commander
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* View All Button */}
        <Reveal delay={200}>
          <div className="mt-12 text-center md:mt-16">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 border border-[#D4A638] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A638] transition-all duration-300 hover:bg-[#D4A638] hover:text-[#111111] sm:px-8"
            >
              Voir tous les produits
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}