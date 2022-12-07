import { customerModel } from "../database/db.js";
// import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
class CustomerController {
    static getAllCustomer = async (req, res) => {
        try {
            const result = await customerModel.find();
            res.status(200).json(result);
        }
        catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static addCustomer = async (req, res) => {
        try {
            const { firstName, lastName, email, contact, dob, address, gender, personalTraining, packageAdopt, programType, tAndC } = req.body;
            if (!firstName || !lastName || !email || !contact || !dob || !address || !gender || !String(personalTraining) || !packageAdopt || !programType || !String(tAndC)) {
                res.status(403).json({message: "Please Fill all the Details"});
                return;
            }

            const preRecord = await customerModel.findOne({ email: email });
            if (preRecord) {
                res.status(409).json({message: "Customer Already Registered With this Email Id"});
                return
            }

            
            const customer = new customerModel({
                firstName, lastName, email, contact, dob, address, gender, 
                personalTraining: personalTraining=== "Yes" ? true : false,
                packageAdopt, programType, 
                tAndC: tAndC ? true : false,
                image: req.file.filename
            })

            const doc = new customerModel(customer);
            const result = await doc.save();
            res.status(201).json(result);
        }
        catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static editCustomer = async (req, res) => {
        try {

            const { firstName, lastName, email, contact, dob, address, gender, personalTraining, packageAdopt, programType, tAndC } = req.body;
            if (!firstName || !lastName || !email || !contact || !dob || !address || !gender || !String(personalTraining) || !packageAdopt || !programType || !String(tAndC)) {
                return res.status(403).json({message: "Please Fill all the Details"});
                
            }

            const customer = new customerModel({
                _id:req.params.id, firstName, lastName, email, contact, dob, address, gender, personalTraining, packageAdopt, programType, tAndC
            })
            if (req.file) {
                //if new picture was there then delete the previous one
                const previous = await customerModel.findById(req.params.id);
                fs.unlink(path.join(path.resolve(), "uploads", previous.image), (err) => err ? console.log("error removing file", err) : "");
                customer = {
                    ...customer,
                    image: req.file.filename
                }
            }
            const result = await customerModel.findByIdAndUpdate(req.params.id, customer, { returnDocument: "after" });
            res.status(201).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }

    static getCustomerById = async (req, res) => {
        try {
            const result = await customerModel.findById(req.params.id);
            res.status(200).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(404).json({ message: err.message });
        }
    }

    static deleteCustomer = async (req, res) => {
        try {
            const result = await customerModel.findByIdAndDelete(req.params.id);
            fs.unlink(path.join(path.resolve(), "uploads", result.image), (err) => err ? console.log("error removing file", err) : "");
            res.status(201).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }
}

export default CustomerController