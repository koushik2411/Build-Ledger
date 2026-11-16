"use client"

import { categories } from "@/data/categories";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function CategoryCards() {

    const [search, setSearch] = useState("");
    
    const filteredCategories = categories.filter((cat) => cat.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className=" w-full max-w-7xl mt-4 mx-auto py-4 space-y-4">

            <h1 className=" font-semibold">
                Categories
            </h1>


            {/* Search Bar */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              suppressHydrationWarning
              placeholder="Search expense category"
              className=" w-full max-w-7xl mx-auto p-3 border-2 border-teal-700/60 bg-teal-200/10 rounded-2xl outline-teal-500 focus:bg-teal-400/10"
            />


            <div className=" w-full md:p-4 grid grid-cols-2 md:grid-cols-3 gap-4">

                {filteredCategories.length > 0 ? (
                    filteredCategories.map((item, index) => (
                        <Link
                          key={index}
                          href={`/category/${item.path}`}
                        >

                            <motion.div
                              initial={{ y: 50, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.7, delay: index * 0.05 }}
                              viewport={{ once: false }}
                              className={` p-5 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-md active:scale-[0.97] hover:scale-[1.02] ${item.cardColors}`}
                            >

                                <h1 
                                  className={` text-5xl ${item.iconColor}`}
                                >
                                    {item.icon}
                                </h1>

                                <h2 className="">
                                    {item.title}
                                </h2>

                            </motion.div>

                        </Link>
                    ))
                ) : (
                    <div className=" min-h-80 col-span-full mt-16 text-center text-lg md:text-2xl">
                        🔎 No matching categories found !!!
                    </div>
                )}
            </div>

        </div>
    );
}