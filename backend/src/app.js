// app.js
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();
app.use(
  cors()
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data (e.g., from forms)
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

export default app;
// No database connection here.
// No app.listen() here.

// Just configuration.