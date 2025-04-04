"use client";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { ChevronRight, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Socket } from "socket.io-client";

interface Param {
  user?: any | null;
  socket?: Socket;
  setChat: React.Dispatch<React.SetStateAction<any[]>>;
  setTyping?: React.Dispatch<React.SetStateAction<any[]>>;
}

const InputChat = ({ user, socket, setChat, setTyping }: Param) => {
  const [input, setInput] = useState("");
  const uploadImageRef: any = useRef(null);

  const userTyping = (e: any) => {
    setInput(e.target.value);
    socket?.emit("user_typing", {
      user: user.name,
      typing: e.target.value ? true : false,
    });
  };

  const sendMessage = () => {
    if (input) {
      const msg = { content: input, type: "text", user };
      socket?.emit("send_message", msg);
      socket?.emit("user_typing", { user: user.name, typing: false });
      setChat((prev) => [...prev, msg]);
      setInput("");
    }
  };

  const openImageUpload = () => {
    if (uploadImageRef.current) {
      uploadImageRef.current?.click();
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const img = URL.createObjectURL(file);
      console.log("img>>>>>>>>>>>>>>>>.", img);
      const msg = { content: img, type: "image", user };
      setChat((prev) => [...prev, msg]);
      socket?.emit("send_message", msg);
    }
  };

  return (
    <div className="w-full absolute bottom-0 text-xl grid grid-cols-5 gradient md:bg-none md:text-3xl md:flex md:justify-center md:relative">
      <Input
        type="text"
        placeholder="Send Message"
        className="focus:outline-none rounded-2xl p-3 text-primary placeholder-slate-200 col-span-4 gradient md:w-6/12 md:mr-3"
        value={input}
        onChange={(e) => userTyping(e)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <Input
        type="file"
        className="hidden"
        ref={uploadImageRef}
        onChange={(e) => handleImageUpload(e)}
      />
      <div className="flex gap-5">
        <Button
          onClick={openImageUpload}
          variant="outline"
          size="icon"
          className="cursor-pointer"
        >
          <Upload />
        </Button>
        <Button
          onClick={sendMessage}
          variant="outline"
          size="icon"
          className="cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default InputChat;
