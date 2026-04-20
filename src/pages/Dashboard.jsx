import React, { useEffect, useState } from "react";
import { getAssets } from "../services/assetService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);

  async function fetchData() {
    try {
      const res = await getAssets(0, 10);

      const assetList = res?.data?.data?.content || [];
      setAssets(assetList);
      setTotalAssets(res?.data?.data?.totalElements || 0);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  useEffect(() => {
    void fetchData();
  }, []);

  const itEquipment = assets.filter(
    (a) => (a.assetTypeName || "").toLowerCase() === "it equipment"
  ).length;

  const furniture = assets.filter(
    (a) => (a.assetTypeName || "").toLowerCase() === "office furniture"
  ).length;

  const availableAssets = assets.filter(
    (a) => (a.status || "").toUpperCase() === "AVAILABLE"
  ).length;

  const recentAssets = [...assets].slice(-3).reverse();

  const statCard = (title, value, gradient, icon, trendText) => (
    <Card
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 200,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        color: "rgba(18, 18, 24, 0.92)",
        backgroundImage: gradient,
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
        transform: "translateY(0px)",
        transition:
          "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "11px 11px",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 18px 38px rgba(0,0,0,0.16)",
          filter: "saturate(1.06)",
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mb: 1.25, alignItems: "center", justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
              }}
            >
              {icon}
            </Box>
            <Typography variant="subtitle2" component="h5" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Stack>

          {trendText ? (
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "rgba(18,18,24,0.72)" }}
            >
              {trendText}
            </Typography>
          ) : null}
        </Stack>

        <Typography variant="h4" component="div" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Dashboard
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        {statCard(
          "Total Assets",
          totalAssets,
          "linear-gradient(135deg, rgba(168, 222, 255, 1), rgba(224, 244, 255, 1))",
          <Inventory2OutlinedIcon sx={{ color: "rgba(30, 90, 180, 0.95)" }} />,
          
        )}
        {statCard(
          "IT Equipment",
          itEquipment,
          "linear-gradient(135deg, rgba(221, 195, 255, 1), rgba(242, 230, 255, 1))",
          <LaptopMacOutlinedIcon sx={{ color: "rgba(110, 60, 190, 0.95)" }} />,
          
        )}
        {statCard(
          "Office Furniture",
          furniture,
          "linear-gradient(135deg, rgba(255, 236, 171, 1), rgba(255, 248, 220, 1))",
          <ChairOutlinedIcon sx={{ color: "rgba(170, 120, 20, 0.95)" }} />,
          
        )}
        {statCard(
          "Available",
          availableAssets,
          "linear-gradient(135deg, rgba(255, 209, 194, 1), rgba(255, 236, 228, 1))",
          <CheckCircleOutlineOutlinedIcon sx={{ color: "rgba(190, 70, 40, 0.95)" }} />,
          
        )}
      </Stack>

      <Paper elevation={2}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">Recent Assets</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.200" }}>
                <TableCell>Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Asset Type</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Data
                  </TableCell>
                </TableRow>
              ) : (
                recentAssets.map((asset) => (
                  <TableRow key={asset.assetId} hover>
                    <TableCell>{asset.assetName}</TableCell>
                    <TableCell>{asset.brand}</TableCell>
                    <TableCell>{asset.assetTypeName}</TableCell>
                    <TableCell>{asset.assetCondition}</TableCell>
                    <TableCell>
                      <Chip
                        label={asset.status}
                        size="small"
                        color={asset.status === "AVAILABLE" ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
