const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, basketController.move);
router.get("/", authMiddleware, basketController.get);
router.delete("/", authMiddleware, basketController.delete);

module.exports = router;
