import React from "react";
import Login from "./pages/Login";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AddAsset from "./pages/AddAsset";
import { Routes, Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Protected Layout */}
      <Route 
       element={ <PrivateRoute> <Layout /> </PrivateRoute> }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="add-asset" element={<AddAsset />} />
      </Route>
    </Routes>
  );
};

export default App;








