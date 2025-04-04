"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Chat from "@/components/shared/Chat";
import InputChat from "@/components/shared/InputChat";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserData } from "@/redux/slices/userSlice";
import { io, Socket } from "socket.io-client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChevronRight, Upload } from "lucide-react";
import { getCookie } from "@/apiConfig/cookies";

const PrivateChatApp = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedUser, setSelectedtUser] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const user: any = getCookie("user");
  const loggedinUser = JSON.parse(user);

  const socket: Socket = useMemo(() => {
    return io("/", { path: "/api/chat" });
  }, []);

  const dispatch = useDispatch<any>();
  const users = useSelector((state: any) => state.userReducer.users);

  useEffect(() => {
    if (!loggedinUser?._id) return;

    socket.emit("startChat", { userId: loggedinUser._id });
    const handleMessage = (data: any) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.off("receive_message_private", handleMessage);
    socket.on("receive_message_private", handleMessage);

    return () => {
      socket.off("receive_message_private", handleMessage);
    };
  }, []);

  useEffect(() => {
    dispatch(getAllUserData());
  }, []);

  const handleStartChat = (user: any) => {
    setMessages([] as any);
    setSelectedtUser(user._id);
  };

  const handleSendMessage = () => {
    const loggedinUser = JSON.parse(user);
    if (inputMessage.trim() === "") return;

    const msgData = {
      recipientId: selectedUser,
      message: inputMessage,
      senderId: loggedinUser._id,
      senderName: `${loggedinUser.firstName} ${loggedinUser.lastName}`,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message_private", msgData);
    setMessages((prev) => [...prev, msgData]);
    setInputMessage("");
  };

  return (
    <div className="p-10 h-screen">
      <h1 className="text-3xl font-semibold">{selectedUser}</h1>
      <h1 className="text-3xl font-semibold">
        {loggedinUser.firstName} {loggedinUser.lastName}
      </h1>
      <div className="flex ">
        <div className="w-[20%]">
          <Card className="">
            <CardContent className="cursor-pointer">
              {users?.data?.length !== 0 &&
                users?.data?.map((item: any) => (
                  <p
                    key={item._id}
                    className={`bg-gray-300 rounded-3xl p-3 hover:bg-amber-100 mb-6 ${
                      item._id === selectedUser && "bg-red-100"
                    }`}
                    onClick={() => handleStartChat(item)}
                  >
                    {item.firstName} {item.lastName}
                  </p>
                ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-[80%] mt-0 pt-0">
          <Card className="">
            <CardContent className="cursor-pointer p-20 py-0">
              <div>
                {messages.map((msg, index) => (
                  <p
                    key={index}
                    className={`flex flex-col
                      ${
                        msg.senderId === loggedinUser?._id
                          ? "text-end"
                          : "text-start"
                      }`}
                  >
                    <strong>
                      {msg.senderId === loggedinUser?._id
                        ? "You"
                        : msg.senderName}
                      :
                    </strong>{" "}
                    <span
                      className={`flex flex-col mb-3 rounded-3xl p-2
                      ${
                        msg.senderId === loggedinUser?._id
                          ? "bg-amber-100 pr-5"
                          : "bg-red-100 pl-5"
                      }`}
                    >
                      {msg.message}
                    </span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="w-full absolute bottom-0 text-xl grid grid-cols-5 gradient md:bg-none md:text-3xl md:flex md:justify-center md:relative">
            <Input
              type="text"
              placeholder="Send Message"
              className="focus:outline-none rounded-2xl p-3 text-primary placeholder-slate-200 col-span-4 gradient md:w-6/12 md:mr-3"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            <div className="flex gap-5">
              <Button
                onClick={handleSendMessage}
                variant="outline"
                size="icon"
                className="cursor-pointer"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChatApp;
