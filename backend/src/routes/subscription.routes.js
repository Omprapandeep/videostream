import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import { togglesubscription,getsubscribers,issubscribed } from '../controllers/subscription.controller.js';

const router = express.Router();

// toggle subscription
router.post("/:channelId",authMiddleware,togglesubscription);

//get subscribers of a channel
router.get("/subscribers/:channelId",getsubscribers);

//check subscribed or not
router.get("/:channelId/status",authMiddleware,issubscribed);

export default router;
