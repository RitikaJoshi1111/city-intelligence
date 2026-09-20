import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Globe,
  Phone,
  Star,
  Building2,
  ExternalLink,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import { getBusiness } from "../services/businessService";

function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const data = await getBusiness(id);
        setBusiness(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadBusiness();
  }, [id]);

  if (!business) {
    return (
      <MainLayout>
        <div className="py-24 text-center text-2xl font-bold">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[#233554] font-bold hover:text-[#C89B4B] transition"
        >
          ← Back to Businesses
        </button>

        {/* Header */}
        <div className="bg-white rounded-[30px] border border-[#E6DDD0] p-10 shadow-sm">

          <div className="flex justify-between items-start">

            {/* Left */}
            <div className="flex gap-8">

              <div className="w-28 h-28 rounded-3xl bg-[#233554] flex items-center justify-center shadow">

                <Building2
                  size={50}
                  className="text-white"
                />

              </div>

              <div>

                <div className="flex gap-3 mb-4">

                  <span className="bg-[#EFE5D3] px-4 py-2 rounded-full font-semibold">
                    {business.category}
                  </span>

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                    {business.status}
                  </span>

                </div>

                <h1 className="text-5xl font-black text-[#233554]">
                  {business.business_name}
                </h1>

              </div>

            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-5">

              <div className="bg-[#FFF4DA] px-6 py-3 rounded-full flex items-center gap-2">

                <Star
                  size={24}
                  fill="#FBBF24"
                  className="text-yellow-400"
                />

                <span className="text-3xl font-bold">
                  {business.rating}
                </span>

              </div>

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#233554] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#1b2942] transition"
                >
                  Visit Website
                  <ExternalLink size={18} />
                </a>
              )}

            </div>

          </div>

        </div>

        {/* Information */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {/* Left Card */}
          <div className="bg-white rounded-[24px] p-8 border border-[#E6DDD0]">

            <h2 className="text-2xl font-bold mb-6">
              Business Information
            </h2>

            <div className="space-y-6">

              <div className="flex gap-4">

                <MapPin className="text-[#233554]" />

                <div>

                  <p className="font-semibold">
                    Address
                  </p>

                  <p className="text-gray-600">
                    {business.address}
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <Phone className="text-[#233554]" />

                <div>

                  <p className="font-semibold">
                    Phone
                  </p>

                  <p className="text-gray-600">
                    {business.phone || "Not Available"}
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <Globe className="text-[#233554]" />

                <div>

                  <p className="font-semibold">
                    Website
                  </p>

                  {business.website ? (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 break-all"
                    >
                      {business.website}
                    </a>
                  ) : (
                    <p className="text-gray-600">
                      Not Available
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* Right Card */}
          <div className="bg-white rounded-[24px] p-8 border border-[#E6DDD0]">

            <h2 className="text-2xl font-bold mb-6">
              Overview
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Industry
                </span>

                <span className="font-semibold">
                  {business.industry || "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Category
                </span>

                <span className="font-semibold">
                  {business.category}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Status
                </span>

                <span className="font-semibold">
                  {business.status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Rating
                </span>

                <span className="font-semibold">
                  ⭐ {business.rating}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Reviews
                </span>

                <span className="font-semibold">
                  {business.review_count ?? "N/A"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    
    
    <div className="grid md:grid-cols-2 gap-8 mt-8">

      {/* Google Map */}

      <div className="bg-white rounded-[24px] border border-[#E6DDD0] p-8">

        <h2 className="text-2xl font-bold mb-6">
          Location
        </h2>

        <iframe
          title="Business Location"
          width="100%"
          height="350"
          loading="lazy"
          className="rounded-2xl"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            business.address
          )}&output=embed`}
        />

      </div>

      {/* Description */}

      <div className="bg-white rounded-[24px] border border-[#E6DDD0] p-8">

        <h2 className="text-2xl font-bold mb-6">
          About Business
        </h2>

        <p className="text-gray-600 leading-8">

          {business.business_name} is one of the leading

          <span className="font-semibold text-[#233554]">
            {" "}{business.category}
          </span>

          businesses located in Jodhpur.

          It is known for providing quality products and services
          to customers and maintaining a strong local business presence.

          This profile has been generated from the City Intelligence
          database.

        </p>

      </div>

    </div>

    </MainLayout>
  );
}

export default BusinessDetails;