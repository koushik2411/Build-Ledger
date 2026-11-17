"use client";

import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { IoClose, IoCalendarOutline } from "react-icons/io5";

export default function ExpenseDetailsModal({
  expense,
  onClose,
  formatDate,
  currency,
}) {

  const getPaymentSummary = (record) => {
    const payments = record.payments || [];

    // New payment records
    if (payments.length > 0) {
      const paidAmount = payments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
      );

      return {
        paidAmount,
        dueAmount: Math.max(0, Number(record.amount) - paidAmount),
      }
    }

    const paidAmount = record.paymentStatus === "paid" ? Number(record.amount) : 0;

    return {
      paidAmount,
      dueAmount: Math.max(0, Number(record.amount) - paidAmount),
    };
  };

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
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        className=" p-4 bg-white w-full max-w-4xl max-h-[90vh]
         overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className=" flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2
              id="expense-modal-title"
              className="text-xl sm:text-2xl font-semibold text-teal-950"
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
            <IoClose className=" p-0.5 text-3xl bg-red-600 text-white border rounded-full" />
          </button>
        </div>

        {/* Total Summary */}
        <div className=" mt-4 px-5 sm:px-6 py-4 bg-linear-to-b from-teal-50 to-teal-100 flex items-center justify-between rounded-xl">
          <div>
            <p className="text-sm text-teal-700">Total expenditure</p>

            <h3 className="text-2xl font-bold text-teal-900">
              {currency(expense.total)}/-
            </h3>
          </div>

          <p className="text-sm text-teal-700">{expense.count} transactions</p>
        </div>

        {/* Expense Cards */}
        <div className=" mt-4 space-y-4 bg-linear-to-b from-teal-50 to-white">
          {expense.records.map((record, index) => (
            <div
              key={record._id || index}
              className="rounded-xl border border-stone-200 bg p-4 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between gap-3 border-b">
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
                    {record.quantity} {record.quantity > 1 ? record.unit + "s" : record.unit}
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
                    {record.paymentMethod === "cash" ? "Cash" : record.paymentMethod === "upi" ? "UPI" : record.paymentMethod === "cheque" ? "Cheque" : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-500">Payment Status</p>

                  {(() => {
                    const { paidAmount, dueAmount } = getPaymentSummary(record);

                    const status = dueAmount === 0
                        ? "paid"
                        : paidAmount > 0
                            ? "partial"
                            : "due";

                    return (
                      <span
                        className={`inline-block mt-1 rounded-full px-2 py-1 text-xs font-medium ${
                          record.paymentStatus === "paid"
                            ? "bg-green-200 text-emerald-700 border border-emerald-700"
                            : status === "partial"
                              ? "bg-amber-200 text-amber-600 border border-amber-600"
                              : "bg-red-200 text-red-700 border border-red-700"
                        }`}
                      >
                        {record.paymentStatus === "paid" ? "Paid" :  record.paymentStatus === "partial" ? "Partial" : "Due"}
                      </span>
                    )
                  })()}
                  
                </div>

                <div className=" col-span-full">
                  {(() => {
                    const { paidAmount, dueAmount } = getPaymentSummary(record);

                    return (
                      <div className=" grid grid-cols-2">
                        
                        <div className="">

                          <p className=" text-xs text-stone-500">
                            Paid Amount
                          </p>

                          <p className=" text-emerald-700 font-semibold">
                            {currency(paidAmount)}/-
                          </p>

                        </div>

                        <div className="">

                          <p className=" text-xs text-stone-500">
                            Due Amount
                          </p>

                          <p className=" text-red-700 font-semibold">
                            {currency(dueAmount)}/-
                          </p>

                        </div>

                      </div>
                    )
                  })()}
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-stone-500">Payment History</p>
                  
                  {record.payments?.length > 0 ? (
                    record.payments.map((payment, paymentIndex) => (
                      <div
                        key={payment._id || paymentIndex}
                        className=""
                      >

                        <div>

                          <p>
                            {currency(payment.amount)}
                          </p>

                          <p>
                            {payment.paymentDate
                              ? formatDate(payment.paymentDate)
                              : "Date Unavailable"}
                          </p>

                        </div>

                        <span>
                          {payment.paymentMethod || "Other"}
                        </span>

                      </div>
                    ))

                  ) : (
                    <div>

                      <p className=" text-stone-700">
                        {record.paymentDate
                          ? formatDate(record.paymentDate)
                          : "No payment history available."}
                      </p>

                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div
                  key={record.id}
                  className=" col-span-full bg-linear-to-b from-gray-100 to-gray-200/80 p-3 rounded-xl text-sm"
                >
                  <p className="font-semibold">
                    {record.description || "Expense"}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {record.notes}
                  </p>
                </div>

              </div>
            </div>
          ))}

          {/* Modal Total */}
          <div className="flex items-center justify-between rounded-xl bg-linear-to-b from-teal-100 to-teal-200 p-4 shadow-md">
            <span className="font-semibold text-teal-700">Total Expense</span>
            <span className="text-lg font-bold text-teal-900">
              {currency(expense.total)}
            </span>
          </div>

          
        </div>

        {/* Modal Footer */}
        {/* <div className=" p-4 flex justify-center items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-3xl bg-linear-to-b from-amber-400 to-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md flex items-center gap-1"
          >
            <FaEdit/> Edit
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-3xl bg-linear-to-b from-red-500 to-red-600 text-white hover:bg-red-700 transition-colors shadow-md flex items-center gap-1"
          >
            <ImBin/> Delete
          </button>
        </div> */}

      </motion.div>

    </motion.div>
  );
}
