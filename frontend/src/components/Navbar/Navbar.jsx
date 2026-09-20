import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Map,
  BarChart3,
  Bookmark,
  User,
  Building2,
} from "lucide-react";

function Navbar() {
  return (
    <header className="w-full flex justify-center py-6">
      <div className="w-full max-w-[1280px] bg-[#F7F2E9] border border-[#DED6C8] rounded-full px-8 py-4 flex items-center justify-between shadow-sm">

        {/* Logo */}

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-[#233554] flex items-center justify-center">

            <Building2 className="text-white" size={24} />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-[#233554]">
              Jodhpur BI
            </h1>

            <p className="text-xs tracking-[0.35em] text-gray-500 uppercase">
              Business Intelligence Platform
            </p>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex gap-3">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all
              ${
                isActive
                  ? "bg-[#233554] text-white"
                  : "text-[#233554] hover:bg-[#ECE5D9]"
              }`
            }
          >
            <Home size={18} />
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all
              ${
                isActive
                  ? "bg-[#233554] text-white"
                  : "text-[#233554] hover:bg-[#ECE5D9]"
              }`
            }
          >
            <Search size={18} />
            Explore
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all
              ${
                isActive
                  ? "bg-[#233554] text-white"
                  : "text-[#233554] hover:bg-[#ECE5D9]"
              }`
            }
          >
            <Map size={18} />
            Map
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all
              ${
                isActive
                  ? "bg-[#233554] text-white"
                  : "text-[#233554] hover:bg-[#ECE5D9]"
              }`
            }
          >
            <BarChart3 size={18} />
            Analytics
          </NavLink>

        </nav>

        {/* Right Side */}

        <div className="flex gap-3">

          <button className="w-11 h-11 rounded-full border border-[#DED6C8] bg-white flex items-center justify-center hover:bg-[#ECE5D9]">

            <Bookmark size={20} />

          </button>

          <button className="w-11 h-11 rounded-full border border-[#DED6C8] bg-white flex items-center justify-center hover:bg-[#ECE5D9]">

            <User size={20} />

          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;