import express from "express";
import CustomerController from "../controller/customerController.js";
import FranchiseController from "../controller/franchiseController.js";
import SubscriptionController from "../controller/subscriptionController.js";
import UserController from "../controller/userController.js";
import auth from '../Middleware/auth.js';
import multer from 'multer';
import {nanoid} from 'nanoid';
import path from 'path';

const router = express.Router();

//used to store image in viewable format
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.resolve(), 'uploads'))
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, nanoid() + '-' + file.originalname)
    }
})


//where to store the image
const upload = multer({ storage });

router.post("/customer/add", upload.single('image'), CustomerController.addCustomer);                   //customer side route
router.get("/customer/getAll", auth, CustomerController.getAllCustomer);              //admin side route
router.get("/customer/:id", auth, upload.single('productPicture'), CustomerController.getCustomerById);                //admin side route
router.put("/customer/edit/:id", auth, CustomerController.editCustomer);               //admin side route
router.delete("/customer/delete/:id", auth, CustomerController.deleteCustomer);       //admin side route        


router.post("/franchise/add", FranchiseController.addFranchise);                   //customer side route
router.get("/franchise/getAll", auth, FranchiseController.getAllFranchise);              //admin side route
router.get("/franchise/:id", auth, FranchiseController.getFranchiseById);                //admin side route
router.put("/franchise/edit/:id", auth, FranchiseController.editFranchise);               //admin side route
router.delete("/franchise/delete/:id", auth, FranchiseController.deleteFranchise);       //admin side route 


router.post("/subscription/add", SubscriptionController.addSubscription);        //customer side route
router.get("/subscription/getAll", auth, SubscriptionController.getAllSubscription);   //admin side route
router.delete("/subscription/delete/:id", auth, SubscriptionController.deleteSubscription);        //admin side route

router.post("/registerUser", UserController.addUser);                                 // admin side route          
router.post("/loginUser", UserController.getUserByEmail);                             // admin side route
router.post("/logoutUser", UserController.logout);                                    // admin side route
router.put("/changePassword", UserController.changePassword);                                    // admin side route

export default router;

