import { TypeOf, object, string } from "zod";

export const registerUserSchema = {
  body: object({
    username: string({
      required_error: "Username is required!",
    }),
    email: string({
      required_error: "email is required!",
    }),
    password: string({
      required_error: "password is required!",
    }).min(6, "password must be more than 6 characters!"),
    confirmPassword: string({
      required_error: "confirmPassword is required!",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPasswords"],
  }),
};

export type RegisterUserBodyT = TypeOf<typeof registerUserSchema.body>;
