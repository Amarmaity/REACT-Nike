import React, { useMemo, useRef, useState } from "react";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { Navigation, Mousewheel } from "swiper/modules";
import { ChevronUp, ChevronDown } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";
import ArrowButton from "./ArrowButton";


const ProductGallery = ({
    galleryImages,
    selectedImage,
    mainImage,
    setMainImage,
    setSelectedImage,
    product,
}) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const [open, setOpen] = useState(false);

    const slides = useMemo(
        () =>
            galleryImages.map((img) => ({
                src: img.image,
            })),
        [galleryImages]
    );

    const currentIndex = galleryImages.findIndex(
        (item) => item.image === mainImage
    );

    return (
        <>
            <div className="flex flex-col md:flex-row gap-5">

                {/* Thumbnail Slider */}

                <div className="relative md:w-[110px] w-full">

                    {/* Top Arrow */}
                   <ArrowButton ref={prevRef} className="top-0">
                        <ChevronUp className="text-gray-800" />
                    </ArrowButton>
                    

                    <Swiper
                        direction="vertical"
                        slidesPerView={5}
                        spaceBetween={12}
                        mousewheel
                        modules={[Navigation, Mousewheel]}
                        navigation
                        onSwiper={(swiper) => {
                            setTimeout(() => {
                                if (!swiper.params.navigation) return;

                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;

                                swiper.navigation.destroy();
                                swiper.navigation.init();
                                swiper.navigation.update();
                            });
                        }}
                        className="h-[650px] py-10"
                    >
                        {galleryImages.map((item) => (
                            <SwiperSlide key={item.id}>
                                <img
                                    src={item.image}
                                    alt={product.name}
                                    loading="lazy"
                                    onMouseEnter={() => setMainImage(item.image)}
                                    onMouseLeave={() => setMainImage(selectedImage)}
                                    onClick={() => {
                                        setSelectedImage(item.image);
                                        setMainImage(item.image);
                                    }}
                                    className={`
                                    h-[110px]
                                    w-full
                                    object-cover
                                    rounded-lg
                                    cursor-pointer
                                    border-2
                                    transition-all
                                    duration-300
                                    ${selectedImage === item.image
                                            ? "border-[#138695] shadow-lg scale-105"
                                            : "border-gray-300 hover:border-[#138695]"
                                    }
                       `}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Bottom Arrow */}                  
                       
                       <ArrowButton ref={nextRef} className="bottom-0">
                        <ChevronDown className="text-gray-800" />
                    </ArrowButton>
                    
                    

                </div>

                {/* Main Image */}

                <div className="flex-1">

                    <img
                        src={mainImage}
                        alt={product.name}
                        onClick={() => setOpen(true)}
                        className="
                            md:h-[650px]
                            w-full
                            object-cover
                            rounded-xl
                            cursor-zoom-in
                            transition-all
                            duration-300
                        "
                    />

                </div>

            </div>

            {/* Lightbox */}

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={currentIndex}
                plugins={[Zoom, Thumbnails]}
            />
        </>
    );
};

export default ProductGallery;