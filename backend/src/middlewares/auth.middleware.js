import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        //get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "no token provided" });
        }


        const token = authHeader.split(" ")[1];
        //split the token from "Bearer " beacuse the token is in the format "Bearer token"

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  

        //find user by id
        const user = await User.findById(decoded.id).select("-password"); //select -password to exclude password from the user object

        if (!user) {
            return res.status(401).json({ message: "no user found with this token" });
        }

        //attach user to request
        req.user = user;
        next();

        //move to next controller


    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

export default authMiddleware;