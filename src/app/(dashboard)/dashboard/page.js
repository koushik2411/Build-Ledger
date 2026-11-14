import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";
import { connection } from "next/server";
import Welcome from "@/components/dashboard/Welcome";
import CategoryCards from "@/components/dashboard/CategoryCards";

export async function DashboardContent() {

    await connection();
    const user = await getCurrentUser();

    return (
        <main className=" p-4">

            {/* - - - Welcome Section - - - */}
            <Welcome name={user?.name}/>


            {/* - - - Search bar & Category Cards - - - */}
            <CategoryCards/>


        </main>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div className=" min-h-screen flex items-center justify-center text-2xl">Almost done...</div>}>
            <DashboardContent/>
        </Suspense>
    )
}