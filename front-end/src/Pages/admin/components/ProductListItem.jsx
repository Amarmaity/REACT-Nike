const ProductListItem = ({ rank, name, value, secondary, trend }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-white/40 text-sm w-5">{rank}</span>

                <div>
                    <p className="text-white text-sm font-medium">{name}</p>
                    {secondary && (
                        <p className="text-xs text-white/40">{secondary}</p>
                    )}
                </div>
            </div>

            <div className="text-right">
                <p className="text-white text-sm font-semibold">{value}</p>
                {trend && (
                    <p
                        className={`text-xs ${trend > 0 ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {trend > 0 ? "+" : ""}
                        {trend}%
                    </p>
                )}
            </div>
        </div>
    );
};
export default ProductListItem;
