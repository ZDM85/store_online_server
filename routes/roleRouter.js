const Router = require("express");
const router = new Router();
const roleController = require("../controllers/roleController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, roleController.create);
router.post("/add", checkRole("ADMIN"), roleController.add);
router.get("/", authMiddleware, roleController.get);
router.get("/role", authMiddleware, roleController.getRoles);
router.delete("/", checkRole("ADMIN"), roleController.delete);

module.exports = router;
