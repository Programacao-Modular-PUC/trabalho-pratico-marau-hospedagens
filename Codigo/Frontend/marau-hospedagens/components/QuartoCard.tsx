"use client";

import { useState } from "react";
import EditarQuartoModal from "@/components/EditarQuartoModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import ConferirDisponibilidadeModal from "@/components/ConferirDisponibilidadeModal";
import { api, ApiError, type Quarto } from "@/lib/api";

type Props = {
    q: Quarto;
    onChanged: () => void;
};

export default function QuartoCard({ q, onChanged }: Props) {
    const disponivel = q.status === "disponivel";

    const [modalEdicao, setModalEdicao] = useState(false);
    const [modalDisponibilidade, setModalDisponibilidade] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);

    async function handleExcluir() {
        setExcluindo(true);
        setErroExclusao(null);
        try {
            await api.quartos.deletar(q.id);
            onChanged();
        } catch (e) {
            const msg = e instanceof ApiError && e.status !== 500
                ? e.message
                : "Não é possível excluir: esse quarto tem aluguéis vinculados.";
            setErroExclusao(msg);
            setConfirmandoExclusao(false);
        } finally {
            setExcluindo(false);
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-5" style={{ backgroundColor: q.cor }}>
                <p className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-1">
                    {q.nome} · {q.residencia}
                </p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">R$ {q.preco}</span>
                    <span className="text-white/80 text-sm mb-1">/dia</span>
                </div>
            </div>

            {/* Corpo */}
            <div className="px-6 py-5 flex flex-col gap-4 flex-1 justify-between">
                {/* Status */}
                <span
                    className="self-start px-3 py-1 rounded-full text-xs font-semibold"
                    style={
                        disponivel
                            ? { backgroundColor: "#dcfce7", color: "#16a34a" }
                            : { backgroundColor: "#fee2e2", color: "#dc2626" }
                    }
                >
          {disponivel ? "DISPONÍVEL" : "OCUPADO"}
        </span>

                {/* Comodidades */}
                <div className="flex flex-wrap gap-2">
                    {q.comodidades.length > 0 ? (
                        q.comodidades.map((c) => (
                            <span
                                key={c.nome}
                                className="px-4 py-1.5 rounded-full text-sm font-medium"
                                style={{ backgroundColor: "#E8F0F3", color: "#1A4A5E" }}
                            >
                {c.nome}
            </span>
                        ))
                    ) : (
                        <span
                            className="px-4 py-1.5 rounded-full text-sm font-medium"
                            style={{ backgroundColor: "#f3f4f6", color: "#9ca3af" }}
                        >
            Sem adicionais
        </span>
                    )}
                </div>

                {/* Descrição */}
                <p className="text-sm text-gray-400">{q.descricao}</p>

                {erroExclusao && (
                    <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                        {erroExclusao}
                    </div>
                )}

                {/* Ações */}
                <div className="flex justify-end gap-2 pt-1">
                    <button
                        onClick={() => setModalDisponibilidade(true)}
                        className="px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-colors cursor-pointer"
                        style={{ borderColor: "#1A4A5E", color: "#1A4A5E" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1A4A5E"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1A4A5E"; }}
                    >
                        Conferir Datas
                    </button>
                    <button
                        onClick={() => setModalEdicao(true)}
                        title="Editar"
                        className="w-9 h-9 flex items-center justify-center rounded-xl border-2 transition-colors cursor-pointer"
                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setConfirmandoExclusao(true)}
                        title="Excluir"
                        className="w-9 h-9 flex items-center justify-center rounded-xl border-2 transition-colors cursor-pointer"
                        style={{ borderColor: "#EF4444", color: "#EF4444" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EF4444"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </div>
            </div>

            {modalDisponibilidade && (
                <ConferirDisponibilidadeModal
                    quarto={q}
                    onClose={() => setModalDisponibilidade(false)}
                    onReservado={() => { setModalDisponibilidade(false); onChanged(); }}
                />
            )}

            {modalEdicao && (
                <EditarQuartoModal
                    quarto={q}
                    onClose={() => setModalEdicao(false)}
                    onConfirm={() => { setModalEdicao(false); onChanged(); }}
                />
            )}

            {confirmandoExclusao && (
                <ConfirmDialog
                    titulo="Excluir quarto?"
                    mensagem={`Isso vai remover "${q.nome}" de ${q.residencia} permanentemente.`}
                    enviando={excluindo}
                    onConfirm={handleExcluir}
                    onCancel={() => { setConfirmandoExclusao(false); setErroExclusao(null); }}
                />
            )}
        </div>
    );
}