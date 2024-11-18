// JWT
import jwt from "jsonwebtoken";
// JWT

export const generateNewToken = (
  user: { id: string; email: string },
  expireTime: "1h" | "1d" | "2d"
) => {
  // The payload is the user data you want to include in the token
  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: expireTime,
  });

  return token;
};
