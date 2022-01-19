const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

// only admin can view all users
router.get("/", [authenticateUser, authorizePermissions("admin")], getAllUsers);

// order is important
// must be defined before '/:' routes
router.get("/showMe", authenticateUser, showCurrentUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updateUserPassword", authenticateUser, updateUserPassword);

router.get("/:id", authenticateUser, getSingleUser);

module.exports = router;
