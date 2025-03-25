"use client";
import React, { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

const HomePage = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [data, setData] = useState("");
  const [joinRoom, setJoinRoom] = useState("");

  const socket: Socket = useMemo(() => {
    return io("/", { path: "/api/socket" }); // ✅ Ensure you return the instance
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id as string);
      console.log("connected form FE side");
    });

    socket.on("welcome", (msg: string) => {
      console.log("message>>>>>>>>>>>>>>>>>>>>", msg, "=========", socket.id);
    });

    socket.on("recieve-message", (data) => {
      console.log("data>>>>>>>>>>>>>>>>>", data);
      setData(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("send-message", { message, room });
    setMessage("");
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    socket.emit("join-room", joinRoom);
    setJoinRoom("");
  };

  return (
    <div>
      <h1>Welcome to socket.io</h1>
      <h3>{socketId}</h3>
      <div>
        <h5>Join room</h5>
        <form onSubmit={handleJoinRoom}>
          <br />
          <input
            type="text"
            value={joinRoom}
            onChange={(e) => setJoinRoom(e.target.value)}
            placeholder="Room"
          />
          <br />
          <button type="submit">Join room</button>
        </form>
        <br />
        <h2>Message Recieved</h2>
        <p>{data}</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <br />
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room"
          />
          <br />
          <button type="submit">Send</button>
        </form>
        <br />
        <h2>Message Recieved</h2>
        <p>{data}</p>
      </div>
    </div>
  );
};

export default HomePage;
