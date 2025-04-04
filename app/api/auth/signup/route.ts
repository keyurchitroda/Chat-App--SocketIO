import User from "@/lib/database/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptJS from "bcryptjs";
import { connectToDatabase } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connectToDatabase();

    if (userId) {
      const userDetails = await User.findById(userId);
      return NextResponse.json(
        {
          message: "User fetched successfully",
          success: true,
          data: userDetails,
        },
        { status: 200 }
      );
    } else {
      const users = await User.find();
      return NextResponse.json(
        { message: "User fetched successfully", success: true, data: users },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { username, email, password, firstName, lastName } = reqBody;
    const user = await User.findOne({ email: email });

    if (user) {
      return NextResponse.json(
        { message: "User already exists", success: false, data: null },
        { status: 400 }
      );
    }
    const salt = await bcryptJS.genSalt(10);
    const hashedPassword = await bcryptJS.hash(password, salt);
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    };
    const userCreated = await User.create(newUser);
    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        data: userCreated,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required for deletion" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
        success: true,
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}
