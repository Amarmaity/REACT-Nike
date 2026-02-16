import { InsightCard } from "../../../components";

const ConversionFunnel = () => {
    const steps = [
        { label: "Product Views", value: "12,400", percent: 100 },
        { label: "Add to Cart", value: "4,320", percent: 35 },
        { label: "Purchases", value: "1,280", percent: 10 },
    ];
    return (
        <InsightCard
            title="Conversion Funnel"
            subtitle="User journey performance"
        >
            {steps.map((step, i) => (
                <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{step.label}</span>
                        <span className="text-white">{step.value}</span>
                    </div>

                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${step.percent}%` }}
                        />
                    </div>
                </div>
            ))}
        </InsightCard>
    );
};
export default ConversionFunnel;
