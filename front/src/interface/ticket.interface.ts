export interface GetTicket {
	ID_Ticket: number;
	Resolution: string | null;
	Date_Ticket: Date;
	Description: string;
	User_Ticket_ID_TechnicianToUser: { Name: string } | null;
	User_Ticket_ID_UserToUser: { Name: string };
	Status: { Status: "Creado" | "Proceso" | "Cerrado" | "Cancelado" };
	Property: { Property: "Pendiente de asignar" | "Alta" | "Media" | "Baja" };
}

export interface GetTicketByID {
	Date_Ticket: Date;
	Description: string;
	User_Ticket_ID_UserToUser: { Name: string };
	Status: { Status: "Creado" | "Proceso" | "Cerrado" | "Cancelado" };
	Property: { Property: "Pendiente de asignar" | "Alta" | "Media" | "Baja" };
}
