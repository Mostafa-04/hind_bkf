export const categories = [
  {
    id: 1,
    slug: "parfums",
    name: "Parfums",
    subtitle: "L'ESSENCE DE L'ÉLÉGANCE",
    description: "Des fragrances uniques pour révéler votre personnalité.",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=85",
    number: "01",
  },
  {
    id: 2,
    slug: "boukhour",
    name: "Boukhour",
    subtitle: "L'ART DES TRADITIONS",
    description: "Des senteurs envoûtantes pour sublimer vos espaces.",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85",
    number: "02",
  },
  {
    id: 3,
    slug: "luban",
    name: "Luban & Encens",
    subtitle: "LA BEAUTÉ NATURELLE",
    description: "Découvrez l'univers authentique des résines parfumées.",
    image:
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=900&q=85",
    number: "03",
  },
  {
    id: 4,
    slug: "mode",
    name: "Mode Femme",
    subtitle: "L'ÉLÉGANCE AU FÉMININ",
    description: "Des pièces soigneusement sélectionnées pour vous.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    number: "04",
  },
].map((c) => ({ ...c, href: `/shop?category=${c.slug}` }));