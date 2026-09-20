import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { Link } from "react-router-dom";

function FlyToBusiness({ business }) {
  const map = useMap();

  useEffect(() => {
    if (
      business &&
      business.latitude &&
      business.longitude
    ) {
      map.flyTo(
        [business.latitude, business.longitude],
        16,
        {
          duration: 1.5,
        }
      );
    }
  }, [business, map]);

  return null;
}

function BusinessMap({ businesses, selectedBusiness }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">

      <MapContainer
        center={[26.2389, 73.0243]}
        zoom={12}
        style={{
          height: "650px",
          width: "100%",
          borderRadius: "16px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToBusiness business={selectedBusiness} />

        {businesses.map((business) => {
          if (
            business.latitude == null ||
            business.longitude == null
          ) {
            return null;
          }

          return (
            <Marker
              key={business.id}
              position={[
                business.latitude,
                business.longitude,
              ]}
            >
              <Popup>
                <div className="space-y-2">

                  <h3 className="font-bold text-lg">
                    {business.business_name}
                  </h3>

                  <p>
                    ⭐ {business.rating}
                  </p>

                  <p>
                    {business.category}
                  </p>

                  <Link
                    to={`/business/${business.id}`}
                    className="text-blue-600 font-medium"
                  >
                    View Details →
                  </Link>

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

    </div>
  );
}

export default BusinessMap;