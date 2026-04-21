import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'DM Sans', sans-serif",
  },
  palette: {
    primary: { main: "#5b6ef5" },
  },
});

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
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x - this.r * 0.38, this.y - this.r * 0.38, this.r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.r * 0.28, this.y - this.r * 0.22, this.r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();
    ctx.restore();
  }
}

function BubbleCanvas({ pageRef }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const bubblesRef = useRef([]);
  const cursorRef = useRef({ x: -999, y: -999, wobble: 0 });
  const spawnTimer = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const page = pageRef.current;

    const resize = () => {
      canvas.width = page.offsetWidth;
      canvas.height = page.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const rect = page.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    const onClick = (e) => {
      const rect = page.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 10; i++) bubblesRef.current.push(new Bubble(cx, cy));
    };

    page.addEventListener("mousemove", onMouseMove);
    page.addEventListener("mouseleave", onMouseLeave);
    page.addEventListener("click", onClick);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      spawnTimer.current++;
      if (mouse.x > 0 && spawnTimer.current % 5 === 0) {
        bubblesRef.current.push(new Bubble(mouse.x, mouse.y));
      }
      bubblesRef.current = bubblesRef.current.filter((b) => b.update());
      bubblesRef.current.forEach((b) => b.draw(ctx));

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
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, cr * 0.05, cx, cy, cr);
        g.addColorStop(0, "rgba(140,170,255,0.12)");
        g.addColorStop(0.7, "rgba(160,120,255,0.06)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(120,150,255,0.75)";
        ctx.lineWidth = 1.8;
        ctx.stroke();
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
      page.removeEventListener("mousemove", onMouseMove);
      page.removeEventListener("mouseleave", onMouseLeave);
      page.removeEventListener("click", onClick);
    };
  }, [pageRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
        borderRadius: "20px",
      }}
    />
  );
}

// Floating blobs for left panel
function LeftBlobs() {
  return (
    <>
      {/* Yellow blob */}
      <Box sx={{
        position: "absolute", width: 90, height: 90, borderRadius: "50%",
        background: "#f5d97a", bottom: 120, left: 30, opacity: 0.7,
        animation: "floatA 5s ease-in-out infinite",
      }} />
      {/* White blob */}
      <Box sx={{
        position: "absolute", width: 70, height: 70, borderRadius: "50%",
        background: "rgba(255,255,255,0.85)", bottom: 130, left: 100, opacity: 0.7,
        animation: "floatB 6s ease-in-out infinite",
      }} />
      {/* Purple pill */}
      <Box sx={{
        position: "absolute", width: 55, height: 80,
        background: "linear-gradient(180deg,#c07dff,#9b4fff)",
        borderRadius: "40px", bottom: 60, left: 140, opacity: 0.7,
        animation: "floatD 5.5s ease-in-out infinite",
      }} />
      {/* Store box */}
      <Box sx={{
        position: "absolute", bottom: 80, right: 20,
        width: 130, height: 110,
        background: "rgba(255,255,255,0.75)",
        borderRadius: "18px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "6px",
        animation: "floatC 7s ease-in-out infinite",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.9)",
      }}>
        <Box sx={{
          background: "#a35dff", color: "white",
          fontSize: 11, fontWeight: 600,
          padding: "3px 12px", borderRadius: "20px",
        }}>Store</Box>
        <Box sx={{
          width: 50, height: 40,
          display: "grid", gridTemplateColumns: "repeat(5,1fr)",
          gap: "1px", overflow: "hidden", borderRadius: "4px",
        }}>
          {[0,1,2,3,4].map(i => (
            <Box key={i} sx={{ height: 40, background: i % 2 === 0 ? "#ee6633" : "white" }} />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default function LoginPage() {
  const pageRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatC { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes floatD { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        * { cursor: none !important; }
      `}</style>

      {/* Page wrapper */}
      <Box
        ref={pageRef}
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#c8dff8 0%,#e8eeff 40%,#f0e8ff 70%,#ffe8f5 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem",
          position: "relative", overflow: "hidden",
        }}
      >
        <BubbleCanvas pageRef={pageRef} />

        {/* Card */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          maxWidth: 820, width: "100%",
          borderRadius: "24px", overflow: "hidden",
          position: "relative", zIndex: 1,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid rgba(255,255,255,0.95)",
          boxShadow: "0 20px 60px rgba(80,100,200,0.12), 0 4px 20px rgba(0,0,0,0.06)",
        }}>

          {/* Left panel */}
          <Box sx={{
            background: "linear-gradient(140deg,#d6e8ff 0%,#e4d8ff 50%,#f5d8f5 100%)",
            padding: "2.5rem 2rem",
            position: "relative", overflow: "hidden",
            minHeight: 380,
            display: { xs: "none", md: "block" },
          }}>
            <Typography sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: "2rem",
              color: "#1a1f5e", lineHeight: 1.2,
              position: "relative", zIndex: 2,
            }}>
              Register<br />your asset<br />name now!
            </Typography>
            <LeftBlobs />
          </Box>

          {/* Right panel */}
          <Box sx={{
            padding: "2.5rem 2rem",
            background: "white",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <Typography sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: "1.5rem",
              color: "#1a1f5e", mb: "4px",
            }}>
              Welcome back
            </Typography>
            <Typography sx={{ color: "#888", fontSize: "0.875rem", mb: "1.5rem" }}>
              Sign in to continue.
            </Typography>

            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#a0b0ff" },
                  "&.Mui-focused fieldset": { borderColor: "#6378ff" },
                },
                "& input::placeholder": { color: "#bbb", opacity: 1 },
              }}
            />

            <TextField
              fullWidth
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#a0b0ff" },
                  "&.Mui-focused fieldset": { borderColor: "#6378ff" },
                },
                "& input::placeholder": { color: "#bbb", opacity: 1 },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                mt: 1, py: 1.3,
                borderRadius: "12px",
                background: "linear-gradient(135deg,#4f6ff5,#6b4fff)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: "0.95rem",
                letterSpacing: "0.02em",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  background: "linear-gradient(135deg,#3d5ee8,#5a3fee)",
                  boxShadow: "0 8px 25px rgba(99,120,255,0.45)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Login
            </Button>

            <Divider sx={{ my: 2, color: "#ccc", fontSize: 12 }}>or</Divider>

            <Typography sx={{ textAlign: "center", fontSize: "0.8rem", color: "#999" }}>
              Don't have an account?{" "}
              <Link href="#" underline="hover" sx={{ color: "#6378ff", fontWeight: 600 }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}