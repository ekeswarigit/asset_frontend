import React, { useEffect, useState } from "react";
import { getAssets, deleteAsset, addAsset, updateAsset } from "../services/assetService";
import { getLocations } from "../services/locationService";
import DataTable from "../components/DataTable";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const initialForm = {
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
};

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const role = localStorage.getItem("role");
  const canManage = role === "ADMIN";

  async function fetchData() {
    try {
      const res = await getAssets(page, 10);

      console.log("FULL API:", res);

      const assetList = res?.data?.data?.content || [];
      setAssets(assetList);

      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  useEffect(() => {
    void fetchData();
  }, [page]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.assetId !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesType = !searchType
      ? true
      : (a.assetTypeName || "").toLowerCase().includes(searchType.toLowerCase());

    const matchesStatus = !statusFilter
      ? true
      : (a.status || "").toUpperCase() === statusFilter.toUpperCase();

    const q = (searchQuery || "").trim().toLowerCase();
    const matchesQuery = !q
      ? true
      : `${a.assetName || ""} ${a.brand || ""}`.toLowerCase().includes(q);

    return matchesType && matchesStatus && matchesQuery;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setIsEdit(false);
    setEditId(null);
    setFormData(initialForm);
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
      closeDialog();
    } catch {
      alert("Error ");
    }
  };

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
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    if (!canManage) {
      alert("Only Admin can add assets");
      return;
    }
    setIsEdit(false);
    setEditId(null);
    setFormData(initialForm);
    setDialogOpen(true);
  };

  async function fetchLocations() {
    try {
      const res = await getLocations();

      console.log("LOCATIONS:", res);

      const locationList = res?.data?.data || [];

      setLocations(Array.isArray(locationList) ? locationList : []);
    } catch (err) {
      console.error("Location fetch error:", err);
    }
  }

  useEffect(() => {
    void fetchLocations();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Assets
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }} alignItems={{ sm: "center" }}>
        <Button variant="contained" color="primary" onClick={openAddDialog}>
          Add Asset
        </Button>

        <TextField
          label="Search (Name / Brand)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 280 } }}
          size="small"
        />

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: { xs: "100%", sm: 200 } }}
          size="small"
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="ASSIGNED">Assigned</MenuItem>
          <MenuItem value="RETIRED">Retired</MenuItem>
        </TextField>

        <TextField
          select
          label="Asset Type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          sx={{ width: { xs: "100%", sm: 250 } }}
          size="small"
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="IT equipment">IT Equipment</MenuItem>
          <MenuItem value="office furniture">Office Furniture</MenuItem>
        </TextField>
      </Stack>

      <dataTable assets={filteredAssets} onDelete={handleDelete} onEdit={handleEdit} canManage={canManage} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </Button>

        <Typography variant="body2">
          Page {page + 1} of {totalPages || 1}
        </Typography>

        <Button
          variant="contained"
          disabled={page + 1 >= totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Stack>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6 }}>
          {isEdit ? "Edit Asset" : "Add Asset"}
          <IconButton
            aria-label="close"
            onClick={closeDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Asset Name"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Serial Number"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Warranty Expiry"
              name="warrantyExpiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={handleChange}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="Type"
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="1">IT Equipment</MenuItem>
              <MenuItem value="2">Office Furniture</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="">Status</MenuItem>
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="ASSIGNED">Assigned</MenuItem>
              <MenuItem value="RETIRED">Retired</MenuItem>
            </TextField>
            <TextField
              select
              label="Condition"
              name="assetCondition"
              value={formData.assetCondition}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="">Condition</MenuItem>
              <MenuItem value="GOOD">Good</MenuItem>
              <MenuItem value="FAIR">Fair</MenuItem>
              <MenuItem value="POOR">Poor</MenuItem>
            </TextField>
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              size="small"
              multiline
              minRows={2}
            />
            <TextField
              select
              label="Location"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="">Select Location</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc.locationId} value={loc.locationId}>
                  {loc.locationName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assets;
