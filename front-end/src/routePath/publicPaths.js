const PUBLIC_BASE = "";

export const PUBLIC_PATHS = {
  HOME: "/",
  SHOP: "/shop",

  PRODUCT_DETAILS: (
    id = ":id",
    slug = ":slug"
  ) => `/products/${id}/${slug}`,

  CART: "/cart",
  CHECKOUT: "/checkout",

  LOGIN: "/user/login",
  REGISTER: "/user/register",

  PROFILE: (userName = ":userName") => `/profile/${userName}`,
  CATEGORY: (Id = ":Id") => `/category/${Id}`,

  MENS: "/mens",
  CONTACT: "/contact",
};
