import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import connectDB from "./mongodb";
import UserModel from "@/models/User";
import { cache } from "react";

// Get the currently authenticated and approved user
export const getCurrentUser = cache(async function getCurrentUser() {
    try {
        const cookieStore = await cookies();

        const sessionCookie = cookieStore.get(
            "buildledger_session"
        )?.value;

        if (!sessionCookie) {
            return null;
        }

        // Verify Firebase session and check whether it was revoked
        const decodedToken = await adminAuth.verifySessionCookie(
            sessionCookie,
            true
        );

        await connectDB();

        // Find the corresponding approved MongoDB user
        const user = await UserModel.findOne({
            firebaseUid: decodedToken.uid,
            isApproved: true,
        })
          .select("_id firebaseUid name email householdId role")
          .lean();

        if (!user || !user.householdId) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Authentication Error:", error);
        return null;
    }
})

// Allow access only to admin users
export async function requireAdmin() {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
        return null;
    }

    return user;
}