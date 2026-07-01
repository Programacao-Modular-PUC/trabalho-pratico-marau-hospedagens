"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import QuartoCard from "@/components/QuartoCard";
import CadastrarQuartoModal from "@/components/CadastrarQuartoModal";
import { api, ApiError, type Quarto, type Residencia } from "@/lib/api";

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
                <p className="text-white font-semibold text-sm">Quarto cadastrado!</p>
                <p className="text-white/70 text-xs">O quarto foi registrado com sucesso.</p>
            </div>
        </div>
    );
}

function QuartosContent() {
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [residenciaSelecionada, setResidenciaSelecionada] = useState("Todas");
    const [tipoSelecionado, setTipoSelecionado] = useState("Todos");

    const [residencias, setResidencias] = useState<Residencia[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const param = searchParams.get("residencia");
        if (param) queueMicrotask(() => setResidenciaSelecionada(param));
    }, [searchParams]);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const [rs, qs] = await Promise.all([api.residencias.listar(), api.quartos.listar()]);
            setResidencias(rs);
            setQuartos(qs);
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao carregar quartos.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await carregar();
        })();
    }, [carregar]);

    const tipos = ["Todos", "Individual", "Duplo", "Familia"];
    const nomesResidencias = residencias.map((r) => r.nome);

    const quartosFiltrados = (residencia: string) =>
        quartos.filter((q) =>
            q.residencia === residencia &&
            (tipoSelecionado === "Todos" || q.tipo === tipoSelecionado)
        );

    async function handleCadastrado() {
        setModalAberto(false);
        setShowToast(true);
        carregar();
    }

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Quartos"
                subtitulo="Gerencie os quartos disponíveis para aluguel"
                botao={{ label: "Cadastrar Quarto", onClick: () => setModalAberto(true) }}
            />

            {erro && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                    {erro}
                </div>
            )}

            {/* Filtros */}
            <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-600">Residência:</label>
                    <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white shadow-sm relative cursor-pointer">
                        <select
                            value={residenciaSelecionada}
                            onChange={(e) => setResidenciaSelecionada(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        >
                            <option>Todas</option>
                            {nomesResidencias.map((r) => <option key={r}>{r}</option>)}
                        </select>
                        {residenciaSelecionada}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-600">Tipo:</label>
                    <div className="flex gap-2">
                        {tipos.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTipoSelecionado(t)}
                                className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
                                style={{
                                    borderColor: tipoSelecionado === t ? "#1A4A5E" : "#e5e7eb",
                                    backgroundColor: tipoSelecionado === t ? "#E8F0F3" : "white",
                                    color: tipoSelecionado === t ? "#1A4A5E" : "#6b7280",
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {carregando ? (
                <p className="text-sm text-gray-400">Carregando quartos...</p>
            ) : (
                /* Listagem por residência */
                <div className="flex flex-col gap-10">
                    {nomesResidencias
                        .filter((r) => residenciaSelecionada === "Todas" || r === residenciaSelecionada)
                        .map((residencia) => (
                            <div key={residencia}>
                                <div className="flex items-center gap-3 mb-3">
                                    <h2 className="text-base font-bold" style={{ color: "#1A4A5E" }}>{residencia}</h2>
                                    <span
                                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                        style={{ backgroundColor: "#E8F0F3", color: "#1A4A5E" }}
                                    >
                                        {quartosFiltrados(residencia).length} quarto{quartosFiltrados(residencia).length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {quartosFiltrados(residencia).map((q) => (
                                        <QuartoCard key={q.id} q={q} />
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {modalAberto && (
                <CadastrarQuartoModal
                    residencias={residencias}
                    onClose={() => setModalAberto(false)}
                    onConfirm={handleCadastrado}
                />
            )}
        </div>
    );
}

export default function QuartosPage() {
    return (
        <Suspense fallback={<div className="flex-1 px-10 py-8">Carregando...</div>}>
            <QuartosContent />
        </Suspense>
    );
}