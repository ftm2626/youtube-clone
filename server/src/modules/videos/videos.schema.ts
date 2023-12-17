import { TypeOf, boolean, object, string } from "zod";

export const updateVideoSchema = {
    body:object({
        title:string(),
        description:string(),
        published:boolean(),
    }),
    params:object({
        videoId:string()
    })
}

export type UpdateVideoBodyT = TypeOf<typeof updateVideoSchema.body>
export type UpdateVideoParamsT = TypeOf<typeof updateVideoSchema.params>;