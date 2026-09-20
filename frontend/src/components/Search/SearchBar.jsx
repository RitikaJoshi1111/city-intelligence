import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="mt-12">

      <div className="bg-white border border-[#E6DDD0] rounded-[28px] shadow-xl p-4">

        <div className="flex items-center">

          <Search size={22} className="text-[#233554]" />

          <input
            type="text"
            placeholder="Search industries, companies or products..."
            className="flex-1 ml-4 text-lg font-medium outline-none bg-transparent placeholder:text-gray-400"
          />

          <button className="bg-[#233554] hover:bg-[#1B2A44] transition text-white px-8 py-3 rounded-2xl font-semibold">
            Search
          </button>

        </div>

        <div className="flex gap-3 flex-wrap mt-5">

          {[
            "Furniture",
            "Steel",
            "Textile",
            "Handicrafts",
            "Exporters",
            "Logistics",
          ].map((item) => (
            <button
              key={item}
              className="px-4 py-2 rounded-full bg-[#F6F1E8] hover:bg-[#ECE4D7] transition text-[#233554] font-medium text-sm"
            >
              {item}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}

export default SearchBar;