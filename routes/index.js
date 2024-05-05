const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const deviceRouter = require("./deviceRouter");
const basketRouter = require("./basketRouter");
const roleRouter = require("./roleRouter");
const rateRouter = require("./rateRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/basket", basketRouter);
router.use("/role", roleRouter);
router.use("/rate", rateRouter);

module.exports = router;
