import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function RatingChart({ data }) {
  const chartData = [
    {
      range: "4-5",
      count: data["4-5"],
    },
    {
      range: "3-4",
      count: data["3-4"],
    },
    {
      range: "Below 3",
      count: data["Below 3"],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 h-[420px]">
      <h2 className="text-xl font-bold text-[#233554] mb-6">
        Rating Distribution
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="range" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#D97706"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RatingChart;