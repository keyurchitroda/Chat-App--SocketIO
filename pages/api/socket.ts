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

  if (!server.io) {
    const io = new SocketIOServer(server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      //   socket.emit("welcome", "Welcoem to the server...!");
      //   socket.broadcast.emit("welcome", "Joined the server...!");

      socket.on("send-message", (data) => {
        console.log("Message received:", data);
        socket.to(data.room).emit("recieve-message", data);
      });

      socket.on("join-room", (room) => {
        socket.join(room);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.io = io;
  }

  res.end();
}
