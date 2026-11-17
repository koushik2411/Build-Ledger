"use client";

import { logout } from '@/lib/logout';
import { Audiowide } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BsEnvelopeAtFill } from 'react-icons/bs';
import { FaBars, FaUserAlt } from 'react-icons/fa';
import { GiArchiveRegister } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { RiCloseCircleFill } from 'react-icons/ri';
import { TbLogout } from 'react-icons/tb';

const logoFont = Audiowide({
    subset: "latin",
    weight: ["400"],
});

export default function Header({ name, email }) {

    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout() {
        try {
            await logout();
            router.replace("/login");
            router.refresh();

        } catch (error) {
            console.error("Logout Error:", error);
        }
    }

  return (
    <header className=" h-14 px-4 flex justify-between items-center shadow-md sticky z-50 top-0 left-0 bg-stone-50">

        {/* Logo */}
        <h1 className={` ${logoFont.className} text-2xl font-semibold text-teal-900 flex items-center gap-1.5`}>
            <GiArchiveRegister/> Build Ledger
        </h1>


        {/* Menu button */}
        <button
          suppressHydrationWarning
          onClick={() => setMenuOpen((prev) => !prev)}
          className={` ${menuOpen ? " text-red-600 text-3xl" : " text-teal-800 text-2xl"}`}
        >
            {menuOpen ? <RiCloseCircleFill/> : <FaBars/>}
        </button>


        {/* - - - MENU - - - */}
        {menuOpen && (
            <div 
              className=" fixed inset-0 z-40 bg-black/80 backdrop-blur-[2px]"
            >

                <div className=" w-80 md:w-sm h-fit p-6 bg-linear-to-b from-white to-teal-100 rounded-3xl absolute top-16 right-5 md:right-12 space-y-10 shadow-md overflow-hidden">

                    {/* User details */}
                    <div className=" pt-14 flex flex-col items-center gap-4">

                        {/* Avatar */}
                        <h1 className=" h-48 w-48 bg-linear-to-b from-teal-200 to-teal-500 flex justify-center items-center text-9xl rounded-full shadow-md font-bold text-gray-800">
                            {name?.charAt(0) || "U"}
                        </h1>

                        {/* Name and Email */}
                        <p className=" mt-6 font-semibold text-xl flex items-center gap-2">
                            <FaUserAlt/> {name || "User"}
                        </p>

                        <p className=" flex text-sm items-center gap-2 text-stone-700">
                            <BsEnvelopeAtFill/> {email || "No email available"}
                        </p>

                    </div>

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className=" w-full p-4 rounded-2xl flex items-center justify-center gap-2 bg-linear-to-b from-rose-500 to-rose-700 text-white font-semibold shadow-md"
                    >
                        Logout <TbLogout/>
                    </button>

                    {/* Close button */}
                    <button
                      onClick={() => setMenuOpen(false)}
                      className=" h-28 w-28 absolute -top-13 -right-13 bg-linear-to-b from-rose-500 to-rose-700 rounded-full"
                    >
                        <span className=" absolute bottom-5 left-5 text-4xl text-white">
                            <IoClose/>
                        </span>
                    </button>

                </div>

            </div>
        )}


    </header>
  )
}
