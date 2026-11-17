
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ExpenseDetailsModal from "./ExpenseDetailsModal";

export default function ExpenseHistory({ history = [] }) {
    const [selectedExpense, setSelectedExpense] = useState(null);

    const currency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    return (
        <div className="mx-auto w-full max-w-7xl">

            {/* Header */}
            <div className="flex items-center justify-between text-lg font-semibold">
                <h1>Expense History</h1>

                <p>
                    {history.length}{" "}
                    {history.length === 1 ? "Day" : "Days"}
                </p>
            </div>

            {/* Empty State */}
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 pt-24 text-center">

                    <h3 className="text-lg font-semibold">
                        💰 No expenses yet!
                    </h3>

                    <p className="text-gray-500">
                        Your expense history will appear here once you
                        add expenses to this category.
                    </p>

                </div>
            ) : (

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {history.map((item, index) => {

                        const paidCount = item.records.filter(
                            (record) => record.paymentStatus === "paid"
                        ).length;

                        const dueCount = item.records.filter(
                            (record) => record.paymentStatus === "due"
                        ).length;

                        const unrecordedCount =
                            item.count - paidCount - dueCount;

                        const status =
                            paidCount === item.count
                                ? "paid"
                                : dueCount === item.count
                                    ? "due"
                                    : paidCount > 0 && dueCount > 0
                                        ? "partial"
                                        : "unrecorded";

                        const statusStyles = {
                            paid: "bg-emerald-200 text-emerald-700 border border-emerald-700",
                            due: "bg-red-200 text-red-700 border border-red-700",
                            partial: "bg-amber-200 text-amber-700 border border-amber-700",
                            unrecorded: "bg-gray-100 text-gray-600",
                        };

                        const statusLabels = {
                            paid: "Paid",
                            due: "Payment Due",
                            partial: "Partially Paid",
                            unrecorded: "Status not recorded",
                        };

                        return (
                            <motion.button
                                key={item.date}
                                type="button"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.35,
                                    delay: index * 0.05,
                                }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedExpense(item)}
                                className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 text-left transition hover:shadow-md shadow-md bg-linear-to-b from-teal-200/70 to-teal-50"
                            >

                                {/* Date and Entry Count */}
                                <div className="flex items-center justify-between gap-2">

                                    <div className="flex items-center gap-2 font-semibold text-teal-950">
                                        <FaCalendarAlt />

                                        <p>{formatDate(item.date)}</p>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {item.count}{" "}
                                        {item.count === 1 ? "Entry" : "Entries"}
                                    </p>

                                </div>

                                {/* Total Amount */}
                                <div className=" my-1">
                                    <p className="text-sm text-gray-600">
                                        Total spent
                                    </p>

                                    <h3 className="flex items-center gap-2 text-2xl font-semibold text-teal-900">
                                        <FaIndianRupeeSign />
                                        {currency(item.total).replace("₹", "")}/-
                                    </h3>
                                </div>

                                {/* Payment Status */}
                                <div className="flex flex-wrap items-center justify-between gap-2">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
                                    >
                                        {statusLabels[status]}
                                    </span>

                                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                        <span className=" text-emerald-600">
                                            Paid: {paidCount}
                                        </span>

                                        <span className=" text-red-500">
                                            Due: {dueCount}
                                        </span>
                                    </div>

                                </div>

                                {/* View Details */}
                                <p className="rounded-3xl mt-1 p-2 text-center text-sm font-medium transition bg-linear-to-b from-teal-300 to-teal-500 shadow-md">
                                    View Details →
                                </p>

                            </motion.button>
                        );
                    })}

                </div>
            )}

            {/* Expense Details Modal */}
            <AnimatePresence>
                {selectedExpense && (
                    <ExpenseDetailsModal
                        expense={selectedExpense}
                        onClose={() => setSelectedExpense(null)}
                        formatDate={formatDate}
                        currency={currency}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
