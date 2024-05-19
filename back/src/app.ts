import cors from "cors";
import express from "express";
import morgan from "morgan";
import { ticket, user } from "./routes/index.route";

//Setting --------------------------------
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("case sensitive routing", true);
//midelware-----------

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//routes-----------
app.use("/ticket", ticket);
app.use("/user", user);

//Server runing --------------------------------
app.listen(app.get("port"), () => {
	console.log("server running on port", app.get("port"));
});
