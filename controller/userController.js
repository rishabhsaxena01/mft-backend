import { userModel } from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
class UserController {
  static addUser = async (req, res) => {
    try {
        //hashing password
      const newPassword = await bcrypt.hash(req.body.password, 10);

      //getting parameters from body
      const { name, email, password } = req.body;

      //checking all parameters
      if (!name || !email || !password) {
        return res.status(403).json({ message: "Please Fill all the Details" });
        
      }

      //checking for pre record
      const preRecord = await userModel.findOne({ email: req.body.email });
      if (preRecord) {
        return res.status(409).json({ message: "User Already Registered With this Email Id" });
      }

      // save the user to DB
      const doc = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
      });
      const result = await doc.save();

      //add a token
      const token = jwt.sign({
        userId: result._id
        },
        process.env.JWT_SECRET
        // ,{expiresIn:"10000"}
      );

      //set it in cookie
      res.cookie("jwtToken", token, {
        httpOnly:true,
        maxAge:3600000*5,
        secure:true,
        sameSite:'none',
      });

      //return saved user
      res.status(201).json(result);
    } catch (err) {
      console.log(err)
      res.status(403).json({ message: err.message });
    }
  };

  static getUserByEmail = async (req, res) => {
    try {

        //check if user exist or not
      const result = await userModel.findOne({ email: req.body.email });

      if (!result) return res.status(404).json({ message: "No User Exist" });

      //check for password
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        result.password
      );

      //if valid then add token
      if (isPasswordValid) {
        const token = jwt.sign({
            userId: result._id
          },
          process.env.JWT_SECRET
          // ,{expiresIn:"10000"}
        );

        //set it in cookie
        res.cookie("jwtToken", token, {
          httpOnly:true,
       maxAge:3600000*5,
       secure:true,
       sameSite:'none',
        });

        //return valid user
        return res.status(200).json({ message: "Valid User" });
        
      } 
      // check password
      else {
        return res.status(403).json({ message: "Check Password" });
      }
    } 
    catch (err) {
      console.log(err)
      return res.status(404).json({ message: "Error occured" });
    }
  };
  static logout = async (req, res) => {
    try {
      res.cookie("jwtToken", "", {
        httpOnly: false,
        expires: new Date(0),
      });
      return res.status(200).json({ message: "Log Out Successfully" });
    } 
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Cant Logout" });
    }
  };


  static changePassword = async (req, res) => {
    try {
        //get parameters
      const { email, password } = req.body;

      //check parameters
      if (!email ||!password ) {
        res.status(403).json({message: "Please Fill all the Details"});
        return;
      }

      //find user if exist
      const result = await userModel.findOne({email:email});

      if(result){
        //create new hash password
        const newPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser= new userModel({
            _id:result._id,
            name: result.name,
            email: email,
            password: newPassword,
          });

          //save the updated user
        await userModel.findByIdAndUpdate(result._id,newUser)

        return res.status(200).json({ message: "Password Changed" });
      }
      else{

        //if no user exist throw error
        return res.status(404).json({message: "No user"});
      }
    } 
    catch (err) {
      console.log(err);
      res.status(409).json({ message: err.message });
    }
  };
}

export default UserController;
