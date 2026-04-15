import '../styles/nav.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const role = localStorage.getItem("role");    
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Asset Management
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
  <span className="me-3 w-75">
  👤 {role === "ADMIN" ? "Admin" : "User"}
</span>
      
    </nav>
  );
};
export default Navbar;