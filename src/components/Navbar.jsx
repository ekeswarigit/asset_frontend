import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/assets">Assets</Link> | 
      <Link to="/add-asset">Add Asset</Link>
    </div>
  );
};