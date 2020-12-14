import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVer from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import "./Chat.css";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import DeleteIcon from "@material-ui/icons/Delete";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const deleteMessage = (id) => {
    db.collection("rooms").doc(roomId).collection("messages").doc(id).delete();
  };

  useEffect(() => {
    let unsubscribe = null;
    if (roomId) {
      unsubscribe = db
        .collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data()?.name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 500));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    const unsubscribe = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        email: user.email,
      });
    setInput("");
    return () => {
      unsubscribe();
    };
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen at ....
            {messages.length === 0
              ? null
              : new Date(
                  messages[messages.length - 1]?.data.timestamp?.toDate()
                ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVer />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map(({ data, id }, index) => (
          <p
            key={index}
            className={`chat__bodyMessage ${
              data.email === user.email && "chat--bodyReciverMessage"
            }`}
          >
            <span className="chat__bodyName">
              {data.name} {}
              {data.email === user.email && "You"}
            </span>
            {data.message}
            <span className="chat__bodyTime">
              {new Date(data.timestamp?.toDate()).toUTCString()}
            </span>
            {data.email === user.email && (
              <>
                <IconButton
                  onClick={() => {
                    if (window.confirm("Are you sure???")) deleteMessage(id);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </>
            )}
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>

        <form>
          <input
            value={input}
            className="chat__footerInput"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type the message...."
            type="text"
          />
          <button disabled={!input} onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
