import { Star, MapPin, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function BusinessCard({ business }) {

  if (!business) return null;

  console.log({
    id: business.id,
    name: business.business_name,
    address: business.address,
    category: business.category,
  });

  const website = business.website
    ? business.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "Not Available";

  const isOpen =
    business.status &&
    business.status.toLowerCase().includes("open");

  return (
    <div className="bg-white rounded-[30px] border border-[#E6DDD0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 flex flex-col h-full">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-[30px] font-extrabold text-[#233554] leading-tight">
            {business.business_name}
          </h2>

          <div className="flex gap-2 mt-3 flex-wrap">

            <span className="bg-[#F4EEE4] text-[#233554] text-sm px-3 py-1 rounded-full font-semibold">
              {business.category}
            </span>

            <span
              className={`text-sm px-3 py-1 rounded-full font-semibold ${
                isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isOpen ? "Open" : "Closed"}
            </span>

          </div>

        </div>

        <div className="bg-[#FFF5DD] px-3 py-2 rounded-full flex items-center gap-1">

          <Star
            size={16}
            fill="currentColor"
            className="text-[#D49A2A]"
          />

          <span className="font-bold">
            {business.rating ?? "N/A"}
          </span>

        </div>

      </div>

      {/* Address */}

      <div className="mt-6 flex gap-3">

        <MapPin
          size={18}
          className="text-[#233554] mt-1"
        />

        <p className="text-gray-600 leading-7">
          {business.address}
        </p>

      </div>

      {/* Website */}

      <div className="mt-4 flex gap-3">

        <Globe
          size={18}
          className="text-[#233554]"
        />

        <a
          href={business.website}
          target="_blank"
          rel="noreferrer"
          className="text-[#233554] hover:underline break-all"
        >
          {website}
        </a>

      </div>

      {/* Spacer */}

      <div className="flex-grow" />

      {/* Button */}

      <Link
        to={`/business/${business.id}`}
        className="mt-8 w-full bg-[#233554] text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-[#1B2A44] transition"
      >
        View Business
        <ArrowRight size={18} />
      </Link>

    </div>
  );
}

export default BusinessCard;