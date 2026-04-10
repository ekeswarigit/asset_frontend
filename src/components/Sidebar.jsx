import "../styles/sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-info text-white p-3 vh-100 " style={{ width: "220px" }}>
      <h4 className="text-center">Menu</h4>

      <ul className="nav flex-column mt-4 ">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/assets">
            Assets
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/add-asset">
            Add Asset
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;