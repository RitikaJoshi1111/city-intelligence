import {
  Building2,
  BriefcaseBusiness,
  Star,
  CheckCircle,
} from "lucide-react";

const icons = {
  Businesses: Building2,
  Industries: BriefcaseBusiness,
  "Average Rating": Star,
  "Open Businesses": CheckCircle,
};

const colors = {
  Businesses: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  Industries: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  "Average Rating": {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  "Open Businesses": {
    bg: "bg-green-100",
    text: "text-green-600",
  },
};

function KPICard({ title, value }) {
  const Icon = icons[title];
  const color = colors[title];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[#233554]">
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color.bg}`}
        >
          {Icon && (
            <Icon
              size={30}
              className={color.text}
            />
          )}
        </div>

      </div>

    </div>
  );
}

export default KPICard;