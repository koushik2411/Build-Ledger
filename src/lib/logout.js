import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function logout() {
    try {
        // Clear server-side cookie
        const response = await fetch("/api/auth/session", {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Unable to end server session.");
        }

        // Sign out from firebase client
        await signOut(auth);

        window.location.href = "/login";
        
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
}