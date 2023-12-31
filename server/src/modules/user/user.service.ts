import { UserClass, UserModel } from "./user.model";

export async function createUser(user: Omit<UserClass, "comparePasswords">) {
  return UserModel.create(user);
}

export async function findUserByEmail(email: UserClass['email']) {
  return UserModel.findOne({ email });
}
