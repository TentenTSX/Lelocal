import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ??
  "2h") as SignOptions["expiresIn"];

type TokenPayload = {
  id: number;
  email: string;
  role: string;
  firstname: string;
};

const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    throw error;
  }
};

export default { signToken, verifyToken };
export type { TokenPayload };
