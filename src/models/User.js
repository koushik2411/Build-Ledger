import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        householdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HouseholdModel",
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "viewer"],
            default: "viewer",
        },

        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;