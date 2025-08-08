import { Chat } from "../modles/chatsModel.js";
import { User } from "../modles/userModel.js"
export const accessChat = async (req, res) => {
    const { userId } = req.body;
    console.log(userId)

    if (!userId) {
        console.log("user id not send");
        return res.status(400).send("user id not send");
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")//except password return all data
        .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    /*
    “Hey Mongoose, inside this isChat, there's a latestMessage, and inside that, there's a sender — 
    that sender is a User. So go to the User collection, and give me selected data from there.”
    */


    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData);
            const fullChats = await Chat.find({ _id: createdChat._id }).populate("users", "-password");
            console.log("CHAT: ",fullChats[0])
            res.status(200).send(fullChats[0]);
        } catch (err) {
            console.log("Error in access chat in sending response ", err);
            res.status(500)
        }
    }
}

export const fetchChats = async (req, res) => {
    try {
        let allChats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        allChats = await User.populate(allChats, {
            path: "latestMessage.sender",
            select: "name pic email"
        })
        console.log(allChats)
        res.status(200).json(allChats)
    } catch (err) {
        console.log("Error in allChats function ", err);
        res.status(500)
    }
}

export const createGroupChat = async (req, res) => {
    if (!req.body.users && !req.body.groupName) {
        return res.status(400).json({ message: "Please Fill All the Fields" })
    }

    // let users = JSON.parse(req.body.users);
    let users = req.body.users;

    if (users.length < 2) {
        return res.status(400).json({ message: "More then 2 users are required to make a group chat" })
    }

    const loginUser = req.user.id;

    users.push(loginUser);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: loginUser
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    } catch (err) {
        console.log("Error in createGroupChat ", err);
        res.status(500)
    }
}

export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName
            },
            { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).json({ message: "Group not found" })
        }
        res.status(200).json(updatedChat)
    } catch (err) {
        console.log("Error in renameGroup ", err);
        res.status(500)
    }
}

export const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    try {

        const remove =await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId }
            },
            { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");


        if (!remove) {
            return res.status(404).json({ message: "Group not found" })
        }
        res.status(200).json(remove)
    }
    catch (err) {
        console.log("Error in addToGroup ", err);
        res.status(500)
    }
}

export const groupRemove = async (req, res) => {
    const { chatId, userId } = req.body;
    try {

        const remove =await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId }
            },
            { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");


        if (!remove) {
            return res.status(404).json({ message: "Group not found" })
        }
        res.status(200).json(remove)
    }
    catch (err) {
        console.log("Error in addToGroup ", err);
        res.status(500)
    }
}
