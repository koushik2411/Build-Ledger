"use client";

import { categories } from '@/data/categories';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoMdCloseCircle } from 'react-icons/io';
import { TbMoneybagMove } from 'react-icons/tb';

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const initialForm = {
    date: getToday(),
    type: "material",
    category: "",
    description: "",
    quantity: "",
    unit: "",
    rate: "",
    amount: "",
    paymentMethod: "cash",
    paymentStatus: "due",
    paymentDate: "",
    vendor: "",
    notes: "",
};

export default function AddExpense() {

    const router = useRouter();

    const [openAddModal, setOpenAddModal] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // If payment is due, clear payment date.
        if (name === "paymentStatus" && value === "due") {
            setFormData((prev) => ({
                ...prev,
                paymentStatus: value,
                paymentDate: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.category) {
            setError("Please select an expense category.");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            setError("Please enter a valid expense amount.");
            return;
        }

        if (formData.paymentStatus === "paid" && !formData.paymentDate) {
            setError("Please select the payment date.");
            return;
        }

        const payload = {
            ...formData,
            quantity: Number(formData.quantity) || 0,
            rate: Number(formData.rate) || 0,
            amount: Number(formData.amount),
            paymentDate: formData.paymentStatus === "paid"
              ? formData.paymentDate
              : "",
        }

        try {
            setLoading(true);

            const response = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to add expense."
                );
            }

            setFormData({
                ...initialForm,
                date: getToday(),
            });

            setOpenAddModal(false);
            router.refresh();

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>

        <button
          onClick={() => setOpenAddModal(true)}
          className=" fixed bottom-10 right-5 p-3 px-5 rounded-3xl flex items-center gap-2 bg-linear-to-b from-amber-400 to-amber-600 shadow-md"
        >
            <TbMoneybagMove/> Add Expense
        </button>


        {/* - - - ADD EXPENSE FORM MODAL - - - */}
        {openAddModal && (
            <div
              onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setOpenAddModal(false);
                    }
                }}
              className=" p-4 bg-black/70 fixed inset-0 z-50 flex justify-center items-start backdrop-blur-[2px] overflow-y-auto"
            >

                <div 
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="add-expense-title"
                  className=" w-full max-w-2xl mt-4 p-6 bg-white relative flex flex-col gap-6 rounded-2xl shadow-md"
                >
                    
                    <div className=" w-full pb-3 flex justify-between items-center border-b-2">

                        <h1 className=" text-xl font-bold">
                            Add New Expense
                        </h1>
                        
                        <button
                          onClick={() => setOpenAddModal(false)}
                          disabled={loading}
                          className=" p-2 md:pr-4 rounded-3xl bg-linear-to-b from-red-500/80 to-red-600 text-white self-end flex items-center gap-1"
                        >
                            <IoMdCloseCircle className=" text-2xl"/><span className=" hidden md:flex"> Close</span>
                        </button>

                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit}
                      className=" flex flex-col gap-4"
                    >

                        {/* Date */}
                        <div className=" flex flex-col gap-1.5">
                            <label>Expense Date</label>

                            <input
                              type="date"
                              name="date"
                              id="date"
                              value={formData.date}
                              onChange={handleChange}
                              required
                              placeholder="YYYY-MM-DD"
                              className=" border p-2 rounded-lg"
                            />
                        </div>

                        {/* Type */}
                        <div className=" flex flex-col gap-1.5">
                            <label>
                                Expense Type
                            </label>

                            <select
                              name="type"
                              id="type"
                              value={formData.type}
                              onChange={handleChange}
                              required
                              className=" border p-2 rounded-lg"
                            >
                                <option value="">Select Type</option>
                                <option value="material">Material</option>
                                <option value="contractor">Contractor</option>
                                <option value="labour">Labour</option>
                                <option value="transport">Transport</option>
                                <option value="food">Food</option>
                                <option value="other">Other</option>

                            </select>

                        </div>

                        {/* Category */}
                        <div className=" flex flex-col gap-1.5">
                            <label>
                                Category
                            </label>

                            <select
                              name="category"
                              id="category"
                              value={formData.category}
                              onChange={handleChange}
                              required
                              className=" border p-2 rounded-lg"
                            >
                                <option value="">Select Category</option>

                                {categories.map((item, index) => (
                                    <option
                                      key={index}
                                      value={item.title}
                                      className=""
                                    >
                                        {item.title}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Vendor */}
                        <div className=" flex flex-col gap-1.5">
                            <label>
                                Vendor / Contractor
                            </label>

                            <input
                              type="text"
                              name="vendor"
                              id="vendor"
                              value={formData.vendor}
                              onChange={handleChange}
                              required
                              maxLength={30}
                              placeholder="Vendor's Name"
                              className=" border p-2 rounded-lg"
                            />
                        </div>

                        {/* Description */}
                        <div className=" flex flex-col gap-1.5">
                            <label>
                                Description
                            </label>

                            <input
                              type="text"
                              name="description"
                              id="description"
                              value={formData.description}
                              onChange={handleChange}
                              maxLength={50}
                              placeholder="e.g. Material purchase"
                              className=" border p-2 rounded-lg"
                            />
                        </div>

                        {/* - - - AMOUNT DETAILS - - - */}
                        <div className=" border rounded-xl mt-2 p-3 pb-6 space-y-4 md:grid md:grid-cols-2 md:gap-3">

                            <h3 className=" text-center font-semibold border-b md:col-span-full">
                                Amount Details
                            </h3>

                            {/*  */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Quantity
                                </label>

                                <input
                                  type="number"
                                  name="quantity"
                                  id="quantity"
                                  value={formData.quantity}
                                  onChange={handleChange}
                                  required
                                  min={0}
                                  placeholder="e.g. 10"
                                  className=" border p-2 rounded-lg"
                                />
                            </div>

                            {/* Unit */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Unit
                                </label>

                                <select
                                  name="unit"
                                  id="unit"
                                  value={formData.unit}
                                  onChange={handleChange}
                                  required
                                  className=" border p-2 rounded-lg"
                                >
                                    <option value="">Select Unit</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="ltr">Litre (ltr)</option>
                                    <option value="bag">Bag</option>
                                    <option value="tempo">Tempo</option>
                                    <option value="tractor">Tractor</option>
                                    <option value="truck">Truck</option>
                                    <option value="other">Other</option>
                                </select>
                                
                            </div>

                            {/* Rate */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Rate
                                </label>

                                <input
                                  type="number"
                                  name="rate"
                                  id="rate"
                                  value={formData.rate}
                                  onChange={handleChange}
                                  min={0}
                                  step="any"
                                  placeholder="Price per unit"
                                  className=" border p-2 rounded-lg"
                                />
                            </div>

                            {/* Total Amount */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Total Amount
                                </label>

                                <input
                                  type="number"
                                  name="amount"
                                  id="amount"
                                  value={formData.amount}
                                  onChange={handleChange}
                                  min="0.01"
                                  step="any"
                                  required
                                  placeholder="Enter total amount"
                                  className=" border p-2 rounded-lg"
                                />
                            </div>

                        </div>


                        {/* - - - PAYMENT DETAILS - - - */}
                        <div className=" border rounded-xl mt-2 p-3 pb-6 space-y-4 md:grid md:grid-cols-2 md:gap-3">

                            <h3 className=" text-center font-semibold border-b md:col-span-full">
                                Payment Details 
                            </h3>

                            {/* Payment Method */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Payment Method
                                </label>

                                <select
                                  name="paymentMethod"
                                  id="paymentMethod"
                                  value={formData.paymentMethod}
                                  onChange={handleChange}
                                  required
                                  className=" border p-2 rounded-lg"
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="upi">UPI</option>
                                    <option value="cash">Cash</option>
                                    <option value="cheque">Cheque</option>
                                </select>

                            </div>

                            {/* Payment Status */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Payment Status
                                </label>

                                <select
                                  name="paymentStatus"
                                  id="paymentStatus"
                                  value={formData.paymentStatus}
                                  onChange={handleChange}
                                  required
                                  className=" border p-2 rounded-lg"
                                >
                                    <option value="">Select Payment Status</option>
                                    <option value="due">Payment Due</option>
                                    <option value="paid">Paid</option>
                                    <option value="partial">Partial</option>
                                </select>

                            </div>

                            {/* Payment Date */}
                            <div className=" flex flex-col gap-1.5">
                                <label>
                                    Payment Date
                                </label>

                                <input
                                  type="date"
                                  name="paymentDate"
                                  id="paymentDate"
                                  value={formData.paymentDate}
                                  onChange={handleChange}
                                  max={getToday()}
                                  required
                                  className=" border p-2 rounded-lg"
                                />
                            </div>
                        </div>


                        {/* - - - NOTES - - - */}
                        <div className=" border rounded-xl p-3 pb-6 space-y-4">

                            <h3 className=" text-center font-semibold border-b">
                                Additional Information
                            </h3>
                            
                            <div className=" flex flex-col gap-1.5">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                  id="notes"
                                  name="notes"
                                  value={formData.notes}
                                  onChange={handleChange}
                                  rows={5}
                                  className=" border p-2 rounded-lg resize-none"
                                />
                            </div>

                        </div>


                        {/* Errors */}
                        {error && (
                            <p>
                                {error}
                            </p>
                        )}


                        <button
                          type="submit"
                          disabled={loading}
                          className=" border mt-4 p-3 px-5 rounded-3xl"
                        >
                            {loading ? "Adding expense..." : "Add Expense"}
                        </button>

                    </form>

                </div>

            </div>
        )}

    </div>
  )
}
