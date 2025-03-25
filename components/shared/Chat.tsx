import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Message from "./Messages/Message";

interface Param {
  chat: any[];
  user: any | null;
  typing: any[];
}

const Chat = ({ chat, user, typing }: Param) => {
  console.log("typing>>>>>>>>>>>>>>>>", chat);
  return (
    <div className="h-full pb-12 md:p-4">
      <div className="w-full h-full max-h-screen rounded-md overflow-y-auto gradient pt-2 md:pt-6">
        <Card className="w-full h-full max-h-screen rounded-md overflow-y-auto gradient pt-2 md:pt-6">
          <CardHeader>
            <CardTitle>Group Name</CardTitle>
          </CardHeader>
          <CardContent>
            {chat.map((message, index) => {
              message = { ...message, own: message.user?.id === user?.id };
              console.log("message>>>>>>>>>>>>>>>>>.", message);
              return message.type === "server" ? (
                <p key={index} className="px-1 md:px-6 py-1 flex">
                  <span className="text-xl md:text-3xl text-red-400 flex bg-transparent">
                    {message.content}
                  </span>
                </p>
              ) : (
                <Message key={index} {...message} />
              );
            })}
            {typing[0] && (
              <div className="px-1 md:px-6 py-1 flex">
                <span className="logo text-2xl bg-blue-600 text-white rounded-full py-2 my-auto text-center px-4 mr-2 flex items-center">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
                <div className="loader">
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
