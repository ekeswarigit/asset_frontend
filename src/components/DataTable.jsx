import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

/**
 /* GenericDataTable
 *
 * Props:
 * - rows         : array of data objects (each must have a unique `id` field, or set `getRowId`)
 * - columns      : array of MUI DataGrid column definitions (no need to add "actions" — it's auto-appended)
 * - onView       : (row) => void  — called when "View Details" is clicked
 * - onEdit       : (row) => void  — called when "Edit" is clicked
 * - onDelete     : (row) => void  — called when "Delete" is clicked
 * - canManage    : boolean (default: true) — hides the Actions column when false
 * - getRowId     : (row) => string|number — optional custom row id extractor
 * - menuItems    : array of extra menu items: [{ label, icon: <Icon/>, onClick: (row)=>void, sx }]
 * - pageSize     : number (default: 5)
 */
const DataTable = ({
  rows = [],
  columns = [],
  onView,
  onEdit,
  onDelete,
  canManage = true,
  getRowId,
  menuItems = [],
  pageSize = 5,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAction = (callback) => {
    callback(selectedRow);
    handleCloseMenu();
  };

  const allColumns = [
    ...columns,
    ...(canManage
      ? [
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.4,
            minWidth: 70,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <IconButton
                size="small"
                onClick={(e) => handleOpenMenu(e, params.row)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={allColumns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          getRowId={getRowId}
        />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {onView && (
          <MenuItem onClick={() => handleAction(onView)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleAction(item.onClick)}
            sx={item.sx}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}

        {onDelete && (
          <MenuItem
            onClick={() => handleAction(onDelete)}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default DataTable;


// ─────────────────────────────────────────────
// USAGE EXAMPLES (not exported — reference only)
// ─────────────────────────────────────────────

// ── Asset Table ──────────────────────────────
//
// const ASSET_COLUMNS = [
//   { field: "assetName",      headerName: "Name",       flex: 1 },
//   { field: "brand",          headerName: "Brand",      flex: 1 },
//   { field: "status",         headerName: "Status",     flex: 1 },
//   { field: "assetCondition", headerName: "Condition",  flex: 1 },
//   { field: "assetTypeName",  headerName: "Asset Type", flex: 1 },
// ];
//
// <GenericDataTable
//   rows={assets.map((a) => ({ id: a.assetId, ...a }))}
//   columns={ASSET_COLUMNS}
//   onView={(row) => openViewModal(row)}
//   onEdit={(row) => openEditModal(row)}
//   onDelete={(row) => handleDelete(row.assetId)}
//   canManage={canManage}
// />


// ── User Table ───────────────────────────────
//
// const USER_COLUMNS = [
//   { field: "username", headerName: "Username", flex: 1 },
//   { field: "email",    headerName: "Email",    flex: 1.5 },
//   { field: "role",     headerName: "Role",     flex: 1 },
// ];
//
// <GenericDataTable
//   rows={users.map((u) => ({ id: u.userId, ...u }))}
//   columns={USER_COLUMNS}
//   onView={(row) => openUserProfile(row)}
//   onEdit={(row) => openEditUser(row)}
//   onDelete={(row) => handleDeleteUser(row.userId)}
//   canManage={isAdmin}
// />