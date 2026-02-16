const InsightCard = ({ title, subtitle, children }) => {
    return (
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-5 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-white font-semibold">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-white/50">{subtitle}</p>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {children}
            </div>
        </div>
    );
};

export default InsightCard;
