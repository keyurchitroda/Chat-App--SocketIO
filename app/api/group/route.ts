import User from "@/lib/database/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Group from "@/lib/database/models/group.model";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const group = await Group.find()
      .populate("joined_user")
      .populate("created_by");
    return NextResponse.json(
      { message: "Group fetched successfully", success: true, data: group },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { group_name } = reqBody;
    const grpup = await Group.findOne({ group_name: group_name });

    if (grpup) {
      return NextResponse.json(
        { message: "Group already exists", success: false, data: null },
        { status: 400 }
      );
    }

    const groupCreated = await Group.create(reqBody);
    return NextResponse.json(
      {
        message: "Grpup created successfully",
        success: true,
        data: groupCreated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false, data: null },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { group_id, joined_user } = reqBody;
    const group: any = await Group.find();
    const allExist = group.joined_user.every((item: any) =>
      joined_user.includes(item)
    );

    if (allExist) {
      return NextResponse.json(
        {
          message: "You already joined thi group",
          success: false,
        },
        { status: 401 }
      );
    }

    const groupCreated = await Group.findByIdAndUpdate(group_id, reqBody);
    return NextResponse.json(
      {
        message: "Grpup created successfully",
        success: true,
        data: groupCreated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false, data: null },
      { status: 500 }
    );
  }
}
