import { NextRequest, NextResponse } from "next/server";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/type/next";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { message: "Welcome to socket learning" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

interface SocketServer extends HttpServer {
  io?: SocketIOServer;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket) return res.status(500).json({ error: "No socket found" });

  const server = res.socket.server as SocketServer;
  const users: any = {};
  const groups: any = {};

  if (!server.io) {
    const io = new SocketIOServer(server, {
      path: "/api/chat",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("send_message", (message) => {
        socket.broadcast.emit("recieve_message", message);
      });

      socket.on("user_typing", (data) => {
        socket.broadcast.emit("user_typing", data);
      });

      socket.on("new_user", (data) => {
        socket.broadcast.emit("new_user", data.user);
      });

      // Private chat

      socket.on("startChat", ({ userId }) => {
        if (!users[userId]) {
          users[userId] = [];
        }

        if (!users[userId].includes(socket.id)) {
          users[userId].push(socket.id);
        }
      });

      socket.on("send_message_private", (data) => {
        const recipientSocketIds = users[data.recipientId];
        if (recipientSocketIds && recipientSocketIds.length > 0) {
          recipientSocketIds.forEach((socketId: any) => {
            io.to(socketId).emit("receive_message_private", data);
          });
        } else {
          console.log("Recipient not found or offline");
        }
      });

      socket.on("disconnect", () => {
        let disconnectedUserId = null;

        for (const userId in users) {
          if (users[userId].includes(socket.id)) {
            disconnectedUserId = userId;
            users[userId] = users[userId].filter((id: any) => id !== socket.id);

            if (users[userId].length === 0) {
              delete users[userId];
            }
          }
        }
      });

      //group chat

      socket.on("join-group", (group) => {
        const { groupId, joinUserId } = group;
        console.log(`User ${socket.id} joined group: ${groupId}`);
        socket.join(groupId);
        io.to(groupId).emit("joined-group", joinUserId);
      });
    });

    server.io = io;
  }

  res.end();
}
