import React from 'react'
import Login from './pages/Login'
import Layout from './layouts/Layout'
import Dashboard from "./pages/Dashboard"
import Assets from './pages/Assets'
import { Routes, Route } from "react-router-dom"
import AddAsset from './pages/AddAsset'
import { useState } from "react";

const App = () => {
  const [assets, setAssets] = useState([]);
  return (
   <Routes>
      {/* Layout Wrapper */}
      <Route path="/" element={<Layout/>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assets" element={<Assets assets={assets}/>} />
        <Route path="add-asset" element={<AddAsset setAssets={setAssets} />} />
      </Route>
    </Routes>
  )
}
export default App;






