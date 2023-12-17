import { VideoClass, VideoModel } from "./videos.model";

export function createVideo({ owner }: { owner: string }) {
  return VideoModel.create({ owner });
}

export function findVideo(videoId: VideoClass["videoId"]) {
  return VideoModel.findOne({ videoId });
}

export function findAllVideos() {
  return VideoModel.find({ published: true }).lean();
}
