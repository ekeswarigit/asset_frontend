import React from "react";

const AssetTable = ({ assets=[], onDelete, onEdit }) => {
  return (  
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
          {assets.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Assets Found
              </td>
            </tr>
          ) : (
            assets.map((a) => (
              <tr key={a.assetId}>
                <td>{a.assetName}</td>
                <td>{a.brand}</td>
                <td>{a.status}</td>
                <td>{a.assetCondition}</td>
                <td>{a.assetTypeName}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2"
                    onClick={() => onEdit(a)}>
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(a.assetId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  );
}; 

export default AssetTable;