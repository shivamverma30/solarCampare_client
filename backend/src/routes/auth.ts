import { Router } from "express";
import {
  register,
  login,
  registerUser,
  loginUser,
  registerVendor,
  loginVendor,
  getProfile,
  updateProfile,
  changePassword,
  requestEmailVerification,
  confirmEmailVerification,
  resendVerificationOtp,
  requestPasswordReset,
  verifyPasswordResetOtp,
  completePasswordReset,
  resetPassword,
  listAdminUsers,
} from "../controllers/auth";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/vendor/register", registerVendor);
router.post("/vendor/login", loginVendor);
router.post("/verify-email/request", requestEmailVerification);
router.post("/verify-email/confirm", confirmEmailVerification);
router.post("/verify-email/resend", resendVerificationOtp);
router.post("/forgot-password", requestPasswordReset);
router.post("/forgot-password/verify", verifyPasswordResetOtp);
router.post("/forgot-password/reset", completePasswordReset);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/change-password", authMiddleware, changePassword);
router.get("/admin/users", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), listAdminUsers);

export default router;
