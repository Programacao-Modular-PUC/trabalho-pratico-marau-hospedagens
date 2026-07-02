"use client";

import { useState } from "react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import NovaReservaModal from "@/components/NovaReservaModal";
import type { Quarto } from "@/lib/api";

type Props = {
    quarto: Quarto;
    onClose: () => void;
    onReservado: () => void;
};

const BRAND = "#1A4A5E";

function formatarLabel(iso: string): string {
    const [ano, mes, dia] = iso.split("-").map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function ConferirDisponibilidadeModal({ quarto, onClose, onReservado }: Props) {
    const [entrada, setEntrada] = useState<string | null>(null);
    const [saida, setSaida] = useState<string | null>(null);
    const [modalReserva, setModalReserva] = useState(false);

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: BRAND }}>Conferir disponibilidade</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{quarto.nome} · {quarto.residencia}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-6 py-6 flex flex-col gap-4">
                        <p className="text-sm text-gray-500">Selecione um intervalo para verificar se o quarto fica disponível.</p>

                        <AvailabilityCalendar
                            residenciaInicial={quarto.residencia}
                            quartoInicial={quarto.nome}
                            onRangeSelect={(e, s) => { setEntrada(e); setSaida(s); }}
                        />

                        {entrada && saida && (
                            <div className="rounded-xl px-4 py-3 flex flex-col gap-3" style={{ backgroundColor: "#E8F0F3" }}>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Intervalo selecionado</p>
                                    <p className="text-sm font-semibold" style={{ color: BRAND }}>
                                        Entrada: {formatarLabel(entrada)} &nbsp;·&nbsp; Saída: {formatarLabel(saida)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setModalReserva(true)}
                                    className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors"
                                    style={{ backgroundColor: BRAND }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15394d"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                                >
                                    Agendar Reserva
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modalReserva && entrada && saida && (
                <NovaReservaModal
                    residenciaInicial={quarto.residencia}
                    quartoInicial={quarto.nome}
                    entradaInicial={entrada}
                    saidaInicial={saida}
                    onClose={() => setModalReserva(false)}
                    onConfirm={() => {
                        setModalReserva(false);
                        onReservado();
                    }}
                />
            )}
        </>
    );
}