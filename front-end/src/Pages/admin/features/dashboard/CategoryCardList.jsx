import CategoryCard from "./CategoryCard";
import { User, UserCheck, Users } from "lucide-react";

const categories = [
    {
        title: "Men",
        subtitle: "AeroStep Category",
        total: "1,240 Pairs",
        growth: 12,
        accent: "#2563eb",
        icon: <User size={22} />,
    },
    {
        title: "Women",
        subtitle: "AeroStep Category",
        total: "980 Pairs",
        growth: 8,
        accent: "#9333ea",
        icon: <UserCheck size={22} />,
    },
    {
        title: "Kids",
        subtitle: "AeroStep Category",
        total: "620 Pairs",
        growth: -3,
        accent: "#10b981",
        icon: <Users size={22} />,
    },
];

const CategoryCardList = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((item, index) => (
                <CategoryCard key={index} {...item} />
            ))}
        </div>
    );
};

export default CategoryCardList;
