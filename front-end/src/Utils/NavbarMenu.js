import { PUBLIC_PATHS } from "../routePath/publicPaths";

export const NavbarMenu = [
  { id: 1, title: "Home", link: `${PUBLIC_PATHS.HOME}` },
  { id: 2, title: "Shop", link: `${PUBLIC_PATHS.SHOP}` },
  { id: 3, title: "Mens", link: `$${PUBLIC_PATHS.CATEGORY(3)}` },
  { id: 4, title: "Womens", link: `${PUBLIC_PATHS.CATEGORY(1)}` },
  { id: 5, title: "Kids", link: `${PUBLIC_PATHS.CATEGORY(2)}` },
  { id: 6, title: "Contact", link: `${PUBLIC_PATHS.CONTACT}` },
];
