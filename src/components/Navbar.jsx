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
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(10,10,10,.88)" : "#0a0a0a",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,.07)"
          : "1px solid transparent",
        transition: "background .3s, border-color .3s, backdrop-filter .3s",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          {/* Square mark */}
          <div
            style={{
              width: 22,
              height: 22,
              border: "1px solid rgba(255,255,255,.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ width: 8, height: 8, background: "#fff" }} />
          </div>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: ".14em",
              color: "rgba(255,255,255,.65)",
              textTransform: "uppercase",
            }}
          >
            Search Bench
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: 2,
          }}
          className="md-nav-links"
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 11,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                border: isActive(to)
                  ? "1px solid rgba(255,255,255,.15)"
                  : "1px solid transparent",
                color: isActive(to)
                  ? "rgba(255,255,255,.85)"
                  : "rgba(255,255,255,.28)",
                background: isActive(to)
                  ? "rgba(255,255,255,.05)"
                  : "transparent",
                transition: "color .2s, background .2s, border-color .2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive(to)) {
                  e.currentTarget.style.color = "rgba(255,255,255,.7)";
                  e.currentTarget.style.background = "rgba(255,255,255,.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(to)) {
                  e.currentTarget.style.color = "rgba(255,255,255,.28)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* CTA button — desktop */}
          <Link
            to="/compare"
            style={{
              display: "none",
              alignItems: "center",
              gap: 8,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              background: "#fff",
              color: "#000",
              fontWeight: 500,
              padding: "7px 18px",
              borderRadius: 6,
              textDecoration: "none",
              transition: "background .2s, transform .15s, box-shadow .2s",
            }}
            className="md-cta"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e8e8e8";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 32px rgba(255,255,255,.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Open Compare
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md-hamburger"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,.4)",
            }}
          >
            {[
              menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              null, // middle bar
              menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            ].map((transform, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 18,
                  height: 1,
                  background: "currentColor",
                  transition: "transform .2s, opacity .2s",
                  transform: transform ?? "none",
                  opacity: i === 1 && menuOpen ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? 280 : 0,
          transition: "max-height .3s ease",
          borderTop: menuOpen ? "1px solid rgba(255,255,255,.05)" : "none",
          background: "rgba(10,10,10,.96)",
        }}
      >
        <div
          style={{
            padding: "12px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive(to)
                  ? "rgba(255,255,255,.85)"
                  : "rgba(255,255,255,.3)",
                background: isActive(to)
                  ? "rgba(255,255,255,.05)"
                  : "transparent",
                transition: "color .2s, background .2s",
              }}
            >
              {label}
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link
            to="/compare"
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              background: "#fff",
              color: "#000",
              fontWeight: 500,
              padding: "10px 18px",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Open Compare
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Responsive styles injected once */}
      <style>{`
        @media (min-width: 768px) {
          .md-nav-links { display: flex !important; }
          .md-cta { display: flex !important; }
          .md-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  );
}