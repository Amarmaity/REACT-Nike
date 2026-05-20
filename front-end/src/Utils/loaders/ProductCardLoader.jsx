import React from "react";

const ProductCardLoader = () => {
    return (
        <div className="animate-pulse">

            {/* Image */}
            <div className="h-[250px] w-full rounded-2xl bg-neutral-800"></div>           
            <div className="mt-4 flex items-start justify-between gap-4">                
                <div className="flex-1">
                    <div className="h-5 w-[150px] rounded bg-neutral-700"></div>
                </div>                
                <div className="flex flex-col items-end gap-2">                   
                    <div className="h-5 w-[100px] rounded bg-neutral-700"></div>                    
                    <div className="h-4 w-[100px] rounded bg-neutral-800"></div>

                </div>

            </div>

        </div>
    );
};
export default ProductCardLoader;