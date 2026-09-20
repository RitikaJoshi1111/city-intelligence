function Section({ title, subtitle, children }) {
  return (
    <section className="py-20">

      <div className="mb-12">

        <h2 className="text-4xl font-bold text-[#233554]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-3 text-lg text-gray-600 font-medium">
            {subtitle}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}

export default Section;