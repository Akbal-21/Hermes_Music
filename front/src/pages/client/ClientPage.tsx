import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { hermesApi } from "../../api";
import { SectionContainer } from "../../components/index.components";
import { useAuthStore } from "../../store";
export const ClientPage = () => {
	//

	const navigate = useNavigate();
	const logoutUser = useAuthStore((state) => state.logoutUser);
	const user = useAuthStore((state) => state.user);

	if (user?.Tipo !== "Cliente") {
		logoutUser();
		return <Navigate to="/login" />;
	}

	const [formData, setFormData] = useState<{
		Description: string;
		Date_Ticket: Date;
		ID_User: number;
	}>({
		ID_User: user?.ID_User || 0,
		Description: "",
		Date_Ticket: new Date(Date.now()),
	});

	const handleChange = (name: string, value: string) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSaveData = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formData.Description.length <= 10) {
			return toast.error("La description es muy corta");
		}
		console.log(formData);

		try {
			const { data } = await hermesApi.post("ticket/createTicket", formData);
			if (!data) {
				return toast.error("Error al crear el ticket");
			}
			toast.success("Ticket creado");
			setFormData({
				ID_User: user?.ID_User || 0,
				Description: "",
				Date_Ticket: new Date(Date.now()),
			});
			return;
		} catch (error) {
			if (error instanceof Error) {
				return toast.error(error.message);
			}
		}
		return toast.error("Error en inesperado");
	};

	const handleLogout = () => {
		logoutUser();
		navigate("/login");
	};

	return (
		<SectionContainer className="w-full">
			<Toaster />
			<SectionContainer className="w-full flex justify-center items-center gap-64">
				<h1 className="text-center text-2xl font-bold">Hola {user?.Name}</h1>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button className="btn btn-info" onClick={handleLogout}>
					Cerrar sesion
				</button>
			</SectionContainer>

			<SectionContainer className="w-full">
				<h2 className="text-center text-xl font-bold">Crear un nuevo ticket</h2>
				<SectionContainer className="m-3 mx-48 gap-12">
					<form onSubmit={(e) => handleSaveData(e)}>
						<label className="input input-bordered flex items-center gap-2 m-3 h-48">
							Descripción
							<textarea
								className="textarea textarea-bordered grow w-4xl h-44 resize-none"
								placeholder="Ingrese una descripción"
								name="Description"
								value={formData.Description}
								onChange={(e) => handleChange(e.target.name, e.target.value)}
							/>
						</label>

						<label className="input input-bordered flex items-center gap-2 m-3 ">
							Dia de creacion
							<input
								type="date"
								className="grow disabled:text-white"
								disabled
								value={formData.Date_Ticket.toISOString().split("T")[0]}
							/>
						</label>
						<button
							className="w-full btn btn-primary"
							type="submit"
							disabled={formData.Description.length <= 10}
						>
							Enviar Ticket
						</button>
					</form>
				</SectionContainer>
			</SectionContainer>
		</SectionContainer>
	);
};
