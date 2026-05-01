"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
    value: number;
    duration?: number; // ms
    prefix?: string;
    suffix?: string;
    decimals?: number;
};

export default function AnimatedNumber({ value, duration = 1000, prefix = "", suffix = "", decimals = 0 }: Props) {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing: ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(eased * value);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [value, duration]);

    const formatted = display.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return <span>{prefix}{formatted}{suffix}</span>;
}