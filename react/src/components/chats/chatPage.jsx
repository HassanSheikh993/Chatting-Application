import "../../style/chatPage.css"
import React, { useState, useEffect, useRef, use } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

 const socket= io("http://localhost:8000");
export const ChatPage = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  
  

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("Connected to socket")
      socket.emit("setUp",userInfo)
      console.log("CHAT Object: ",chat)
      socket.emit("joinChat", chat);
    })


  })

  useEffect(()=>{
    socket.on("receiveMessage",(data)=>{
      console.log("TESTING ",data)
    })
  })

  // Get the other user's details
  const otherUser = chat.users.find(user => user._id !== userInfo._id);

  // Fetch messages for this chat
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8000/api/msg/${chat._id}`, {
        withCredentials: true,
      });
      setMessages(data);
      console.log("MESSAGES: ",messages)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  // Fetch messages when chat changes
  useEffect(() => {
    if (chat?._id) {
      fetchMessages();
    }
  }, [chat?._id]); // Add chat._id as dependency

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post('http://localhost:8000/api/msg/', {
        content: newMessage,
        chatId: chat._id
      }, {
        withCredentials: true,
      });
    
      socket.emit("newMessage",newMessage)

      // Optimistically update the UI
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      

      // Refresh messages to ensure sync with server
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading messages...</div>;
  }

  if (!otherUser) {
    return <div className="chat-loading">Loading user information...</div>;
  }

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <img 
            src={otherUser.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
            alt={otherUser.name} 
            className="chat-user-avatar" 
          />
          <div>
            <h3>{otherUser.name}</h3>
            <p className="chat-status">Online</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="messages-area">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`message ${message.sender._id === userInfo._id ? 'sent' : 'received'}`}
          >
            {message.sender._id !== userInfo._id && (
              <img 
                src={message.sender.pic || otherUser.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                alt={message.sender.name}
                className="message-sender-avatar"
              />
            )}
            <div className="message-content-wrapper">
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};