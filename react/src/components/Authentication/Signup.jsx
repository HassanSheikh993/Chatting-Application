import { useState } from "react";
import axios from "axios";
import "../../style/signup.css";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  function handleOnChange(e) {
    setUserData({...userData, [e.target.name]: e.target.value});
  }

  function postDetails(pics) {
    // if (pics && (pics.type === "image/jpeg" || pics.type === "image/png")) {
    //   setFile(pics);
    // }


     if (pics && (pics.type === "image/jpeg" || pics.type === "image/png")) {
    const reader = new FileReader();
    reader.readAsDataURL(pics);
    reader.onloadend = () => {
      setFile(reader.result); // base64 string
    };
  }
  }

  // async function handleOnSubmit(e) {
  //   e.preventDefault();
  //   setError("");
  //   setSuccessMessage("");
    
  //   try {
  //     const formData = new FormData();
  //     formData.append("name", userData.name);
  //     formData.append("email", userData.email);
  //     formData.append("password", userData.password);
  //     formData.append("confirmPassword", userData.confirmPassword);
  //     // formData.append("file", file); 
  //     formData.append("pic", file);

  //     const result = await axios.post("http://localhost:8000/api/user/", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data"
  //       }
  //     });

  //     if (result.status === 201) {
  //       setSuccessMessage("Account created successfully! Redirecting to login...");
  //       setTimeout(() => {
  //         navigate("/login");
  //       }, 2000);
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Registration failed. Please try again.");
  //     console.error("Signup error:", err);
  //   }
  // }

async function handleOnSubmit(e) {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  try {
    const result = await axios.post("http://localhost:8000/api/user/", {
      ...userData,
      pic: file,
    });

    if (result.status === 201) {
      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed. Please try again.");
    console.error("Signup error:", err);
  }
}




  function handleShow(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  function handleGoToLogin() {
    navigate("/login");
  }

  return (
    <div className="signup-container">
      <h1>Sign-up</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form className="signup-form" onSubmit={handleOnSubmit}>
        {/* Form fields remain the same as your existing code */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            name="name" 
            id="name"
            value={userData.name} 
            onChange={handleOnChange} 
            required
          />
        </div>

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

        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            id="password"
            value={userData.password} 
            onChange={handleOnChange} 
            required
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={handleShow}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="form-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            name="confirmPassword" 
            id="confirmPassword"
            value={userData.confirmPassword} 
            onChange={handleOnChange} 
            required
          />
        </div>

        <div className="form-group file-input-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input 
            type="file" 
            id="profilePic"
            accept="image/*" 
            className="file-input"
            onChange={(e) => postDetails(e.target.files[0])} 
          />
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>
      <p className="register_login_account" onClick={handleGoToLogin}>
        Already have an account?
      </p>
    </div>
  );
}