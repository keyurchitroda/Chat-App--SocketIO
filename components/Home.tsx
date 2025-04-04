"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const HomeLayout = () => {
  const router = useRouter();

  return (
    <div className="p-28 py-5 flex flex-col items-center gap-10">
      <Card className="bg-amber-300  w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl underline font-bold">
            Public Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-20 py-0">
          <Button
            onClick={() => router.push("/public/chat")}
            className="w-full h-[80px] cursor-pointer text-1xl"
          >
            Go to public chat
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-300  w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl underline font-bold">
            Group Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-20 py-0">
          <Button
            onClick={() => router.push("/group/chat")}
            className="w-full h-[80px] cursor-pointer text-1xl"
          >
            Go to group chat
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-red-300  w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl underline font-bold">
            Private Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-20 py-0">
          <Button
            onClick={() => router.push("/private/chat")}
            className="w-full h-[80px] cursor-pointer text-1xl"
          >
            Go to private chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeLayout;
