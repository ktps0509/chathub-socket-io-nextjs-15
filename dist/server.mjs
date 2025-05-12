"use strict";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";
const dev = process.env.NODE_ENV !== "production";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3000";
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    let allClients = [];
    const httpServer = createServer(handle);
    const io = new SocketIOServer(httpServer);
    io.on("connection", (socket) => {
        allClients.push(socket);
        socket.on("join-room", ({ room, username }) => {
            socket.join(room);
            socket.to(room).emit("user-joined", `${username} has joined the room.`);
        });
        socket.on("message", ({ room, message, sender }) => {
            socket.to(room).emit("message", { sender, message });
        });
        socket.on("disconnect", () => {
            let i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });
    });
    httpServer.listen(port, () => {
        console.log(`> Ready on https://${host}:${port}`);
    });
});
