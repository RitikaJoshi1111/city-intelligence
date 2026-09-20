import {
  Sofa,
  Shirt,
  Cpu,
  Truck,
  Hammer,
  Package,
} from "lucide-react";

import Section from "../Common/Section";
import IndustryCard from "./IndustryCard";

function IndustrySection() {

  const industries = [

    {
      title: "Furniture",
      description: "Manufacturers and exporters",
      icon: <Sofa size={28}/>
    },

    {
      title: "Textile",
      description: "Fabric & garments",
      icon: <Shirt size={28}/>
    },

    {
      title: "Handicrafts",
      description: "Wood & metal crafts",
      icon: <Hammer size={28}/>
    },

    {
      title: "IT",
      description: "Software & AI",
      icon: <Cpu size={28}/>
    },

    {
      title: "Logistics",
      description: "Transport & Warehousing",
      icon: <Truck size={28}/>
    },

    {
      title: "Exporters",
      description: "International businesses",
      icon: <Package size={28}/>
    }

  ];

  return (

    <Section
      title="Explore Industries"
      subtitle="Browse businesses by category."
    >

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {industries.map((industry)=>

          <IndustryCard
            key={industry.title}
            {...industry}
          />

        )}

      </div>

    </Section>

  );

}

export default IndustrySection;