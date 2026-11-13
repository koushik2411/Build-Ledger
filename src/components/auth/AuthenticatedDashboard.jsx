import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Header from "../layout/Header";

export default async function AuthenticatedDashboard({ children }) {
    await connection();

    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            <Header user={user}/>
            {children}
        </>
    );
}