import express from "express";
import requireUser from "../../middleware/requireUser";
import {
  findVideosHandler,
  streamVideosHandler,
  updateVideoHandler,
  uploadVideoHandler,
} from "./videos.controller";

const router = express.Router();
router.get("/", findVideosHandler);
router.post("/", requireUser, uploadVideoHandler);
router.get("/:videoId", streamVideosHandler);
router.patch("/:videoId", requireUser, updateVideoHandler);

export default router;
