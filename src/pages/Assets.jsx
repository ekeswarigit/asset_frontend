import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAssets, deleteAsset } from "../services/assetService";
import { addAsset, updateAsset } from "../services/assetService";
import { getLocations } from "../services/locationService";

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5); // items per page
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch data on load
  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
  try {
    const res = await getAssets(page, 10);

    console.log("FULL API:", res);

    // ✅ FIXED PATH
    const assetList = res?.data?.data?.content || [];

    setAssets(assetList);

    // ✅ FIXED totalPages
    setTotalPages(res?.data?.data?.totalPages || 0);

  } catch (error) {
    console.error("Error:", error);
  }
};
  // const fetchData = async () => {
  //   try {
  //     const res = await getAssets(page, 5);

  //     console.log("FULL API:", res);

  //     // ✅ Handle ALL backend response formats
  //     let assetList = [];

  //     if (Array.isArray(res)) {
  //       assetList = res;
  //     } else if (Array.isArray(res?.data)) {
  //       assetList = res.data;
  //     } else if (Array.isArray(res?.data?.content)) {
  //       assetList = res.data.content;
  //     } else if (Array.isArray(res?.data?.data)) {
  //       assetList = res.data.data;
  //     } else if (Array.isArray(res?.data?.data?.content)) {
  //       assetList = res.data.data.content;
  //     }
  //     setAssets(assetList);
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //    // setAssets([]);
  //   }
  // };

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
  const filteredAssets = assets.filter((a) => {
  if (!searchType) return true;

  return (a.assetTypeName || "")
    .toLowerCase()
    .includes(searchType.toLowerCase());
});

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
    if (isEdit) {
      await updateAsset(editId, formData);
      alert("Asset Updated ✅");
    } else {
      await addAsset(formData);
      alert("Asset Added ✅");
    }

    fetchData();

    // reset form
    setFormData({
      assetName: "",
      assetType: "",
      status: "",
      assetCondition: "",
      brand: "",
      serialNumber: "",
      model: "",
      purchaseDate: "",
      warrantyExpiry: "",
      cost: "",
      notes: "",
      typeId: "",
      locationId: "",
    });

    setIsEdit(false);
    setEditId(null);

    // close modal
    const modal = document.getElementById("addAssetModal");
    const modalInstance = window.bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

  } catch (error) {
    alert("Error ");
  }
};
//update data
 const handleEdit = (asset) => {
  setFormData({
    assetName: asset.assetName,
    serialNumber: asset.serialNumber,
    brand: asset.brand,
    model: asset.model || "",
    purchaseDate: asset.purchaseDate || "",
    warrantyExpiry: asset.warrantyExpiry || "",
    cost: asset.cost || "",
    status: asset.status,
    assetCondition: asset.assetCondition,
    notes: asset.notes || "",
    typeId: asset.typeId,
    locationId: asset.locationId || "",
  });

  setEditId(asset.assetId);
  setIsEdit(true);

  // open modal
  const modal = new window.bootstrap.Modal(
    document.getElementById("addAssetModal")
  );
  modal.show();
};
//location
 useEffect(() => {
  fetchLocations();
}, []);

const fetchLocations = async () => {
  try {
    const res = await getLocations();

    console.log("LOCATIONS:", res);

    // handle response safely
    const locationList = res?.data?.data || [];

    setLocations(Array.isArray(locationList) ? locationList : []);

  } catch (error) {
    console.error("Location fetch error:", error);
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
          <option value="IT equipment">IT Equipment</option>
          <option value="office furniture">Office Furniture</option>
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
                  <button className="btn btn-success btn-sm me-2"
                    onClick={() => handleEdit(a)}>
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
      <div className="d-flex justify-content-between mt-3">
  <button
    className="btn btn-secondary"
    disabled={page === 0}
    onClick={() => setPage(page - 1)}
  >
    ⬅ Previous
  </button>

  <span>Page {page + 1} of {totalPages}</span>

  <button
    className="btn btn-primary"
    disabled={page + 1 === totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next 
  </button>
</div>
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
          value={formData.serialNumber}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          placeholder="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        />
        
        <input
           className="form-control mb-2"
           name="model"
           placeholder="Model"
           value={formData.model}
           onChange={handleChange}
        />
        <input
            type="date"
            className="form-control mb-2"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
        />

        <input
            type="date"
            className="form-control mb-2"
            name="warrantyExpiry"
            value={formData.warrantyExpiry}
            onChange={handleChange}
        />
        <input
            className="form-control mb-2"
            name="cost"
            placeholder="Cost"
            value={formData.cost}
            onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="typeId"
          value={formData.typeId}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          <option value="1">IT Equipment</option>
          <option value="2">Office Furniture</option>
        </select>

        <select
          className="form-control mb-2"
          name="status"
          value={formData.status}
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
          value={formData.assetCondition}
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
        value={formData.notes}
        onChange={handleChange}
      />
      {/* <input
        className="form-control mb-2"
        name="locationId"
        placeholder="Location ID"
        value={formData.locationId}
        onChange={handleChange}
      /> */}
      <select
          className="form-control mb-2"
          name="locationId"
          value={formData.locationId}
          onChange={handleChange}
        >
          <option value="">Select Location</option>

          {locations.map((loc) => (
            <option key={loc.locationId} value={loc.locationId}>
              {loc.locationName}
            </option>
          ))}
      </select>
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
          {isEdit ? "Update" : "Save"}
        </button>
      </div>

    </div>
  </div>
</div>
    </div>
  );
};

export default Assets;