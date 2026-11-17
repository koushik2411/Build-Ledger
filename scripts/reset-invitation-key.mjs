
import nextEnv from "@next/env";
import mongoose from "mongoose";
import { randomBytes, createHash } from "crypto";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function resetInvitationKey() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const households = mongoose.connection.collection("households");

        const household = await households.findOne({
            name: "Bundu_Home",
        });

        if (!household) {
            throw new Error("Existing household not found.");
        }

        const invitationKey =
            `BLD-${randomBytes(24).toString("hex").toUpperCase()}`;

        const invitationKeyHash = createHash("sha256")
            .update(invitationKey)
            .digest("hex");

        await households.updateOne(
            { _id: household._id },
            {
                $set: {
                    invitationKeyHash,
                    invitationKeyUpdatedAt: new Date(),
                    updatedAt: new Date(),
                },
            }
        );

        console.log("\nInvitation key reset successfully!");
        console.log("Household:", household.name);
        console.log("New Invitation Key:", invitationKey);
        console.log("\nSave this key securely.");

    } catch (error) {
        console.error("Reset failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

resetInvitationKey();
