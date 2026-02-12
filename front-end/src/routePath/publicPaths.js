const PUBLIC_BASE = "";

export const PUBLIC_PATHS = {
  HOME: "/",
  SHOP: "/shop",

  PRODUCT_DETAILS: (slug = ":slug") => `/product/${slug}`,
  PRODUCT_BY_ID: (id = ":productId") => `/products/${id}`,

  CART: "/cart",
  CHECKOUT: "/checkout",

  LOGIN: "/user/login",
  REGISTER: "/user/register",

  PROFILE: (userName = ":userName") => `/profile/${userName}`,

  MENS: "/mens",
  CONTACT: "/contact",
};
