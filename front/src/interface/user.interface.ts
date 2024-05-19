export interface User {
	ID_User: number;
	Name: string;
	Email: string;
	Tipo: "Cliente" | "Tecnico" | "Administrador";
}

export type AuthStatus = "authorized" | "unauthorized" | "pending";
