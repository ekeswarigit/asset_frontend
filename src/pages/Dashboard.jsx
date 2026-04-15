//import React from 'react'
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getAssets } from "../services/assetService";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  //  Fetch from API
  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    const res = await getAssets(0, 10); // first page
    
    const assetList = res?.data?.data?.content || [];
    setAssets(assetList);
    const totalAssets = res?.data?.data?.totalElements;// from api
    //  correct total
    setTotalAssets(res?.data?.data?.totalElements || 0)

  } catch (error) {
    console.error("Error:", error);
  } 
};

  //  Counts
 // const totalAssets = assets.length;

 const itEquipment = assets.filter((a) =>
  (a.assetTypeName || "").toLowerCase() === "it equipment" 
).length;

const furniture = assets.filter((a) =>
  (a.assetTypeName || "").toLowerCase() === "office furniture"
).length;

  //  Recent 3 assets
  const recentAssets = [...assets].slice(-3).reverse();

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Dashboard</h2>

      {/*  Cards */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary p-3">
            <h5>
              <i className="bi bi-box-seam me-2"></i>Total Assets
            </h5>
            <h3>{totalAssets}</h3>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success p-3">
            <h5>
              <i className="bi bi-laptop me-2"></i>IT Equipment
            </h5>
            <h3>{itEquipment}</h3>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning p-3">
            <h5>
              <i className="bi bi-house-door me-2"></i>Office Furniture
            </h5>
            <h3>{furniture}</h3>
          </div>
        </div>
      </div>

      {/*  Recent Assets Table */}
      <div className="card mt-4">
        <div className="card-header">
          <h5>Recent Assets</h5>
        </div>

        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Asset Type</th>
                <th>Condition</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentAssets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Data
                  </td>
                </tr>
              ) : (
                recentAssets.map((asset) => (
                  <tr key={asset.assetId}>
                    <td>{asset.assetName}</td>
                    <td>{asset.brand}</td>
                    <td>{asset.assetTypeName}</td>
                    <td>{asset.assetCondition}</td>
                    <td>
                      <span
                        className={`badge ${
                          asset.status === "AVAILABLE"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;