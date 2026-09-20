function TopBusinesses({ businesses }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-[#233554] mb-6">
        Top Rated Businesses
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Business</th>
              <th className="text-left py-3">Industry</th>
              <th className="text-left py-3">Rating</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {businesses.map((business) => (
              <tr
                key={business.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-4">
                  {business.business_name}
                </td>

                <td>{business.industry}</td>

                <td>⭐ {business.rating}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      business.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {business.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default TopBusinesses;