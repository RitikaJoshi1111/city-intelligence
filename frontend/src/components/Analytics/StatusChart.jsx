import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function StatusChart({ summary }) {
  const data = [
    {
      name: "Open",
      value: summary.open,
    },
    {
      name: "Closed",
      value: summary.businesses - summary.open,
    },
  ];

  const COLORS = ["#16A34A", "#DC2626"];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 h-[420px]">
      <h2 className="text-xl font-bold text-[#233554] mb-6">
        Business Status
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatusChart;