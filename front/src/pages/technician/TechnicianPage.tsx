import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { hermesApi } from "../../api";
import { SectionContainer } from "../../components/index.components";
import type { GetTicket } from "../../interface";
import { useAuthStore } from "../../store";

export const TechnicianPage = () => {
	//

	const navigate = useNavigate();

	const logoutUser = useAuthStore((state) => state.logoutUser);
	const user = useAuthStore((state) => state.user);

	if (user?.Tipo !== "Tecnico") {
		logoutUser();
		return <Navigate to="/login" />;
	}

	const [data, setData] = useState<GetTicket[]>([]);

	const url = `ticket/getTicketsByTechnician/${user?.ID_User}`;

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await hermesApi.get(url);

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
	}, [url]);

	const handleLogout = () => {
		logoutUser();
		navigate("/login");
	};

	const handleResolution = (ID_Ticket: number) => {
		console.log(ID_Ticket);
		navigate(`/technician/${ID_Ticket}`);
	};

	return (
		<SectionContainer className="w-full">
			<Toaster />
			<SectionContainer className="w-full flex justify-center items-center gap-64">
				<h1 className="text-center text-2xl font-bold">
					Hola administrador : NombreAdmin
				</h1>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button className="btn btn-info" onClick={handleLogout}>
					Cerrar sesion
				</button>
			</SectionContainer>
			<SectionContainer className="w-full">
				<h2 className="text-center text-xl font-bold">Listado de Tickets</h2>

				<div className="overflow-x-auto mx-20">
					<table className="table table-zebra">
						{/* head */}
						<thead>
							<tr>
								<th># Ticket</th>
								<th>Descripcion</th>
								<th>Fecha</th>
								<th>Cliente</th>
								<th>Prioridad</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{data.map((ticket) => {
								return (
									<tr key={ticket.ID_Ticket}>
										<td>{ticket.ID_Ticket}</td>
										<td>{ticket.Description}</td>
										<td>{String(ticket.Date_Ticket).split("T")[0]}</td>
										<td>{ticket.User_Ticket_ID_UserToUser.Name}</td>
										<td>{ticket.Property.Property}</td>
										<td>
											{!ticket.Resolution && (
												// biome-ignore lint/a11y/useButtonType: <explanation>
												<button
													className="btn btn-xs btn-success m-1 h-auto"
													onClick={() => handleResolution(ticket.ID_Ticket)}
												>
													Dar resolucion
												</button>
											)}
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
