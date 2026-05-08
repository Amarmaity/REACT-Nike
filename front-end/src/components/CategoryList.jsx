import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategories } from "../features/products/subcategory/subcategory";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CategoryList = () => {
    const dispatch = useDispatch();

    const { subCategoryList, loading } = useSelector(
        (state) => state.subCategory
    );

    useEffect(() => {
        if (subCategoryList.length === 0) {
            dispatch(fetchSubCategories());
        }
    }, [dispatch, subCategoryList.length]);
    console.log(subCategoryList)
    return (
        <div className="py-5 w-full px-[40px]" >           
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    slidesPerView={4}
                    loop={true}
                    speed={4000} 
                    navigation={true}
                    
                    autoplay={{
                        delay: 0, 
                        disableOnInteraction: true,
                    }}
                    allowTouchMove={true} 
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                >
                    {subCategoryList.map((cat) => (
                        <SwiperSlide  key={cat.id}>
                            <CategoryCard category={cat} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};
export default CategoryList;