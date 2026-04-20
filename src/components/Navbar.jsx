import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Asset Management
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            👤 {role === "ADMIN" ? "Admin" : "User"}
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
