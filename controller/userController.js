import { userModel } from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { response } from "express";
class UserController {
    static addUser = async (req, res) => {
        try {

            const newPassword = await bcrypt.hash(req.body.password, 10)
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(403).json({ message: "Please Fill all the Details" });
                return;
            }

            const preRecord = await userModel.findOne({ email: req.body.email });
            if (preRecord) {
                res.status(409).json({ message: "User Already Registered With this Email Id" });
                return
            }

            // save the user to DB
            const doc = new userModel({
                name: req.body.name,
                email: req.body.email,
                password: newPassword
            });
            const result = await doc.save();

            //add a token
            const token = jwt.sign({
                userId: result._id
            }, process.env.JWT_SECRET,
            // ,{expiresIn:"10000"}
            )

            //set it in cookie
            res.cookie("jwtToken", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true
            })
            res.status(201).json(result);
        }
        catch (err) {
            res.status(403).json({ message: err.message });
        }
    }

    static getUserByEmail = async (req, res) => {
        try {

            const result = await userModel.findOne({ email: req.body.email });

            if (!result) return res.status(404).json({ message: "No User Exist" });

            const isPasswordValid = await bcrypt.compare(req.body.password, result.password);

            if (isPasswordValid) {
                const token = jwt.sign({
                    userId: result._id
                }, process.env.JWT_SECRET
                // ,{expiresIn:"10000"}
                )

                //set it in cookie
                res.cookie("jwtToken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json({ message: "Valid User" })
                return
            }
            else {
                return res.status(403).json({ message: "Check Password" })
            }
        }
        catch (err) {
            return res.status(404).json({ message: "Error occured" });
        }
    }
    static logout = async (req, res) => {
        try {
            res.cookie("jwtToken", "", {
                httpOnly: true,
                expires: new Date(0)
            })
            return res.status(200).json({ message: "Log Out Successfully" });
        }
        catch(err){
            res.status(500).json({message:"Cant Logout"})
        }
    }
}

export default UserController