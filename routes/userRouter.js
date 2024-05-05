const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const checkRole = require("../middleware/checkRoleMiddleware");
const { body } = require("express-validator");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", checkRole("ADMIN"), userController.users);

module.exports = router;
