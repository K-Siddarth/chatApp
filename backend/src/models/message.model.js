import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recieverId: {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
},
    {timestamps: true}
);

const Message = mongoose.model("Message", messageSchema);
export default Message;