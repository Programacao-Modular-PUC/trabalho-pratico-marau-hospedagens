"use client";

import PageHeader from "@/components/PageHeader";
import { useState, useEffect, useCallback } from "react";
import DetalhesReservaModal from "@/components/DetalhesReservaModal";
import { api, ApiError, type Aluguel, type Residencia } from "@/lib/api";

const COLS = "1.4fr 1fr 1fr 1fr 0.6fr 1fr 1fr 0.6fr";
const BRAND = "#1A4A5E";

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
                backgroundColor: "#EF4444",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-16px)",
            }}
        >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </div>
            <div>
                <p className="text-white font-semibold text-sm">Reserva cancelada!</p>
                <p className="text-white/70 text-xs">A reserva foi removida com sucesso.</p>
            </div>
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
            className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ backgroundColor: s.bg, color: s.color }}
        >
            {s.label}
        </span>
    );
}

type TabelaProps = {
    itens: Aluguel[];
    onVerDetalhes: (a: Aluguel) => void;
};

function TabelaAlugueis({ itens, onVerDetalhes }: TabelaProps) {
    if (itens.length === 0) {
        return (
            <p className="text-sm text-gray-400 px-6 py-6">Nenhum aluguel encontrado.</p>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
                className="grid px-6 py-4 text-xs font-bold tracking-widest uppercase text-white"
                style={{ backgroundColor: BRAND, gridTemplateColumns: COLS }}
            >
                <span>Cliente</span>
                <span>Quarto</span>
                <span>Entrada</span>
                <span>Saída</span>
                <span>Diárias</span>
                <span>Valor Final</span>
                <span>Status</span>
                <span>Ações</span>
            </div>

            {itens.map((a, i) => (
                <div
                    key={a.id}
                    className={`grid px-6 py-4 items-center text-sm text-gray-600 border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === itens.length - 1 ? "border-b-0" : ""}`}
                    style={{ gridTemplateColumns: COLS }}
                >
                    <span className="font-semibold text-gray-800">{a.cliente}</span>
                    <span>{a.quarto}</span>
                    <span>{a.entrada}</span>
                    <span>{a.saida}</span>
                    <span>{a.diarias}</span>
                    <span className="font-semibold text-gray-800">{a.valorFinal}</span>
                    <span><StatusBadge status={a.status} /></span>
                    <button
                        className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                        style={{ borderColor: BRAND, color: BRAND }}
                        onClick={() => {
                            if (a.acaoLabel === "Recibo") {
                                window.open(`/recibo?id=${a.id}`, "_blank");
                            } else {
                                onVerDetalhes(a);
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = BRAND;
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = BRAND;
                        }}
                    >
                        {a.acaoLabel}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default function AlugueisPage() {
    const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
    const [residencias, setResidencias] = useState<Residencia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [residenciaSelecionada, setResidenciaSelecionada] = useState("Todas");
    const [aluguelSelecionado, setAluguelSelecionado] = useState<Aluguel | null>(null);
    const [showToast, setShowToast] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const [as, rs] = await Promise.all([api.alugueis.listar(), api.residencias.listar()]);
            setAlugueis(as);
            setResidencias(rs);
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao carregar aluguéis.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await carregar();
        })();
    }, [carregar]);

    const nomesResidencias = residencias.map((r) => r.nome);

    const aluguelFiltrado = (residencia: string) =>
        alugueis.filter((a) => a.residencia === residencia);

    async function handleCancelar(id: number) {
        try {
            await api.alugueis.cancelar(id);
            setAlugueis((prev) => prev.filter((a) => a.id !== id));
            setAluguelSelecionado(null);
            setShowToast(true);
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao cancelar reserva.");
        }
    }

    async function handleMarcarOcupado(id: number) {
        try {
            const atualizado = await api.alugueis.atualizarStatus(id, "Ocupado");
            setAlugueis((prev) => prev.map((a) => (a.id === id ? atualizado : a)));
            setAluguelSelecionado(atualizado);
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao atualizar status da reserva.");
        }
    }

    return (
        <div className="px-10 py-8">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Aluguéis e Reservas"
                subtitulo="Registro de estadias e reservas futuras"
            />

            {erro && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                    {erro}
                </div>
            )}

            <div className="flex items-center gap-3 mb-8">
                <label className="text-sm font-semibold text-gray-600">Residência:</label>
                <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white shadow-sm relative cursor-pointer">
                    <select
                        value={residenciaSelecionada}
                        onChange={(e) => setResidenciaSelecionada(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    >
                        <option>Todas</option>
                        {nomesResidencias.map((r) => (
                            <option key={r}>{r}</option>
                        ))}
                    </select>
                    {residenciaSelecionada}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            {carregando ? (
                <p className="text-sm text-gray-400">Carregando aluguéis...</p>
            ) : (
                <div className="flex flex-col gap-10">
                    {nomesResidencias
                        .filter((r) => residenciaSelecionada === "Todas" || r === residenciaSelecionada)
                        .map((residencia) => (
                            <div key={residencia}>
                                <div className="flex items-center gap-3 mb-3">
                                    <h2 className="text-base font-bold" style={{ color: BRAND }}>
                                        {residencia}
                                    </h2>
                                    <span
                                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                        style={{ backgroundColor: "#E8F0F3", color: "#1A4A5E" }}
                                    >
                                        {aluguelFiltrado(residencia).length} registro{aluguelFiltrado(residencia).length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <TabelaAlugueis
                                    itens={aluguelFiltrado(residencia)}
                                    onVerDetalhes={setAluguelSelecionado}
                                />
                            </div>
                        ))}
                </div>
            )}

            {aluguelSelecionado && (
                <DetalhesReservaModal
                    aluguel={aluguelSelecionado}
                    onClose={() => setAluguelSelecionado(null)}
                    onCancelar={handleCancelar}
                    onMarcarOcupado={handleMarcarOcupado}
                />
            )}
        </div>
    );
}