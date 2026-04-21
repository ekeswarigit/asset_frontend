import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAsset } from "../services/assetService";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

const Addform = () => {
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
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Add Asset
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            name="assetName"
            label="Asset Name"
            value={formData.assetName}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            name="assetType"
            label="Asset Type"
            value={formData.assetType}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
          </TextField>

          <TextField
            select
            name="condition"
            label="Condition"
            value={formData.condition}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">Select Condition</MenuItem>
            <MenuItem value="GOOD">Good</MenuItem>
            <MenuItem value="DAMAGED">Damaged</MenuItem>
          </TextField>

          <TextField
            name="brand"
            label="Brand"
            value={formData.brand}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="serialNumber"
            label="Serial Number"
            value={formData.serialNumber}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="success">
            Save
          </Button>
          <Button type="button" variant="outlined" onClick={() => navigate("/assets")}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Addform;
