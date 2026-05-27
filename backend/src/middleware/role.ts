import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export function requireRoles(allowedRoles: Array<string>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.authRole || !allowedRoles.includes(req.authRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}