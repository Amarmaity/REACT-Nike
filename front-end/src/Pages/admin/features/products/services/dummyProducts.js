export const dummyProducts = [
  {
    id: 1,
    name: "Nike Air Max",
    slug: "nike-air-max",
    type: "variable",
    category: "Fashion",
    brand: "Nike",
    tags: ["running", "sports", "men"],
    description: "Comfortable running shoes for daily use.",
    shortDescription: "Lightweight running shoes",
    status: "Active",
    featured: true,

    thumbnail: "https://via.placeholder.com/300",
    gallery: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300"
    ],

    regularPrice: null,
    salePrice: null,

    sku: null,
    stock: null,
    stockStatus: "in_stock",
    manageStock: true,

    variations: [
      {
        id: 101,
        attributes: {
          size: "8",
          color: "Black"
        },
        regularPrice: 6000,
        salePrice: 5500,
        stock: 10,
        sku: "NIKE-BLK-8"
      },
      {
        id: 102,
        attributes: {
          size: "9",
          color: "White"
        },
        regularPrice: 6200,
        salePrice: 5800,
        stock: 5,
        sku: "NIKE-WHT-9"
      }
    ]
  },

  {
    id: 2,
    name: "iPhone 15",
    slug: "iphone-15",
    type: "simple",
    category: "Mobile",
    brand: "Apple",
    tags: ["smartphone", "ios"],
    description: "Latest Apple iPhone with A17 chip.",
    shortDescription: "Apple iPhone 15",
    status: "Active",
    featured: false,

    thumbnail: "https://via.placeholder.com/300",
    gallery: [],

    regularPrice: 90000,
    salePrice: 85000,

    sku: "IPHONE-15",
    stock: 12,
    stockStatus: "in_stock",
    manageStock: true,

    variations: []
  }
];
