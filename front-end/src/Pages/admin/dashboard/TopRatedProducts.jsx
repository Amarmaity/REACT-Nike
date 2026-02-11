import InsightCard from "./InsightCard";
import ProductListItem from "./ProductListItem";


const TopRatedProducts = () => {
  return (
    <InsightCard
      title="Top Rated Products"
      subtitle="Based on customer reviews"
    >
      <ProductListItem
        rank={1}
        name="AeroStep Ultra"
        value="⭐ 4.9"
        secondary="320 reviews"
      />
      <ProductListItem
        rank={2}
        name="AeroStep Street"
        value="⭐ 4.8"
        secondary="280 reviews"
      />
      <ProductListItem
        rank={3}
        name="AeroStep Mini"
        value="⭐ 4.7"
        secondary="190 reviews"
      />
    </InsightCard>
  );
};

export default TopRatedProducts