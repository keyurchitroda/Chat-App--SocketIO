"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserData } from "@/redux/slices/userSlice";
import { createGroupService } from "@/services/groupService";
import { getCookie } from "@/apiConfig/cookies";
import toast from "react-hot-toast";
import { getAllGroups } from "@/redux/slices/groupSlice";

const Group = () => {
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [groupName, setGroupName] = useState("");
  const dispatch = useDispatch<any>();
  const users = useSelector((state: any) => state.userReducer.users);
  const groups = useSelector((state: any) => state.groupReducer.groups);
  const user: any = getCookie("user");
  const loggedinUser = JSON.parse(user);
  useEffect(() => {
    dispatch(getAllUserData());
    dispatch(getAllGroups());
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreatGroup = async () => {
    try {
      const body = {
        group_name: groupName,
        joined_user: selectedIds,
        created_by: loggedinUser?._id,
      };
      const response: any = await createGroupService(body);
      if (response.success) {
        toast.success(response.message);
        setOpenAddGroupModal(false);
        dispatch(getAllGroups());
      }
    } catch (error: any) {
      console.log("handleCreatGroup>>>>", error);
    }
  };

  const renderGroupDialogue = () => {
    return (
      <Dialog open={openAddGroupModal}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Group Name
              </Label>
              <Input
                id="name"
                placeholder="Group Name"
                className="col-span-3"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Choose Members</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto h-40">
                  {users?.data?.length !== 0 &&
                    users?.data?.map((item: any) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-2 pb-2 "
                      >
                        <Checkbox
                          id="terms"
                          onCheckedChange={() => handleCheckboxChange(item._id)}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.firstName} {item.lastName}
                        </label>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => handleCreatGroup()}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const handleJoinGroup = () => {
    const currentUser = loggedinUser?._id;
  };

  return (
    <div className="p-20">
      <div className="pb-8 flex justify-end">
        <Button onClick={() => setOpenAddGroupModal(true)}>Add Group</Button>
      </div>
      <div className="w-full">
        {groups?.length > 0 &&
          groups.map((item: any, index: number) => (
            <Card key={index} className="mt-5">
              <CardHeader>
                <CardTitle>{item.group_name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-3">
                    {item.joined_user.map((item: any, index: number) => (
                      <Avatar key={index}>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-500 font-bold">
                  Created by : {item.created_by.firstName}{" "}
                  {item.created_by.lastName}
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleJoinGroup()}>Join Group</Button>
              </CardFooter>
            </Card>
          ))}
      </div>
      {openAddGroupModal && renderGroupDialogue()}
    </div>
  );
};

export default Group;
