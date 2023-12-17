import { Request, Response } from "express";
import { loginBodyT } from "./auth.schema";
import { findUserByEmail } from "../user/user.service";
import { StatusCodes } from "http-status-codes";
import { signJwt } from "./auth.utils";
import omit from "../../helpers/omit";

export async function loginHandler(
  req: Request<{}, {}, loginBodyT>,
  res: Response
) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !user.comparePasswords(password)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("invalid email or password");
  }

  const payload = omit(user.toJSON(),["password","__v"]);
  const jwt = signJwt(payload);

  res.cookie("accessToken", jwt, {
    maxAge: 3.154e10, //1 year
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });
  res.status(StatusCodes.OK).send(jwt);
}
