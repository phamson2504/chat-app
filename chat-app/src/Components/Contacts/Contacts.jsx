import React, { useState, useEffect } from 'react'
import "./Contacts.css"
import { IoIosPersonAdd } from "react-icons/io";
import AddFriend from "../AddFriend/AddFriend";
import { MdOutlineMailOutline } from "react-icons/md";
import axios from 'axios';
import authHeader from "../../Service/auth-header";
import { useNavigate } from "react-router-dom";
import { addFriendRequest, getRequestFriends, getUserByEmail, getAllFriend, addFriendReponse } from '../../Untils/APIRoutes';
import ImgAvatar from '../ImgAvatar/ImgAvatar';

function Contacts({ socket, user, changeChat }) {

    const navigate = useNavigate();
    
    const [modalAvatar, setModalAvatar] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
  
    const [friendSearch, setfriendSearch] = useState();
    const [addresEmail, setAdressEmail] = useState();
    const [requestAF, setRequestAF] = useState([]);
    const [newRequestAF, setnewRequestAF] = useState(null);
    const [acceptRequest, setAcceptRequest] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    const openAvatar = () => {
        setModalAvatar(true);
    };

    const closeAvatar = () => {
        setModalAvatar(false);
    };

    const handleChange = (event) => {
        setAdressEmail(event.target.value);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("friend-request", (data) => {
                setnewRequestAF(data)
            });
            socket.current.on("accept-a-f-request", (data) => {
                setAcceptRequest(data)
            });
        }
    }, []);

    function errorForAuth () {
        navigate("/login")
    }

    const findFirend = async (event) => {
        event.preventDefault();

        const { data } = await axios.get(getUserByEmail + `/${addresEmail}`, { headers: authHeader() });
        if (data.auth === false) {
            navigate("/login")
        } else {
            if (data.status === false) {
                alert(data.msg)
            }
            else {
                setfriendSearch(data.user)
            }

        }
    }
    useEffect(() => {
        async function initData() {
            const { data } = await axios.get(getRequestFriends, { headers: authHeader() });
            if (data.auth === false) {
                navigate("/login")
            } else {
                if (data.status === false)
                    alert(data.msg)
                else {
                    setRequestAF(data.friendList)
                }
            }
            const allFriends = await axios.get(getAllFriend + `/${user._id}`);
            setContacts(allFriends.data.friendList)
        }
        initData();
    }, [])

    useEffect(() => {
        if (acceptRequest)
            setContacts((prev) => [...prev, { _id: acceptRequest._id, username: acceptRequest.username, avatarImage: acceptRequest.avatarImage }])
    }, [acceptRequest]);

    useEffect(() => {
        if (newRequestAF)
            setRequestAF((prev) => [...prev, { _id: newRequestAF._id, username: newRequestAF.username, avatarImage: newRequestAF.avatarImage }])
    }, [newRequestAF]);

    const addFriend = async (event) => {
        event.preventDefault();

        setfriendSearch(friendSearch.isDisabled === true);
        const { data } = await axios.put(addFriendRequest + `/${user._id}`,
            { userId: friendSearch._id }, { headers: authHeader() });
        if (data.auth === false) {
            navigate("/login")
        } else {
            if (data.status === false) {
                alert(data.msg);
            } else {
                alert(data.msg)
                socket.current.emit("send-add-friend", {
                    to: friendSearch._id,
                    from: user._id,
                    user,
                });
            }
        }
    }
    const acceptFriend = async (event, request) => {
        event.preventDefault();
        const { data } = await axios.put(addFriendReponse,
            { friendId: request._id }, { headers: authHeader() });
        if (data.auth === false) {
            navigate("/login")
        } else {
            alert(data.msg);

            setAcceptRequest(request);

            socket.current.emit("send-accept-a-f", {
                to: request._id,
                from: user._id,
                user,
            });
            setRequestAF(requestAF.filter(value => value._id !== request._id));
        }
    }

    const changeCurrentChat = (contact) => {
        setCurrentSelected(contact);
        changeChat(contact);
    };

    return (
        <div className='menuContainer'>
            <div className='menuBrand'>
                <div className='menuContainerSearch'>
                    <input type="text" className="form-control" placeholder="Search..." />
                </div>
                <IoIosPersonAdd className='menuAddFriend' onClick={openModal} />
                <AddFriend isOpen={modalOpen} onClose={closeModal}>
                    <div className='addFriendSearch'>
                        <MdOutlineMailOutline className='addFriendIconSearch' />
                        <input placeholder='Enter email address' type='email' name="email" onChange={(e) => handleChange(e)} />
                        <button onClick={(event) => findFirend(event)}>Search</button>
                    </div>
                    <div className='addfriendSearched'>
                        {friendSearch &&
                            (<>
                                <div className='addfriendSearchedHeader'>
                                    <h4>Result search</h4>
                                </div>
                                <div className='addfriendSearchedContent'>
                                    <img src={friendSearch.avatarImage} alt='' />
                                    <p>{friendSearch.username} </p>
                                    <button disabled={friendSearch.isDisabled} onClick={(event) => addFriend(event)}>Add</button>
                                </div>

                            </>)}
                        {requestAF.length !== 0 &&
                            (<>
                                <div className='addfriendSearchedHeader'>
                                    <h4>You have request add friend</h4>
                                </div>
                            </>)
                        }
                        {requestAF.map((request) => {
                            return (
                                <>
                                    <div className='addfriendSearchedContent'>
                                        <img src={request.avatarImage} alt='' />
                                        <p>{request.username} </p>
                                        <button onClick={(event) => acceptFriend(event, request)}>Accept</button>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </AddFriend>
            </div>

            <div className='menuContacts'>
                {contacts.length !== 0 && (<>
                    {contacts.map((contact) => {
                        return (
                            <>
                                <div className={`menuContact ${contact === currentSelected ? "selected" : ""}`}
                                    key={contact._id}
                                    onClick={() => changeCurrentChat(contact)}>
                                    <div className='menuAvatar'>
                                        <img src={contact.avatarImage} alt='' />
                                        {/* <div className="chatOnlineBadge"></div> */}
                                    </div>
                                    <div className='menuUsername'>
                                        <h4>{contact.username}</h4>
                                    </div>
                                </div>
                            </>
                        )

                    })}
                </>)}

            </div>
            <div className='menuCurrentUser'>
                <div className='menuAvatar'>
                    <img src={user.avatarImage} alt=''/>
                    
                </div>
                <div className='menuUserName' onClick={openAvatar}>
                    <h3>{user.username}</h3>
                </div>
                <ImgAvatar isOpen={modalAvatar} onClose={closeAvatar} errorForAuth={errorForAuth}/>
            </div>
        </div>
    )
}

export default Contacts