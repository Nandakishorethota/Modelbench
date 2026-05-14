import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 dm-sans
        ${
          scrolled
            ? "bg-[#07080a]/80 backdrop-blur-md border-b border-[rgba(163,255,78,0.08)]"
            : "bg-[#07080a] border-b border-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 flex items-center justify-center rounded-md
                           bg-[rgba(163,255,78,0.12)]
                           border border-[rgba(163,255,78,0.25)]
                           text-[#a3ff4e] text-[10px] font-bold dm-mono
                           group-hover:shadow-[0_0_20px_rgba(163,255,78,0.4)] transition">
            AI
          </span>

          <span className="text-white dm-mono text-sm tracking-[0.08em]">
            Search Bench
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-md text-[11px] tracking-[0.08em] uppercase dm-mono transition-all duration-200 border
                ${
                  isActive(to)
                    ? "text-[#a3ff4e] bg-[rgba(163,255,78,0.06)] border-[rgba(163,255,78,0.25)] shadow-[0_0_18px_rgba(163,255,78,0.08)]"
                    : "text-[rgba(255,255,255,0.35)] border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          <Link
            to="/compare"
            className="hidden md:inline-flex items-center dm-mono text-[11px] tracking-[0.08em]
                       bg-[#a3ff4e] hover:bg-[#b8ff5a]
                       text-black font-semibold px-4 py-2 rounded-md
                       transition-all duration-200 hover:shadow-[0_0_35px_rgba(163,255,78,0.45)] active:scale-95"
          >
            Open Compare
          </Link>

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-[rgba(255,255,255,0.5)] hover:text-[#a3ff4e] transition"
          >
            <span
              className={`block w-5 h-px bg-current transition-transform duration-200 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-current transition-transform duration-200 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300
          ${
            menuOpen
              ? "max-h-64 border-t border-[rgba(163,255,78,0.1)] bg-[#07080a]/95"
              : "max-h-0"
          }`}
      >
        <div className="px-6 py-3 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2.5 rounded-md text-sm dm-mono tracking-[0.06em] transition
                ${
                  isActive(to)
                    ? "text-[#a3ff4e] bg-[rgba(163,255,78,0.08)]"
                    : "text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-white/5"
                }`}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/compare"
            className="mt-2 dm-mono text-[11px] tracking-[0.08em]
                       bg-[#a3ff4e] text-black font-semibold px-4 py-2 rounded-md
                       hover:bg-[#b8ff5a] transition"
          >
            Open Compare
          </Link>
        </div>
      </div>
    </nav>
  );
}