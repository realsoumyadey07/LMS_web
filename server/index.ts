import { app } from "./app";
import connectDb from "./utils/db";
require("dotenv").config();
const port = process.env.PORT || 8000;

app.listen(port, ()=> {
     console.log(`Server is running on ${port}`);  
     connectDb(); 
})