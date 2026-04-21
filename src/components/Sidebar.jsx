import { Link as RouterLink } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext } from "../theme/colorMode";
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CasesIcon from '@mui/icons-material/Cases';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 76;

const Sidebar = ({ onWidthChange }) => {
  const theme = useTheme();
  const { mode, setMode } = useContext(ColorModeContext);
  const [collapsed, setCollapsed] = useState(false);
  const email = localStorage.getItem("email") || "your@email.com";
  const displayName = email.includes("@") ? email.split("@")[0] : email;
  const initials = displayName
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const items = useMemo(
    () => [
      { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
      { label: "Assets", to: "/assets", icon: <CasesIcon /> },
      { label: "User", to:"/user", icon:<PeopleIcon/> },
    ],
    []
  );

  const bottomItems = useMemo(
    () => [
      { label: "Settings", to: "/settings", icon: <SettingsOutlinedIcon />, disabled: true },
      //{ label: "Support", to: "/support", icon: <HelpOutlineOutlinedIcon />, disabled: true },
    ],
    []
  );

  const handleToggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      onWidthChange?.(next ? COLLAPSED_WIDTH : EXPANDED_WIDTH);
      return next;
    });
  };

  return (
    <Box
      sx={{
        width,
        height: "100vh",
        position: "sticky",
        top: 0,
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 180ms ease",
      }}
    >
      <Box
        sx={{
          px: collapsed ? 1.5 : 2,
          pt: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(11, 61, 145, 0.12)",
              color: "primary.main",
              fontWeight: 800,
            }}
          >
            {initials}
          </Avatar>

          {!collapsed ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(18,18,24,0.92)",
                }}
                noWrap
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.62)"
                      : "rgba(18,18,24,0.58)",
                }}
                noWrap
              >
                {email}
              </Typography>
            </Box>
          ) : null}
        </Box>

        {!collapsed ? (
          <IconButton
            onClick={handleToggleCollapsed}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(20, 20, 40, 0.10)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ChevronLeftRoundedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleToggleCollapsed}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(20, 20, 40, 0.10)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.8 }} />

      <Box sx={{ px: collapsed ? 1 : 1.5, py: 1.5, flex: 1 }}>
        <List disablePadding>
          {items.map((item) => {
            const btn = (
              <ListItemButton
                key={item.to}
                component={RouterLink}
                to={item.to}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  px: collapsed ? 1.5 : 1.75,
                  py: 1.1,
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.84)"
                      : "rgba(18,18,24,0.82)",
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                    mr: collapsed ? 0 : 1.5,
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.72)"
                        : "rgba(18,18,24,0.72)",
                  },
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {!collapsed ? <ListItemText primary={item.label} /> : null}
              </ListItemButton>
            );

            return collapsed ? (
              <Tooltip key={item.to} title={item.label} placement="right" arrow>
                {btn}
              </Tooltip>
            ) : (
              btn
            );
          })}
        </List>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.8 }} />

      <Box sx={{ px: collapsed ? 1 : 1.5, py: 1.5 }}>
        <List disablePadding sx={{ mb: 1 }}>
          {bottomItems.map((item) => {
            const btn = (
              <ListItemButton
                key={item.to}
                component="button"
                disabled={item.disabled}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  px: collapsed ? 1.5 : 1.75,
                  py: 1.05,
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.72)"
                      : "rgba(18,18,24,0.72)",
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                    mr: collapsed ? 0 : 1.5,
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.58)"
                        : "rgba(18,18,24,0.58)",
                  },
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {!collapsed ? <ListItemText primary={item.label} /> : null}
              </ListItemButton>
            );

            return collapsed ? (
              <Tooltip key={item.to} title={item.label} placement="right" arrow>
                {btn}
              </Tooltip>
            ) : (
              btn
            );
          })}
        </List>

        {!collapsed ? (
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, next) => {
              if (next) setMode(next);
            }}
            fullWidth
            size="small"
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.7)",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: "hidden",
              "& .MuiToggleButton-root": {
                border: 0,
                py: 0.75,
                textTransform: "none",
                fontWeight: 700,
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.70)"
                    : "rgba(18,18,24,0.70)",
              },
              "& .Mui-selected": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.10) !important"
                    : "rgba(11, 61, 145, 0.10) !important",
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(18,18,24,0.90)",
              },
            }}
          >
            <ToggleButton value="light">
              <LightModeOutlinedIcon sx={{ mr: 0.75 }} fontSize="small" />
              Light
            </ToggleButton>
            <ToggleButton value="dark">
              <DarkModeOutlinedIcon sx={{ mr: 0.75 }} fontSize="small" />
              Dark
            </ToggleButton>
          </ToggleButtonGroup>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Tooltip title="Light" placement="right" arrow>
              <IconButton
                size="small"
                onClick={() => setMode("light")}
                sx={{
                  bgcolor:
                    mode === "light"
                      ? theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(11, 61, 145, 0.10)"
                      : theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.7)",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <LightModeOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dark" placement="right" arrow>
              <IconButton
                size="small"
                onClick={() => setMode("dark")}
                sx={{
                  bgcolor:
                    mode === "dark"
                      ? theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(11, 61, 145, 0.10)"
                      : theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.7)",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <DarkModeOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
