import { requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Authenticate user
        const user = await requireAdmin();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized. Please login." },
                { status: 403 }
            );
        }

        // Get request data
        const body = await request.json();

        const {
            date,
            type,
            category,
            description,
            quantity,
            unit,
            rate,
            amount,
            paymentMethod,
            paymentStatus,
            paymentDate,
            paidAmount,
            vendor,
            notes,
        } = body;

        // Validate required fields
        if (!date || !type || !category || amount === undefined || amount === null || amount === "") {
            return NextResponse.json(
                { message: "Please provide all required fields." },
                { status: 400 }
            );
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { message: "Invalid expense date." },
                { status: 400 }
            );
        }

        const numericAmount = Number(amount);
        const numericQuantity = Number(quantity || 0);
        const numericRate = Number(rate || 0);
        const numericPaidAmount = Number(paidAmount || 0);

        // Payment status validation
        if (!["paid", "partial", "due"].includes(paymentStatus)) {
            return NextResponse.json(
                { message: "Invalid payment status." },
                { status: 400 }
            );
        }

        // Initial paid amount validation
        if (
            !Number.isFinite(numericPaidAmount) ||
            numericPaidAmount < 0 ||
            numericPaidAmount > numericAmount
        ) {
            return NextResponse.json(
                { message: "Please enter valid numeric values." },
                { status: 400 }
            );
        }

        // Validate payment status against paid amount
        if (
            (paymentStatus === "due" && numericPaidAmount !== 0) ||
            (paymentStatus === "paid" && numericPaidAmount !== numericAmount) ||
            (paymentStatus === "partial" && 
                (numericPaidAmount <= 0 || numericPaidAmount >= numericAmount)
            )
        ) {
            return NextResponse.json(
                { message: "Payment amount does not match payment status." },
                { status: 400 }
            )
        }

        // Payment date validation
        if (
            numericPaidAmount > 0 && (
                !paymentDate ||
                !/^\d{4}-\d{2}-\d{2}$/.test(paymentDate) ||
                paymentDate > new Date().toISOString().slice(0, 10)
            )
        ) {
            return NextResponse.json(
                { message: "Please provide a valid payment date." },
                { status: 400 }
            );
        }

        // Connect DB
        await connectDB();

        // Save expense
        const expense = await ExpenseModel.create({
            householdId: user.householdId,
            createdBy: user.firebaseUid,
            date,
            type,
            category,
            description: description || "",
            quantity: numericQuantity,
            unit: unit || "",
            rate: numericRate,
            amount: numericAmount,
            paymentMethod,
            paymentStatus,
            paymentDate: numericPaidAmount > 0 ? paymentDate : "",
            payments: numericPaidAmount > 0
                ? [
                    {
                        amount: numericPaidAmount,
                        paymentDate,
                        paymentMethod,
                        notes: "",
                    },
                ]
                : [],
            vendor: vendor || "",
            notes: notes || "",
        });

        return NextResponse.json(
            {
                message: "Expense added successfully!",
                expenseId: expense._id.toString(),
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Add Expense Error:", error);

        if (error.name === "ValidationError") {
            return NextResponse.json(
                {  message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Something went wrong while adding expense." },
            { status: 500 }
        );
    }
}