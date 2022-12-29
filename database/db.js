import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.URL, { dbName: "MFT", useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("Connected to DB")
    })
}

const customerSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    personalTraining: { type: Boolean, required: true },
    packageAdopt: { type: String, required: true },
    programType: { type: String, required: true },
    tAndC: { type: Boolean, required: true },
    image: { type: String, required: true }
});

const franchiseSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    companyName: { type: String, required: false },
    companyWebsite: { type: String, required: false },
    turnOver: { type: Number, required: false },
    amountForInvestment: { type: Number, required: false }
});

const subscriptionSchema = mongoose.Schema({
    email: { type: String, required: true }
});

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    number: { type: Number, required: true },
    subject: {type: String, required: true},
    location: {type: String, required: true},
    query: {type: String, required: true}
})

const customerModel = mongoose.model("customer", customerSchema);
const franchiseModel = mongoose.model("franchise", franchiseSchema);
const subscriptionModel = mongoose.model("subscription", subscriptionSchema);
const userModel = mongoose.model('user', userSchema);
const contactModel = mongoose.model('contact', contactSchema);


export { connectDB, customerModel, franchiseModel, subscriptionModel, userModel, contactModel }


