"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        label: "Residências",
        href: "/residencias",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                <polyline points="9 21 9 12 15 12 15 21" />
            </svg>
        ),
    },
    {
        label: "Quartos",
        href: "/quartos",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                <path d="M2 14h20" />
                <path d="M6 14V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
            </svg>
        ),
    },
    {
        label: "Clientes",
        href: "/clientes",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        label: "Aluguéis",
        href: "/alugueis",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="M21 2l-9.6 9.6" />
                <path d="M15.5 7.5l3 3L22 7l-3-3" />
            </svg>
        ),
    },
    {
        label: "Recibo",
        href: "/recibo",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="16" y2="14" />
            </svg>
        ),
    },
];

const BRAND = "#1A4A5E";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-white border-r-2 border-[#F1F6FC] flex flex-col py-8 px-5 shrink-0">

            {/* Logo */}
            <div className="mb-8 px-1">
                <Image
                    src="/logo-marau.png"
                    alt="Maraú Hospedagens"
                    width={180}
                    height={80}
                    priority
                    style={{ width: "100%", height: "auto" }}
                />
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 ${isActive ? "shadow-md" : ""}`}
                            style={
                                isActive
                                    ? { backgroundColor: BRAND, color: "white" }
                                    : { color: "#6b7280" }
                            }
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "#f0f4f6";
                                    e.currentTarget.style.color = BRAND;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "#6b7280";
                                }
                            }}
                        >
              <span style={{ color: isActive ? "white" : "#9ca3af" }}>
                {item.icon}
              </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}