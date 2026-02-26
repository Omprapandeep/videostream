// app.js
import express from "express";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import likeRoutes from "./routes/like.routes.js";

const app = express();

app.use(express.json());
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

export default app;
// No database connection here.
// No app.listen() here.

// Just configuration.