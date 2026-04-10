import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="d-flex">
        {/* Sidebar */}
        <div style={{ width: "220px" }}>
          <Sidebar />
        </div>

        {/* Page Content */}
        <div className="flex-grow-1 p-4">
          <Outlet /> {/* 🔥 This loads pages */}
        </div>
      </div>
    </div>
  );
};

export default Layout;