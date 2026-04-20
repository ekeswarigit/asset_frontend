import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "./theme/colorMode";

function Root() {
  const [mode, setMode] = useState(() => localStorage.getItem("color-mode") || "light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            light: "#90a4ae",
            main: "#0B3D91",
            dark: "#212121",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#066a7c",
            contrastText: "#FFFFFF",
          },
          background: {
            default: mode === "dark" ? "#0B0F1A" : "#F5F7FB",
            paper: mode === "dark" ? "#111827" : "#FFFFFF",
          },
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  const colorModeValue = useMemo(
    () => ({
      mode,
      setMode: (next) => {
        setMode(next);
        localStorage.setItem("color-mode", next);
      },
    }),
    [mode]
  );

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorModeValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StrictMode>
            <App />
          </StrictMode>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <Root />
)
