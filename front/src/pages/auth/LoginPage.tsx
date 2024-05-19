import { useState, type FormEvent } from "react";
import { CiUser } from "react-icons/ci";
import { GrMail } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { SectionContainer } from "../../components/index.components";
import type { User } from "../../interface";
import { useAuthStore } from "../../store";
import { isValidEmail } from "../../utils/validations";

export const LoginPage = () => {
	//

	const loginUser = useAuthStore((state) => state.loginUser);

	const navigate = useNavigate();

	const [dataUser, setDataUser] = useState<{
		Email: string;
		password: string;
	}>({
		Email: "",
		password: "",
	});

	const handleChange = (name: string, value: string) => {
		setDataUser((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const sendData = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(isValidEmail(dataUser.Email));

		if (!isValidEmail(dataUser.Email) || dataUser.password.length <= 6) {
			toast.error("Todos los campos son obligatorios");
			return;
		}
		console.log("pasa");

		try {
			const data: string | User = await loginUser(
				dataUser.Email,
				dataUser.password,
			);

			console.log(data);

			if (typeof data === "string") {
				return toast.error(data);
			}
			console.log(data);

			if (data.Tipo === "Cliente") {
				navigate("/cliente");
			}
			console.log("Hola");

			if (data.Tipo === "Administrador") {
				navigate("/admin");
			}

			if (data.Tipo === "Tecnico") {
				navigate("/technician");
			}

			return toast.success("Acceso exitoso");
		} catch (error) {
			toast.error("No se puede acceder");
		}
		return toast.error("Error inesperado");
	};

	return (
		<SectionContainer>
			<Toaster />
			<SectionContainer className="content-center">
				<h1 className="text-4xl text-center">Inicio de sesion</h1>
			</SectionContainer>
			<SectionContainer className="mx-52">
				<form onSubmit={(e) => sendData(e)}>
					<label className="input input-bordered flex items-center gap-2 m-3">
						<GrMail />
						<input
							type="text"
							className="grow"
							placeholder="Correo"
							name="Email"
							onChange={(e) => handleChange(e.target.name, e.target.value)}
						/>
					</label>
					<label className="input input-bordered flex items-center gap-2 m-3">
						<CiUser />
						<input
							type="password"
							className="grow"
							placeholder="*****"
							name="password"
							onChange={(e) => handleChange(e.target.name, e.target.value)}
						/>
					</label>

					<button
						className="w-full btn btn-accent"
						type="submit"
						disabled={
							dataUser.Email.length < 0 || dataUser.password.length <= 6
						}
					>
						Iniciar sesion
					</button>
				</form>
			</SectionContainer>
		</SectionContainer>
	);
};
