import { InsightCard, ProductListItem } from "../../components";

const MostViewedProducts = () => {
    return (
        <InsightCard
            title="Most Viewed Products"
            subtitle="Last 7 days"
        >
            <ProductListItem
                rank={1}
                name="AeroStep Pro Runner"
                value="12.4k views"
            />
            <ProductListItem
                rank={2}
                name="AeroStep Urban"
                value="9.8k views"
            />
        </InsightCard>
    );
};
export default MostViewedProducts
