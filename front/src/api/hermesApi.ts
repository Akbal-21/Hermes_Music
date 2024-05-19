import axios from "axios";

const chibalApi = axios.create({
	baseURL: "http://localhost:3000",
});

export default chibalApi;
