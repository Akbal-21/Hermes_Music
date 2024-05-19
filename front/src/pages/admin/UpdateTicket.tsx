import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { hermesApi } from "../../api";
import { SectionContainer } from "../../components/SectionContainer";
import type { GetTicketByID } from "../../interface";
import { useAuthStore } from "../../store";

export const UpdateTicket = () => {
	//

	const [updateData, setUpdateData] = useState<{
		id_tecnico: number;
		tecnico: string;
		estado: string;
		prioridad: string;
	}>({
		id_tecnico: 0,
		tecnico: "",
		estado: "",
		prioridad: "",
	});

	const { ID_Ticket } = useParams();

	const status = ["Creado", "Proceso", "Cerrado", "Cancelado"];
	const property = ["Alta", "Media", "Baja", "Pendiente de asignar"];

	const navigate = useNavigate();

	const logoutUser = useAuthStore((state) => state.logoutUser);
	const user = useAuthStore((state) => state.user);

	if (user?.Tipo !== "Administrador") {
		logoutUser();
		return <Navigate to="/login" />;
	}

	const [tec, setTec] = useState<
		{
			ID_User: number;
			Name: string;
		}[]
	>([
		{
			ID_User: 0,
			Name: "",
		},
	]);
	const [data, setData] = useState<GetTicketByID>();

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await hermesApi.get(`/ticket/getTicketByID/${ID_Ticket}`);

				console.log(res.data);

				if (!res.data) {
					toast.error("Error en la petición");
					return (
						<>
							<h1>Lo sentimos no podemos cargar la pagina</h1>
						</>
					);
				}

				const { getTicketById } = res.data;

				setData(getTicketById);

				const technician = await hermesApi.get("/user/getAllTechnicans");

				const { userdb } = technician.data;

				setTec(userdb);

				const { User_Ticket_ID_TechnicianToUser, Status, Property } =
					getTicketById;

				setUpdateData({
					id_tecnico: 0,
					tecnico: "",
					estado: Status.Status,
					prioridad: Property.Property,
				});

				const { Name, ID_User } = User_Ticket_ID_TechnicianToUser;

				if (getTicketById.User_Ticket_ID_TechnicianToUser != null) {
					console.log("a");

					setUpdateData({
						id_tecnico: ID_User,
						tecnico: Name,
						estado: Status.Status,
						prioridad: Property.Property,
					});

					// console.log(updateData);

					toast.success("Se Cargaron los datos");
					return;
				}

				if (getTicketById.User_Ticket_ID_TechnicianToUser === null) {
					console.log("a");
				}
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
	}, [ID_Ticket]);

	const handleChange = (name: string, value: string, id_tecnico?: number) => {
		if (name === "tecnico") {
			if (!id_tecnico) {
				return;
			}
			setUpdateData((prevFormData) => ({
				...prevFormData,

				[name]: value,
			}));
			setUpdateData((prevFormData) => ({
				...prevFormData,
				id_tecnico: id_tecnico,
			}));
		}
		setUpdateData((prevFormData) => ({
			...prevFormData,

			[name]: value,
		}));
	};

	const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (updateData.tecnico === "") {
			return toast.error("Es requerido asignar un tecnico");
		}
		console.log(updateData);

		try {
			const { data } = await hermesApi.put(
				`/ticket/updateTicket/${ID_Ticket}`,
				updateData,
			);

			if (!data) {
				return toast.error("Error al actualizar el ticket");
			}

			toast.success("Ticket actualizado");
			navigate("/admin");
			return;
		} catch (error) {
			if (error instanceof Error) {
				return toast.error(error.message);
			}
		}
		return toast.error("Error en inesperado");
	};

	return (
		<SectionContainer>
			<Toaster />
			<SectionContainer>
				<h1 className="text-center text-3xl font-bold">Ticket {ID_Ticket}</h1>
			</SectionContainer>
			<SectionContainer className="mx-40">
				<form onSubmit={(e) => handleUpdate(e)}>
					<label className="input input-bordered flex items-center gap-2 m-3 ">
						Cliente
						<input
							type="text"
							className="grow disabled:text-white"
							value={data?.User_Ticket_ID_UserToUser.Name}
							disabled
						/>
					</label>

					<label className="input input-bordered flex items-center gap-2 m-3 ">
						Fecha de cracion
						<input
							type="calendar"
							className="grow disabled:text-white"
							value={String(data?.Date_Ticket).split("T")[0]}
							disabled
						/>
					</label>

					<label className="input input-bordered flex items-center gap-2 m-3 h-48">
						Descripción
						<textarea
							className="textarea textarea-bordered grow w-4xl h-44 resize-none disabled:text-white"
							name="Description"
							value={data?.Description}
							disabled
						/>
					</label>

					<label className="input input-bordered flex items-center gap-2 m-3 h-auto">
						Tecnico
						<div className="dropdown dropdown-top w-full">
							<div tabIndex={0} role="button" className="btn m-1 w-full">
								{updateData.tecnico.length <= 0
									? "Por favor Ingrese un tecnico"
									: updateData.tecnico}
							</div>
							<ul
								// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
								tabIndex={0}
								className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								{tec.map((tenic, index) => {
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<li key={index}>
											<a
												// biome-ignore lint/a11y/useValidAnchor: <explanation>
												onClick={() =>
													handleChange("tecnico", tenic.Name, tenic.ID_User)
												}
											>
												{tenic.Name}
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					</label>

					<label className="input input-bordered flex items-center gap-2 m-3 h-auto">
						Estado
						<div className="dropdown dropdown-top w-full">
							<div tabIndex={0} role="button" className="btn m-1 w-full">
								{updateData.estado}
							</div>
							<ul
								// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
								tabIndex={0}
								className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								{status.map((estado, index) => {
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<li key={index}>
											{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
											<a onClick={() => handleChange("estado", estado)}>
												{estado}
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					</label>

					<label className="input input-bordered flex items-center gap-2 m-3 h-auto">
						Prioridad
						<div className="dropdown dropdown-top w-full">
							<div tabIndex={0} role="button" className="btn m-1 w-full">
								{updateData.prioridad}
							</div>
							<ul
								// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
								tabIndex={0}
								className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								{property.map((prioridad, index) => {
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<li key={index}>
											{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
											<a onClick={() => handleChange("prioridad", prioridad)}>
												{prioridad}
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					</label>

					<button className="btn btn-primary w-full" type="submit">
						Enviar resolucion
					</button>
				</form>
			</SectionContainer>
		</SectionContainer>
	);
};
