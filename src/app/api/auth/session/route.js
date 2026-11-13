import { adminAuth } from "@/lib/firebase-admin";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

const COOKIE_NAME = "buildledger_session";
const EXPIRES_IN = 5 * 24 * 60 * 60 * 1000; //5 days

// - - - Create a secure session - - - //
export async function POST(request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID token is required"
                },
                {
                    status: 400
                }
            );
        }

        // Verify Firebase ID token
        const decodedToken = await adminAuth.verifyIdToken(
            idToken,
            true
        );

        // Check whether this user is an approved BuildLedger member
        await connectDB();

        const user = await UserModel.findOne({
            firebaseUid: decodedToken.uid,
            isApproved: true,
        }).select("_id householdId");

        if (!user || !user.householdId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized to access this ledger"
                },
                {
                    status: 403
                }
            );
        }

        // Create Firebase session cookie
        const sessionCookie = await adminAuth.createSessionCookie(
            idToken,
            { expiresIn: EXPIRES_IN }
        );

        const response = NextResponse.json({
            success: true,
            message: "Session created successfully",
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
        console.error("Session Creation Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to create session"
            },
            {
                status: 401
            }
        );
    }
}


// - - - Logout and clear session cookie - - - //
export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully",
    });

    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}