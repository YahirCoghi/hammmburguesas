import type { SelectionType } from "@/lib/store-types";

type SeedExtraOption = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable?: boolean;
};

type SeedExtraGroup = {
  id: string;
  name: string;
  selectionType: SelectionType;
  minSelect: number;
  maxSelect: number;
  required: boolean;
  options: SeedExtraOption[];
};

type SeedProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  isSpicy?: boolean;
  image?: string;
  isFeatured?: boolean;
  featuredEyebrow?: string;
  featuredAccentClass?: string;
  stock: number;
  isAvailable?: boolean;
  prepMinutes: number;
  extraGroups: SeedExtraGroup[];
};

export const seedCategories = [
  {
    id: "hamburguesas",
    name: "Hamburguesas",
    blurb: "Doble smash, salsas propias y combinaciones bien pesadas.",
  },
  {
    id: "chanclas",
    name: "Chanclas",
    blurb: "Pollo crunchy con miel picante, slaw fresco y mucho character.",
  },
  {
    id: "papas",
    name: "Papas",
    blurb: "Sides con queso, bacon, dips y toppings para levantar cualquier orden.",
  },
  {
    id: "cachos-alitas",
    name: "Cachos y alitas",
    blurb: "Snacks para la mesa con salsas intensas y salida rapida.",
  },
  {
    id: "kids",
    name: "Kids",
    blurb: "Opciones simples, bien resueltas y sin vueltas para los peques.",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    blurb: "Refrescos, sodas y draft para cerrar el combo.",
  },
] as const;

function breadChoice(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-bread`,
    name: "Tipo de pan",
    selectionType: "single",
    minSelect: 1,
    maxSelect: 1,
    required: true,
    options: [
      { id: `${productId}-bread-brioche`, name: "Brioche dorado", price: 0, stock: 22 },
      { id: `${productId}-bread-potato`, name: "Potato bun", price: 250, stock: 18 },
    ],
  };
}

function burgerBoosts(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-boosts`,
    name: "Subele el nivel",
    selectionType: "multiple",
    minSelect: 0,
    maxSelect: 3,
    required: false,
    options: [
      { id: `${productId}-boosts-cheddar`, name: "Extra cheddar", price: 450, stock: 18 },
      { id: `${productId}-boosts-bacon`, name: "Bacon ahumado", price: 700, stock: 14 },
      { id: `${productId}-boosts-patty`, name: "Torta adicional", price: 1450, stock: 12 },
      { id: `${productId}-boosts-pickles`, name: "Pepinillos extra", price: 250, stock: 20 },
    ],
  };
}

function burgerSauces(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-sauces`,
    name: "Salsas",
    selectionType: "multiple",
    minSelect: 0,
    maxSelect: 2,
    required: false,
    options: [
      { id: `${productId}-sauces-secret`, name: "Salsa secreta", price: 0, stock: 32 },
      { id: `${productId}-sauces-chipotle`, name: "BBQ chipotle", price: 150, stock: 24 },
      { id: `${productId}-sauces-hot-honey`, name: "Hot honey", price: 200, stock: 18 },
    ],
  };
}

function chickenStyle(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-style`,
    name: "Estilo de crunch",
    selectionType: "single",
    minSelect: 1,
    maxSelect: 1,
    required: true,
    options: [
      { id: `${productId}-style-classic`, name: "Crunch clasico", price: 0, stock: 16 },
      { id: `${productId}-style-hot`, name: "Crunch spicy", price: 300, stock: 12 },
    ],
  };
}

function chickenAddOns(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-addons`,
    name: "Extras de pollo",
    selectionType: "multiple",
    minSelect: 0,
    maxSelect: 3,
    required: false,
    options: [
      { id: `${productId}-addons-cheese`, name: "Queso americano", price: 350, stock: 15 },
      { id: `${productId}-addons-slaw`, name: "Slaw extra", price: 300, stock: 10 },
      { id: `${productId}-addons-pickles`, name: "Pickles extra", price: 200, stock: 18 },
    ],
  };
}

function friesToppings(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-toppings`,
    name: "Toppings",
    selectionType: "multiple",
    minSelect: 0,
    maxSelect: 3,
    required: false,
    options: [
      { id: `${productId}-toppings-bacon`, name: "Bacon crujiente", price: 650, stock: 14 },
      { id: `${productId}-toppings-jalapeno`, name: "Jalapeno", price: 250, stock: 16 },
      { id: `${productId}-toppings-parmesano`, name: "Parmesano", price: 350, stock: 11 },
    ],
  };
}

