import "../styles/sidebar.css";
import { Link } from "react-router-dom";
import { Navigate,useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();

  // ✅ Logout function
  const handleLogout = () => {
   // localStorage.removeItem("token"); // remove JWT
    navigate("/"); // go to login page
  };
  return (
    <div className="bg-info text-white p-3 vh-100 " style={{ width: "220px" }}>
      <h4 className="text-center">Menu</h4>

      <ul className="nav flex-column mt-4 ">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/layout/dashboard">
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/layout/assets">
            Assets
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/layout/add-asset">
            Add Asset
          </Link>
        </li>
      </ul>

        <div className="mt-auto">
        <button
          className="btn btn-danger w-100 mt-5"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;