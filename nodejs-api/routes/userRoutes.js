const { register, login, getUserId,
    getUserByEmail, addFriendRequest, getAllFriend, getAllRequestAdd, addFriendReponse } = require("../controllers/userController")
const { authJwt } = require("../middleware/authJwt")


const router = require("express").Router()

router.post("/register", register)
router.post("/login", login)
router.get("/verify_tocken", authJwt, getUserId)
router.get("/getUserByEmail/:addressEmail", authJwt, getUserByEmail)
router.put("/addFriendRequest/:id", authJwt, addFriendRequest)
router.get("/getAllFriend/:id", getAllFriend)
router.get("/getRequestFriends", authJwt, getAllRequestAdd)
router.put("/addFriendReponse", authJwt, addFriendReponse)


module.exports = router;