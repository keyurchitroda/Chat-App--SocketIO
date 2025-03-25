"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";
import Chat from "./shared/Chat";
import InputChat from "./shared/InputChat";
import SignupChat from "./shared/SignupChat";

const ChatApp = () => {
  const user = useRef(null);
  const [chat, setChat] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState<any[]>([]);

  const socket: Socket = useMemo(() => {
    return io("https://keyurs-chat-app.vercel.app", { path: "/api/chat" });
  }, []);

  console.log("socket>>>>>>>>>>>>>>>>", socket);

  useEffect(() => {
    console.log("call useeffect");
    socket.on("recieve_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on("user_typing", (data) => {
      if (!user.current) return;
      setTyping((prev) => {
        if (typing.includes(data.user) && data.typing === true) return prev;
        if (data.typing === false) {
          return prev.filter((u) => u !== data.user);
        } else {
          return [...prev, data.user];
        }
      });
    });

    socket.on("new_user", (newUser) => {
      if (!user.current) return;
      setChat((prev) => [
        ...prev,
        { content: `${newUser} joined`, type: "server" },
      ]);
    });

    return () => {
      socket.off("recieve_message");
      socket.off("new_user");
      socket.off("user_typing");
    };
  });

  return (
    <main className="h-screen max-h-screen max-w-screen mx-auto md:container md:p-20 md:pt-4">
      {user.current ? (
        <>
          {" "}
          <Chat chat={chat} user={user.current} typing={typing} />
          <InputChat
            setChat={setChat}
            user={user.current}
            socket={socket}
            setTyping={setTyping}
          />
        </>
      ) : (
        <SignupChat
          user={user}
          socket={socket}
          input={input}
          setInput={setInput}
        />
      )}
    </main>
  );
};

export default ChatApp;