function friesDips(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-dips`,
    name: "Dips",
    selectionType: "multiple",
    minSelect: 0,
    maxSelect: 2,
    required: false,
    options: [
      { id: `${productId}-dips-burger`, name: "Salsa burger", price: 0, stock: 20 },
      { id: `${productId}-dips-ranch`, name: "Ranch de la casa", price: 200, stock: 16 },
      { id: `${productId}-dips-garlic`, name: "Aioli ajo negro", price: 250, stock: 9 },
    ],
  };
}

function wingDips(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-dips`,
    name: "Dips para mojar",
    selectionType: "multiple",
    minSelect: 1,
    maxSelect: 2,
    required: true,
    options: [
      { id: `${productId}-dips-ranch`, name: "Ranch", price: 0, stock: 20 },
      { id: `${productId}-dips-bluecheese`, name: "Blue cheese", price: 250, stock: 11 },
      { id: `${productId}-dips-bbq`, name: "BBQ ahumada", price: 150, stock: 14 },
    ],
  };
}

function kidsDrink(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-drink`,
    name: "Bebida incluida",
    selectionType: "single",
    minSelect: 1,
    maxSelect: 1,
    required: true,
    options: [
      { id: `${productId}-drink-jugo`, name: "Jugo natural", price: 0, stock: 15 },
      { id: `${productId}-drink-tea`, name: "Te frio", price: 0, stock: 14 },
    ],
  };
}

function drinkSize(productId: string): SeedExtraGroup {
  return {
    id: `${productId}-size`,
    name: "Tamano",
    selectionType: "single",
    minSelect: 1,
    maxSelect: 1,
    required: true,
    options: [
      { id: `${productId}-size-regular`, name: "Regular", price: 0, stock: 25 },
      { id: `${productId}-size-large`, name: "Grande", price: 400, stock: 16 },
    ],
  };
}

export const seedProducts: SeedProduct[] = [
  {
    id: "onion-blazer",
    categoryId: "hamburguesas",
    name: "Onion Blazer",
    description:
      "Doble torta, onion strings, cheddar, pickles y salsa de la casa con golpe dulce.",
    price: 6950,
    badge: "Top seller",
    image: "/images/onion-blazer.jpg",
    isFeatured: true,
    featuredEyebrow: "Street icon",
    featuredAccentClass: "bg-[#f4efe7] text-[#111111]",
    stock: 11,
    prepMinutes: 22,
    extraGroups: [
      breadChoice("onion-blazer"),
      burgerBoosts("onion-blazer"),
      burgerSauces("onion-blazer"),
    ],
  },
  {
    id: "stan-smith-avocado",
    categoryId: "hamburguesas",
    name: "Stan Smith Avocado",
    description:
      "Smash burger con aguacate, mayo limonada, lechuga crujiente y pan brioche dorado.",
    price: 6500,
    badge: "Favorita",
    image: "/images/stan-smith-avocado.jpg",
    isFeatured: true,
    featuredEyebrow: "Fresh heat",
    featuredAccentClass: "bg-[#f5c200] text-[#111111]",
    stock: 7,
    prepMinutes: 20,
    extraGroups: [
      breadChoice("stan-smith-avocado"),
      burgerBoosts("stan-smith-avocado"),
      burgerSauces("stan-smith-avocado"),
    ],
  },
  {
    id: "og-hamm",
    categoryId: "hamburguesas",
    name: "OG HaMM",
    description:
      "Doble torta artesanal, cheddar, cebolla caramelizada, pepinillos y salsa secreta.",
    price: 5900,
    badge: "Clasica",
    stock: 14,
    prepMinutes: 18,
    extraGroups: [breadChoice("og-hamm"), burgerBoosts("og-hamm"), burgerSauces("og-hamm")],
  },
  {
    id: "bacon-air-jordan",
    categoryId: "hamburguesas",
    name: "Bacon Air Jordan",
    description: "Tocino ahumado, aros de cebolla, queso americano y BBQ chipotle.",
    price: 7200,
    badge: "Crujiente",
    stock: 6,
    prepMinutes: 21,
    extraGroups: [
      breadChoice("bacon-air-jordan"),
      burgerBoosts("bacon-air-jordan"),
      burgerSauces("bacon-air-jordan"),
    ],
  },
  {
    id: "truffle-hype",
    categoryId: "hamburguesas",
    name: "Truffle Hype",
    description: "Hongos salteados, queso suizo, aioli de trufa negra y cebolla grillada.",
    price: 7800,
    stock: 4,
    prepMinutes: 24,
    extraGroups: [
      breadChoice("truffle-hype"),
      burgerBoosts("truffle-hype"),
      burgerSauces("truffle-hype"),
    ],
  },
  {
    id: "double-drop",
    categoryId: "hamburguesas",
    name: "Double Drop",
    description:
      "Doble smash, doble queso, bacon candy y mostaza tostada con pan potato bun.",
    price: 7600,
    badge: "Nuevo",
    stock: 8,
    prepMinutes: 23,
    extraGroups: [
      breadChoice("double-drop"),
      burgerBoosts("double-drop"),
      burgerSauces("double-drop"),
    ],
  },
  {
    id: "chancla-classic",
    categoryId: "chanclas",
    name: "La Chancla Classic",
    description:
      "Pollo frito estilo Nashville, coleslaw fresco y mayo pepper en brioche.",
    price: 6100,
    stock: 9,
    prepMinutes: 19,
    extraGroups: [chickenStyle("chancla-classic"), chickenAddOns("chancla-classic")],
  },
  {
    id: "hot-honey-chancla",
    categoryId: "chanclas",
    name: "Chancla Hot Honey",
    description: "Pechuga crispy con hot honey, pickles y slaw de repollo morado.",
    price: 6600,
    badge: "Picante",
    isSpicy: true,
    stock: 5,
    prepMinutes: 19,
    extraGroups: [chickenStyle("hot-honey-chancla"), chickenAddOns("hot-honey-chancla")],
  },
  {
    id: "papas-supremas",
    categoryId: "papas",
    name: "Papas Supremas",
    description: "Papas fritas, queso fundido, bacon, cebollino y salsa burger cremosa.",
    price: 4300,
    badge: "Shareable",
    image: "/images/papas-supremas.jpg",
    isFeatured: true,
    featuredEyebrow: "Late-night fuel",
    featuredAccentClass: "bg-[#161616] text-white",
    stock: 10,
    prepMinutes: 14,
    extraGroups: [friesToppings("papas-supremas"), friesDips("papas-supremas")],
  },
  {
    id: "papas-triple-cheese",
    categoryId: "papas",
    name: "Triple Cheese Fries",
    description: "Mezcla de cheddar, mozzarella y parmesano con chile dulce tostado.",
    price: 3900,
    stock: 7,
    prepMinutes: 13,
    extraGroups: [friesToppings("papas-triple-cheese"), friesDips("papas-triple-cheese")],
  },
  {
    id: "papas-black-garlic",
    categoryId: "papas",
    name: "Black Garlic Fries",
    description: "Papas con aioli de ajo negro, parmesano rallado y limon rugido.",
    price: 4100,
    stock: 0,
    isAvailable: false,
    prepMinutes: 13,
    extraGroups: [friesToppings("papas-black-garlic"), friesDips("papas-black-garlic")],
  },
  {
    id: "alitas-kickflip",
    categoryId: "cachos-alitas",
    name: "Alitas Kickflip",
    description: "Seis alitas glaseadas con buffalo mantequilla y ranch de la casa.",
    price: 4950,
    isSpicy: true,
    stock: 6,
    prepMinutes: 17,
    extraGroups: [wingDips("alitas-kickflip")],
  },
  {
    id: "cachos-smoke",
    categoryId: "cachos-alitas",
    name: "Cachos Smoke and Dip",
    description: "Cachos rellenos con queso, jalapeno y dip ahumado para mojar sin miedo.",
    price: 3650,
    stock: 3,
    prepMinutes: 16,
    extraGroups: [
      {
        id: "cachos-smoke-dips",
        name: "Dip incluido",
        selectionType: "single",
        minSelect: 1,
        maxSelect: 1,
        required: true,
        options: [
          { id: "cachos-smoke-dips-bbq", name: "BBQ ahumada", price: 0, stock: 12 },
          { id: "cachos-smoke-dips-ranch", name: "Ranch", price: 0, stock: 10 },
        ],
      },
    ],
  },
  {
    id: "kids-mini-burger",
    categoryId: "kids",
    name: "Mini Burger Kids",
    description: "Burger sencilla con queso, papas mini y bebida pequena.",
    price: 4200,
    stock: 9,
    prepMinutes: 15,
    extraGroups: [kidsDrink("kids-mini-burger")],
  },
  {
    id: "kids-crispy-bites",
    categoryId: "kids",
    name: "Crispy Bites Kids",
    description: "Trocitos de pollo crispy con dip suave, papitas y jugo.",
    price: 3950,
    stock: 6,
    prepMinutes: 15,
    extraGroups: [kidsDrink("kids-crispy-bites")],
  },
  {
    id: "cola-artesanal",
    categoryId: "bebidas",
    name: "Cola Artesanal",
    description: "Refresco frio de la casa con especias y carbonatacion ligera.",
    price: 1700,
    stock: 20,
    prepMinutes: 4,
    extraGroups: [drinkSize("cola-artesanal")],
  },
  {
    id: "naranja-soda",
    categoryId: "bebidas",
    name: "Naranja Soda",
    description: "Soda naranja bien fria para balancear el combo.",
    price: 1600,
    stock: 18,
    prepMinutes: 4,
    extraGroups: [drinkSize("naranja-soda")],
  },
  {
    id: "birra-draft",
    categoryId: "bebidas",
    name: "Birra Draft",
    description: "Cerveza tirada nacional, perfecta para el cierre del drop.",
    price: 2400,
    badge: "Fria",
    stock: 12,
    prepMinutes: 4,
    extraGroups: [drinkSize("birra-draft")],
  },
];
