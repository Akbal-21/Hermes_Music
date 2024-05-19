import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { hermesApi } from "../../api";
import { SectionContainer } from "../../components/index.components";
import type { GetTicket } from "../../interface";
import { useAuthStore } from "../../store";

export const AdminPage = () => {
	//

	const navigate = useNavigate();
	const logoutUser = useAuthStore((state) => state.logoutUser);
	const user = useAuthStore((state) => state.user);

	const [data, setData] = useState<GetTicket[]>([]);

	if (user?.Tipo !== "Administrador") {
		logoutUser();
		return <Navigate to="/login" />;
	}

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await hermesApi.get("ticket/getTickets");

				if (!res.data) {
					toast.error("Error en la petición");
					return (
						<>
							<h1>Lo sentimos no podemos cargar la pagina</h1>
						</>
					);
				}

				const { getTickets } = res.data;

				setData(getTickets);
				toast.success("Listado de tickets");
				return;
			} catch (error) {
				if (error instanceof Error) {
					return [error];
				}
			}
			return toast.error("Error en la petición");
		};

		getData();
	}, []);

	const handleLogout = () => {
		logoutUser();
		navigate("/login");
	};

	const handleUpdate = (ID_Ticket: number) => {
		navigate(`/admin/${ID_Ticket}`);
	};

	return (
		<SectionContainer className="w-full">
			<Toaster />
			<SectionContainer className="w-full flex justify-center items-center gap-64">
				<h1 className="text-center text-2xl font-bold">
					Hola administrador : {user?.Name}
				</h1>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button className="btn btn-info" onClick={handleLogout}>
					Cerrar sesion
				</button>
			</SectionContainer>
			<SectionContainer className="w-full">
				<h2 className="text-center text-xl font-bold">Listado de Tickets</h2>

				<div className="overflow-x-auto">
					<table className="table table-zebra">
						{/* head */}
						<thead>
							<tr>
								<th># Ticket</th>
								<th>Estado</th>
								<th>Prioridad</th>
								<th>Cliente</th>
								<th>Tecnico</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{data.map((ticket, index) => {
								return (
									<tr key={ticket.ID_Ticket}>
										<th>{index + 1}</th>
										<td>{ticket.Status.Status}</td>
										<td>{ticket.Property.Property}</td>
										<td>{ticket.User_Ticket_ID_UserToUser.Name}</td>
										<td>
											{ticket.User_Ticket_ID_TechnicianToUser?.Name
												? ticket.User_Ticket_ID_TechnicianToUser.Name
												: "Sin tecnico"}
										</td>
										<td>
											{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
											<button
												className="btn btn-xs btn-success m-1"
												onClick={() => handleUpdate(ticket.ID_Ticket)}
											>
												Actualizar ticket
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</SectionContainer>
		</SectionContainer>
	);
};
