import type { Request, Response } from "express";
import { connection, disconnect, prisma } from "../db";
import type {
	GetTicket,
	GetTicketById,
	Ticket,
} from "../interface/index.interface";

type Data =
	| { message: string }
	| { getTickets: Ticket[] }
	| { getTickets: GetTicket[] }
	| { getTicketById: GetTicketById };

const status = ["Creado", "Proceso", "Cerrado", "Cancelado"];
const property = ["Alta", "Media", "Baja", "Pendiente de asignar"];

export const createTicket = async (req: Request, res: Response<Data>) => {
	const { ID_User, Date_Ticket, Description } = req.body as {
		Date_Ticket: Date;
		Description: string;
		ID_User: number;
	};

	if (
		Date_Ticket < new Date(Date.now()) ||
		Date_Ticket > new Date(Date.now())
	) {
		return res
			.status(400)
			.json({ message: "La fecha es incorrecta o no es posible" });
	}

	if (Description.length <= 10) {
		return res.status(400).json({
			message: "Es necesario que la descripción tenga al menos 10 caracteres",
		});
	}

	if (!ID_User) {
		return res.status(400).json({ message: "Es necesario mandar un Usuario" });
	}

	try {
		await connection;

		const newTicket: Ticket = await prisma.ticket.create({
			data: {
				Date_Ticket,
				Description,
				ID_Status: 1,
				ID_Property: 4,
				ID_User,
			},
		});

		await disconnect;
		if (!newTicket) {
			return res.status(400).json({ message: "No se puede crear el ticket" });
		}

		return res
			.status(200)
			.json({ message: "Se creo el ticket EXITOSAMENTe!!" });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(400)
				.json({ message: "Error en la creación del ticket" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const asignateTechnician = async (req: Request, res: Response<Data>) => {
	const { ID_User } = req.body as { ID_User: number };
	const { ID_Ticket } = req.params as { ID_Ticket: string };

	if (Number(ID_Ticket) < 0 || !ID_Ticket) {
		return res.status(400).json({ message: "No existe el ticket" });
	}

	if (!ID_User) {
		return res.status(400).json({ message: "No se puede asignar un tecnico" });
	}

	try {
		await connection;

		const asignedTechnician: Ticket = await prisma.ticket.update({
			where: {
				ID_Ticket: Number(ID_Ticket),
			},
			data: {
				ID_Technician: ID_User,
			},
		});

		await disconnect;

		if (asignedTechnician) {
			return res.status(400).json({ message: "Error al asignar tecnico" });
		}

		return res.status(200).json({ message: "Tecnico asignado" });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al asignar tecnico" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const updateStatusResolution = async (
	req: Request,
	res: Response<Data>,
) => {
	const { resoult, estado } = req.body as { resoult: string; estado: string };
	const { ID_Ticket } = req.params as { ID_Ticket: string };

	console.log(resoult, estado);

	if (Number(ID_Ticket) < 0 || !ID_Ticket) {
		return res.status(400).json({ message: "No existe el ticket" });
	}

	if (!status.includes(estado)) {
		return res.status(400).json({ message: "No se tiene un estado" });
	}

	const ID_Status =
		estado === "Creado"
			? 1
			: estado === "Proceso"
				? 2
				: estado === "Cerrado"
					? 3
					: 4;

	if (!resoult) {
		return res.status(400).json({ message: "Es necesario una resolución" });
	}

	try {
		await connection;

		const updatedStatusResolution: Ticket = await prisma.ticket.update({
			where: {
				ID_Ticket: Number(ID_Ticket),
			},
			data: {
				ID_Status,
				Resolution: resoult,
			},
		});

		await disconnect;

		if (!updatedStatusResolution) {
			return res.status(400).json({ message: "Error al actualizar el estado" });
		}

		return res.status(200).json({ message: "Se actualizo el estado" });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al actualizar el estado" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const updateTicket = async (req: Request, res: Response<Data>) => {
	const { estado, prioridad, id_tecnico } = req.body as {
		id_tecnico: number;
		estado: string;
		prioridad: string;
	};

	const { ID_Ticket } = req.params as { ID_Ticket: string };

	if (Number(ID_Ticket) < 0 || !ID_Ticket) {
		return res.status(400).json({ message: "No existe el ticket" });
	}

	if (!status.includes(estado)) {
		return res.status(400).json({ message: "No se tiene un estado" });
	}

	if (!property.includes(prioridad)) {
		return res.status(400).json({ message: "No se tiene una prioridad" });
	}

	if (!id_tecnico || id_tecnico < 0) {
		return res.status(400).json({ message: "No se puede asignar un tecnico" });
	}

	const ID_Property =
		prioridad === "Alta"
			? 1
			: prioridad === "Media"
				? 2
				: prioridad === "Baja"
					? 3
					: 4;

	const ID_Status =
		estado === "Creado"
			? 1
			: estado === "Proceso"
				? 2
				: estado === "Cerrado"
					? 3
					: 4;

	try {
		await connection;

		const updateTicket: Ticket = await prisma.ticket.update({
			where: {
				ID_Ticket: Number(ID_Ticket),
			},
			data: {
				ID_Property,
				ID_Status,
				ID_Technician: id_tecnico,
			},
		});

		await disconnect;

		if (!updateTicket) {
			return res
				.status(400)
				.json({ message: "Error al actualizar la prioridad" });
		}

		return res.status(200).json({ message: "Se actualizo la prioridad" });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(400)
				.json({ message: "Error al actualizar la prioridad" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const getAllTickets = async (req: Request, res: Response<Data>) => {
	try {
		await connection;

		const getTickets: GetTicket[] = await prisma.ticket.findMany({
			select: {
				ID_Ticket: true,
				Resolution: true,
				Date_Ticket: true,
				Description: true,
				User_Ticket_ID_TechnicianToUser: {
					select: {
						Name: true,
					},
				},
				User_Ticket_ID_UserToUser: {
					select: {
						Name: true,
					},
				},
				Status: {
					select: {
						Status: true,
					},
				},
				Property: {
					select: {
						Property: true,
					},
				},
			},
		});

		await disconnect;

		if (!getTickets) {
			return res.status(400).json({ message: "Error al Obtener los Tickets" });
		}

		return res.status(200).json({ getTickets });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(400)
				.json({ message: "Error al actualizar la prioridad" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const getTicketsByTechnician = async (
	req: Request,
	res: Response<Data>,
) => {
	const { ID_Technician } = req.params as { ID_Technician: string };

	try {
		await connection;

		const getTickets: GetTicket[] = await prisma.ticket.findMany({
			where: {
				ID_Technician: Number(ID_Technician),
			},
			select: {
				ID_Ticket: true,
				Resolution: true,
				Date_Ticket: true,
				Description: true,
				User_Ticket_ID_TechnicianToUser: {
					select: {
						Name: true,
					},
				},
				User_Ticket_ID_UserToUser: {
					select: {
						Name: true,
					},
				},
				Status: {
					select: {
						Status: true,
					},
				},
				Property: {
					select: {
						Property: true,
					},
				},
			},
		});

		await disconnect;

		if (!getTickets) {
			return res.status(400).json({ message: "Error al obrtener los tickets" });
		}

		return res.status(200).json({ getTickets });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(400)
				.json({ message: "Error al actualizar la prioridad" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const getTicketByID = async (req: Request, res: Response<Data>) => {
	const { ID_Ticket } = req.params as { ID_Ticket: string };

	try {
		await connection;

		const getTicketById: GetTicketById | null = await prisma.ticket.findUnique({
			where: {
				ID_Ticket: Number(ID_Ticket),
			},
			select: {
				Date_Ticket: true,
				Description: true,
				User_Ticket_ID_UserToUser: {
					select: {
						Name: true,
					},
				},
				Status: {
					select: {
						Status: true,
					},
				},
				Property: {
					select: {
						Property: true,
					},
				},
				User_Ticket_ID_TechnicianToUser: {
					select: {
						Name: true,
						ID_User: true,
					},
				},
			},
		});

		await disconnect;

		if (!getTicketById) {
			return res.status(400).json({ message: "Error al obrtener los tickets" });
		}

		return res.status(200).json({ getTicketById });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(400)
				.json({ message: "Error al actualizar la prioridad" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

//

// export const updateProperty = (req: Request, res: Response<Data>) => {
// try {
// await connection;
//
//
// await disconnect;
//
// if (!) {
// return res
// .status(400)
// .json({ message: "Error al actualizar la prioridad" });
// }
//
// return res.status(200).json({ message: "Se actualizo la prioridad" });
// } catch (error) {
// if (error instanceof Error) {
// return res
// .status(400)
// .json({ message: "Error al actualizar la prioridad" });
// }
// }
// return res.status(400).json({ message: "Error inseperado" });
// };
