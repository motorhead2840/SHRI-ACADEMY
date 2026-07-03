import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import blockchainRouter from "./blockchain.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/blockchain", blockchainRouter);

export default router;
