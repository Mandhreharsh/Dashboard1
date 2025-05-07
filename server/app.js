import "dotenv/config";
import express from "express";
import cors from "cors";
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRouter from "./router/messageRouter.js" ;
import {errorMiddleware} from './middlewares/errorMiddleware.js';
import userRouter from './router/userRouter.js';
import  appointmentRouter  from "./router/appointmentRouter.js";
import prescriptionRoutes from "./router/prescriptionRoutes.js";
import authRoutes from "./router/DashboardRoutes.js";
import appointmentRoutes from "./router/appointmentRouter.js";

const app = express();
config({path: ".env"});

const allowedOrigins = [
    "https://dashboard1-psi-nine.vercel.app"
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
})
);

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/v1/appointment", appointmentRoutes);



app.get("/", (req, res) => {
    res.send("Server is running...");
  });

app.use(errorMiddleware);

export default app;
