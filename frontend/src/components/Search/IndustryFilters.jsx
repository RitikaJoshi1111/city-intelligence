function IndustryFilters({ industries, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 mt-8">

      <button
        onClick={() => onSelect("All")}
        className={`px-5 py-2 rounded-full font-semibold transition ${
          selected === "All"
            ? "bg-[#233554] text-white"
            : "bg-[#F4EEE4] text-[#233554]"
        }`}
      >
        All
      </button>

      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => onSelect(industry)}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            selected === industry
              ? "bg-[#233554] text-white"
              : "bg-[#F4EEE4] text-[#233554]"
          }`}
        >
          {industry}
        </button>
      ))}
    </div>
  );
}

export default IndustryFilters;