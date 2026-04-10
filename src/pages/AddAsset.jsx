import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAsset } from "../services/assetService";

const AddAsset = ({ setAssets }) => {
   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    status: "",
    condition: "",
    brand: "",
    serialNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await addAsset(formData);

    navigate("/assets");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="container">
      <h2>Add Asset</h2>

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="row">

          <div className="col-md-6 mb-3">
            <input
              className="form-control"
              name="assetName"
              placeholder="Asset Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              className="form-control"
              name="assetType"
              placeholder="Asset Type"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <select className="form-control" name="status" onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <select className="form-control" name="condition" onChange={handleChange}>
              <option value="">Select Condition</option>
              <option value="GOOD">Good</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <input
              className="form-control"
              name="brand"
              placeholder="Brand"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              className="form-control"
              name="serialNumber"
              placeholder="Serial Number"
              onChange={handleChange}
            />
          </div>

        </div>

        <button className="btn btn-success">Save</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/assets")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddAsset;