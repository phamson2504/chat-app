import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import "./Message.css"
import ChatInput from "../ChatInput/ChatInput.jsx";
import { getMessageRoute, sendMessageRoute } from '../../Untils/APIRoutes.js';
import axios from 'axios';
const { DateTime } = require('luxon');

function Message({ socket, user, currentChat }) {
    const scrollRef = useRef();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        async function response() {
            const { data } = await axios.post(getMessageRoute, {
                from: user._id,
                to: currentChat._id,
            });
            setMessages(data);
        }
        response();
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMsg = async (msg) => {
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: user._id,
            msg,
        });

        await axios.post(sendMessageRoute, {
            from: user._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg, time: DateTime.local().toFormat('yyyy-MM-dd HH:mm') });
        setMessages(msgs);
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg, idCurrenChat) => {
                setArrivalMessage({ fromSelf: false, message: msg, idCurrenChat, time: DateTime.local().toFormat('yyyy-MM-dd HH:mm') });
            });
        }
    }, []);

    useEffect(() => {
        if (arrivalMessage)
            arrivalMessage.idCurrenChat === currentChat._id && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);
    return (
        <>
            <div className='messContainer'>
                <div className='messHeader'>
                    <div className='messUserDetails'>
                        <div className='messAvatar'>
                            <img src={currentChat.avatarImage} alt='' />
                        </div>
                        <div className='messUserName'>
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                </div>
                <div className='messChatBox'>
                    {messages.map((message) => {
                        return (
                            <div ref={scrollRef} key={uuidv4()}>
                                <div className={`message ${message.fromSelf ? "messRecieved" : "messSended"}`} >
                                    <div className='messContent'>
                                        <p>{message.message}</p>
                                        <span>{message.time}</span>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                <ChatInput handleSendMsg={handleSendMsg} />
            </div>
        </>
    )
}

export default Message