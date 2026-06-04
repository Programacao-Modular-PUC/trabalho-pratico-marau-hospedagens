"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import NovoClienteModal from "@/components/NovoClienteModal";
import HistoricoClienteModal from "@/components/HistoricoClienteModal";

type StatusHospedagem = "ativo" | "data" | "reserva";

type Cliente = {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: string;
    ultimaHospedagem: string;
    statusTipo: StatusHospedagem;
};

const clientes: Cliente[] = [
    {
        id: 1,
        nome: "Ana Lima",
        cpf: "032.456.789-01",
        email: "ana.lima@email.com",
        telefone: "(11) 98765-4321",
        endereco: "São Paulo, SP",
        ultimaHospedagem: "ATIVO",
        statusTipo: "ativo",
    },
    {
        id: 2,
        nome: "João Santos",
        cpf: "045.678.912-23",
        email: "joao.santos@email.com",
        telefone: "(21) 97654-3210",
        endereco: "Rio de Janeiro, RJ",
        ultimaHospedagem: "16/04/2025",
        statusTipo: "data",
    },
    {
        id: 3,
        nome: "Carlos Mendes",
        cpf: "078.901.234-56",
        email: "carlos.m@email.com",
        telefone: "(31) 96543-2109",
        endereco: "Belo Horizonte, MG",
        ultimaHospedagem: "15/04/2025",
        statusTipo: "data",
    },
    {
        id: 4,
        nome: "Marina Faria",
        cpf: "089.123.456-78",
        email: "marina.faria@email.com",
        telefone: "(41) 95432-1098",
        endereco: "Curitiba, PR",
        ultimaHospedagem: "RESERVA 20/04",
        statusTipo: "reserva",
    },
];

function StatusBadge({ tipo, label }: { tipo: StatusHospedagem; label: string }) {
    const styles = {
        ativo:   { backgroundColor: "#dcfce7", color: "#16a34a" },
        data:    { backgroundColor: "#f3f4f6", color: "#6b7280" },
        reserva: { backgroundColor: "#dbeafe", color: "#2563eb" },
    };

    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={styles[tipo]}
        >
      {label}
    </span>
    );
}

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
                <p className="text-white font-semibold text-sm">Cliente cadastrado!</p>
                <p className="text-white/70 text-xs">O cliente foi registrado com sucesso.</p>
            </div>
        </div>
    );
}

export default function ClientesPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState<typeof clientes[0] | null>(null);

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Clientes"
                subtitulo="Cadastro e autenticação de hóspedes"
                botao={{ label: "Novo Cliente", onClick: () => setModalAberto(true) }}
            />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Cabeçalho da tabela */}
                <div
                    className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_auto] px-6 py-4 text-xs font-bold tracking-widest uppercase text-white"
                    style={{ backgroundColor: "#1A4A5E" }}
                >
                    <span>Nome</span>
                    <span>CPF</span>
                    <span>E-mail</span>
                    <span>Telefone</span>
                    <span>Endereço</span>
                    <span>Última Hospedagem</span>
                    <span>Ações</span>
                </div>

                {/* Linhas */}
                {clientes.map((c, i) => (
                    <div
                        key={c.id}
                        className={`grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_auto] px-6 py-4 items-center text-sm text-gray-600 border-b border-gray-100 transition-colors hover:bg-gray-50
              ${i === clientes.length - 1 ? "border-b-0" : ""}`}
                    >
                        <span className="font-semibold text-gray-800">{c.nome}</span>
                        <span>{c.cpf}</span>
                        <span>{c.email}</span>
                        <span>{c.telefone}</span>
                        <span>{c.endereco}</span>
                        <span>
              <StatusBadge tipo={c.statusTipo} label={c.ultimaHospedagem} />
            </span>
                        <button
                            onClick={() => setClienteSelecionado(c)}
                            className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                            style={{ borderColor: "#1A4A5E", color: "#1A4A5E" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#1A4A5E";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#1A4A5E";
                            }}
                        >
                            Ver
                        </button>
                    </div>
                ))}
            </div>
            {modalAberto && (
                <NovoClienteModal
                    onClose={() => setModalAberto(false)}
                    onConfirm={() => {
                        setModalAberto(false);
                        setShowToast(true);
                    }}
                />
            )}
            {clienteSelecionado && (
                <HistoricoClienteModal
                    cliente={clienteSelecionado}
                    onClose={() => setClienteSelecionado(null)}
                />
            )}
        </div>
    );
}