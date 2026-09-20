function MapSidebar({
  businesses,
  search,
  setSearch,
  industries,
  selectedIndustry,
  setSelectedIndustry,
  onBusinessClick,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 h-[650px] flex flex-col">

      <h2 className="text-xl font-bold text-[#233554] mb-5">
        Explore Businesses
      </h2>

      <input
        type="text"
        placeholder="Search businesses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-[#233554]"
      />

      <select
        value={selectedIndustry}
        onChange={(e) => setSelectedIndustry(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-5"
      >
        <option value="All">All Industries</option>

        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>

      <div className="overflow-y-auto flex-1 space-y-3">

        {businesses.map((business) => (
          <div
            key={business.id}
            onClick={() => onBusinessClick(business)}
            className="border rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">
              {business.business_name}
            </h3>

            <p className="text-sm text-gray-500">
              {business.category}
            </p>

            <p className="text-sm">
              ⭐ {business.rating}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default MapSidebar;