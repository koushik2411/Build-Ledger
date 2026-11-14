import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiBallPyramid, GiBrickWall, GiConcreteBag, GiLouvrePyramid, GiPaintBucket, GiSteelDoor, GiTap, GiWindowBars } from "react-icons/gi";
import { GrUserWorker } from "react-icons/gr";
import { IoBulb } from "react-icons/io5";
import { RiBarChartLine, RiPaintBrushFill } from "react-icons/ri";
import { SiOpensourcehardware } from "react-icons/si";
import { TbWindow } from "react-icons/tb";

export const categories = [
    {
        title: "Aggregate",
        icon: <GiBallPyramid/>,
        iconColor: "text-stone-600",
        cardColors: "bg-linear-to-b from-stone-300/10 to-stone-500/20",
        path: "/aggregate",
    },
    {
        title: "Brick",
        icon: <GiBrickWall/>,
        iconColor: "text-red-700",
        cardColors: "bg-linear-to-b from-red-300/10 to-red-400/20",
        path: "/brick",
    },
    {
        title: "Cement",
        icon: <GiConcreteBag/>,
        iconColor: "text-slate-600",
        cardColors: "bg-linear-to-b from-slate-300/10 to-slate-400/20",
        path: "/cement",
    },
    {
        title: "Contractors",
        icon: <GrUserWorker/>,
        iconColor: "text-violet-500",
        cardColors: "bg-linear-to-b from-violet-300/10 to-violet-400/20",
        path: "/contractors",
    },
    {
        title: "Doors",
        icon: <GiSteelDoor/>,
        iconColor: "text-amber-800",
        cardColors: "bg-linear-to-b from-amber-300/10 to-amber-600/20",
        path: "/doors",
    },
    {
        title: "Electrical",
        icon: <IoBulb/>,
        iconColor: "text-yellow-400",
        cardColors: "bg-linear-to-b from-yellow-300/10 to-yellow-400/20",
        path: "electrical",
    },
    {
        title: "Hardware",
        icon: <SiOpensourcehardware/>,
        iconColor: "text-zinc-600",
        cardColors: "bg-linear-to-b from-zinc-300/10 to-zinc-400/20",
        path: "/hardware",
    },
    {
        title: "Others",
        icon: <FaMoneyBillTrendUp/>,
        iconColor: "text-emerald-600",
        cardColors: "bg-linear-to-b from-emerald-300/10 to-emerald-400/20",
        path: "/others",
    },
    {
        title: "Paint",
        icon: <RiPaintBrushFill/>,
        iconColor: "text-rose-500",
        cardColors: "bg-linear-to-b from-rose-300/10 to-rose-400/20",
        path: "/paint",
    },
    {
        title: "Plumbing",
        icon: <GiTap/>,
        iconColor: "text-blue-500",
        cardColors: "bg-linear-to-b from-blue-300/10 to-blue-400/20",
        path: "/plumbing",
    },
    {
        title: "Putty",
        icon: <GiPaintBucket/>,
        iconColor: "text-teal-500",
        cardColors: "bg-linear-to-b from-teal-300/10 to-teal-400/20",
        path: "/putty",
    },
    {
        title: "Sand",
        icon: <GiLouvrePyramid/>,
        iconColor: "text-yellow-600",
        cardColors: "bg-linear-to-b from-yellow-300/10 to-yellow-400/20",
        path: "/sand",
    },
    {
        title: "Steel",
        icon: <RiBarChartLine/>,
        iconColor: "text-indigo-800",
        cardColors: "bg-linear-to-b from-indigo-300/10 to-indigo-400/20",
        path: "/steel",
    },
    {
        title: "Welding",
        icon: <GiWindowBars/>,
        iconColor: "text-orange-500",
        cardColors: "bg-linear-to-b from-orange-300/10 to-orange-400/20",
        path: "/welding",
    },
    {
        title: "Windows",
        icon: <TbWindow/>,
        iconColor: "text-sky-500",
        cardColors: "bg-linear-to-b from-sky-300/10 to-sky-400/20",
        path: "/windows",
    },
];



// {
//     title: "",
//     icon: "",
//     path: "",
// },