import { Search } from "lucide-react";
import { useState } from "react";

function ExploreSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="bg-white border border-[#E6DDD0] rounded-[28px] shadow-lg p-4 flex items-center">

      <Search className="text-[#233554]" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search businesses..."
        className="flex-1 px-4 outline-none text-lg"
      />

      <button
        onClick={handleSearch}
        className="bg-[#233554] text-white px-8 py-3 rounded-2xl font-semibold"
      >
        Search
      </button>

    </div>
  );
}

export default ExploreSearch;