import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  console.log(secret);

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  generateToken,
  verifyToken,
};
