import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end("Chat server is running!");
});

const wss = new WebSocketServer({ server });



interface User {
  ws: WebSocket;
  username: string;
  roomId: string;
}

let users: User[] = [];

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const parsedData = JSON.parse(message.toString());

    if (parsedData.type === "join") {
      let user = users.find((u) => u.ws === ws);
      if (user) {
        user.roomId = parsedData.roomId;
        user.username = parsedData.username || user.username;
      } else {
        user = {
          ws,
          username: parsedData.username || "Anonymous",
          roomId: parsedData.roomId,
        };
        users.push(user);
      }

      console.log(`${user.username} joined room ${user.roomId}`);

      ws.send(JSON.stringify({
        type: "system",
        event: "joined",
        roomId: user.roomId,
        username: user.username,
        message: `You joined room ${user.roomId}`
      }));

      users
        .filter(u => u.roomId === user!.roomId && u.ws !== ws)
        .forEach(u => {
          if (u.ws.readyState === WebSocket.OPEN) {
            u.ws.send(JSON.stringify({
              type: "system",
              event: "user_joined",
              roomId: user!.roomId,
              username: user!.username,
              message: `${user!.username} joined the room`
            }));
          }
        });
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

    else if (parsedData.type === "leave") {
      users = users.filter((u) => u.ws !== ws);
      console.log(`${parsedData.username} left room ${parsedData.roomId}`);

      users
        .filter(u => u.roomId === parsedData.roomId)
        .forEach(u => {
          if (u.ws.readyState === WebSocket.OPEN) {
            u.ws.send(JSON.stringify({
              type: "system",
              event: "user_left",
              roomId: parsedData.roomId,
              username: parsedData.username,
              message: `${parsedData.username} left the room`
            }));
          }
        });
    }
  });

  ws.on("close", () => {
    const user = users.find((u) => u.ws === ws);
    if (user) {
      console.log(`${user.username} disconnected`);
      users = users.filter((u) => u.ws !== ws);

      users
        .filter(u => u.roomId === user.roomId)
        .forEach(u => {
          if (u.ws.readyState === WebSocket.OPEN) {
            u.ws.send(JSON.stringify({
              type: "system",
              event: "user_left",
              roomId: user.roomId,
              username: user.username,
              message: `${user.username} disconnected`
            }));
          }
        });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
