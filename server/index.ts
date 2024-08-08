import { app } from "./app";
import connectDb from "./utils/db";
require("dotenv").config();
const port = process.env.PORT || 8000;
import { v2 as cloudinary } from "cloudinary";

//cloudinary config

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY 
})

//create server

app.listen(port, ()=> {
     console.log(`Server is running on ${port}`);  
     connectDb(); 
})