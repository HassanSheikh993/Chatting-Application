import { useState } from "react";
import axios from "axios";
import "../../style/groupCreate.css"

export function CreateGroup() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(true); // 👈 controls visibility

  const [groupUsers ,setGroupUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  async function handleSearchSubmit(e) {
    e.preventDefault();
    try {
      const result = await axios.get(
        `http://localhost:8000/api/user/allUsers?search=${searchUser}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSearchResult(result.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

function handleGroupUsers(userData) {
  const alreadyExist = groupUsers.find((data) => data._id === userData._id);
  if(alreadyExist) return
  setGroupUsers((prev) => [...prev, userData]);
  console.log(groupUsers);
}

async function handleCreateGroup(){
  const users = groupUsers.map((data)=> data._id)
  const result = await axios.post("http://localhost:8000/api/chat/group",{users,groupName},
      {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
  )

  console.log(result)

}

  return (
    <>
      {isPopupVisible && ( 
        <div className="popup_overlay">
          <div className="popup">
            <button
              className="close_button"
              onClick={() => setIsPopupVisible(false)} // 👈 hides popup
              onCanPlay={()=>setGroupUsers([])}
            >
              ❌
            </button>

             <div className="group_name_text_field">
              <input type="text" name="groupName" 
              value={groupName} onChange={(e)=> setGroupName(e.target.value)}
              placeholder="Group Name?"/>
            </div>

            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchUser}
                name="searchUser"
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <button className="go-button" onClick={handleSearchSubmit}>
                Go
              </button>
            </div>

           

            <div className="results">
              {searchResult.map((data,index) => (
                   <div className="searchResult_container" key={index} onClick={()=>handleGroupUsers(data)}>
                <img src={data.pic} alt="no image" />
                <div className="user-info">
                  <p className="user-name">{data.name}</p>
                  <p className="user-email">{data.email}</p>
                </div>
              </div>
              ))}
            </div>
       <div>
  {
    groupUsers && (
      <>
        {
          groupUsers.map((data, index) => (
            <p key={index}>{data.name}</p>
          ))
        }
      </>
    )
  }
</div>

{
  groupUsers.length > 1 && <div className="groupPage_send_button_div">
     <button className="groupPage_send_button" onClick={handleCreateGroup}>Create Group</button>
</div>
}

          </div>
        </div>
      )}

 

    </>

    
  );
}
