export const host = "http://localhost:4000"

//for user
export const registerRoute = `${host}/api/auth/register`
export const loginRoute = `${host}/api/auth/login`
export const verifyTockenRoute = `${host}/api/auth/verify_tocken`
export const getUserByEmail = `${host}/api/auth/getUserByEmail`
export const addFriendRequest = `${host}/api/auth/addFriendRequest`
export const getAllFriend = `${host}/api/auth/getAllFriend`
export const getRequestFriends = `${host}/api/auth/getRequestFriends`
export const addFriendReponse = `${host}/api/auth/addFriendReponse`

// for mess
export const getMessageRoute = `${host}/api/messages/getMess`;
export const sendMessageRoute = `${host}/api/messages/addMess`;