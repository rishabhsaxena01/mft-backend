import { franchiseModel } from "../database/db.js";
// import jwt from "jsonwebtoken";

class FranchiseController {
    static getAllFranchise = async (req, res) => {
        try {
            const result = await franchiseModel.find();
            res.status(200).json(result);
        }
        catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static addFranchise = async (req, res) => {
        try {

            const { name, phone, email, state, city, companyName, companyWebsite, turnOver, amountForInvestment} = req.body;
            if (!name || !phone || !email || !state || !city || !companyName) {
                res.status(403).json("Please Fill all the Details");
                return;
            }

            const preRecord = await franchiseModel.findOne({ email: req.body.email });
            if (preRecord) {
                res.status(409).json("Franchise Already Registered With this Email Id");
                return
            }

            const doc = new franchiseModel(req.body);
            const result = await doc.save();
            res.status(201).json(result);
        }
        catch (err) {
            res.status(403).json({ message: err.message });
        }
    }

    static editFranchise = async (req, res) => {
        try {

            const { name, phone, email, state, city, companyName, companyWebsite, turnOver, amountForInvestment} = req.body;
            if (!name || !phone || !email || !state || !city || !companyName || !companyWebsite || !turnOver || !amountForInvestment) {
                res.status(403).json("Please Fill all the Details");
                return;
            }

            const result = await franchiseModel.findByIdAndUpdate(req.params.id, new franchiseModel(req.body), { returnDocument: "after" });
            res.status(201).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }

    static getFranchiseById = async (req, res) => {
        try {
            const result = await franchiseModel.findById(req.params.id);
            res.status(200).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(404).json({ message: err.message });
        }
    }

    static deleteFranchise = async (req, res) => {
        try {
            const result = await franchiseModel.findByIdAndDelete(req.params.id);
            res.status(201).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }
}

export default FranchiseController
