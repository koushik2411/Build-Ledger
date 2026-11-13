import mongoose from "mongoose";

const householdSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        createdBy: {
            type: String,
            required: true,
        },

        invitationKeyHash: {
            type: String,
            required: true,
            select: false,
        },

        invitationKeyUpdatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const HouseholdModel = mongoose.models.Household || mongoose.model("Household", householdSchema);

export default HouseholdModel;