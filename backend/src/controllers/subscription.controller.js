import subscription from "../models/subscription.model.js";

//toggle subscribe/unsubscribe

export const togglesubscription = async (req, res) => {
    try {

        const userId = req.user._id;
        const channelId = req.params.channelId;

        //prevent subscribing to self
        if (userId.toString() === channelId) {
            return res.status(400).json({ message: "You cannot subscribe to yourself" })
        }

        const deleted = await subscription.findOneAndDelete({
            subscriber: userId,
            channel: channelId
        });

        if (deleted) {
            return res.status(200).json({
                message: "Unsubscribed successfully",
                subscribed: false
            });
        }

        // ✅ else subscribe
        try {
            await subscription.create({
                subscriber: userId,
                channel: channelId
            });

            return res.status(200).json({
                message: "Subscribed successfully",
                subscribed: true
            });

        } catch (err) {
            // handle duplicate click
            if (err.code === 11000) {
                return res.status(200).json({
                    message: "Already subscribed",
                    subscribed: true
                });
            }
            throw err;
        }

    } catch (err) {
        res.status(500).json({
            message: "Failed to toggle subscription",
            error: err.message
        });
    }
};


//check subscribed or not 

export const issubscribed = async (req, res) => {
    try {
        const userId = req.user._id;
        const channelId = req.params.channelId;
        const existingsubscription = await subscription.findOne({ subscriber: userId, channel: channelId });

        if (existingsubscription) {
            return res.status(200).json({ subscribed: true })
        } else {
            return res.status(200).json({ subscribed: false })
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to check subscription status", error: err.message })
    }
}

//get subscribers of a channel

export const getsubscribers = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const subscribers = await subscription.countDocuments({ channel: channelId });
        return res.status(200).json({ subscribers })
    } catch (err) {
        res.status(500).json({ message: "Failed to get subscribers", error: err.message })
    }
}
