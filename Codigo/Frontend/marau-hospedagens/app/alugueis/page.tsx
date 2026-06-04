"use client";

import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";

type StatusAluguel = "ocupado" | "reserva" | "concluido";

type Aluguel = {
    id: number;
    cliente: string;
    residencia: string;
    quarto: string;
    entrada: string;
    saida: string;
    diarias: number;
    valorFinal: string;
    status: StatusAluguel;
    acaoLabel: string;
};

const alugueis: Aluguel[] = [
    {
        id: 1,
        cliente: "Ana Lima",
        residencia: "Casa Praiana",
        quarto: "Qto 02",
        entrada: "17/04 12:00",
        saida: "21/04 12:00",
        diarias: 4,
        valorFinal: "R$ 800,00",
        status: "ocupado",
        acaoLabel: "Ver",
    },
    {
        id: 2,
        cliente: "João Santos",
        residencia: "Casa Praiana",
        quarto: "Qto 01",
        entrada: "12/04 12:00",
        saida: "16/04 12:00",
        diarias: 4,
        valorFinal: "R$ 480,00",
        status: "concluido",
        acaoLabel: "Recibo",
    },
    {
        id: 3,
        cliente: "Marina Faria",
        residencia: "Pousada do Mato",
        quarto: "Qto 01",
        entrada: "20/04 12:00",
        saida: "25/04 12:00",
        diarias: 5,
        valorFinal: "R$ 475,00",
        status: "reserva",
        acaoLabel: "Ver",
    },
    {
        id: 4,
        cliente: "Carlos Mendes",
        residencia: "Pousada do Mato",
        quarto: "Qto 02",
        entrada: "10/04 12:00",
        saida: "14/04 12:00",
        diarias: 4,
        valorFinal: "R$ 360,00",
        status: "concluido",
        acaoLabel: "Recibo",
    },
];

const residencias = ["Todas", "Casa Praiana", "Pousada do Mato"];

const COLS = "1.4fr 1fr 1fr 1fr 0.6fr 1fr 1fr 0.6fr";
const BRAND = "#1A4A5E";

function StatusBadge({ status }: { status: StatusAluguel }) {
    const map = {
        ocupado:   { label: "OCUPADO",   bg: "#dcfce7", color: "#16a34a" },
        reserva:   { label: "RESERVA",   bg: "#dbeafe", color: "#2563eb" },
        concluido: { label: "CONCLUÍDO", bg: "#f3f4f6", color: "#6b7280" },
    };
    const s = map[status];
    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ backgroundColor: s.bg, color: s.color }}
        >
            {s.label}
        </span>
    );
}

function TabelaAlugueis({ itens }: { itens: Aluguel[] }) {
    const router = useRouter();

    if (itens.length === 0) return (
        <p className="text-sm text-gray-400 px-6 py-6">Nenhum aluguel encontrado.</p>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Cabeçalho */}
            <div
                className="grid px-6 py-4 text-xs font-bold tracking-widest uppercase text-white"
                style={{ backgroundColor: BRAND, gridTemplateColumns: COLS }}
            >
                <span>Cliente</span>
                <span>Quarto</span>
                <span>Entrada</span>
                <span>Saída</span>
                <span>Diárias</span>
                <span>Valor Final</span>
                <span>Status</span>
                <span>Ações</span>
            </div>

            {/* Linhas */}
            {itens.map((a, i) => (
                <div
                    key={a.id}
                    className={`grid px-6 py-4 items-center text-sm text-gray-600 border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === itens.length - 1 ? "border-b-0" : ""}`}
                    style={{ gridTemplateColumns: COLS }}
                >
                    <span className="font-semibold text-gray-800">{a.cliente}</span>
                    <span>{a.quarto}</span>
                    <span>{a.entrada}</span>
                    <span>{a.saida}</span>
                    <span>{a.diarias}</span>
                    <span className="font-semibold text-gray-800">{a.valorFinal}</span>
                    <span><StatusBadge status={a.status} /></span>
                    <button
                        className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                        style={{ borderColor: BRAND, color: BRAND }}
                        onClick={() => {
                            if (a.acaoLabel === "Recibo") {
                                window.open(`/recibo?id=${a.id}`, "_blank");
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = BRAND;
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = BRAND;
                        }}
                    >
                        {a.acaoLabel}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default function AlugueisPage() {
    const [residenciaSelecionada, setResidenciaSelecionada] = useState("Todas");

    // Agrupa por residência
    const residenciasParaExibir = residencias.filter((r) => r !== "Todas");

    const aluguelFiltrado = (residencia: string) =>
        alugueis.filter((a) => a.residencia === residencia);

    return (
        <div className="px-10 py-8">
            <PageHeader
                titulo="Aluguéis e Reservas"
                subtitulo="Registro de estadias e reservas futuras"
            />

            {/* Filtro de residência */}
            <div className="flex items-center gap-3 mb-8">
                <label className="text-sm font-semibold text-gray-600">Residência:</label>
                <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white shadow-sm relative cursor-pointer">
                    <select
                        value={residenciaSelecionada}
                        onChange={(e) => setResidenciaSelecionada(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    >
                        {residencias.map((r) => (
                            <option key={r}>{r}</option>
                        ))}
                    </select>
                    {residenciaSelecionada}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            {/* Listagem separada por residência */}
            <div className="flex flex-col gap-10">
                {residenciasParaExibir
                    .filter((r) => residenciaSelecionada === "Todas" || r === residenciaSelecionada)
                    .map((residencia) => (
                        <div key={residencia}>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-base font-bold" style={{ color: BRAND }}>
                                    {residencia}
                                </h2>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#E8F0F3", color: "#1A4A5E" }}>
                                    {aluguelFiltrado(residencia).length} registro{aluguelFiltrado(residencia).length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <TabelaAlugueis itens={aluguelFiltrado(residencia)} />
                        </div>
                    ))}
            </div>
        </div>
    );
}