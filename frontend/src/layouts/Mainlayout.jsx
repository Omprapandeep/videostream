import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div >

      {/* ✅ Navbar FULL WIDTH */}
      <Navbar toggle={() => setOpen(!open)} />

      {/* ✅ Below Navbar Layout */}
      <div className="flex h-[calc(100vh-67px)] overflow-hidden">

        {/* Sidebar */}
        <div
          className={`hidden md:block h-full overflow-y-auto ${
            open ? "w-56" : "w-15"
          } transition-all duration-200`}
        >
          <Sidebar open={open} />
        </div>

        {/* Main Content */}
        <div id="main-scroll" className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>

      </div>

     
    </div>
  );
};

export default MainLayout;