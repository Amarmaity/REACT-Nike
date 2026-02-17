import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { month: "Jan", sales: 180 },
    { month: "Feb", sales: 220 },
    { month: "Mar", sales: 200 },
    { month: "Apr", sales: 350 },
    { month: "May", sales: 370 },
    { month: "Jun", sales: 460 },
    { month: "Jul", sales: 390 },
    { month: "Aug", sales: 310 },
    { month: "Sep", sales: 360 },
    { month: "Oct", sales: 220 },
    { month: "Nov", sales: 400 },
    { month: "Dec", sales: 430 },
];

const SalesOverviewChart = () => {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#071a3a] to-[#06132d] p-6 h-[320px] flex flex-col">
            <div className="mb-4">
                <h3 className="text-white font-semibold">Sales Overview</h3>
                <p className="text-green-400 text-sm">(+5) more in 2025</p>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fill="url(#salesGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default SalesOverviewChart;
