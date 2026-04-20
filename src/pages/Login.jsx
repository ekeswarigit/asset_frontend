import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractRoleFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  const direct = payload.role || payload.userRole;
  if (typeof direct === "string") return direct;

  const rolesArray = payload.roles || payload.authorities || payload.authority;
  if (Array.isArray(rolesArray) && rolesArray.length > 0) {
    const first = rolesArray[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && typeof first.authority === "string") return first.authority;
  }

  if (typeof payload.scope === "string") {
    if (payload.scope.toUpperCase().includes("ADMIN")) return "ADMIN";
    if (payload.scope.toUpperCase().includes("USER")) return "USER";
  }

  return null;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      console.log("LOGIN RESPONSE:", res);

      const token = res;
      if (!token) {
        alert("Token not received ❌");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("email", formData.email);

      const payload = decodeJwtPayload(token);
      const roleRaw = extractRoleFromPayload(payload);
      const normalizedRole =
        typeof roleRaw === "string" && roleRaw.toUpperCase().includes("ADMIN") ? "ADMIN" : "USER";
      localStorage.setItem("role", normalizedRole);

      alert("Login Successful ✅");

      navigate("/dashboard");
    } catch {
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleLogin}
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 400 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          autoComplete="email"
          onChange={handleChange}
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="current-password"
          onChange={handleChange}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
