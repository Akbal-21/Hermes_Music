import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Root";
import { DashboardLayout } from "../layouts";
import {
	AdminPage,
	ClientPage,
	LoginPage,
	TechnicianPage,
	UpdateTicket,
} from "../pages";
import { TicketTechnician } from "../pages/technician/TicketTechnician";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <DashboardLayout />,
				children: [
					{
						path: "admin",
						element: <AdminPage />,
					},
					{
						path: "admin/:ID_Ticket",
						element: <UpdateTicket />,
					},
					{
						path: "technician",
						element: <TechnicianPage />,
					},
					{
						path: "technician/:ID_Ticket",
						element: <TicketTechnician />,
					},

					{
						path: "cliente",
						element: <ClientPage />,
					},
				],
			},

			// * Auth
			{
				path: "login",
				element: <LoginPage />,
			},
		],
	},
]);
