const { register, login, getUserId,
    getUserByEmail, addFriendRequest, getAllFriend, getAllRequestAdd, addFriendReponse, setAvatar } = require("../controllers/userController")
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

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/Images")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({ storage });

router.post("/setAvatar", authJwt ,upload.single('file'), (req, res) => {
    
    return res.json({msg: "Update avatar success", status: true, auth: true })
})

module.exports = router;