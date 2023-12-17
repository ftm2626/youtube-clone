import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { UserClass } from "../user/user.model";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

export class VideoClass {
  @prop()
  public title: string;

  @prop()
  public description: string;

  @prop({ enum: ["mp4"] })
  public extention: string;

  @prop({ required: true, ref: () => UserClass })
  public owner: Ref<UserClass>;

  @prop({ unique: true, default: () => nanoid() })
  public videoId: string;

  @prop({ default: false })
  public published: boolean;
}

export const VideoModel = getModelForClass(VideoClass, {
  schemaOptions: {
    timestamps: true,
  },
});
