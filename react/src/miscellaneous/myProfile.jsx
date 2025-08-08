import React, { useState } from "react";
import '../style/myProfile.css';
import { useNavigate } from "react-router-dom";
import { CreateGroup } from "../components/testing/groupCreate";

export function MyProfile({ onClose }) {
  const navigate = useNavigate();
  // Get user data from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [showPopup, setShowPopup] = useState(false);
  
  // 
const [groupState, setGroupState] = useState(false)
  //

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    if (onClose) onClose(); // Call the onClose prop if provided
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Clear user data
    navigate("/login");
    
  };
  
  const handleGroupState = () =>{
    setGroupState(!groupState)
  }

  return (
    <>
      <div className="myProfile_container">
        <div
          className="myProfile_container_inner_div"
          onClick={handleOpenPopup}
        >
          <p>My Profile</p>
        </div>
        <div 
          className="myProfile_container_inner_div"
          onClick={handleLogout}
        >
          <p>Logout</p>
        </div>

        {groupState && <CreateGroup/>}

     {/* ------ */}
   <div 
          className="myProfile_container_inner_div"
          onClick={handleGroupState}
        >
          <p>Create Group</p>
        </div>

      {/* ------- */}

      </div>


      {showPopup && userInfo && (
        <div className="popup_overlay">
          <div className="popup">
            <button className="close_button" onClick={handleClosePopup}>
              ❌
            </button>
            <img
              src={userInfo.pic || "https://via.placeholder.com/100"}
              alt="User"
              className="popup_image"
            />
            <h2 className="popup_name">{userInfo.name}</h2>
            <p className="popup_email">{userInfo.email}</p>
          </div>
        </div>
      )}
    </>
  );
}