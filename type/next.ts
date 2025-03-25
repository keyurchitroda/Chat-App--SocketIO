import { Server as NetServer } from "http";
import { Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

export interface SocketWithServer extends Socket {
  server: SocketServer;
}

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: SocketWithServer;
}
