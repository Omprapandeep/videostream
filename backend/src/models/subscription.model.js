import mongoose from "mongoose";

const subscriotionschema = new mongoose.Schema({

    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true});

//prevent duplicate subscriptions
subscriotionschema.index({subscriber:1,channel:1},{unique:true});

//performace optimization for fetching subscribers of a channel
subscriotionschema.index({channel:1});

const Subscription = mongoose.model("Subscription", subscriotionschema);

export default Subscription;