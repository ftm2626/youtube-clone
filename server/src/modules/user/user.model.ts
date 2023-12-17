import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import argon2 from "argon2";

@pre<UserClass>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return next();
  }
})
export class UserClass {
  @prop({ required: true, unique: true })
  public username: string;
  @prop({ required: true, unique: true })
  public email: string;
  @prop({ required: true, unique: true })
  public password: string;

  public async comparePasswords(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }
}

export const UserModel = getModelForClass(UserClass, {
  schemaOptions: {
    timestamps: true,
  },
});
