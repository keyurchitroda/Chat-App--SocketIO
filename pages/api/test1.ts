import { NextRequest, NextResponse } from "next/server";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/type/next";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { message: "Welcome new socket" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
