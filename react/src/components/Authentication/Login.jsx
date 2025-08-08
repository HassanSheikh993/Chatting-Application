import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../style/login.css"

export function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleOnChange(e) {
    setUserData({...userData, [e.target.name]: e.target.value});
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login", 
        userData, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleShow(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  function handleGoToRegister(){
    navigate("/signUp")
  }

  return (
    <div className="login-container">
      <h1>Log-in</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={userData.password}
              onChange={handleOnChange}
              required
            />
            <button 
              onClick={handleShow}
              className="show-password-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
      <p className="login_create_account" onClick={handleGoToRegister}>Create a new account?</p>
    </div>
  );
}