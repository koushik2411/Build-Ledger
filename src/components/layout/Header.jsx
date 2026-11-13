"use client";

import { logout } from '@/lib/logout';
import { Audiowide } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import { GiArchiveRegister } from 'react-icons/gi';
import { RiCloseCircleFill } from 'react-icons/ri';

const logoFont = Audiowide({
    subset: "latin",
    weight: ["400"],
});

export default function Header() {

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
    <header className=" h-14 px-4 flex justify-between items-center shadow-md">

        {/* Logo */}
        <h1 className={` ${logoFont.className} text-2xl font-semibold text-teal-950 flex items-center gap-1.5`}>
            <GiArchiveRegister/> Build Ledger
        </h1>


        {/* Desktop Menu */}


        {/* Mobile Menu */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={` ${menuOpen ? " text-red-600 text-3xl" : " text-teal-800 text-2xl"}`}
        >
            {menuOpen ? <RiCloseCircleFill/> : <FaBars/>}
        </button>


    </header>
  )
}
