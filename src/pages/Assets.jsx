import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAssets, deleteAsset } from "../services/assetService";

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
  // const fetchData = async () => {
  //   try {
  //     const res = await getAssets(page, 5); // ✅ pagination

  //     console.log("API:", res);

  //     const content = res?.data?.data.content || [];

  //     // ✅ Append data (important)
  //     setAssets((prev) => [...prev, ...content]);

  //     setHasMore(!res?.data?.data.last);
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   }
  // };

   // ✅ Infinite scroll observer (attach to last row)
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
    (a.assetType || "")
      .toLowerCase()
      .includes(searchType.toLowerCase())
  );

  return (
    <div>
      <h2>Assets</h2>

      {/* 🔹 Top controls */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button
          className="btn btn-primary w-25"
          onClick={() => navigate("/add-asset")}
        >
          Add Asset
        </button>

        <select
          className="form-control"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="IT Equipment">IT Equipment</option>
          <option value="Office Furniture">Office Furniture</option>
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
    </div>
  );
};

export default Assets;