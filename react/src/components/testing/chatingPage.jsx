import { useEffect, useState } from "react";
import { socket } from "./socket";
import axios from "axios";
import {CreateGroup} from "./groupCreate"
import "../../style/chattingPage.css";

export function ChattingPage({ chat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [addNewUserInGroup, SetAddNewUserInGroup] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ✅ Handle group vs one-to-one user display
  const isGroup = chat?.isGroupChat;
  const displayUser = isGroup
    ? {
      name: chat.chatName,
      // pic: "https://icon-library.com/images/group-icon-png/group-icon-png-28.jpg",
      pic: "https://cdn-icons-png.flaticon.com/512/718/718339.png"
    }
    : chat?.users?.find((u) => u._id !== userInfo._id);

  useEffect(() => {
    socket.on("connected", () => {
      console.log("Connected to socket server");
    });

    if (chat?._id) {
      socket.emit("join room", chat);
    }

    fetchMessages();

    socket.on("message received", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message received");
    };
  }, [chat?._id]);

  async function fetchMessages() {
    const { data } = await axios.get(`http://localhost:8000/api/msg/${chat._id}`);
    console.log("FETCHING DATA BROOO ", data);
    setMessages(data);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/msg/`,
        {
          content: newMessage,
          chatId: chat._id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message Send ", data);

      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  }



  function handleAddNewUserInGroup() {
    SetAddNewUserInGroup(!addNewUserInGroup);

  }

  return (
    <>
      <div className="chatting_container">
        {/* ✅ Updated: Works for group and one-to-one chat */}
        <div className="chatting_user_profile">
         <div className="chatting_user_profile_name_part"> 
          <img src={displayUser?.pic} alt={`${displayUser?.name} pic`} />
          <h2 className="chatting_user_name">{displayUser?.name}</h2>
           </div>

          {
            chat.isGroupChat === true && (
              <div className="add_user_to_group"  onClick={handleAddNewUserInGroup}>
                <i class="fa-solid fa-plus fa-xl"></i>
                <p>Add user</p>
              </div>
            )
          }
          {
           addNewUserInGroup && <CreateGroup/>
          }


        </div>

        <ul className="chat-list">
          {messages.map((data, index) => (
            <li
              key={index}
              className={
                data.sender._id === userInfo._id
                  ? "message sender"
                  : "message receiver"
              }
            >
              <img src={data.sender.pic} alt="" height={50} width={50} />
              {data.content}
              <span className="message-time">
                {new Date(data.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>

        <form className="chatting_form" onSubmit={sendMessage}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="white"
            >
              <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
