import React, { useState, useRef, useEffect } from 'react';
import '../style/SideDrawer.css';
import { MyProfile } from './myProfile';
import axios from 'axios';
import { ChatPage } from '../components/chats/chatPage';
import { ChattingPage } from '../components/testing/chatingPage';


export function SideDrawer() {
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const buttonRef = useRef();
  const [showProfile, setShowProfile] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [chats, setChats] = useState([]);
const [loadingChats, setLoadingChats] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/chat', {
        withCredentials: true,
      });
      setChats(data);
      setLoadingChats(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoadingChats(false);
    }
  };

  fetchChats();
}, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          !buttonRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
        setSearchResult([]);
        setSearchUser("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  function handleShowProfile() {
    setShowProfile(!showProfile);
  }

  function handleSearchUser(e) {
    setSearchUser(e.target.value);
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    const result = await axios.get(`http://localhost:8000/api/user/allUsers?search=${searchUser}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setSearchResult(result.data);
  }

  async function handleAccessChat(userId) {
    const result = await axios.post("http://localhost:8000/api/chat/", {userId}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setCurrentChat(result.data);
    setIsSidebarOpen(false); // Close the sidebar when chat opens
    setSearchResult([]);
    setSearchUser("");
  }

  return (
    <div className="app-container">
      {/* Left sidebar */}
      <div className="left-sidebar">
        <div className="search-container">
          <div>
            <button 
              ref={buttonRef}
              className="search-toggle" 
              onClick={toggleSidebar}
            >
              Search
            </button>
          </div>

          <div className="app_name">
            <h1>Friends.com</h1>
          </div>

          <div className="sideDrawer_profile">
            <div className="sideDrawer_profile_image">
              <img 
                onClick={handleShowProfile} 
                src= {userInfo.pic}
                alt="profile" 
              />
            </div>
          </div>

          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
            <div className="search-bar-container">
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
                value={searchUser}
                name='searchUser'
                onChange={handleSearchUser}
              />
              <button className="go-button" onClick={handleSearchSubmit}>Go</button>
            </div>
          
            {searchResult && searchResult.map((data, index) => (
              <div
                className="searchResult_container"
                key={index}
                onClick={() => handleAccessChat(data._id)}
              >
                <img src={data.pic} alt="no image" />
                <div className="user-info">
                  <p className="user-name">{data.name}</p>
                  <p className="user-email">{data.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

<div className="all-chats">
  {loadingChats ? (
    <div className="loading-chats">Loading chats...</div>
  ) : chats.length === 0 ? (
    <div className="no-chats">No chats available</div>
  ) : (
    chats.map(chat => {
      // Get the other user (not the current user)
      const otherUser = chat.users.find(u => u._id !== userInfo._id);
      const displayUser = chat.isGroupChat ? null : otherUser;
      
      return (
        <div 
          key={chat._id} 
          className={`chat-item ${currentChat?._id === chat._id ? 'active' : ''}`}
          onClick={() => setCurrentChat(chat)}
        >
          <img 
            src={
              chat.isGroupChat 
                // ? "https://icon-library.com/images/group-icon-png/group-icon-png-28.jpg" 
                ? "https://cdn-icons-png.flaticon.com/512/718/718339.png"
                : displayUser?.pic || 
                  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            } 
            alt="chat" 
            className="chat-avatar"
          />
          <div className="chat-info">
            <div className="chat-header">
              <span className="chat-name">
                {chat.isGroupChat 
                  ? chat.chatName 
                  : displayUser?.name || "Unknown User"}
              </span>
              <span className="chat-time">
                {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="chat-preview">
              {chat.latestMessage ? (
                <>
                  <span className="sender-name">
                    {chat.latestMessage.sender._id === userInfo._id 
                      ? "You" 
                      : chat.latestMessage.sender.name.split(' ')[0]}
                    : 
                  </span>
                  {chat.latestMessage.content.length > 30
                    ? `${chat.latestMessage.content.substring(0, 30)}...`
                    : chat.latestMessage.content}
                </>
              ) : (
                <span className="no-message">No messages yet</span>
              )}
            </div>
          </div>
        </div>
      )
    })
  )}
</div>

      </div>

      {/* Right chat area */}
      <div className="right-chat-area">
        {console.log("Currect chat: ",currentChat)}
        {currentChat ? (
          // <ChatPage chat={currentChat} />
           <ChattingPage chat={currentChat} />
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <img 
                src="../../public/images/two.png" 
                alt="WhatsApp background" 
              />
              <h2>Welcome to Friends.com</h2>
              <p>Start a conversation just click on a contact to begin chatting.</p>
            </div>
          </div>
        )}
      </div>

      {showProfile && <MyProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
}