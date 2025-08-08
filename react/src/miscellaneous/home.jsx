import { SideDrawer } from "./sideDrawer"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export function HomePage(){
    const navigate = useNavigate();
useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) {
    navigate('/login');
  }
}, [navigate]);
    return(
        <>
        <SideDrawer/>
        </>
    )
}