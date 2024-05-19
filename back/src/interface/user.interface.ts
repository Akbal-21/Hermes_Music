export interface User {
	ID_User: number;
	Name: string;
	Email: string;
	Password: string;
	ID_Type: number;
}

export interface UserLogin {
	ID_User: number;
	Name: string;
	Password: string;
	Type_User: {
		ID_Type: number;
		Tipo: string;
	};
}

export interface Tecnico {
	ID_User: number;
	Name: string;
}
