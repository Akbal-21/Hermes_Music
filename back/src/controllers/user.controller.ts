import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { connection, disconnect, prisma } from "../db";
import type { Tecnico, User, UserLogin } from "../interface/index.interface";
import { isValidEmail } from "../utils/index.urils";

type Data =
	| {
			message: string;
	  }
	| {
			user: { ID_User: number; Name: string; Email: string; Tipo: string };
	  }
	| {
			userdb: Tecnico[];
	  };

export const createClient = async (req: Request, res: Response<Data>) => {
	const { Name, Email, Password } = req.body as {
		Name: string;
		Email: string;
		Password: string;
	};

	if (Name.length <= 6) {
		return res.status(400).json({ message: "El nombre es demasiado corto" });
	}

	if (!isValidEmail(Email)) {
		return res.status(404).json({ message: "El correo no es valido" });
	}

	if (Password.length <= 6) {
		return res
			.status(400)
			.json({ message: "La contraseña es demasiado corta" });
	}

	const pass = bcrypt.hashSync(Password);

	try {
		await connection;

		const client: User = await prisma.user.create({
			data: {
				Name,
				Email,
				Password: pass,
				ID_Type: 1,
			},
		});

		await disconnect;

		if (!client) {
			return res.status(400).json({ message: "Error al crear al cliente" });
		}

		console.log(client);

		return res.status(200).json({ message: "Cliente creado con exito" });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al crear al cliente" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const createAdmin = async (req: Request, res: Response<Data>) => {
	const { Name, Email, Password } = req.body as {
		Name: string;
		Email: string;
		Password: string;
	};

	if (Name.length <= 6) {
		return res.status(400).json({ message: "El nombre es demasiado corto" });
	}

	if (!isValidEmail(Email)) {
		return res.status(404).json({ message: "El correo no es valido" });
	}

	if (Password.length <= 6) {
		return res
			.status(400)
			.json({ message: "La contraseña es demasiado corta" });
	}

	const pass = bcrypt.hashSync(Password);

	try {
		await connection;

		const client: User = await prisma.user.create({
			data: {
				Name,
				Email,
				Password: pass,
				ID_Type: 3,
			},
		});

		await disconnect;

		if (!client) {
			return res
				.status(400)
				.json({ message: "Error al crear al administrador" });
		}

		return res
			.status(200)
			.json({ message: "El administrador se creo con exito" });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al crear al tecnico" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const createTechnican = async (req: Request, res: Response<Data>) => {
	const { Name, Email, Password } = req.body as {
		Name: string;
		Email: string;
		Password: string;
	};

	if (Name.length <= 6) {
		return res.status(400).json({ message: "El nombre es demasiado corto" });
	}

	if (!isValidEmail(Email)) {
		return res.status(404).json({ message: "El correo no es valido" });
	}

	if (Password.length <= 6) {
		return res
			.status(400)
			.json({ message: "La contraseña es demasiado corta" });
	}

	const pass = bcrypt.hashSync(Password);

	try {
		await connection;

		const client: User = await prisma.user.create({
			data: {
				Name,
				Email,
				Password: pass,
				ID_Type: 2,
			},
		});

		await disconnect;

		if (!client) {
			return res.status(400).json({ message: "Error al crear al tecnico" });
		}

		return res.status(200).json({ message: "El tecnico se creo con exito" });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al crear al tecnico" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const loginUser = async (req: Request, res: Response<Data>) => {
	console.log(req.body);

	const { Email, password } = req.body as { Email: string; password: string };

	if (password.length <= 6) {
		return res.status(400).json({ message: "Contraseña no valida." });
	}

	if (!isValidEmail(Email)) {
		return res.status(400).json({ message: "Correo no valido." });
	}

	try {
		await connection;

		const userdb: UserLogin | null = await prisma.user.findUnique({
			where: {
				Email,
			},
			select: {
				ID_User: true,
				Name: true,
				Password: true,
				Type_User: true,
			},
		});

		await disconnect;

		if (!userdb) {
			return res
				.status(404)
				.json({ message: "usuario o contraseña no validos." });
		}

		const { ID_User, Name, Type_User, Password } = userdb;
		const { Tipo } = Type_User;

		if (!bcrypt.compareSync(password, Password)) {
			return res
				.status(400)
				.json({ message: "usuario o contraseña no validos." });
		}

		return res.status(200).json({ user: { ID_User, Name, Email, Tipo } });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al iniciar sesion" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};

export const getAllTechnicans = async (req: Request, res: Response<Data>) => {
	try {
		await connection;

		const userdb: Tecnico[] = await prisma.user.findMany({
			where: {
				ID_Type: 2,
			},
			select: {
				ID_User: true,
				Name: true,
			},
		});

		await disconnect;

		if (!userdb) {
			return res
				.status(404)
				.json({ message: "usuario o contraseña no validos." });
		}

		console.log(userdb);

		return res.status(200).json({ userdb });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: "Error al iniciar sesion" });
		}
	}
	return res.status(400).json({ message: "Error inseperado" });
};
