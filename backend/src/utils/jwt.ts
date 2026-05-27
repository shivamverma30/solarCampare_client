import jwt, { type SignOptions } from "jsonwebtoken";

export interface TokenPayload {
  role: "SUPERADMIN" | "ADMIN" | "USER" | "VENDOR";
  subjectType: "admin" | "user" | "vendor";
  adminId?: string;
  userId?: string;
  vendorId?: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
};
