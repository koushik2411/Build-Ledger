"use client";

import {useState} from "react"
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, deleteUser, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterForm() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        invitationKey: "",
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

        const {
            name,
            email,
            password,
            confirmPassword,
            invitationKey,
        } = formData;

        // Basic Validation
        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword ||
            !invitationKey.trim()
        ) {
            setError("Please fill all fields.");
            return;
        }

        if (password.length <8) {
            setError("Password must contain at least 8 characters.")
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return;
        }

        setLoading(true);

        let firebaseUser = null;

        try {
            // Create firebase user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            firebaseUser = userCredential.user;

            // Get firebase id token
            const idToken = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    invitationKey: invitationKey.trim(),
                    idToken,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                // These responses mean the backend rejected registration before creating the MongoDB user.
                if ([400, 403, 409].includes(response.status)) {
                    await deleteUser(firebaseUser);
                    firebaseUser = null;
                } else {
                    // On an uncertain server error, don't delete the account.
                    // The backend might already have created the MongoDB user.
                    await signOut(auth);
                    firebaseUser = null;
                }

                throw new Error(
                    result.message || "Registration failed."
                );
            }

            router.replace("/dashboard");
            router.refresh();
        } catch (err) {
            console.error("Registration Error:", err);

            setError(
                err.code === "auth/email-already-in-use"
                  ? "An account with this email already exists."
                  : err.code === "auth/weak-password"
                    ? "Please choose a stronger password."
                    : err.code === "auth/invalid-email"
                      ? "Please enter a valid email address."
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
              animate={{ scale: 4, opacity: 0.7 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
              className=" h-32 w-32 absolute -top-10 -right-10 bg-blue-300/30 rounded-full blur-sm"
            />
            
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 4, opacity: 0.7 }}
              transition={{ delay: 2.5, duration: 2.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
              className=" h-32 w-32 absolute -bottom-10 -left-10 bg-teal-300/30 rounded-full blur-sm"
            />


            {/* - - - Form - - - */}
            <form
              onSubmit={handleSubmit}
              className=" space-y-4 mx-auto w-full p-5 py-8 flex flex-col items-center rounded-xl relative z-50"
            >

                <h1 className=" w-full pb-1 mb-8 text-center text-lg font-bold border-b-2 text-teal-700">
                    Registration Form
                </h1>

                {/* Name */}
                <div className=" w-full flex flex-col gap-1">

                    <label className=" font-semibold">
                        Full Name:
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className=" border border-slate-500 p-2 rounded focus:outline-emerald-500"
                    />

                </div>

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

                {/* Confirm Password */}
                <div className=" w-full flex flex-col gap-1">

                    <label className=" font-semibold">
                        Confirm Password:
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="********"
                      className=" border border-slate-500 p-2 rounded focus:outline-emerald-500"
                    />
                    
                </div>

                {/* Invitation Key */}
                <div className=" w-full flex flex-col gap-1">

                    <label className=" font-semibold">
                        Invitation Key:
                    </label>

                    <input
                      id="invitationKey"
                      name="invitationKey"
                      type="text"
                      value={formData.invitationKey}
                      onChange={handleChange}
                      required
                      placeholder="ABCD1234"
                      className=" border border-slate-500 p-2 rounded focus:outline-emerald-500"
                    />

                    <p className=" text-xs mt-1">
                        Ask <strong>Admin</strong> for the household invitation key.
                    </p>
                    
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
                    {loading ? "Creating account..." : "Create account"}
                </button>

                {/* login link */}
                <div className=" text-center">
                    Already registered? <Link href="/login" className=" border-b pb-1 font-semibold text-blue-500">
                        Login
                    </Link>
                </div>

            </form>
            
        </div>
    )
}