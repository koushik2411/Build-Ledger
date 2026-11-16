"use client";

import { motion } from "framer-motion";
import { IoClose, IoCalendarOutline } from "react-icons/io5";

export default function ExpenseDetailsModal({
  expense,
  onClose,
  formatDate,
  currency,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2
              id="expense-modal-title"
              className="text-xl sm:text-2xl font-semibold"
            >
              Expense Details
            </h2>

            <p className="flex items-center gap-2 text-sm text-gray-500">
              <IoCalendarOutline />
              {formatDate(expense.date)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Total Summary */}
        <div className="px-5 sm:px-6 py-4 bg-teal-50 flex items-center justify-between">
          <div>
            <p className="text-sm text-teal-700">Total expenditure</p>

            <h3 className="text-2xl font-bold text-teal-900">
              {currency(expense.total)}
            </h3>
          </div>

          <p className="text-sm text-teal-700">{expense.count} transactions</p>
        </div>

        {/* Expense Table */}
        <div className=" space-y-4">
          {expense.records.map((record, index) => (
            <div
              key={record._id || index}
              className="rounded-xl border border-stone-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  {record.vendor && (
                    <p className=" mt-1 text-lg font-semibold">
                      {record.vendor}
                    </p>
                  )}
                </div>

                <p className="font-bold text-stone-900 whitespace-nowrap">
                  {currency(record.amount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-stone-500">Quantity</p>
                  <p className="font-medium text-stone-700">
                    {record.quantity} {record.unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-500">Rate</p>
                  <p className="font-medium text-stone-700">
                    {currency(record.rate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-500">Payment Method</p>
                  <p className="font-medium text-stone-700 capitalize">
                    {record.paymentMethod || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-500">Payment Status</p>
                  <span
                    className={`inline-block mt-1 rounded-full px-2 py-1 text-xs font-medium ${
                      record.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {record.paymentStatus || "Unrecorded"}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-stone-500">Payment Date</p>
                  <p className="font-medium text-stone-700">
                    {record.paymentDate || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Total */}
          <div className="flex items-center justify-between rounded-xl bg-stone-100 p-4">
            <span className="font-semibold text-stone-700">Total Expense</span>
            <span className="text-lg font-bold text-stone-900">
              {currency(expense.total)}
            </span>
          </div>

          {/* Additional Notes */}
          {expense.records.some((record) => record.notes) && (
            <div className="mt-6 p-5 space-y-3">
              <h3 className="font-semibold">Additional Notes</h3>

              {expense.records.map(
                (record) =>
                  record.notes && (
                    <div
                      key={record.id}
                      className="bg-gray-50 p-3 rounded-lg text-sm"
                    >
                      <p className="font-medium">
                        {record.description || "Expense"}
                      </p>

                      <p className="text-gray-600 mt-1">{record.notes}</p>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
