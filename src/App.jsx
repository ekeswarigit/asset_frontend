import React from "react";
import Login from "./pages/Login";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Addform from "./pages/AddForm";
import { Routes, Route, Navigate } from "react-router-dom";
import {User} from "./pages/User";

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
        <Route path="user" element={<User/>}/>
        <Route
          path="add-asset"
          element={
            <AdminRoute>
              <Addform />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;

