import { InsightCard } from "../../../components";

const LowStockAlerts = () => {
    const items = [
        { name: "AeroStep Pro Runner", stock: 8 },
        { name: "AeroStep Flex Women", stock: 12 },
        { name: "AeroStep Kids Boost", stock: 5 },
    ];

    return (
        <InsightCard
            title="Low Stock Alerts"
            subtitle="Immediate restock required"
        >
            {items.map((item, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                    <p className="text-white text-sm">{item.name}</p>
                    <span className="text-red-400 text-sm font-semibold">
                        {item.stock} left
                    </span>
                </div>
            ))}
        </InsightCard>
    );
};

export default LowStockAlerts;
