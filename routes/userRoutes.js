const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.get("/", getAllUsers);

// order is important
// must be defined before '/:' routes
router.get("/showMe", showCurrentUser);
router.patch("/updateUser", updateUser);
router.patch("/updateUserPassword", updateUserPassword);

router.get("/:id", getSingleUser);

module.exports = router;
