import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const AssetTable = ({ assets=[], onDelete, onEdit }) => {
  
  const columns = [
    { field: "assetName", headerName: "Name", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "assetCondition", headerName: "Condition", flex: 1 },
    { field: "assetTypeName", headerName: "Asset Type", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => onDelete(params.row.assetId)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // ✅ Rows (IMPORTANT FIX)
  const rows = assets.map((a) => ({
    id: a.assetId, // MUST be 'id'
    ...a,
  }));
  return (  
      <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </div>
  );
}; 

export default AssetTable;