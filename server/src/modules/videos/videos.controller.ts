import busboy from "busboy";
import fs from "fs";
import { Request, Response } from "express";
import { createVideo, findAllVideos, findVideo } from "./videos.service";
import { VideoClass } from "./videos.model";
import { StatusCodes } from "http-status-codes";
import { UpdateVideoBodyT, UpdateVideoParamsT } from "./videos.schema";

const MIME_TYPES = ["video/mp4"];
const CHUNK_SIZE_IN_BYTES = 1000000; //1MB

function getPath({
  videoId,
  extension,
}: {
  videoId: VideoClass["videoId"];
  extension: VideoClass["extention"];
}) {
  return `${process.cwd()}/videos/${videoId}.${extension}`;
}

export async function uploadVideoHandler(req: Request, res: Response) {
  const bb = busboy({ headers: req.headers });
  const user = res.locals.user;
  const video = await createVideo({ owner: user._id });
  bb.on("file", async (_, file, info) => {
    if (!MIME_TYPES.includes(info.mimeType)) {
      return res.status(StatusCodes.BAD_REQUEST).send("invalid file type");
    }
    const extention = info.mimeType.split("/")[1];
    const filePath = getPath({
      videoId: video.videoId,
      extension: extention,
    });
    video.extention = extention;
    await video.save();
    const stream = fs.createWriteStream(filePath);
    file.pipe(stream);
  });

  bb.on("close", () => {
    res.writeHead(StatusCodes.CREATED, {
      Connection: "close",
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(video));
    res.end();
  });
  return req.pipe(bb);
}

export async function updateVideoHandler(
  req: Request<UpdateVideoParamsT, {}, UpdateVideoBodyT>,
  res: Response
) {
  const { videoId } = req.params;
  const { title, description, published } = req.body;
  const { _id: userId } = res.locals.user;
  const video = await findVideo(videoId);

  if (!video) {
    return res.status(StatusCodes.NOT_FOUND).send("video not found");
  }
  if (String(video.owner) !== String(userId)) {
    return res.status(StatusCodes.UNAUTHORIZED).send("unauthorized");
  }

  video.title = title;
  video.description = description;
  video.published = published;

  await video.save();

  return res.status(StatusCodes.OK).send(video);
}

export async function findVideosHandler(req: Request, res: Response) {
  const videos = await findAllVideos();
  res.status(StatusCodes.OK).send(videos);
}

export async function streamVideosHandler(req: Request, res: Response) {
  const { videoId } = req.params;
  const range = req.headers.range;
  if (!range) {
    return res.status(StatusCodes.BAD_REQUEST).send("range must be provided");
  }
  const video = await findVideo(videoId);

  if (!video) {
    return res.status(StatusCodes.NOT_FOUND).send("video not found");
  }

  const filePath = getPath({
    videoId: video.videoId,
    extension: video.extention,
  });

  const fileSizeInBytes = fs.statSync(filePath).size;
  const chunkStart = +range.replace(/\D/g, "");
  const chunkEnd = Math.min(
    chunkStart + CHUNK_SIZE_IN_BYTES,
    fileSizeInBytes - 1
  );
  const contentLength = chunkEnd - chunkStart + 1;
  const headers = {
    "Content-Range": `bytes${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": `video/${video.extention}`,
    "Cross-Origin_Resource-Policy":"cross-origin"
  };

  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

  const videoStream = fs.createReadStream(filePath, {
    start: chunkStart,
    end: chunkEnd,
  });
  videoStream.pipe(res);
}
