import {BrowserRouter,Routes, Route} from "react-router-dom"

import { HomePage } from "./miscellaneous/home.jsx"
import { Signup } from "./components/Authentication/Signup.jsx"
import { Login } from "./components/Authentication/Login.jsx"
import "./App.css"

import { SideDrawer } from "./miscellaneous/sideDrawer.jsx"
import { MyProfile } from "./miscellaneous/myProfile.jsx"
import { ChatPage } from "./components/chats/chatPage.jsx"
function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/signUp" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/sideDrawer" element={<SideDrawer/>} />
      <Route path="/profile" element={<MyProfile/>} />
      <Route path="/chatPage" element={<ChatPage/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
