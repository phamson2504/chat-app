
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userNameCheck = await userModel.findOne({ username });
        if (userNameCheck)
            return res.json({ msg: "Username already used", status: false });
        const emailCheck = await userModel.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
}
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });
        if (!user)
            return res.json({ msg: "Incorrect Username or Password", status: false });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect Username or Password", status: false });
        const tokenJWT = jwt.sign({ userId: user._id, username: user.username },
            process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ status: true, accessToken: tokenJWT });
    } catch (error) {
        next(error)
    }
};

module.exports.logout = (req, res) => {
    res.cookie('token', '').json('ok');
};

module.exports.getUserId = async (req, res) => {
    const user = await userModel.findById(req.userId);
    delete user.password;
    return res.json({ status: true, user: user, auth: true });
}
module.exports.getUserByEmail = async (req, res) => {
    const user = await userModel.findOne({ email: req.params.addressEmail });
    if (!user) {
        return res.json({ msg: "No user found with email address is: " + req.params.addressEmail, status: false, auth: true });
    }
    if (user._id.toString() === req.userId) {
        return res.json({ msg: "Can't find myself", status: false, auth: true });
    }
    const checkUser = await userModel.findById(req.userId);
    let userReponse = null;
    if (checkUser.friendRequests.includes(user._id.toString()) || checkUser.friends.includes(user._id.toString())) {
        userReponse = { _id: checkUser._id, username: checkUser.username, avatarImage: checkUser.avatarImage, isDisabled: true }
        return res.json({ user: userReponse, status: true, auth: true });
    }
    userReponse = { _id: user._id, username: user.username, avatarImage: user.avatarImage, isDisabled: false }
    delete user.password;
    return res.json({ user: userReponse, status: true, auth: true });
}

module.exports.addFriendRequest = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user.friendRequests.includes(req.body.userId)) {
            await user.updateOne({ $push: { friendRequests: req.body.userId } });
            res.json({ msg: "your request has been sent", status: true, auth: true });
        } else {
            res.json({ msg: "You requested to be friends", status: false, auth: true });
        }
    } catch (error) {
        next();
    }
}

module.exports.getAllFriend = async (req, res, next) => {

    try {
        const user = await userModel.findById(req.params.id);

        const friends = await Promise.all(
            user.friends.map((friendId) => {
                return userModel.findById(friendId);
            })
        );

        let friendList = [];
        friends.map((friend) => {
            const { _id, username, avatarImage } = friend;
            friendList.push({ _id, username, avatarImage });
        });
        res.json({ friendList: friendList, status: true });
    } catch (error) {
        next();
    }
}

module.exports.getAllRequestAdd = async (req, res, next) => {
    try {
        const users = await userModel.find({ friendRequests: { $elemMatch: { $eq: `${req.userId}` } } });
        let friendList = [];
        users.map((friend) => {
            const { _id, username, avatarImage } = friend;
            friendList.push({ _id, username, avatarImage });
        });
        res.json({ friendList: friendList, status: true, auth: true });
    } catch (error) {
        next();
    }
}

module.exports.addFriendReponse = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);
        const friend = await userModel.findById(req.body.friendId);
        await friend.updateOne({ $pull: { friendRequests: user._id } });
        //Update each other's friend list
        await friend.updateOne({ $push: { friends: user._id } });
        await user.updateOne({ $push: { friends: friend._id } });
        res.json({ msg: "Accept succession", status: true, auth: true });
    } catch (error) {
        next()
    }
}