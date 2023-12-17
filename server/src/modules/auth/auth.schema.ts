import { TypeOf, object, string } from "zod";

export const loginSchema = {
  body: object({
    email: string({ required_error: "email is Required" }).email(
      "not a valid email"
    ),
    password: string({ required_error: "password is Required" }).min(
      6,
      "password must be more than 6 characters!"
    ),
  }),
};

export type loginBodyT = TypeOf<typeof loginSchema.body>;
