
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { categories } from "@/data/categories";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GiWallet } from "react-icons/gi";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";
import ExpenseHistory from "@/components/category/ExpenseHistory";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { connection } from "next/server";
import AddExpense from "@/components/category/AddExpense";

async function CategoryContent({ params }) {

    await connection();

    const { slug } = await params;

    const category = categories.find(
        (item) => item.path.replace(/^\/+/, "") === slug
    );

    if (!category) {
        notFound();
    }

    // Authenticate user
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // Connect to MongoDB
    await connectDB();

    // Fetch expenses for this category only
    const expenses = await ExpenseModel.find({
        householdId: user.householdId,
        category: category.title,
    })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    // Group expenses by date
    const groupedExpenses = {};

    expenses.forEach((expense) => {

        const date = expense.date;

        if (!groupedExpenses[date]) {
            groupedExpenses[date] = [];
        }

        groupedExpenses[date].push({
            id: expense._id.toString(),
            description: expense.description || "",
            quantity: expense.quantity,
            unit: expense.unit,
            rate: expense.rate,
            amount: expense.amount,
            paymentMethod: expense.paymentMethod,
            vendor: expense.vendor,
            paymentStatus: expense.paymentStatus || "unrecorded",
            paymentDate: expense.paymentDate || "",
            notes: expense.notes,
        });
    });

    // Prepare date-wise history
    const expenseHistory = Object.entries(groupedExpenses).map(
        ([date, records]) => ({
            date,
            records,
            count: records.length,
            total: records.reduce(
                (sum, record) => sum + (Number(record.amount) || 0),
                0
            ),
        })
    );

    // Calculate overall category expenditure
    const totalAmount = expenseHistory.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const currency = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    })

    return (
        <main className=" min-h-screen p-4 space-y-4 md:space-y-6 relative">
            
            <Link
              href="/dashboard"
              className=" flex items-center gap-1"
            >
                <IoMdArrowRoundBack/> Back to Dashboard
            </Link>

            <div className=" flex flex-col md:flex-row items-center justify-center gap-4">

                <div className={` w-full max-w-lg p-6 rounded-2xl flex items-center justify-between shadow-md ${category.cardColors}`}>

                    <div className=" space-y-2">

                        <h1 className="text-2xl font-semibold">
                            {category.title}
                        </h1>

                        <p className="text-gray-800">
                            Manage your {category.title} expenses.
                        </p>

                        <p className=" text-xs text-gray-600">
                            Track all transaction history of {category.title}
                        </p>

                    </div>

                    <p className={` text-5xl ${category.iconColor}`}>
                        {category.icon}
                    </p>

                </div>

                <div className=" w-full max-w-lg p-6 rounded-2xl flex items-center justify-between shadow-md bg-linear-to-b from-lime-300/20 to-lime-500/40">

                    <div className=" space-y-2">

                        <p>
                            Total expense on {category.title}s :
                        </p>

                        <h1 className=" flex items-center gap-1 text-2xl font-semibold text-teal-900">
                            <FaIndianRupeeSign/> {currency.format(totalAmount).replace("₹", "")}
                        </h1>

                        <p className=" text-xs text-gray-600">
                            Across all transactions
                        </p>

                    </div>

                    <p className=" text-5xl text-teal-700">
                        <GiWallet/>
                    </p>

                </div>
            </div>

            {/* Category expense summary */}
            <ExpenseHistory 
                history={expenseHistory}
            />

            {/* Add Expense Button */}
            {user.role === "admin" && <AddExpense/>}
            

        </main>
    );
}


export default function CategoryPage({ params }) {
    return (
        <Suspense fallback={<div className=" min-h-screen flex justify-center items-center">Loading Category...</div>}>
            <CategoryContent params={params}/>
        </Suspense>
    )
}