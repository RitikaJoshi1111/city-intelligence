import Navbar from "../components/Navbar/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F4EC]">

      <Navbar />

      <main className="max-w-[1280px] mx-auto px-8">

        {children}

      </main>

    </div>
  );
}

export default MainLayout;