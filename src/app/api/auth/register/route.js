import { adminAuth } from "@/lib/firebase-admin";
import connectDB from "@/lib/mongodb";
import HouseholdModel from "@/models/Household";
import UserModel from "@/models/User";
import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const COOKIE_NAME = "buildledger_session";
const EXPIRES_IN = 5 * 24 * 60 * 60 * 1000;

function hasInvitationKey(key) {
  return createHash("sha256").update(key).digest();
}

function isValidInvitationKey(inputKey, storedHash) {
  if (!inputKey || !storedHash) {
    return false;
  }

  const inputHash = hasInvitationKey(inputKey);
  const savedHash = Buffer.from(storedHash, "hex");

  if (inputHash.length !== savedHash.length) {
    return false;
  }

  return timingSafeEqual(inputHash, savedHash);
}

export async function POST(request) {
  try {
    const { name, invitationKey, idToken } = await request.json();

    // Validate request data
    if (
      typeof name !== "string" ||
      typeof invitationKey !== "string" ||
      typeof idToken !== "string" ||
      !name.trim() ||
      !invitationKey.trim() ||
      !idToken
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, invitation key and ID token are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Verify Firebase identity
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);

    if (!decodedToken.email) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid email address is required."
        },
        {
          status: 403
        }
      );
    }

    await connectDB();

    // Check if this Firebase account is already registered
    const existingUser = await UserModel.findOne({
      firebaseUid: decodedToken.uid,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This account is already registered.",
        },
        {
          status: 400,
        },
      );
    }

    // Find household and retrieve its invitation key hash
    const households = await HouseholdModel.find()
    .select("+invitationKeyHash")
    .lean();

const inputKey = invitationKey.trim();

const inputHash = hasInvitationKey(inputKey).toString("hex");

console.log("Households found:", households.length);
console.log("Input key length:", inputKey.length);
console.log("Stored hash exists:", Boolean(households[0]?.invitationKeyHash));
console.log(
    "Hash matches:",
    households.some((item) => item.invitationKeyHash === inputHash)
);

const household = households.find((item) =>
    isValidInvitationKey(inputKey, item.invitationKeyHash)
);

    if (!household) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid household invitation key.",
        },
        {
          status: 403,
        },
      );
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(
      idToken,
      { expiresIn: EXPIRES_IN }
    );

    // Create mongodb viewer account
    const newUser = await UserModel.create({
      firebaseUid: decodedToken.uid,
      name: name.trim(),
      email: decodedToken.email.toLowerCase(),
      householdId: household._id,
      role: "viewer",
      isApproved: true,
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    response.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EXPIRES_IN / 1000,
    });

    return response;
  } catch (error) {
    console.error("Registration Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
