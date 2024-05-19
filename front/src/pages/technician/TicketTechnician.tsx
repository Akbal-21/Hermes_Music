import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { hermesApi } from "../../api";
import { SectionContainer } from "../../components/index.components";
import type { GetTicketByID } from "../../interface";
import { useAuthStore } from "../../store";

export const TicketTechnician = () => {
	//

	const logoutUser = useAuthStore((state) => state.logoutUser);
	const user = useAuthStore((state) => state.user);

	if (user?.Tipo !== "Tecnico") {
		logoutUser();
		return <Navigate to="/login" />;
	}

	const status = ["Creado", "Proceso", "Cerrado", "Cancelado"];

	const [data, setData] = useState<GetTicketByID>();
	const [updateData, setUpdateData] = useState({
		resoult: "",
		estado: "",
	});

	const navigate = useNavigate();

	const { ID_Ticket } = useParams();

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await hermesApi.get(`/ticket/getTicketByID/${ID_Ticket}`);

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
				setUpdateData({
					resoult: "",
					estado: getTicketById.Status.Status,
				});
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

	const handleChange = (name: string, value: string) => {
		setUpdateData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};
	const handleSaveData = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(updateData);
		if (updateData.resoult.length <= 10) {
			return toast.error("La descripción es muy corta");
		}

		try {
			const { data } = await hermesApi.put(
				`/ticket/updateStatusResolution/${ID_Ticket}`,
				updateData,
			);

			if (!data) {
				return toast.error("Error al actualizar el ticket");
			}

			toast.success("Ticket actualizado");
			navigate("/technician");
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
				<form onSubmit={(e) => handleSaveData(e)}>
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

					<label className="input input-bordered flex items-center gap-2 m-3 h-48">
						Resolucion
						<textarea
							className="textarea textarea-bordered grow w-4xl h-44 resize-none disabled:text-white"
							name="resoult"
							onChange={(e) => handleChange(e.target.name, e.target.value)}
							value={updateData.resoult}
						/>
					</label>
					<button className="btn btn-primary w-full" type="submit">
						Enviar resolucion
					</button>
				</form>
			</SectionContainer>
		</SectionContainer>
	);
};
