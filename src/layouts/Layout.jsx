import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import { useState } from "react";

const Layout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  return (
    <Box>
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
          <Sidebar onWidthChange={setSidebarWidth} />
        </Box>

        <Box sx={{ flexGrow: 1, p: 4, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
