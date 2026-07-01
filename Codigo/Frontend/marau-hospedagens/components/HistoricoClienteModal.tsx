"use client";

import { useEffect, useState } from "react";
import { api, ApiError, type HistoricoCliente, type Aluguel } from "@/lib/api";

type Props = {
    clienteId: number;
    onClose: () => void;
};

const BRAND = "#1A4A5E";

function StatusBadge({ status }: { status: Aluguel["status"] }) {
    const map: Record<Aluguel["status"], { label: string; bg: string; color: string }> = {
        ocupado: { label: "ATIVO", bg: "#dcfce7", color: "#16a34a" },
        concluido: { label: "CONCLUÍDO", bg: "#f3f4f6", color: "#6b7280" },
        reserva: { label: "RESERVA", bg: "#dbeafe", color: "#2563eb" },
    };
    const s = map[status];
    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: s.bg, color: s.color }}
        >
            {s.label}
        </span>
    );
}

export default function HistoricoClienteModal({ clienteId, onClose }: Props) {
    const [dados, setDados] = useState<HistoricoCliente | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setCarregando(true);
            setErro(null);
            try {
                setDados(await api.clientes.historico(clienteId));
            } catch (e) {
                setErro(e instanceof ApiError ? e.message : "Erro ao carregar histórico do cliente.");
            } finally {
                setCarregando(false);
            }
        })();
    }, [clienteId]);

    const cliente = dados?.cliente;
    const historico = dados?.historico ?? [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: BRAND }}>{cliente?.nome ?? "Cliente"}</h2>
                        {cliente && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                CPF: {cliente.cpf} · {cliente.email}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {carregando ? (
                    <p className="text-sm text-gray-400 px-6 py-6">Carregando...</p>
                ) : erro ? (
                    <p className="text-sm px-6 py-6" style={{ color: "#B91C1C" }}>{erro}</p>
                ) : cliente && (
                    <>
                        {/* Infos do cliente */}
                        <div className="px-6 py-4 grid grid-cols-3 gap-4 border-b border-gray-100" style={{ backgroundColor: "#FAF5EE" }}>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Telefone</p>
                                <p className="text-sm font-medium text-gray-700">{cliente.telefone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Endereço</p>
                                <p className="text-sm font-medium text-gray-700">{cliente.endereco}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Total de estadias</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {historico.length} hospedagem{historico.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {/* Histórico */}
                        <div className="px-6 py-5">
                            <h3 className="text-sm font-bold text-gray-700 mb-4">Histórico de Hospedagens</h3>

                            {historico.length === 0 ? (
                                <p className="text-sm text-gray-400">Nenhuma hospedagem encontrada.</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {historico.map((h) => (
                                        <div
                                            key={h.id}
                                            className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {h.residencia} · {h.quarto}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {h.entrada} → {h.saida} · {h.diarias} diária{h.diarias !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-bold" style={{ color: BRAND }}>
                                                    {h.valorFinal}
                                                </span>
                                                <StatusBadge status={h.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}