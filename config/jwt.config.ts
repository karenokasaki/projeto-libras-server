import jwt from "jsonwebtoken";
//todo add type for user

export function generateToken(user: any) {
  const { _id, name, email, role } = user;

  if (process.env.TOKEN_SIGN_SECRET === undefined) {
    throw new Error("TOKEN_SIGN_SECRET is undefined");
  }

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  return jwt.sign({ _id, name, email, role }, signature, {
    expiresIn: expiration,
  });
}
