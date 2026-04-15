import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

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

      const token = res?.data?.token;
      const user = res?.data?.user;

      // ✅ store token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login Successful ✅");

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleLogin} className="card p-4 w-25">
        <h3 className="text-center mb-3">Login</h3>

        <input
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;