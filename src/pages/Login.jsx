import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { keyframes } from "@mui/system";

// ─── JWT helpers 
function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
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
    if (first && typeof first === "object" && typeof first.authority === "string")
      return first.authority;
  }
  if (typeof payload.scope === "string") {
    if (payload.scope.toUpperCase().includes("ADMIN")) return "ADMIN";
    if (payload.scope.toUpperCase().includes("USER")) return "USER";
  }
  return null;
}

// ─── Bubble helpers 
const BUBBLE_COLORS = [
  [120, 160, 255],
  [180, 120, 255],
  [100, 210, 255],
  [255, 160, 220],
  [140, 240, 200],
  [255, 200, 120],
];

class Bubble {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = y + (Math.random() - 0.5) * 20;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -(Math.random() * 1.5 + 0.5);
    this.maxR = Math.random() * 18 + 8;
    this.r = 0;
    this.alpha = 0;
    this.maxAlpha = Math.random() * 0.45 + 0.25;
    this.color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.06 + 0.03;
    this.wobbleAmt = Math.random() * 1.5 + 0.5;
    this.life = 0;
    this.maxLife = Math.random() * 120 + 80;
    this.growing = true;
  }

  update() {
    this.life++;
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * this.wobbleAmt * 0.3;
    this.y += this.vy;
    this.vx *= 0.99;
    this.vy *= 0.995;
    const progress = this.life / this.maxLife;
    if (this.growing) {
      this.r += (this.maxR - this.r) * 0.12;
      this.alpha = Math.min(this.maxAlpha, this.alpha + 0.04);
      if (this.r > this.maxR * 0.95) this.growing = false;
    }
    if (progress > 0.7) {
      this.alpha *= 0.97;
      if (progress > 0.9) this.r *= 0.98;
    }
    return this.life < this.maxLife && this.alpha > 0.005;
  }

  draw(ctx) {
    const [r, g, b] = this.color;
    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Body fill
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(
      this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.05,
      this.x, this.y, this.r
    );
    grad.addColorStop(0, `rgba(${r},${g},${b},0.08)`);
    grad.addColorStop(0.6, `rgba(${r},${g},${b},0.04)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Rim
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Primary shine
    ctx.beginPath();
    ctx.arc(this.x - this.r * 0.38, this.y - this.r * 0.38, this.r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fill();

    // Secondary shine
    ctx.beginPath();
    ctx.arc(this.x + this.r * 0.28, this.y - this.r * 0.22, this.r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();

    ctx.restore();
  }
}

// ─── BubbleCanvas component 
function BubbleCanvas({ containerRef }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const bubblesRef = useRef([]);
  const cursorRef = useRef({ x: -999, y: -999, wobble: 0 });
  const spawnTimer = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 10; i++) bubblesRef.current.push(new Bubble(cx, cy));
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("click", onClick);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      // Spawn trailing bubbles
      spawnTimer.current++;
      if (mouse.x > 0 && spawnTimer.current % 5 === 0) {
        bubblesRef.current.push(new Bubble(mouse.x, mouse.y));
      }

      // Update & draw trail bubbles
      bubblesRef.current = bubblesRef.current.filter((b) => b.update());
      bubblesRef.current.forEach((b) => b.draw(ctx));

      // Draw cursor bubble
      if (mouse.x > 0) {
        const cur = cursorRef.current;
        cur.wobble += 0.07;
        cur.x += (mouse.x - cur.x) * 0.18;
        cur.y += (mouse.y - cur.y) * 0.18;

        const wx = Math.sin(cur.wobble) * 2;
        const wy = Math.cos(cur.wobble * 0.8) * 1.5;
        const cx = cur.x + wx;
        const cy = cur.y + wy;
        const cr = 18;

        ctx.save();
        ctx.globalAlpha = 0.85;

        // Body
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, cr * 0.05, cx, cy, cr);
        g.addColorStop(0, "rgba(140,170,255,0.12)");
        g.addColorStop(0.7, "rgba(160,120,255,0.06)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fill();

        // Rim
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(120,150,255,0.75)";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Shine
        ctx.beginPath();
        ctx.arc(cx - cr * 0.38, cy - cr * 0.38, cr * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx + cr * 0.3, cy - cr * 0.2, cr * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("click", onClick);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        borderRadius: "inherit",
      }}
    />
  );
}

// ─── Main Login component
const Login = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Hide default cursor over the page
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "bubble-cursor-style";
    style.textContent = `body { cursor: none !important; } * { cursor: none !important; }`;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("bubble-cursor-style");
      if (el) el.remove();
    };
  }, []);

  const anim = useMemo(() => {
    const floatSlow = keyframes`
      0%   { transform: translate3d(0px, 0px, 0px); }
      50%  { transform: translate3d(0px, -10px, 0px); }
      100% { transform: translate3d(0px, 0px, 0px); }
    `;
    const floatFast = keyframes`
      0%   { transform: translate3d(2px, 2px, 2px) rotate(0deg); }
      50%  { transform: translate3d(2px, -14px, 2px) rotate(2deg); }
      100% { transform: translate3d(1px, 1px, 1px) rotate(0deg); }
    `;
    const shimmer = keyframes`
      0%   { transform: translateX(-60%) rotate(10deg); opacity: 0; }
      25%  { opacity: 0.65; }
      60%  { opacity: 0; }
      100% { transform: translateX(60%) rotate(10deg); opacity: 0; }
    `;
    return { floatSlow, floatFast, shimmer };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser(formData);
      const token = res;
      if (!token) { alert("Token not received ❌"); return; }
      localStorage.setItem("token", token);
      localStorage.setItem("email", formData.email);
      const payload = decodeJwtPayload(token);
      const roleRaw = extractRoleFromPayload(payload);
      const normalizedRole =
        typeof roleRaw === "string" && roleRaw.toUpperCase().includes("ADMIN") ? "ADMIN" : "USER";
      localStorage.setItem("role", normalizedRole);
      navigate("/dashboard");
    } catch {
      alert("Invalid Credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      ref={pageRef}
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: { xs: 2, md: 3 },
        bgcolor: "#f6f7fb",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `
          radial-gradient(1200px 600px at 10% 10%, rgba(173,216,255,0.55), transparent 55%),
          radial-gradient(900px 500px at 80% 35%, rgba(221,195,255,0.60), transparent 55%),
          radial-gradient(700px 420px at 40% 90%, rgba(255,209,194,0.55), transparent 55%)
        `,
      }}
    >
      {/* Bubble cursor canvas — covers the whole page */}
      <BubbleCanvas containerRef={pageRef} />

      <Box
        sx={{
          width: "min(1100px, 100%)",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.75)",
          boxShadow: "0 26px 70px rgba(18,18,24,0.16)",
          bgcolor: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(14px)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          minHeight: { xs: "auto", md: 640 },
          position: "relative",
        }}
      >
        {/* ── Left: animated hero ── */}
        <Box
          sx={{
            position: "relative",
            p: { xs: 3, md: 5 },
            bgcolor: "rgba(255,255,255,0.35)",
            backgroundImage: `
              radial-gradient(800px 520px at 20% 20%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 55%, rgba(255,255,255,0.18) 100%),
              linear-gradient(135deg, rgba(218,236,255,0.85), rgba(247,238,255,0.70))
            `,
          }}
        >
          <Stack spacing={1.25} sx={{ position: "relative", zIndex: 2, maxWidth: 420 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: -0.8,
                color: "rgba(11,24,56,0.94)",
                fontSize: { xs: 34, md: 46 },
                lineHeight: 1.05,
              }}
            >
              Register
              <br />your asset
              <br />name now!
            </Typography>
          </Stack>

          <Box
            sx={{
              position: "relative",
              mt: { xs: 3, md: 4 },
              height: { xs: 280, md: 420 },
              perspective: "1100px",
              transformStyle: "preserve-3d",
              zIndex: 1,
            }}
          >
            {/* Floor */}
            <Box sx={{
              position: "absolute", left: "50%", bottom: 10,
              width: { xs: 320, md: 520 }, height: { xs: 140, md: 200 },
              transform: "translateX(-50%) rotateX(72deg)",
              borderRadius: 6,
              background: "linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.35))",
              boxShadow: "0 40px 60px rgba(18,18,24,0.18)",
              border: "1px solid rgba(255,255,255,0.7)",
            }} />

            {/* Main shop block */}
            <Box sx={{
              position: "absolute", left: "50%", bottom: { xs: 42, md: 60 },
              width: { xs: 210, md: 300 }, height: { xs: 210, md: 300 },
              transform: "translateX(-35%) rotateY(-18deg) rotateX(8deg)",
              transformStyle: "preserve-3d",
              borderRadius: 8,
              background: "linear-gradient(135deg,rgba(255,255,255,0.95),rgba(233,241,255,0.78))",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 30px 70px rgba(18,18,24,0.22)",
              animation: `${anim.floatSlow} 6.8s ease-in-out infinite`,
              "&::before": {
                content: '""', position: "absolute", inset: 0, borderRadius: 8,
                background: "radial-gradient(140px 180px at 20% 20%,rgba(255,255,255,0.95),transparent 60%)",
                pointerEvents: "none",
              },
            }}>
              {/* Right face */}
              <Box sx={{
                position: "absolute", top: 16, right: -34,
                width: 42, height: "calc(100% - 32px)",
                transform: "rotateY(90deg)", transformOrigin: "left",
                borderRadius: 6,
                background: "linear-gradient(180deg,rgba(220,230,255,0.55),rgba(255,255,255,0.18))",
                border: "1px solid rgba(255,255,255,0.65)",
              }} />
              {/* Door */}
              <Box sx={{
                position: "absolute",
                left: { xs: 26, md: 40 }, bottom: { xs: 34, md: 44 },
                width: { xs: 62, md: 82 }, height: { xs: 98, md: 130 },
                borderRadius: 6,
                background: "linear-gradient(180deg,rgba(206,128,255,0.85),rgba(255,170,240,0.62))",
                boxShadow: "0 18px 26px rgba(120,40,160,0.22)",
                border: "1px solid rgba(255,255,255,0.55)",
              }} />
              {/* Awning */}
              <Box sx={{
                position: "absolute",
                right: { xs: 16, md: 22 }, top: { xs: 46, md: 58 },
                width: { xs: 92, md: 128 }, height: { xs: 44, md: 58 },
                borderRadius: 6, transform: "rotateY(10deg)",
                background: "repeating-linear-gradient(90deg,rgba(255,110,70,0.95) 0 14px,rgba(255,255,255,0.95) 14px 28px)",
                boxShadow: "0 14px 26px rgba(18,18,24,0.18)",
                border: "1px solid rgba(255,255,255,0.65)",
              }} />
              {/* Sign */}
              <Box sx={{
                position: "absolute",
                right: { xs: 20, md: 26 }, top: { xs: 22, md: 28 },
                width: { xs: 86, md: 118 }, height: { xs: 28, md: 36 },
                borderRadius: 999, bgcolor: "rgba(206,128,255,0.90)",
                color: "rgba(255,255,255,0.94)",
                display: "grid", placeItems: "center",
                fontWeight: 900, letterSpacing: 0.6,
                fontSize: { xs: 12, md: 14 },
                boxShadow: "0 14px 22px rgba(120,40,160,0.25)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}>Store</Box>
              {/* Shine sweep */}
              <Box sx={{
                position: "absolute", inset: -20, borderRadius: 9,
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)",
                transform: "translateX(-60%) rotate(10deg)",
                animation: `${anim.shimmer} 4.8s ease-in-out infinite`,
                pointerEvents: "none",
              }} />
            </Box>

            {/* Floating boxes */}
            <Box sx={{
              position: "absolute",
              left: { xs: 30, md: 50 }, bottom: { xs: 98, md: 140 },
              width: { xs: 72, md: 96 }, height: { xs: 72, md: 96 },
              borderRadius: 4, transform: "rotateY(18deg) rotateX(10deg)",
              background: "linear-gradient(135deg,rgba(255,236,171,0.95),rgba(255,248,220,0.65))",
              boxShadow: "0 22px 34px rgba(18,18,24,0.14)",
              border: "1px solid rgba(255,255,255,0.75)",
              animation: `${anim.floatFast} 4.9s ease-in-out infinite`,
            }} />
            <Box sx={{
              position: "absolute",
              left: { xs: 88, md: 130 }, bottom: { xs: 158, md: 210 },
              width: { xs: 62, md: 84 }, height: { xs: 62, md: 84 },
              borderRadius: 4, transform: "rotateY(-14deg) rotateX(10deg)",
              background: "linear-gradient(135deg,rgba(255,255,255,0.92),rgba(236,242,255,0.62))",
              boxShadow: "0 22px 34px rgba(18,18,24,0.12)",
              border: "1px solid rgba(255,255,255,0.78)",
              animation: `${anim.floatSlow} 5.6s ease-in-out infinite`,
            }} />

            {/* Shadow under shop */}
            <Box sx={{
              position: "absolute", left: "50%", bottom: { xs: 36, md: 52 },
              width: { xs: 240, md: 340 }, height: { xs: 56, md: 80 },
              transform: "translateX(-36%)", borderRadius: 999,
              bgcolor: "rgba(18,18,24,0.16)", filter: "blur(18px)",
            }} />
          </Box>

          {/* Decorative dots */}
          <Box sx={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.95) 1px,transparent 1px)",
            backgroundSize: "12px 12px", mixBlendMode: "soft-light",
          }} />
        </Box>

        {/* ── Right: login form ── */}
        <Box sx={{
          p: { xs: 3, md: 5 },
          display: "flex", alignItems: "center", justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.35)",
        }}>
          <Paper
            component="form"
            onSubmit={handleLogin}
            elevation={0}
            sx={{
              width: "100%", maxWidth: 420,
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.75)",
              boxShadow: "0 22px 60px rgba(18,18,24,0.14)",
            }}
          >
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
                  Welcome back
                </Typography>
                <Typography sx={{ color: "rgba(18,18,24,0.68)", fontWeight: 600 }}>
                  Sign in to continue.
                </Typography>
              </Stack>

              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "rgba(18,18,24,0.55)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "rgba(18,18,24,0.55)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 0.5, py: 1.25,
                  borderRadius: 2.25,
                  fontWeight: 900,
                  textTransform: "none",
                  bgcolor: "rgba(34,92,246,0.92)",
                  boxShadow: "0 16px 26px rgba(34,92,246,0.24)",
                  "&:hover": { bgcolor: "rgba(34,92,246,1)" },
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;