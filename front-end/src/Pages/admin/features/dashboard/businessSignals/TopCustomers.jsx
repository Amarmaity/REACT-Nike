import { InsightCard } from "../../../components";

const TopCustomers = () => {
    const customers = [
        { name: "Emily Clark", spent: "$2,430", orders: 18 },
        { name: "Daniel Smith", spent: "$1,980", orders: 14 },
        { name: "Sophia Brown", spent: "$1,620", orders: 11 },
    ];

    return (
        <InsightCard title="Top Customers" subtitle="Highest lifetime value">
            {customers.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div>
                        <p className="text-white text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-white/40">{c.orders} orders</p>
                    </div>

                    <p className="text-green-400 font-semibold">{c.spent}</p>
                </div>
            ))}
        </InsightCard>
    );
};

export default TopCustomers;
