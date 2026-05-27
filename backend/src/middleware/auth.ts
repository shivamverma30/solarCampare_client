import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  adminId?: string;
  userId?: string;
  vendorId?: string;
  authRole?: string;
  subjectType?: "admin" | "user" | "vendor";
  admin?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = verifyToken(token);
    req.authRole = decoded.role;
    req.subjectType = decoded.subjectType;

    if (decoded.adminId) {
      req.adminId = decoded.adminId;
      req.admin = {
        id: decoded.adminId,
        email: decoded.email,
      };
    }

    if (decoded.userId) {
      req.userId = decoded.userId;
    }

    if (decoded.vendorId) {
      req.vendorId = decoded.vendorId;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
