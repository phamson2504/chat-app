import React from 'react'
import './AddFriend.css';
import Close from '../../Assets/close.svg'

function addFriend({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="addFriendOverlay">
            <div className="addFriendModal">
                <div className='addFriendHeader'>
                    <div className="addFriendClosebutton" onClick={onClose}><img src={Close} alt="logo" /></div>
                    <h2>Add Friend</h2>
                </div>
                <div className='addFriendContent'>
                    {children}
                </div>
                <div className='addFriendBottom'>
                    <button onClick={onClose} className='addFriendCancel'>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default addFriend