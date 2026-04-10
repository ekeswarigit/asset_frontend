//import React, { useState } from "react";
//import "../pagestyle/asset.css";
import { useNavigate } from "react-router-dom";
import { getAssets, deleteAsset } from "../services/assetService";
import React, { useEffect, useState } from "react";

const Assets = () => {

  const navigate = useNavigate()

  const [assets] = useState([
    { id: 1, assetName: "Laptop", brand: "Dell", status: "AVAILABLE",condition:"GOOD", assetType:"IT Equipment"},
    { id: 2, assetName: "Desktop", brand: "HP", status: "ASSIGNED", condition: "POOR",assetType:"IT Equipment"},
    { id: 3, assetName: "Table",  brand: "WoodCo",status: "AVAILABLE",condition:"GOOD", assetType: "Office Furniture" },
  ]);
const [searchType, setSearchType] = useState("");
const filteredAssets = assets.filter((a) =>
  a.assetType.toLowerCase().includes(searchType.toLowerCase())
);
    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      const data = await getAssets();
      setAssets(data);
    };
    const handleDelete = async (id) => {
      await deleteAsset(id);
       fetchData();
};
  return (
 <div>
      <h2>Assets</h2>

    <div className="d-flex align-items-center gap-2 mb-3">
      <button className="btn btn-primary w-25 "onClick={() => navigate("/add-asset")}>Add Asset</button>

      <select className="form-control" value={searchType}
          onChange={(e) => setSearchType(e.target.value)} >
          <option value="">All Types</option>
          <option value="Equipment">IT Equipment</option>
          <option value="Office Furniture">Office Furniture</option>
      </select>
    </div>
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Search..." />
        <button className="btn btn-dark">Search</button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Condition</th>
            <th>AssetType</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td>{a.assetName}</td>
              <td>{a.brand}</td>
              <td>{a.status}</td>
              <td>{a.condition}</td>
              <td>{a.assetType}</td>
              <td>
                <button className="btn btn-success btn-sm me-2">
                  Edit
                </button>
                <button className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    
  );
}
export default Assets;