export interface Ticket {
	ID_Ticket: number;
	Resolution: string | null;
	Date_Ticket: Date;
	ID_User: number;
	ID_Status: number;
	ID_Property: number;
	ID_Technician: number | null;
	Description: string;
}

export interface GetTicket {
	ID_Ticket: number;
	Resolution: string | null;
	Date_Ticket: Date;
	Description: string;
	User_Ticket_ID_TechnicianToUser: { Name: string } | null;
	User_Ticket_ID_UserToUser: { Name: string };
	Status: { Status: string };
	Property: { Property: string };
}

export interface GetTicketById {
	Date_Ticket: Date;
	Description: string;
	Property: {
		Property: string;
	};
	Status: {
		Status: string;
	};
	User_Ticket_ID_UserToUser: {
		Name: string;
	};
}
