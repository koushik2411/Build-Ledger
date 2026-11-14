import { Suspense } from "react";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";

async function AuthenticatedDashboard({ children }) {
    await connection();

    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return children;
}

export default function DashboardLayout({ children }) {
    return (
        <Suspense fallback={<div className=" min-h-screen flex items-center justify-center text-2xl">Loading...</div>}>
            <AuthenticatedDashboard>

                <Header/>

                {children}
                
            </AuthenticatedDashboard>
        </Suspense>
    );
}