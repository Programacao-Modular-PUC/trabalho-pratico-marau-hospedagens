"use client";

import { useEffect, useRef, useState } from "react";

export type HistoryEntry = {
    id: number;
    date: string;
    time: string;
    text: string;
};

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
            // Itens novos começam invisíveis
            setVisibleIds((prev) => {
                const next = new Set(prev);
                newIds.forEach((id) => next.delete(id));
                return next;
            });

            // Após 50ms animam para visível
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
        <div className="relative pl-6">
            <div
                className="absolute left-[7px] top-2 w-0.5 bg-[#E5D3BA]"
                style={{ height: `calc(100% - 2rem)` }}
            />
            <div className="flex flex-col gap-5">
                {entries.map((entry) => {
                    const isVisible = visibleIds.has(entry.id);
                    return (
                        <div
                            key={entry.id}
                            className="relative transition-all duration-500 ease-out"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? "translateY(0)" : "translateY(-12px)",
                            }}
                        >
                            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center"
                                 style={{ borderColor: "#3C8FAD" }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3C8FAD" }} />
                            </div>
                            <div className="text-xs text-gray-400 mb-0.5">
                                {entry.date} · {entry.time}
                            </div>
                            <div className="text-sm font-medium" style={{ color: "#1A4A5E" }}>
                                {entry.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}