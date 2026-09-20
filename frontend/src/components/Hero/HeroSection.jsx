import SearchBar from "../Search/SearchBar";

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">

      <div className="text-center">

        <p className="uppercase tracking-[0.35em] text-[#C89B4B] font-semibold text-sm">
          BUSINESS INTELLIGENCE PLATFORM
        </p>

        <h1 className="mt-5 text-7xl font-black leading-tight text-[#233554]">
          Discover Jodhpur's
          <br />
          Business Ecosystem
        </h1>

        <p className="mt-6 text-lg font-medium text-gray-600 max-w-3xl mx-auto">
          Search industries, manufacturers, exporters and suppliers across
          Jodhpur through one intelligent business platform.
        </p>

      </div>

      <SearchBar />

    </section>
  );
}

export default HeroSection;