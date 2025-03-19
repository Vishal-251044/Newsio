import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Swal from "sweetalert2";
import "../screens_CSS/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    description: "",
    domain: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Registered successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/profile"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">
            {isRegistering ? "Create Account" : "Login"}
          </h1>
          {isRegistering ? (
            <form className="registration-form" onSubmit={handleRegister}>
              <input
                className="form-input"
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="span_name">Description:</span>
              <textarea
                className="form-input"
                name="description"
                placeholder="(max 25 words)"
                maxLength="25"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <span className="span_name">Select Domain:</span>
              <select
                name="domain"
                className="domain-select"
                value={formData.domain}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your domain
                </option>
                {["sports", "politics", "movies"].map(
                  (domain) => (
                    <option key={domain} value={domain}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </option>
                  )
                )}
              </select>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Set Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? "Loading..." : isRegistering ? "Create Account" : "Login"}
              </button>

              <p className="toggle-link" onClick={toggleForm}>
                Already have an account? Login here.
              </p>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleLogin}>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? "Loading..." : isRegistering ? "Create Account" : "Login"}
              </button>

              <p className="toggle-link" onClick={toggleForm}>
                Create new account
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
