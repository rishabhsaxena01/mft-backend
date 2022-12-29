import { contactModel } from "../database/db.js";
class ContactController {
    static getAllContact = async (req, res) => {
        try {
            const result = await contactModel.find();
            res.status(200).json(result);
        }
        catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static addContact = async (req, res) => {
        try {
            const { name, email, number, subject, location, query} = req.body;
            if (!name || !email || !number || !subject || !location ||!query ) {
                res.status(403).json("Please Fill all the Details");
                return;
            }

            // const preRecord = await contactModel.findOne({ email: req.body.email });
            // if (preRecord) {
            //     res.status(409).json("Franchise Already Registered With this Email Id");
            //     return
            // }

            const doc = new contactModel(req.body);
            const result = await doc.save();
            res.status(201).json(result);
        }
        catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static deleteContact = async (req, res) => {
        try {
            const result = await contactModel.findByIdAndDelete(req.params.id);
            res.status(201).json(result);
        }
        catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }
}

export default ContactController