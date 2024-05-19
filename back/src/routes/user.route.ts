import { Router } from "express";
import {
	createAdmin,
	createClient,
	createTechnican,
	getAllTechnicans,
	loginUser,
} from "../controllers/index.controller";

const router = Router();

router.post("/createClient", createClient);
router.post("/createAdmin", createAdmin);
router.post("/createTechnican", createTechnican);
router.get("/getAllTechnicans", getAllTechnicans);
router.post("/login", loginUser);

export default router;
