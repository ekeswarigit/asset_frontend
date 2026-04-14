import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAssets, deleteAsset } from "../services/assetService";
import { addAsset } from "../services/assetService";

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchType, setSearchType] = useState("");

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // ✅ Fetch data on load
  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const res = await getAssets(page, 5);

      console.log("FULL API:", res);

      // ✅ Handle ALL backend response formats
      let assetList = [];

      if (Array.isArray(res)) {
        assetList = res;
      } else if (Array.isArray(res?.data)) {
        assetList = res.data;
      } else if (Array.isArray(res?.data?.content)) {
        assetList = res.data.content;
      } else if (Array.isArray(res?.data?.data)) {
        assetList = res.data.data;
      } else if (Array.isArray(res?.data?.data?.content)) {
        assetList = res.data.data.content;
      }

      setAssets(assetList);
    } catch (error) {
      console.error("Fetch Error:", error);
     // setAssets([]);
    }
  };

  const lastRowRef = (node) => {
    if (!hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  const res = await deleteAsset(id);

  if (res.success) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  } else {
    alert("Delete failed");
  }
};

  // ✅ Safe filter
  const filteredAssets = (assets || []).filter((a) =>
    (a.assetTypeName || "")
      .toLowerCase()
      .includes(searchType.toLowerCase())
  );

  const [formData, setFormData] = useState({
    assetName: "",
    serialNumber: "",
    brand: "",
    model: "",
    purchaseDate: "",
    warrantyExpiry: "",
    cost: "",
    status: "",
    assetCondition: "",
    notes: "",
    typeId: "",
    locationId: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async () => {
  try {
    const res = await addAsset(formData);
console.log("Sending:", formData);
    if (res?.success) {
      alert("Asset Added ✅");

      // 🔄 refresh table
      fetchData();

      // ✅ clear form
      setFormData({
        assetName: "",
        assetType: "",
        status: "",
        assetCondition: "",
        brand: "",
        serialNumber: "",
      });

      //  close modal
      const modal = document.getElementById("addAssetModal");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } else {
      alert("Save failed ");
    }

  } catch (error) {
    console.error(error);
    alert("Error saving ");
  }
};
  return (
    <div>
      <h2>Assets</h2>

      {/* 🔹 Top controls */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button
            className="btn btn-primary w-25 "
            data-bs-toggle="modal"
            data-bs-target="#addAssetModal" >
          Add Asset
        </button>

        <select
          className="form-control w-75"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="1">IT Equipment</option>
          <option value="2">Furniture</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Condition</th>
            <th>Asset Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAssets.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Assets Found
              </td>
            </tr>
          ) : (
            filteredAssets.map((a) => (
              <tr key={a.assetId}>
                <td>{a.assetName}</td>
                <td>{a.brand}</td>
                <td>{a.status}</td>
                <td>{a.assetCondition}</td>
                <td>{a.assetTypeName}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2">
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(a.assetId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  {/* add asset form */}
<div className="modal fade" id="addAssetModal" tabIndex="-1">
  <div className="modal-dialog">
    <div className="modal-content">

      {/* Header */}
      <div className="modal-header">
        <h5 className="modal-title">Add Asset</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
        ></button>
      </div>

      {/* Body */}
      <div className="modal-body">

        <input
          className="form-control mb-2"
          placeholder="Asset Name"
          name="assetName"
          value={formData.assetName}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          placeholder="Serial Number"
          name="serialNumber"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          placeholder="Brand"
          name="brand"
          onChange={handleChange}
        />
        
        <input
           className="form-control mb-2"
           name="model"
           placeholder="Model"
           onChange={handleChange}
        />
        <input
            type="date"
            className="form-control mb-2"
            name="purchaseDate"
            onChange={handleChange}
        />

        <input
            type="date"
            className="form-control mb-2"
            name="warrantyExpiry"
            onChange={handleChange}
        />
        <input
            className="form-control mb-2"
            name="cost"
            placeholder="Cost"
            onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="typeId"
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          <option value="1">IT Equipment</option>
          <option value="2">Furniture</option>
        </select>

        <select
          className="form-control mb-2"
          name="status"
          onChange={handleChange}
        >
          <option value="">Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="RETIRED">Retired</option>
        </select>

        <select
          className="form-control mb-2"
          name="assetCondition"
          onChange={handleChange}
        >
          <option value="">Condition</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
          
        </select>
    
      <input
        className="form-control mb-2"
        name="notes"
        placeholder="Notes"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        name="locationId"
        placeholder="Location ID"
        onChange={handleChange}
      />
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>

        <button className="btn btn-success" onClick={handleSubmit}>
          Save
        </button>
      </div>

    </div>
  </div>
</div>
    </div>
  );
};

export default Assets;