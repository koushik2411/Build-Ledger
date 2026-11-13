import RegisterForm from "@/components/auth/RegisterForm";
import { Audiowide } from "next/font/google";
import { GiArchiveRegister } from "react-icons/gi";

const logoFont = Audiowide({
    subset: "latin",
    weight: ["400"],
});

export default function Register() {
    return (
        <div className=" w-full min-h-screen p-5 bg-linear-to-b from-teal-700/70 to-teal-950 flex flex-col justify-center items-center gap-4">

            <header className=" h-14 px-4 flex justify-between items-center">

                {/* Logo */}
                <h1 className={` ${logoFont.className} text-3xl font-semibold text-teal-950 flex items-center gap-1.5`}>
                <GiArchiveRegister/> Build Ledger
                </h1>

            </header>

            <RegisterForm/>

        </div>
    )
}