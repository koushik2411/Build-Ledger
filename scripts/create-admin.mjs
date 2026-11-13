import nextEnv from "@next/env";
import mongoose from "mongoose";
import { randomBytes, createHash } from "crypto";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

// Load variables from .env.local
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function createAdmin() {
  let householdId = null;

  try {
    const {
      MONGODB_URI,
      FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY,
      ADMIN_EMAIL,
      ADMIN_NAME,
      HOUSEHOLD_NAME,
    } = process.env;

    // Validate required environment variables
    if (
      !MONGODB_URI ||
      !FIREBASE_PROJECT_ID ||
      !FIREBASE_CLIENT_EMAIL ||
      !FIREBASE_PRIVATE_KEY ||
      !ADMIN_EMAIL ||
      !ADMIN_NAME ||
      !HOUSEHOLD_NAME
    ) {
      throw new Error("Missing required environment variables.");
    }

    // Initialize Firebase Admin
    const firebaseApp =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert({
              projectId: FIREBASE_PROJECT_ID,
              clientEmail: FIREBASE_CLIENT_EMAIL,
              privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            }),
          });

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB.");

    // Prevent accidental duplicate setup
    const usersCollection = mongoose.connection.collection("users");
    const householdsCollection =
      mongoose.connection.collection("households");

    const existingAdmin = await usersCollection.findOne({
      role: "admin",
    });

    const existingHousehold = await householdsCollection.findOne({});

    if (existingAdmin || existingHousehold) {
      throw new Error(
        "A household or admin already exists. Bootstrap stopped."
      );
    }

    // Find your existing Firebase account
    const firebaseUser = await getAuth(firebaseApp).getUserByEmail(
      ADMIN_EMAIL
    );

    // Generate a secure invitation key
    const invitationKey =
      `BLD-${randomBytes(24).toString("hex").toUpperCase()}`;

    // Hash the key before storing it
    const invitationKeyHash = createHash("sha256")
      .update(invitationKey)
      .digest("hex");

    const now = new Date();

    // Create household
    const householdResult = await householdsCollection.insertOne({
      name: HOUSEHOLD_NAME,
      createdBy: firebaseUser.uid,
      invitationKeyHash,
      invitationKeyUpdatedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    householdId = householdResult.insertedId;

    // Create admin user
    await usersCollection.insertOne({
      firebaseUid: firebaseUser.uid,
      name: ADMIN_NAME,
      email: firebaseUser.email.toLowerCase(),
      householdId,
      role: "admin",
      isApproved: true,
      createdAt: now,
      updatedAt: now,
    });

    console.log("\nAdmin and household created successfully!");
    console.log("----------------------------------------");
    console.log("Household:", HOUSEHOLD_NAME);
    console.log("Admin:", ADMIN_EMAIL);
    console.log("Invitation Key:", invitationKey);
    console.log("----------------------------------------");
    console.log("SAVE THIS KEY SECURELY. It will not be shown again.");
  } catch (error) {
    // Roll back household if admin creation fails
    if (householdId) {
      await mongoose.connection
        .collection("households")
        .deleteOne({ _id: householdId });
    }

    console.error("\nBootstrap failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createAdmin();
