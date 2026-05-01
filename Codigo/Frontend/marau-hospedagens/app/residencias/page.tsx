"use client";

import PageHeader from "@/components/PageHeader";
import ResidenciaCard from "@/components/ResidenciaCard";

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

export default function ResidenciasPage() {
    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            <PageHeader
                titulo="Residências"
                subtitulo="Gerencie as propriedades cadastradas no sistema"
                botao={{ label: "Cadastrar Residência", onClick: () => {} }}
            />
            <div className="grid grid-cols-2 gap-6">
                {residencias.map((r) => (
                    <ResidenciaCard key={r.id} r={r} />
                ))}
            </div>
        </div>
    );
}