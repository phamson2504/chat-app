const { addMessage, getMessages } = require("../controllers/chatController");
const router = require("express").Router();

router.post("/addMess/", addMessage);
router.post("/getMess/", getMessages);

module.exports = router;