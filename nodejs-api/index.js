const connectToMongo = require("./connectDB");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
var cookieParser = require('cookie-parser');
const cors = require("cors");
const socket = require("socket.io");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectToMongo();

app.use("/api/auth", userRoutes);
app.use("/api/messages", chatRoutes);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Start on Port ${process.env.PORT}`)
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {

    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-add-friend", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("friend-request", data.user);
        }
    });

    socket.on("send-accept-a-f", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("accept-a-f-request", data.user);
        }
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg, data.from);
        }
    });
});