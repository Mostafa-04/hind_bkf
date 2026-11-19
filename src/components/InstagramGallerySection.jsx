
import { ArrowUpRight } from "lucide-react";
import {FaInstagram} from "react-icons/fa";

const instagramImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=85",
    alt: "Collection de parfums",
    category: "Parfums",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85",
    alt: "Produits de beauté",
    category: "Beauté",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=85",
    alt: "Fragrance élégante",
    category: "Fragrances",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=700&q=85",
    alt: "Parfum premium",
    category: "Collection",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=85",
    alt: "Flacon de parfum",
    category: "Parfums",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
    alt: "Produits de soin",
    category: "Lifestyle",
  },
];

const INSTAGRAM_URL = "https://www.instagram.com/luban_hindbkf/";

const InstagramGallerySection = () => {
  return (
    <section className="overflow-hidden bg-[#F8F6F0] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4A638]">
              Retrouvez-nous
            </span>

            <h2 className="mt-4 font-serif text-3xl text-[#111111] md:text-5xl">
              LUBAN sur
              <span className="italic text-[#D4A638]"> Instagram</span>
            </h2>

            <p className="mt-4 text-sm text-[#292929]/60">
              Plongez dans notre univers et découvrez nos inspirations.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-[#D4A638] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#111111] transition-all duration-300 hover:bg-[#D4A638]"
          >
            <FaInstagram size={17} />
            @luban_hindbkf
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Instagram images */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {instagramImages.map((item) => (
            <a
              key={item.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Découvrir LUBAN sur Instagram - ${item.alt}`}
              className="group relative aspect-square overflow-hidden bg-[#292929]"
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111]/0 transition-all duration-500 group-hover:bg-[#111111]/60">
                <FaInstagram
                  size={30}
                  className="translate-y-4 text-[#D4A638] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                />

                <span className="mt-3 translate-y-4 text-xs font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.category}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 font-serif text-xl text-[#111111] transition-colors hover:text-[#D4A638]"
          >
            Suivez notre univers
            <ArrowUpRight
              size={20}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramGallerySection;
