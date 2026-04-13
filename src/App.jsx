import React from 'react'
import Login from './pages/Login'
import Layout from './layouts/Layout'
import Dashboard from "./pages/Dashboard"
import Assets from './pages/Assets'
import { Routes, Route } from "react-router-dom"
import AddAsset from './pages/AddAsset'
import { useState } from "react";

const App = () => {
 // const [assets, setAssets] = useState([]);
  return (
   <Routes>
      {/* Layout Wrapper */}
      <Route path="/" element={<Login />}/>

      <Route path="/layout/dashboard" element={<Layout/>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="add-asset" element={<AddAsset />} />
      </Route>
    </Routes>
  )
}
export default App;

// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Assets from './pages/Assets';
// import Layout from './layouts/Layout'

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   return token ? children : <Navigate to="/" />;
// };

// function App() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/" element={<Login />} />

//       {/* Protected */}
//       <Route path="/layout" element={<Layout/>} />
//       <Route path="/dashboard" element={  <PrivateRoute>  <Dashboard /> </PrivateRoute>  }/>
//       <Route path="/assets" element={ <PrivateRoute>  <Assets />  </PrivateRoute>  }  />
//     </Routes>
//   );
// }

// export default App;






