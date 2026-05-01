"use client";

import { useState, useEffect } from "react";

type DayStatus = "available" | "occupied" | "today" | "empty";

function buildCalendar(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
}

const dayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const occupiedDays = new Set([8, 9, 10, 18, 19, 20, 24]);
const todayDay = 30;

function dayStatus(day: number | null): DayStatus {
    if (!day) return "empty";
    if (day === todayDay) return "today";
    if (occupiedDays.has(day)) return "occupied";
    return "available";
}

const statusClass: Record<DayStatus, string> = {
    available: "bg-green-100 text-green-700",
    occupied: "bg-red-100 text-red-400",
    today: "text-white font-bold",
    empty: "",
};

export default function AvailabilityCalendar() {
    const [mes, setMes] = useState(3);
    const [ano, setAno] = useState(2026);

    useEffect(() => {
        if (mes > 11) { setMes(0); setAno((a) => a + 1); }
        if (mes < 0)  { setMes(11); setAno((a) => a - 1); }
    }, [mes]);

    const mesNome = new Date(ano, mes, 1).toLocaleString("pt-BR", { month: "long" });
    const cells = buildCalendar(ano, mes);

    return (
        <div className="flex flex-col gap-3">
            {/* Dropdowns */}
            <div className="flex gap-2">
                {["Residência", "Quarto"].map((val) => (
                    <button
                        key={val}
                        className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-teal-400 transition-colors cursor-pointer bg-white shadow-sm"
                    >
                        {val}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                ))}
            </div>

            {/* Card calendário */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4 w-full">

                {/* Navegação mês */}
                <div className="flex items-center justify-between px-2">
                    <button
                        onClick={() => setMes((m) => m - 1)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#1A4A5E" }}>
                        {mesNome} {ano}
                    </div>

                    <button
                        onClick={() => setMes((m) => m + 1)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Cabeçalho dias */}
                <div className="grid grid-cols-7 gap-1 text-[11px] text-gray-400 text-center font-semibold">
                    {dayLabels.map((d) => <div key={d}>{d}</div>)}
                </div>

                {/* Dias */}
                <div className="grid grid-cols-7 gap-2">
                    {cells.map((day, idx) => {
                        const status = dayStatus(day);
                        return (
                            <div
                                key={idx}
                                className={`h-11 w-full flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all
                  ${status === "empty" ? "" : statusClass[status]}
                  ${status !== "empty" && status !== "today" ? "hover:opacity-75" : ""}`}
                                style={status === "today" ? { backgroundColor: "#1A4A5E" } : {}}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>

                {/* Legenda */}
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-100 inline-block" /> Disponível
          </span>
                    <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-100 inline-block" /> Ocupado
          </span>
                    <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "#1A4A5E" }} /> Hoje
          </span>
                </div>
            </div>
        </div>
    );
}