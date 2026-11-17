"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const { email, password } = formData;

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            // Authenticate with firebase
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            const firebaseUser = userCredential.user;

            // Get firebase id token
            const idToken = await firebaseUser.getIdToken();

            // Create secure server session
            const response = await fetch("/api/auth/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            });

            const responseText = await response.text();

            let result = {};

            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                console.error("Invalid API response:", responseText);
                throw new Error("Server returned an invalid response.");
            }

            if (!response.ok) {
                await signOut(auth);
                throw new Error(
                    result.message || "Unable to create login session."
                )
            }

            if (!result.success) {
                await signOut(auth);
                throw new Error(result.message || "Login session was not created.");
            }

            // Navigate to dashboard
            router.replace("/dashboard");
            router.refresh();

        } catch (err) {
            console.error("Login Error:", err);

            setError(
                err.code === "auth/invalid-credential"
                  ? "Invalid email or password."
                  : err.code === "auth/user-disabled"
                    ? "This account is disabled."
                    : err.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=" w-full max-w-xl mx-auto rounded-4xl relative overflow-hidden shadow-lg border border-slate-400 bg-white">

            {/* - - - Bubbles - - - */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0.7 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
              className=" h-32 w-32 absolute -top-10 -right-10 bg-blue-300/30 rounded-full blur-sm"
            />
            
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 3, opacity: 0.7 }}
              transition={{ delay: 2.5, duration: 2.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
              className=" h-32 w-32 absolute -bottom-10 -left-10 bg-teal-300/30 rounded-full blur-sm"
            />


            {/* - - - Form - - - */}
            <form
              onSubmit={handleSubmit}
              className=" space-y-4 mx-auto w-full p-5 py-8 flex flex-col items-center rounded-xl relative z-50"
            >

                <h1 className=" w-full pb-1 mb-8 text-center text-lg font-bold border-b-2 text-teal-700">
                    Login
                </h1>

                {/* Email */}
                <div className=" w-full flex flex-col gap-1">

                    <label className=" font-semibold">
                        Email id:
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example123@gmail.com"
                      className=" border border-slate-500 p-2 rounded focus:outline-emerald-500"
                    />
                    
                </div>

                {/* Password */}
                <div className=" w-full flex flex-col gap-1">

                    <label className=" font-semibold">
                        Password:
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="********"
                      className=" border border-slate-500 p-2 rounded focus:outline-emerald-500"
                    />
                    
                </div>

                {/* Error */}
                {error && (
                    <div
                      role="alert"
                      className=" text-red-600"
                    >
                        {error}
                    </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className=" w-68 mt-4 p-3 rounded-3xl self-center bg-linear-to-b from-teal-300 to-teal-500 shadow-md cursor-pointer font-semibold text-slate-800"
                >
                    {loading ? "Logging In..." : "Login"}
                </button>

                {/* login link */}
                <div className=" mt-3 text-center">
                    New to <span className=" text-teal-900 font-semibold">Build Ledger</span>? <Link href="/register" className=" border-b pb-1 font-semibold text-blue-500">
                        Register
                    </Link>
                </div>

            </form>

        </div>
    )
}