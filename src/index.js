import "./env";
import "./db";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import http from 'http';
import cors from "cors";
import passport from "passport";
import { apiRouter } from "./routes";
import socket from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socket(server);
app.use((req, res, next) => {
    req.io = io;
    next();
  });
let {PORT} = process.env;
if(PORT === null)
{
    PORT = 3001
}
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.disable("x-powered-by");



io.on('connection', function(socket) {
    console.log("Connected");
});

//Adds socket to middleware and makes it useable in routes


app.use("/", apiRouter);

server.listen(PORT, () => {
    console.log("> 🐢 Listening")
});
