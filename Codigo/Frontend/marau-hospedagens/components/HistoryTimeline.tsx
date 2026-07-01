"use client";

import { useEffect, useRef, useState } from "react";

export type HistoryEntry = {
    id: number;
    date: string;
    cliente: string;
    local: string;
    status: "reserva" | "ocupado" | "concluido";
};

const BRAND = "#1A4A5E";

function StatusBadge({ status }: { status: HistoryEntry["status"] }) {
    const map = {
        reserva:   { label: "RESERVA",   bg: "#dbeafe", color: "#2563eb" },
        ocupado:   { label: "OCUPADO",   bg: "#dcfce7", color: "#16a34a" },
        concluido: { label: "CONCLUÍDO", bg: "#f3f4f6", color: "#6b7280" },
    };
    const s = map[status];
    return (
        <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap"
            style={{ backgroundColor: s.bg, color: s.color }}
        >
            {s.label}
        </span>
    );
}

export default function HistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
    const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
    const prevIdsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        const currentIds = new Set(entries.map((e) => e.id));
        const newIds = new Set<number>();

        currentIds.forEach((id) => {
            if (!prevIdsRef.current.has(id)) newIds.add(id);
        });

        if (newIds.size > 0) {
            setVisibleIds((prev) => {
                const next = new Set(prev);
                newIds.forEach((id) => next.delete(id));
                return next;
            });

            setTimeout(() => {
                setVisibleIds((prev) => {
                    const next = new Set(prev);
                    newIds.forEach((id) => next.add(id));
                    return next;
                });
            }, 50);
        } else {
            setVisibleIds(currentIds);
        }

        prevIdsRef.current = currentIds;
    }, [entries]);

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {entries.map((entry, i) => {
                const isVisible = visibleIds.has(entry.id);
                return (
                    <div
                        key={entry.id}
                        className={`flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 transition-all duration-500 ease-out hover:bg-gray-50
                            ${i === entries.length - 1 ? "border-b-0" : ""}`}
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(-8px)",
                        }}
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: BRAND }}>{entry.cliente}</p>
                            <p className="text-xs text-gray-400 truncate">{entry.local}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <StatusBadge status={entry.status} />
                            <span className="text-xs text-gray-400 w-14 text-right">{entry.date}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}