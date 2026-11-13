import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        householdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HouseholdModel",
            required: true,
            index: true,
        },

        createdBy: {
            type: String,
            required: true,
        },

        date: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
        },

        type: {
            type: String,
            enum: ["material", "labour", "other"],
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        quantity: {
            type: Number,
            min: 0,
            default: 0,
        },

        unit: {
            type: String,
            trim: true,
            default: "",
        },

        rate: {
            type: Number,
            min: 0,
            default: 0,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "bank", "other"],
            default: "cash",
        },

        vendor: {
            type: String,
            trim: true,
            default: "",
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        receipt: {
            fileName: {
                type: String,
                trim: true,
                default: "",
            },

            receipt: {
                fileName: {
                    type: String,
                    default: "",
                },

                storagePath: {
                    type: String,
                    default: "",
                },

                contentType: {
                    type: String,
                    default: "",
                },

                size: {
                    type: Number,
                    default: 0,
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

expenseSchema.index({ householdId: 1, date: -1 });

expenseSchema.index({ householdId: 1, type: 1, category: 1 });

const ExpenseModel = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default ExpenseModel;