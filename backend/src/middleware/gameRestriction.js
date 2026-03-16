import User from "../model/user.model.js";

export const gameRestriction = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle suspended users
    if (user.isSuspended()) {
      return res.status(403).json({
        success: false,
        message: `Account suspended. ${user.suspensionReason || ""}`,
      });
    }

    // Block banned or deleted
    if (["banned", "deleted"].includes(user.accountStatus)) {
      return res.status(403).json({
        success: false,
        message: "Account is not allowed to access this resource.",
      });
    }

    // If suspension expired → activate again
    if (user.accountStatus === "active") {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
