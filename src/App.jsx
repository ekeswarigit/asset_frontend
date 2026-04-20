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

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/" />;
  return role === "ADMIN" ? children : <Navigate to="/dashboard" replace />;
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
        <Route
          path="add-asset"
          element={
            <AdminRoute>
              <AddAsset />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;








