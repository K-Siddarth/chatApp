import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (e) {
        console.error("getUsersSidebar error: ", e);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, recieverId: recieverId },
                { senderId: recieverId, recieverId: senderId }
            ]
        });

        res.status(200).json(messages);
    } catch(e) {
        console.error("Error in getMessages", e);
        res.status(500).json({message: "Internal server errro"});
    }
}

// console.error("Error in getMessages", e);
// res.status(500).json({message: "Internal server errro"});

export const sendMessages = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;    
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await Message.save();

        //TODO: Real time functionality will be implemented below;
        res.status(201).json(newMessage);
    } catch (e) {
        console.error("Error in sendMessages", e);
        res.status(500).json({message: "Internal server errro"});
        
    }
}