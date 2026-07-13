import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategories } from "../features/products/subcategorySlice";
import CategoryCard from "./CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { subCategoryList = [], loading, error } = useSelector((state) => state.subCategory || {});
  const { products = [] } = useSelector((state) => state.products || {});

  useEffect(() => {
    if (!subCategoryList || subCategoryList.length === 0) {
      dispatch(fetchSubCategories());
    }
  }, [dispatch, subCategoryList.length]);

  
  const visibleCategories = useMemo(() => {
  if (!subCategoryList || subCategoryList.length === 0) return [];
  
  if (!products || products.length === 0) {
    return subCategoryList;
  }

  const idsWithProducts = new Set(
    products.map((p) =>
      String(p.sub_category_details?.id ?? p.sub_category ?? "")
    )
  );

  return subCategoryList.filter((sc) =>
    idsWithProducts.has(String(sc.id))
  );
}, [subCategoryList, products]);

  if (loading) return <div className="py-5 w-full px-[40px]">Loading...</div>;
  
  if (!visibleCategories || visibleCategories.length === 0) return null;

  return (
    <div className="py-5 w-full px-[40px]">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        loop={visibleCategories.length >= 4}
        speed={4000}
        navigation={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {visibleCategories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <CategoryCard category={cat} />
          </SwiperSlide>
        ))}
      </Swiper>
      {error && <p className="mt-4 text-sm text-red-400">Unable to load categories</p>}
    </div>
  );
};
export default CategoryList;
