import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, password, email } = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password should have atleast 6 letters" });
        }
        const usercheck = await User.findOne({ email });
        if (usercheck) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "Invalid User data" });
        }

    } catch (e) {
        res.send(500).json({ message: "Internal Sever error" });
        console.error("Error in signup: ", e);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid User data" });
        }

        const passwordcheck = await bcrypt.compare(password, user.password);
        if (!passwordcheck) {
            res.status(400).json({ message: "Invalid User data" });
        }
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (e) {
        res.send(500).json({ message: "Internal Sever error" });
        console.error("Error in login: ", e);
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out succesfully" });
    } catch (e) {
        res.send(500).json({ message: "Internal Sever error" });
        console.error("Error in logout: ", e);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id

        if (!profilePic) {
            return res.send(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse}, {new: true});

        res.send(200).json(updatedUser);
    } catch(e) {
        res.send(500).json({ message: "Internal Sever error" });
        console.error("Error in logout: ", e);
    }
};