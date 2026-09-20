import { Building2 } from "lucide-react";

function StatsCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-[26px] border border-[#E7DED1] p-7 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <p className="text-sm uppercase tracking-[0.15em] text-gray-500 font-semibold">
          {title}
        </p>

        <Building2
          size={22}
          className="text-[#C89B4B]"
        />

      </div>

      <h2 className="mt-5 text-5xl font-black text-[#233554]">
        {value}
      </h2>

      <p className="mt-3 text-gray-500 font-semibold">
        {subtitle}
      </p>

    </div>
  );
}

export default StatsCard;