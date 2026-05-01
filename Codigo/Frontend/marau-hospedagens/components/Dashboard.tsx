"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import HistoryTimeline, { type HistoryEntry } from "@/components/HistoryTimeline";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import NovaReservaModal from "@/components/NovaReservaModal";

function Toast({ onDone }: { onDone: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 50);
        setTimeout(() => setVisible(false), 3000);
        setTimeout(() => onDone(), 3500);
    }, []);

    return (
        <div
            className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg transition-all duration-500"
            style={{
                backgroundColor: "#1A4A5E",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-16px)",
            }}
        >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <div>
                <p className="text-white font-semibold text-sm">Reserva confirmada!</p>
                <p className="text-white/70 text-xs">A reserva foi registrada com sucesso.</p>
            </div>
        </div>
    );
}

const history: HistoryEntry[] = [
    { id: 1, date: "16/04/2025", time: "10:22", text: "Ana Lima fez check-in — Quarto Casal · Casa da Praia" },
    { id: 2, date: "16/04/2025", time: "08:45", text: "Recibo #0034 emitido — R$ 480,00 · João Santos" },
    { id: 3, date: "15/04/2025", time: "12:00", text: "Check-out — Carlos Mendes · Pousada do Mato Qto 02" },
];

export default function DashboardPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Painel Geral"
                subtitulo="Dados Referentes: Abril 2025"
                botao={{ label: "Nova Reserva", onClick: () => setModalAberto(true) }}
            />

            <div className="grid grid-cols-4 gap-4 mb-8">
                <MetricCard label="Residências"      value={4}    sub="cadastradas"    borderColor="#1C4B60" valueColor="#1C4B60" />
                <MetricCard label="Quartos Ocupados" value={7}    sub="de 14 no total" borderColor="#C23E23" valueColor="#C23E23" />
                <MetricCard label="Receita do Mês"   value={4820} sub="15 aluguéis"    borderColor="#47977B" valueColor="#47977B" prefix="R$ " decimals={2} />
                <MetricCard label="Clientes"         value={23}   sub="cadastrados"    borderColor="#4EA3B8" valueColor="#38bdf8" />
            </div>

            <div className="grid grid-cols-[600px_1fr] gap-16">
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-3">Disponibilidade</h2>
                    <AvailabilityCalendar />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Histórico Recente</h2>
                    <HistoryTimeline entries={history} />
                </div>
            </div>

            {modalAberto && (
                <NovaReservaModal
                    onClose={() => setModalAberto(false)}
                    onConfirm={() => {
                        setModalAberto(false);
                        setShowToast(true);
                    }}
                />
            )}
        </div>
    );
}