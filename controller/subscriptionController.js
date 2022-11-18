import { subscriptionModel } from "../database/db.js";
// import jwt from "jsonwebtoken";

class SubscriptionController {
    static getAllSubscription = async (req, res) => {
        try {
            const result = await subscriptionModel.find();
            res.status(200).json(result);
        }
        catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static addSubscription = async (req, res) => {
        console.log("called");
        try {

            const { email } = req.body;
            if (!email) {
                res.status(403).json("Email is required");
                return;
            }

            const preRecord = await subscriptionModel.findOne({ email: req.body.email });
            if (preRecord) {
                res.status(409).json("You are already subscribed");
                return
            }

            const doc = new subscriptionModel(req.body);
            const result = await doc.save();
            res.status(201).json(result);
        }
        catch (err) {
            res.status(403).json({ message: err.message });
        }
    }

    static getSubscriptionByEmail = async (req, res) => {
        try {
            const result = await subscriptionModel.findOne({email: req.params.email});
            res.status(200).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(404).json({ message: err.message });
        }
    }

    static deleteSubscription = async (req, res) => {
        try {
            const result = await subscriptionModel.findByIdAndDelete(req.params.id);
            res.status(201).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }
}

export default SubscriptionController