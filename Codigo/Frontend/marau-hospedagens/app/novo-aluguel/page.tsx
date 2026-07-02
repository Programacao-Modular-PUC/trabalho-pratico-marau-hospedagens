"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import NovaReservaModal from "@/components/NovaReservaModal";

export default function NovoAluguelPage() {
    const [modalAberto, setModalAberto] = useState(false);

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            <PageHeader
                titulo="Novo Aluguel"
                subtitulo="Cadastre uma nova reserva diretamente pela interface"
                botao={{ label: "Nova Reserva", onClick: () => setModalAberto(true) }}
            />

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">
                    Use o botão acima para abrir o fluxo de cadastro de uma nova reserva.
                </p>
            </div>

            {modalAberto && (
                <NovaReservaModal
                    onClose={() => setModalAberto(false)}
                    onConfirm={() => setModalAberto(false)}
                />
            )}
        </div>
    );
}
