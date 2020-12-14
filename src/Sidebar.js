import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVerIcon from "@material-ui/icons/MoreVert";
import SearchOutLined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [search, setSearch] = useState([]);
  const history = useHistory();

  const logout = () => {
    dispatch({
      type: actionTypes.REMOVE_USER,
      user: null,
    });
    history.push("/");
  };

  useEffect(() => {
    if (!search) {
      const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
        setRooms(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
      return () => {
        unsubscribe();
      };
    }
    db.collection("rooms")
      .orderBy("name")
      .startAt(`${search}`)
      .endAt(`${search}`)
      .onSnapshot((snapshot) =>
        setRooms(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, [search]);

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <IconButton>
            <SearchOutLined />
          </IconButton>
          <input
            className="sidebar__searchInput"
            value={search}
            placeholder="Search or start a new chat"
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.length === 0 ? (
          <p align="center" style={{ color: "red" }}>
            Room not available
          </p>
        ) : (
          rooms.map((room) => (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;
