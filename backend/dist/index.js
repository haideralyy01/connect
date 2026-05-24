import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let users = [];
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const parsedData = JSON.parse(message.toString());
        if (parsedData.type === "create") {
            const newUser = {
                ws,
                username: parsedData.username || "Anonymous",
                roomId: parsedData.roomId,
            };
            users.push(newUser);
            console.log(`${newUser.username} created room ${newUser.roomId}`);
        }
        else if (parsedData.type === "join") {
            const user = users.find((u) => u.ws === ws);
            if (user) {
                user.roomId = parsedData.roomId;
                console.log(`${user.username} joined room ${parsedData.roomId}`);
            }
            else {
                users.push({
                    ws,
                    username: parsedData.username || "Anonymous",
                    roomId: parsedData.roomId,
                });
                console.log(`${parsedData.username} joined room ${parsedData.roomId}`);
            }
        }
        else if (parsedData.type === "chat") {
            const roomUsers = users.filter((u) => u.roomId === parsedData.roomId);
            roomUsers.forEach((u) => {
                if (u.ws.readyState === WebSocket.OPEN) {
                    u.ws.send(JSON.stringify({
                        type: "chat",
                        roomId: parsedData.roomId,
                        username: parsedData.username,
                        message: parsedData.message,
                    }));
                }
            });
        }
    });
    ws.on("close", () => {
        users = users.filter((u) => u.ws !== ws);
        console.log("User disconnected");
    });
});
//# sourceMappingURL=index.js.map