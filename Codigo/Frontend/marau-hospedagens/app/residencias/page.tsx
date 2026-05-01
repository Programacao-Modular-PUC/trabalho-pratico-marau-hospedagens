"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import ResidenciaCard from "@/components/ResidenciaCard";
import CadastrarResidenciaModal from "@/components/CadastrarResidenciaModal";

const residencias = [
    {
        id: 1,
        nome: "Casa Praiana",
        endereco: "Rua das Amendoeiras, 42 · Barra Grande",
        cep: "45520-000",
        telefone: "(73) 98876-1234",
        email: "casapraiana@email.com",
        totalQuartos: 4,
        disponiveis: 3,
        ocupados: 1,
        cor: "#1A4A5E",
    },
    {
        id: 2,
        nome: "Pousada do Mato",
        endereco: "Alameda das Bromélias, 8 · Algodões",
        cep: "45520-100",
        telefone: "(73) 99001-5566",
        email: "pousadamato@email.com",
        totalQuartos: 6,
        disponiveis: 3,
        ocupados: 3,
        cor: "#C0624A",
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
                <p className="text-white font-semibold text-sm">Residência cadastrada!</p>
                <p className="text-white/70 text-xs">A residência foi registrada com sucesso.</p>
            </div>
        </div>
    );
}

export default function ResidenciasPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Residências"
                subtitulo="Gerencie as propriedades cadastradas no sistema"
                botao={{ label: "Cadastrar Residência", onClick: () => setModalAberto(true) }}
            />
            <div className="grid grid-cols-2 gap-6">
                {residencias.map((r) => (
                    <ResidenciaCard key={r.id} r={r} />
                ))}
            </div>

            {modalAberto && (
                <CadastrarResidenciaModal
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