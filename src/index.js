import "./env";
import "./db";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import http from "http";
import cors from "cors";
import passport from "passport";
import socket from "socket.io";
import { apiRouter } from "./routes";

const app = express();
const server = http.Server(app);
const io = socket(server);
const { PORT = 3001 } = process.env;
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.disable("x-powered-by");

io.on("connection", function(event) {
  console.log("Connected");
});

// Adds socket to middleware and makes it useable in routes

app.use("/", apiRouter);

server.listen(PORT, () => {
  console.log("> 🐢 Listening");
});
