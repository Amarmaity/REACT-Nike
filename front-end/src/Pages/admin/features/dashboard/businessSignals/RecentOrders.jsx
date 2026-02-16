import { InsightCard } from "../../../components";

const RecentOrders = () => {
    const orders = [
        { id: "#ORD1024", customer: "John Doe", amount: "$240", status: "Paid" },
        { id: "#ORD1023", customer: "Sarah Lee", amount: "$180", status: "Pending" },
        { id: "#ORD1022", customer: "Mike Ross", amount: "$320", status: "Paid" },
    ];

    return (
        <InsightCard title="Recent Orders" subtitle="Last 24 hours">
            {orders.map((order, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div>
                        <p className="text-white text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-white/40">{order.customer}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-white text-sm">{order.amount}</p>
                        <span
                            className={`text-xs ${order.status === "Paid"
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>
                </div>
            ))}
        </InsightCard>
    );
};

export default RecentOrders;
