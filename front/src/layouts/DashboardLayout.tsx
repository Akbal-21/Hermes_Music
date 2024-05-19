import { Navigate, Outlet } from "react-router-dom";
import { SectionContainer } from "../components/index.components";
import { useAuthStore } from "../store";

export const DashboardLayout = () => {
	const authSate = useAuthStore((state) => state.status);

	if (authSate === "pending") {
		return <SectionContainer>Loading...</SectionContainer>;
	}

	if (authSate === "unauthorized") {
		return <Navigate to="/login" />;
	}

	return (
		<SectionContainer>
			<Outlet />
		</SectionContainer>
	);
};
