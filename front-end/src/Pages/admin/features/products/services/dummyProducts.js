export const dummyProducts = [
  {
    id: 1,
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    type: "variable",
    category: "Men",
    tags: ["running", "airmax"],
    description: "Nike Air Max 270 with responsive cushioning.",
    shortDescription: "Comfortable running shoes",
    status: "Active",
    featured: true,
    thumbnail: "https://via.placeholder.com/300",
    gallery: [],
    regularPrice: null,
    salePrice: null,
    sku: null,
    stock: null,
    stockStatus: "in_stock",
    manageStock: true,
    variations: [
      {
        id: 101,
        attributes: { size: "8", color: "Black" },
        regularPrice: 9000,
        salePrice: 8200,
        stock: 12,
        sku: "AM270-M-BLK-8"
      },
      {
        id: 102,
        attributes: { size: "9", color: "White" },
        regularPrice: 9000,
        salePrice: 8500,
        stock: 8,
        sku: "AM270-M-WHT-9"
      }
    ]
  },

  {
    id: 2,
    name: "Nike Pegasus 40",
    slug: "nike-pegasus-40",
    type: "variable",
    category: "Women",
    tags: ["running"],
    description: "Lightweight running shoes for daily training.",
    shortDescription: "Women running shoes",
    status: "Active",
    featured: false,
    thumbnail: "https://via.placeholder.com/300",
    gallery: [],
    regularPrice: null,
    salePrice: null,
    sku: null,
    stock: null,
    stockStatus: "in_stock",
    manageStock: true,
    variations: [
      {
        id: 201,
        attributes: { size: "6", color: "Pink" },
        regularPrice: 8500,
        salePrice: 7900,
        stock: 10,
        sku: "PEG40-W-PNK-6"
      },
      {
        id: 202,
        attributes: { size: "7", color: "Blue" },
        regularPrice: 8500,
        salePrice: 8000,
        stock: 6,
        sku: "PEG40-W-BLU-7"
      }
    ]
  },

  {
    id: 3,
    name: "Nike Revolution 6",
    slug: "nike-revolution-6",
    type: "variable",
    category: "Kids",
    tags: ["sports", "school"],
    description: "Durable and lightweight kids running shoes.",
    shortDescription: "Kids sports shoes",
    status: "Active",
    featured: false,
    thumbnail: "https://via.placeholder.com/300",
    gallery: [],
    regularPrice: null,
    salePrice: null,
    sku: null,
    stock: null,
    stockStatus: "in_stock",
    manageStock: true,
    variations: [
      {
        id: 301,
        attributes: { size: "3", color: "Red" },
        regularPrice: 5000,
        salePrice: 4500,
        stock: 15,
        sku: "REV6-K-RED-3"
      },
      {
        id: 302,
        attributes: { size: "4", color: "Black" },
        regularPrice: 5000,
        salePrice: 4700,
        stock: 12,
        sku: "REV6-K-BLK-4"
      }
    ]
  },

  {
    id: 4,
    name: "Nike Air Force 1",
    slug: "nike-air-force-1",
    type: "simple",
    category: "Men",
    tags: ["classic", "lifestyle"],
    description: "Classic Nike Air Force 1 sneakers.",
    shortDescription: "Timeless street style shoes",
    status: "Active",
    featured: true,
    thumbnail: "https://via.placeholder.com/300",
    gallery: [],
    regularPrice: 7500,
    salePrice: 7000,
    sku: "AF1-M-01",
    stock: 18,
    stockStatus: "in_stock",
    manageStock: true,
    variations: []
  },

  {
    id: 5,
    name: "Nike Court Vision Low",
    slug: "nike-court-vision-low",
    type: "simple",
    category: "Women",
    tags: ["casual"],
    description: "Retro-inspired casual sneakers.",
    shortDescription: "Everyday wear sneakers",
    status: "Active",
    featured: false,
    thumbnail: "https://via.placeholder.com/300",
    gallery: [],
    regularPrice: 6500,
    salePrice: 6000,
    sku: "CVL-W-01",
    stock: 20,
    stockStatus: "in_stock",
    manageStock: true,
    variations: []
  },

  {
    id: 6,
    name: "Nike Flex Runner",
    slug: "nike-flex-runner",
    type: "simple",
    category: "Kids",
    tags: ["school"],
    description: "Slip-on design for easy wear.",
    shortDescription: "Kids everyday shoes",
    status: "Active",
    featured: false,
    thumbnail: "https://via.placeholder.com/300",
    gallery: [],
    regularPrice: 4200,
    salePrice: 3900,
    sku: "FLEX-K-01",
    stock: 25,
    stockStatus: "in_stock",
    manageStock: true,
    variations: []
  }
];
