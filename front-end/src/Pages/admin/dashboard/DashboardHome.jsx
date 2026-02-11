import { useEffect, useRef, useState } from "react";
import { HiOutlineAdjustments } from "react-icons/hi";
import StatCardList from "./StatCardList";
import CategoryCardList from "./CategoryCardList";
import DashboardSection from "./DashboardSection";
import ActiveUsersChart from "./ActiveUsersChart";
import SalesOverviewChart from "./SalesOverviewChart";
import DashboardController from "./DashboardController";
import TopSellingProducts from "./TopSellingProducts";
import TopRatedProducts from "./TopRatedProducts";
import MostViewedProducts from "./MostViewedProducts";
import { LowStockAlerts, RecentOrders, TopCustomers, ConversionFunnel } from "./businessSignals"

const DashboardHome = () => {
  const [showController, setShowController] = useState(false);
  const controllerRef = useRef(null);

  const [visibleSections, setVisibleSections] = useState({
    stats: true,
    categories: false,
    analytics: true,
    productIntelligence: false,
    businessSignals: false
  });

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        controllerRef.current &&
        !controllerRef.current.contains(e.target)
      ) {
        setShowController(false);
      }
    };

    if (showController) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showController]);

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          Dashboard Overview
        </h1>

        <div className="relative">
          <button
            onClick={() => setShowController((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 px-3 py-2 rounded-lg"
          >
            <HiOutlineAdjustments size={18} />
            Customize
          </button>

          {showController && (
            <div ref={controllerRef}>
              <DashboardController
                visibleSections={visibleSections}
                toggleSection={toggleSection}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      {visibleSections.stats && (
        <DashboardSection title="Quick Stats">
          <StatCardList />
        </DashboardSection>
      )}

      {visibleSections.categories && (
        <DashboardSection title="Category Performance">
          <CategoryCardList />
        </DashboardSection>
      )}

      {visibleSections.analytics && (
        <DashboardSection title="Sales & Users Analytics">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SalesOverviewChart />
            <ActiveUsersChart />
          </div>
        </DashboardSection>
      )}
      {
        visibleSections.productIntelligence && (
          <DashboardSection title={"🔥 Product Intelligence"} >
            <div className="grid grid-cols-3 gap-6">
              <TopSellingProducts />
              <TopRatedProducts />
              <MostViewedProducts />
            </div>
          </DashboardSection>
        )
      }

      {visibleSections.businessSignals &&
        (
          <DashboardSection title="Business Signals">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <LowStockAlerts />
              <RecentOrders />
              <TopCustomers />
              <ConversionFunnel />
            </div>
          </DashboardSection>
        )
      }
    </div>
  );
};

export default DashboardHome;
