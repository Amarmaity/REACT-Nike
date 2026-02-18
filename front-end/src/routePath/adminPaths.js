

const ADMIN_BASE = "/backoffice";
export const ADMIN_PATHS = {
  ROOT: ADMIN_BASE,

  DASHBOARD: ADMIN_BASE,
  USERS: `${ADMIN_BASE}/users`,
  PAYMENTS: `${ADMIN_BASE}/payments`,
  ORDERS: `${ADMIN_BASE}/orders`,
  SETTINGS: `${ADMIN_BASE}/settings`,
  REPORTS: `${ADMIN_BASE}/reports`,
  CUSTOMERS: `${ADMIN_BASE}/customers`,
  WEBSITE_CONTENT: `${ADMIN_BASE}/website-content`,

  // Products
  PRODUCTS: `${ADMIN_BASE}/products`,
  PRODUCT_CREATE: `${ADMIN_BASE}/products/create`,
  PRODUCT_EDIT: (id = ":id") => `${ADMIN_BASE}/products/edit/${id}`,
  PRODUCT_VIEW: (id = ":id") => `${ADMIN_BASE}/products/view/${id}`  
};
