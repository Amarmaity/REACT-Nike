import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", users: 320 },
  { name: "Tue", users: 220 },
  { name: "Wed", users: 120 },
  { name: "Thu", users: 280 },
  { name: "Fri", users: 480 },
  { name: "Sat", users: 420 },
  { name: "Sun", users: 300 },
];

const ActiveUsersChart = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#071a3a] to-[#06132d] p-6 h-[320px]">
      <h3 className="text-white font-semibold mb-4">
        Active Users
        <span className="text-green-400 text-sm ml-2">
          (+23) than last week
        </span>
      </h3>

      <ResponsiveContainer width="100%" height="65%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Bar
            dataKey="users"
            fill="#ffffff"
            radius={[6, 6, 6, 6]}
            barSize={10}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4 text-sm text-gray-300">
        <div>
          <p className="text-white font-semibold">32,984</p>
          <span>Users</span>
        </div>
        <div>
          <p className="text-white font-semibold">2.42m</p>
          <span>Clicks</span>
        </div>
        <div>
          <p className="text-white font-semibold">$2,400</p>
          <span>Sales</span>
        </div>
        <div>
          <p className="text-white font-semibold">320</p>
          <span>Items</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersChart;
