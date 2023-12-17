import { Request, Response } from "express";
import { UserClass } from "./user.model";
import { StatusCodes } from "http-status-codes";
import { createUser } from "./user.service";
import { RegisterUserBodyT } from "./user.schema";

export async function registerUserHandler(req:Request<{},{},RegisterUserBodyT>,res:Response) {
    const { username,email,password} = req.body
    try {
        await createUser({username,email,password})
        return res.status(StatusCodes.CREATED).send("user was created successfully")
    } catch (e) {
        if (e.code === 11000) {
            res.status(StatusCodes.CONFLICT).send("user already exists")
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message)
    }
}