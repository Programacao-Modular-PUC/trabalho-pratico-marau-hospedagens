"use client";

import PageHeader from "@/components/PageHeader";
import QuartoCard from "@/components/QuartoCard";

const quartos = [
    {
        id: 1,
        nome: "Quarto Solteiro",
        residencia: "Casa da Praia",
        preco: 120,
        status: "disponivel" as const,
        comodidades: [
            { nome: "Ar-Condicionado", inclusa: true },
            { nome: "Hidromassagem", inclusa: false },
        ],
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
        comodidades: [
            { nome: "Ar-Condicionado", inclusa: false },
            { nome: "Hidromassagem", inclusa: false },
        ],
        descricao: "Valor base: R$95 = R$95/diária",
        cor: "#1A4A5E",
    },
];

export default function QuartosPage() {
    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            <PageHeader
                titulo="Quartos"
                subtitulo="Gerencie os quartos disponíveis para aluguel"
                botao={{ label: "Cadastrar Quarto", onClick: () => {} }}
            />
            <div className="grid grid-cols-3 gap-6">
                {quartos.map((q) => (
                    <QuartoCard key={q.id} q={q} />
                ))}
            </div>
        </div>
    );
}