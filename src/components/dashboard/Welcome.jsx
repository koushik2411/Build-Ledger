"use client"

import { motion } from "framer-motion";
import { FaHome, FaRupeeSign } from "react-icons/fa";
import { FaHandsPraying } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";

export default function Welcome({ name }) {

    return (

        <div className=" max-w-7xl mx-auto md:py-8 flex flex-col lg:flex-row gap-4 justify-center">

            {/* - - - Welcome Section - - - */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut"}}
              viewport={{ once: false }}
              className=" border-2 rounded-3xl w-full max-w-md p-4 bg-linear-to-b from-teal-300/15 to-teal-500/20 border-teal-500 flex items-center justify-between shadow-md"
            >
                
                <div className=" space-y-2">

                    <h1 className=" font-semibold text-teal-700 text-xl">
                        Hello <span>{name || "User"}!</span>
                    </h1>

                    <p>
                        Welcome to Build Ledger, your digital ledger for tracking expenses for your construction site.
                    </p>
                </div>

                <p className=" text-5xl text-teal-600">
                    <FaHandsPraying/>
                </p>

            </motion.div>


            {/* - - - Expense till now - - - */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut"}}
              viewport={{ once: false }}
              className=" border-2 rounded-3xl w-full max-w-md p-4 bg-linear-to-b from-rose-300/15 to-rose-400/20 border-rose-400 shadow-md flex items-center justify-between"
            >

                <div className=" space-y-2">

                    <p>Till now, you have spent</p>

                    <h1 className=" text-2xl text-rose-600 font-bold flex items-center gap-1">

                        <FaRupeeSign/> 14610/-
                    </h1>

                </div>

                <p className=" text-5xl text-rose-500">
                    <GiExpense/>
                </p>

            </motion.div>


            {/* - - - Important Dates - - - */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut"}}
              viewport={{ once: false }}
              className=" border-2 rounded-3xl w-full max-w-md p-4 bg-linear-to-b from-sky-300/15 to-sky-500/20 border-sky-400 shadow-md flex items-center justify-between"
            >

                <div className=" space-y-2">

                    <h1 className=" text-xl text-sky-600 font-bold flex items-center gap-1">

                        Bundu Home
                    </h1>

                    <p>
                        Construction started on <span className=" text-sky-600">05/12/2026</span>
                    </p>

                </div>

                <p className=" text-5xl text-sky-500">
                    <FaHome/>
                </p>

            </motion.div>


        </div>

    )
}