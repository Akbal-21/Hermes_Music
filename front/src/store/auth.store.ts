import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { hermesApi } from "../api";
import type { AuthStatus, User } from "../interface/";

export interface AuthState {
	status: AuthStatus;
	user?: User;

	// Actions
	loginUser: (email: string, password: string) => Promise<User | string>;
	logoutUser: () => void;
}

const storeApi: StateCreator<AuthState> = (set) => ({
	status: "pending",
	user: undefined,

	loginUser: async (Email: string, password: string) => {
		try {
			const { data } = await hermesApi.post("user/login", { Email, password });

			console.log(data);

			if (!data) {
				throw "Error inesperado";
			}
			const { user } = data;

			set({ status: "authorized", user });
			return user;
		} catch (error) {
			if (error instanceof Error) {
				set({ status: "unauthorized", user: undefined });
				return "Error inesperado";
			}
		}
	},
	logoutUser: () => {
		set({ status: "unauthorized", user: undefined });
	},
});

export const useAuthStore = create<AuthState>()(
	devtools(persist(storeApi, { name: "auth-storage" })),
);
