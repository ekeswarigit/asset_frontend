import { useNavigate } from "react-router-dom";
import "../styles/style.css"

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // after success
    navigate("/dashboard");
  };

  return(
    <div class="container">
  <div class="card">
    <h2>Login</h2>

    <input type="email" id="email" placeholder="Enter email" />
    <input type="password" id="password" placeholder="Enter password" />

    <button onclick={handleLogin}>Login</button>
  </div>
</div>
  )
}

export default Login;