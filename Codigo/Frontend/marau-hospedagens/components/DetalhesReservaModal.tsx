"use client";

import { useState } from "react";
import type { Aluguel } from "@/lib/api";

type Props = {
    aluguel: Aluguel;
    onClose: () => void;
    onCancelar: (id: number) => void;
};

const BRAND = "#1A4A5E";

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-gray-700">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: Aluguel["status"] }) {
    const map = {
        ocupado:   { label: "OCUPADO",   bg: "#dcfce7", color: "#16a34a" },
        reserva:   { label: "RESERVA",   bg: "#dbeafe", color: "#2563eb" },
        concluido: { label: "CONCLUÍDO", bg: "#f3f4f6", color: "#6b7280" },
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

export default function DetalhesReservaModal({ aluguel: a, onClose, onCancelar }: Props) {
    const [confirmando, setConfirmando] = useState(false);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: BRAND }}>Detalhes da Reserva</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{a.residencia} · {a.quarto}</p>
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

                {/* Status + Cliente */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100" style={{ backgroundColor: "#FAF5EE" }}>
                    <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Cliente</p>
                        <p className="text-base font-bold text-gray-800">{a.cliente}</p>
                    </div>
                    <StatusBadge status={a.status} />
                </div>

                {/* Infos */}
                <div className="px-6 py-5 grid grid-cols-2 gap-5">
                    <InfoItem label="Entrada" value={a.entrada} />
                    <InfoItem label="Saída" value={a.saida} />
                    <InfoItem label="Diárias" value={`${a.diarias} diária${a.diarias !== 1 ? "s" : ""}`} />
                    <InfoItem label="Valor Total" value={a.valorFinal} />
                </div>

                {/* Aviso cancelamento — só para reservas */}
                {a.status === "reserva" && (
                    <div
                        className="mx-6 mb-4 px-4 py-3 rounded-xl flex items-start gap-3 text-sm"
                        style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>
                            {confirmando
                                ? "Tem certeza? Essa ação não pode ser desfeita."
                                : "Ao cancelar, a reserva será removida e o quarto voltará a ficar disponível."}
                        </span>
                    </div>
                )}

                {/* Footer */}
                <div
                    className="flex px-6 py-4 border-t border-gray-100 gap-3"
                    style={{ justifyContent: a.status === "reserva" ? "space-between" : "flex-end" }}
                >
                    {a.status === "reserva" && (
                        confirmando ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmando(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all"
                                    style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => onCancelar(a.id)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
                                    style={{ backgroundColor: "#EF4444" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EF4444"; }}
                                >
                                    Sim, cancelar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmando(true)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all"
                                style={{ borderColor: "#EF4444", color: "#EF4444" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#EF4444";
                                    e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "#EF4444";
                                }}
                            >
                                Cancelar Reserva
                            </button>
                        )
                    )}
                    {!confirmando && (
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors"
                            style={{ backgroundColor: BRAND }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15394d"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                        >
                            Fechar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}