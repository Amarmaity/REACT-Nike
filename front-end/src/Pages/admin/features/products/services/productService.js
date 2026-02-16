import api from "../../../../../api/axios";
// GET products
export const getProducts = async ({ queryKey }) => {
  const [_key, { page, search }] = queryKey;

  const { data } = await api.get("/products", {
    params: { page, search },
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
