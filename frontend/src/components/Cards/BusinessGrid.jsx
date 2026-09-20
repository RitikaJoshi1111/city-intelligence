import BusinessCard from "./BusinessCard";

function BusinessGrid({ businesses }) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[#233554]">
          No Businesses Found
        </h2>

        <p className="mt-2 text-gray-500">
          Try a different search keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      {businesses
        .filter((business) => business)
        .map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
          />
        ))}
    </div>
  );
}

export default BusinessGrid;