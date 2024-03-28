import React, { useState } from 'react'
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import "./ChatInput.css"

function ChatInput({ handleSendMsg }) {
    const [mess, setMess] = useState("");

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    const handleEmoji = (emojiObject) => {
        let message = mess;
        message += emojiObject.emoji;
        setMess(message);
    };
    const sendMess = (event) => {
        event.preventDefault();
        if (mess.length > 0) {
            handleSendMsg(mess);
            setMess("");
        }
    }
    return (
        <div className='chatInputContainer'>
            <div className="inputButtonContainer" >
                <div className="inputEmoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                    {showEmojiPicker && <Picker className='inputPicker' onEmojiClick={handleEmoji} />}
                </div>
            </div >
            <form className="inputContainer" onSubmit={(event) => sendMess(event)}>
                <input
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMess(e.target.value)}
                    value={mess}
                />
                <button type="submit">
                    <IoMdSend />
                </button>
            </form>

        </div>

    )
}

export default ChatInput