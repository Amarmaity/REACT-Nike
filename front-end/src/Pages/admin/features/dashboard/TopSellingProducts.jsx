import { InsightCard, ProductListItem } from "../../components";

const TopSellingProducts = () => {
    return (
        <InsightCard
            title="Top Selling Products"
            subtitle="Last 30 days"
        >
            <ProductListItem
                rank={1}
                name="AeroStep Pro Runner"
                secondary="Men • Running"
                value="1,240 sold"
                trend={12}
            />
            <ProductListItem
                rank={2}
                name="AeroStep Flex"
                secondary="Women • Casual"
                value="980 sold"
                trend={8}
            />
            <ProductListItem
                rank={3}
                name="AeroStep Kids Boost"
                secondary="Kids • Sports"
                value="620 sold"
                trend={-3}
            />
        </InsightCard>
    );
};

export default TopSellingProducts;
