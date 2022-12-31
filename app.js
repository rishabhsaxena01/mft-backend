import express from "express";
import routes from "./routes/allRoutes.js";
import { connectDB } from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import path from "path";

const app=express();

dotenv.config();

const PORT= process.env.PORT || 8000;

connectDB();
app.use(cookieParser())
app.use(cors({
    origin:['http://127.0.0.1:5500', 'http://localhost:3000', 'https://admin-mftgym.netlify.app/'],
    credentials:true,
}));
app.use(express.json())
app.use("/",routes);
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(path.resolve(), "uploads")));

app.listen(PORT,()=>{
    console.log(`App Running at http://localhost:${PORT}`);
})