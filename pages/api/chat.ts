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
    // const io = new SocketIOServer(server, {
    //   path: "/api/chat",
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"],
    //     credentials: true,
    //   },
    // });

    const io = new SocketIOServer(server, {
      path: "/socket.io/",
      cors: {
        origin: "https://keyurs-chat-app.vercel.app",
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
    });

    server.io = io;
  }

  res.end();
}
