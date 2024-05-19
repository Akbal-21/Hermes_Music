import { Router } from "express";
import {
	asignateTechnician,
	createTicket,
	getAllTickets,
	getTicketByID,
	getTicketsByTechnician,
	updateStatusResolution,
	updateTicket,
} from "../controllers/index.controller";

const router = Router();

router.post("/createTicket", createTicket);
router.post("/asignateTechnician/:ID_Ticket", asignateTechnician);
router.put("/updateStatusResolution/:ID_Ticket", updateStatusResolution);
router.put("/updateTicket/:ID_Ticket", updateTicket);
router.get("/getTickets", getAllTickets);
router.get("/getTicketsByTechnician/:ID_Technician", getTicketsByTechnician);
router.get("/getTicketByID/:ID_Ticket", getTicketByID);

export default router;
