import express, { Application } from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import healthRoutes from "./routes/healthRoute";
import playerRoutes from "./routes/playerRoute";
import teamRoutes from "./routes/teamRoute";
import positionRouter from "./routes/positionRoute";

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/webmob", healthRoutes);
app.use("/webmob", playerRoutes);
app.use("/webmob", teamRoutes);
app.use("/webmob", positionRouter)

app.use(errorHandler);

export default app;