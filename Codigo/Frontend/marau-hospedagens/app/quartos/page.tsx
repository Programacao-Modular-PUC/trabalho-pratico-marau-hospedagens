"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import QuartoCard from "@/components/QuartoCard";
import CadastrarQuartoModal from "@/components/CadastrarQuartoModal";

const residencias = ["Todas", "Casa da Praia", "Pousada do Mato"];

const quartos = [
    {
        id: 1,
        nome: "Quarto Solteiro",
        residencia: "Casa da Praia",
        preco: 120,
        status: "disponivel" as const,
        comodidades: [{ nome: "Ar-Condicionado", inclusa: true }],
        descricao: "Valor base: R$110 + Ar: R$10 = R$120/diária",
        cor: "#1A4A5E",
    },
    {
        id: 2,
        nome: "Quarto Casal",
        residencia: "Pousada do Mato",
        preco: 200,
        status: "ocupado" as const,
        comodidades: [
            { nome: "Ar-Condicionado", inclusa: true },
            { nome: "Hidromassagem", inclusa: true },
        ],
        descricao: "Valor base: R$160 + Ar: R$10 + Hidro: R$30 = R$200/diária",
        cor: "#C0624A",
    },
    {
        id: 3,
        nome: "Quarto Casal",
        residencia: "Casa da Praia",
        preco: 95,
        status: "disponivel" as const,
        comodidades: [],
        descricao: "Valor base: R$95 = R$95/diária",
        cor: "#1A4A5E",
    },
];

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
                <p className="text-white font-semibold text-sm">Quarto cadastrado!</p>
                <p className="text-white/70 text-xs">O quarto foi registrado com sucesso.</p>
            </div>
        </div>
    );
}

export default function QuartosPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [residenciaSelecionada, setResidenciaSelecionada] = useState("Todas");

    const residenciasParaExibir = residencias.filter((r) => r !== "Todas");

    const quartosFiltrados = (residencia: string) =>
        quartos.filter((q) => q.residencia === residencia);

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Quartos"
                subtitulo="Gerencie os quartos disponíveis para aluguel"
                botao={{ label: "Cadastrar Quarto", onClick: () => setModalAberto(true) }}
            />

            {/* Filtro */}
            <div className="flex items-center gap-3 mb-8">
                <label className="text-sm font-semibold text-gray-600">Residência:</label>
                <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white shadow-sm relative cursor-pointer">
                    <select
                        value={residenciaSelecionada}
                        onChange={(e) => setResidenciaSelecionada(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    >
                        {residencias.map((r) => <option key={r}>{r}</option>)}
                    </select>
                    {residenciaSelecionada}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            {/* Listagem por residência */}
            <div className="flex flex-col gap-10">
                {residenciasParaExibir
                    .filter((r) => residenciaSelecionada === "Todas" || r === residenciaSelecionada)
                    .map((residencia) => (
                        <div key={residencia}>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-base font-bold" style={{ color: "#1A4A5E" }}>{residencia}</h2>
                                <span
                                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                    style={{ backgroundColor: "#E8F0F3", color: "#1A4A5E" }}
                                >
                                    {quartosFiltrados(residencia).length} quarto{quartosFiltrados(residencia).length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {quartosFiltrados(residencia).map((q) => (
                                    <QuartoCard key={q.id} q={q} />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>

            {modalAberto && (
                <CadastrarQuartoModal
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