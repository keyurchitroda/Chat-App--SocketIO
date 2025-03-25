import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignupChat = ({ user, socket, input, setInput }: any) => {
  const addUser = () => {
    user.current = { name: input, id: socket.id };
    socket.emit("new_user", { user: input });
    setInput("");
  };

  return (
    <div className="w-full h-full flex flex=col items-center justify-center bg-gray-300">
      <div className="text-center grid grid-rows-3 gap-2  p-8 rounded-md">
        <h1 className="text-6xl font-bold text-blue-700 ">Chat App</h1>
        <h2 className="text-1xl text-blue-400">Enter you name to join</h2>
        <Input
          type="text"
          className="text-2xl text-center rounded-md p-2 my-2 text-black-600 placeholder-blue-300 border-blue-700"
          placeholder="Enter name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addUser()}
        />
        <Button
          className={`text-xl w-full text-white font-bold py-2 px-3 rounded-md ${
            input ? "bg-blue-700" : "bg-slate-400"
          }`}
          disabled={!input}
          onClick={addUser}
        >
          Join Chat
        </Button>
      </div>
    </div>
  );
};

export default SignupChat;
