"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const selected = pathname === href;

    return (
        <div
            role="button"
            className={`flex items-center gap-3 p-3 pl-6 cursor-pointer transition-all duration-200 rounded-md
                ${selected ? "bg-gray-100 text-[#6a51a6] font-bold" : "text-slate-500 hover:text-[#6a51a6] hover:bg-gray-100"}
                active:scale-95`}
            onClick={() => router.push(href)}
        >
            <div className="text-lg">{icon}</div>
            <span>{title}</span>
        </div>
    );
};
