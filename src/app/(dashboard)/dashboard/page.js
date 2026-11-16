import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";
import { connection } from "next/server";
import Welcome from "@/components/dashboard/Welcome";
import CategoryCards from "@/components/dashboard/CategoryCards";
import ExpenseModel from "@/models/Expense";
import connectDB from "@/lib/mongodb";

export async function DashboardContent() {

    await connection();
    await connectDB();
    const user = await getCurrentUser();

    const expenseResult = await ExpenseModel.aggregate([
        {
            $match: {
                householdId: user.householdId,
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);

    const totalExpenses = expenseResult[0]?.totalAmount || 0;

    return (
        <main className=" p-4">

            {/* - - - Welcome Section - - - */}
            <Welcome 
              name={user?.name}
              totalExpenses={totalExpenses}
            />


            {/* - - - Search bar & Category Cards - - - */}
            <CategoryCards/>


        </main>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div className=" min-h-screen flex items-center justify-center text-2xl">Loading Dashboard...</div>}>
            <DashboardContent/>
        </Suspense>
    )
}