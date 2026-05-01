"use client";

import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import HistoryTimeline, { type HistoryEntry } from "@/components/HistoryTimeline";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

// ── Histórico

const history: HistoryEntry[] = [
    { id: 1, date: "16/04/2025", time: "10:22", text: "Ana Lima fez check-in — Quarto Casal · Casa da Praia" },
    { id: 2, date: "16/04/2025", time: "08:45", text: "Recibo #0034 emitido — R$ 480,00 · João Santos" },
    { id: 3, date: "15/04/2025", time: "12:00", text: "Check-out — Carlos Mendes · Pousada do Mato Qto 02" },
];

// ── Dashboard

export default function DashboardPage() {
    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {/* Header */}
            <PageHeader
                titulo="Painel Geral"
                subtitulo="Dados Referentes: 2026"
                botao={{ label: "Novo Aluguel", onClick: () => {} }}
            />

            {/* Cards de Mátrica */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <MetricCard label="Residências"      value={4}      sub="cadastradas"    borderColor="#1C4B60" valueColor="#1C4B60" />
                <MetricCard label="Quartos Ocupados" value={7}      sub="de 14 no total" borderColor="#C23E23" valueColor="#C23E23" />
                <MetricCard label="Receita do Mês"   value={4820}   sub="15 aluguéis"    borderColor="#47977B" valueColor="#47977B" prefix="R$ " decimals={2} />
                <MetricCard label="Clientes"         value={23}     sub="cadastrados"    borderColor="#4EA3B8" valueColor="#38bdf8" />
            </div>

            <div className="grid grid-cols-[600px_1fr] gap-15">

                {/* Calendário */}
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-3">Disponibilidade</h2>
                    <AvailabilityCalendar />
                </div>

                {/* Histórico */}
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Histórico Recente</h2>
                    <div>
                        <HistoryTimeline entries={history} />
                    </div>
                </div>

            </div>
        </div>
    );
}