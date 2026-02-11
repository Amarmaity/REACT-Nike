
export const SECTIONS = {
  stats: "Quick Stats",
  categories: "Category Performance",
  analytics: "Sales & Users Analytics",
  productIntelligence: "Product Intelligence",
  businessSignals: "Business Signals"
};
const DashboardController = ({ visibleSections, toggleSection }) => {
  return (
    <div className="absolute right-0 top-full mt-3 w-64 rounded-xl bg-[#071a3a] border border-white/10 p-4 shadow-xl z-50">
      <h4 className="text-sm font-semibold text-white mb-3">
        Screen Options
      </h4>
      <div className="space-y-2">
        {Object.entries(visibleSections).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center  justify-between text-sm text-gray-200 cursor-pointer"
          >
            <span>{SECTIONS[key]}</span>
            <input            
              type="checkbox"
              checked={value}
              onChange={() => toggleSection(key)}
              className="accent-blue-500 cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  );
};
export default DashboardController;
