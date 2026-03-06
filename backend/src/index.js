
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); 
import express from "express";
import connectDB from "./db/db.js";
import app from "./app.js";


 // FIXED

//only allow frontend to access backend

// Connect to MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});


// Notice:

// No routes here.
// No controllers here.










// const indertdata = async()=>{
//     try{
//     const db=mongoose.connection.db;
//     const collection=db.collection("users");
//     const result=await collection.insertOne({name:"om",age:24,createdAt:new Date()});
//     console.log(result);
//     }catch(err){
//         console.log(err);
//     }
// }
