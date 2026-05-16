import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", position: "relative" }}>

      {/* Grid texture */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      {/* Glow blobs */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 550, height: 450, background: "radial-gradient(circle, #16a34a 0%, transparent 70%)", opacity: 0.09, borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", top: "0%", right: "5%", width: 500, height: 550, background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", opacity: 0.10, borderRadius: "50%", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 380, height: 380, background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", opacity: 0.07, borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "25%", width: 320, height: 320, background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)", opacity: 0.06, borderRadius: "50%", filter: "blur(85px)" }} />
      </div>

      {/* Navbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 30 }}>
        <Navbar
          toggle={() => setOpen(p => !p)}
          mobileToggle={() => setMobileOpen(p => !p)}
        />
      </div>

      {/* Body */}
      <div style={{ display: "flex", height: "calc(100vh - 61px)", overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* Desktop sidebar */}
        <div className="hidden md:flex" style={{
          width: open ? 220 : 58,
          flexShrink: 0,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          height: "100%",
          overflow: "hidden",
        }}>
          <Sidebar open={open} />
        </div>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <div className="md:hidden" onClick={() => setMobileOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }} />
        )}

        {/* Mobile drawer */}
        <div className="md:hidden" style={{
          position: "fixed", top: 61, left: 0, bottom: 0,
          width: 240, zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <Sidebar open={true} />
        </div>

        {/* Main content */}
        <main id="main-scroll" className="custom-scrollbar"
          style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
          {children}
        </main>

      </div>

    
    </div>
  );
};

export default MainLayout;