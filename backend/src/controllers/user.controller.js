import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        // 1️⃣ Basic validation
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2️⃣ Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })


        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 3️⃣ Hash password
        const salt = await bcrypt.genSalt(10);
        //added in front of password to make it more secure
        //if two users have same password then it will be different in database
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3️⃣ Create user
        const user = await User.create({
            username,
            email,
            password:hashedPassword
        });

        const userresponse = user.toObject();
        delete userresponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: userresponse
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export const loginUser = async (req, res) =>{
    try{
      const {email,password}=req.body;
      
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        //find user by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"no user found with this email"});
        }

        //compare password
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({message:"Invalid password"});
        }

        //create token
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
         
        // 5️⃣ Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse
    });

    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}

