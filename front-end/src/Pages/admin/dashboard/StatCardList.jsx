import React from "react";
import StatCard from "./StatCard";
import { DollarSign, Users, UserPlus, ShoppingCart } from "lucide-react";

const statCards = [
  {
    title: "Today's Money",
    value: "$53,000",
    percent: 55,
    positive: true,
    icon: <DollarSign size={20} />,
  },
  {
    title: "Today's Users",
    value: "2,300",
    percent: 5,
    positive: true,
    icon: <Users size={20} />,
  },
  {
    title: "New Clients",
    value: "3,052",
    percent: 14,
    positive: false,
    icon: <UserPlus size={20} />,
  },
  {
    title: "Total Sales",
    value: "$173,000",
    percent: 8,
    positive: true,
    icon: <ShoppingCart size={20} />,
  },
];

const StatCardList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatCardList;
