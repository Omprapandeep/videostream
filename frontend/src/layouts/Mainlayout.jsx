import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>

      {/* ✅ Navbar FULL WIDTH */}
      <Navbar toggle={() => setOpen(!open)} />

      {/* ✅ Below Navbar Layout */}
      <div className="flex">

        {/* Sidebar */}
        <div
          className={`hidden md:block h-[calc(100vh-66.5px)] ${
            open ? "w-56" : "w-15"
          } transition-all duration-200`}
        >
          <Sidebar open={open} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

      </div>

     
    </div>
  );
};

export default MainLayout;