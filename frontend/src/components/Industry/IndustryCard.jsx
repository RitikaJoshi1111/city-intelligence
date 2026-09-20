import { ArrowUpRight } from "lucide-react";

function IndustryCard({ icon, title, description }) {
  return (
    <div className="group bg-white rounded-3xl border border-[#E6DDD0] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      <div className="flex justify-between items-start">

        <div className="w-14 h-14 rounded-2xl bg-[#F6F1E8] flex items-center justify-center text-[#233554]">
          {icon}
        </div>

        <ArrowUpRight
          size={18}
          className="text-gray-400 group-hover:text-[#233554]"
        />

      </div>

      <h3 className="mt-8 text-3xl font-bold text-[#233554]">
        {title}
      </h3>

      <p className="mt-3 text-gray-600 leading-7 font-medium">
        {description}
      </p>

    </div>
  );
}

export default IndustryCard;