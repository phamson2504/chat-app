import React, { useEffect, useRef, useState } from "react";
import "./Chat.css"
import Contacts from "../../Components/Contacts/Contacts";
import Message from "../../Components/Message/Message";
import io from 'socket.io-client';
import axios from 'axios';
import { verifyTockenRoute, host } from "../../Untils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import authHeader from "../../Service/auth-header";

export default function Chat() {
  const socket = useRef();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(null);

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    async function initData() {
      const { data } = await axios.get(verifyTockenRoute, { headers: authHeader() });
      if (data.auth === false) {
        toast.error(data.msg, toastOptions)
        navigate("/login")
      } else {
        if (data.status === false)
          toast.error(data.msg, toastOptions)
        else
          setCurrentUser(data.user);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const chageChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <div className="chatBody">
        <div className="chatContainer">
          {socket.current && currentUser && <Contacts socket={socket} user={currentUser} changeChat={chageChat} />}
          {socket.current && currentUser && currentChat && <Message socket={socket} user={currentUser} currentChat={currentChat} />}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}