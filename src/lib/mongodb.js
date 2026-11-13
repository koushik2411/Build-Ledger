import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Existence check
if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

// Reuse an existing connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

async function connectDB() {
    // Return existing connection if available
    if (!cached.promise) {
        cached.promise = mongoose.connect(
            MONGODB_URI, {
                bufferCommands: false,
            }
        ).then((mongoose) => mongoose);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;