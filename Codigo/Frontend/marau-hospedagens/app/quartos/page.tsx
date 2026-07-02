"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import QuartoCard from "@/components/QuartoCard";
import CadastrarQuartoModal from "@/components/CadastrarQuartoModal";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import NovaReservaModal from "@/components/NovaReservaModal";
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
    const [quartoEmDisponibilidade, setQuartoEmDisponibilidade] = useState<Quarto | null>(null);
    const [quartoParaReserva, setQuartoParaReserva] = useState<Quarto | null>(null);
    const [intervaloSelecionado, setIntervaloSelecionado] = useState<{ entrada: string; saida: string } | null>(null);
    const [modalReservaAberta, setModalReservaAberta] = useState(false);

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

    function handleConferirDatas(quarto: Quarto) {
        setQuartoEmDisponibilidade(quarto);
        setQuartoParaReserva(quarto);
        setIntervaloSelecionado(null);
    }

    function fecharModalDisponibilidade() {
        setQuartoEmDisponibilidade(null);
        setQuartoParaReserva(null);
        setIntervaloSelecionado(null);
        setModalReservaAberta(false);
    }

    function abrirModalReserva() {
        setModalReservaAberta(true);
        setQuartoEmDisponibilidade(null);
    }

    function fecharModalReserva() {
        setModalReservaAberta(false);
        setQuartoParaReserva(null);
        setIntervaloSelecionado(null);
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
                                        <QuartoCard key={q.id} q={q} onConferirDatas={handleConferirDatas} />
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

            {modalReservaAberta && intervaloSelecionado && quartoParaReserva && (
                <NovaReservaModal
                    onClose={fecharModalReserva}
                    onConfirm={() => {
                        fecharModalReserva();
                        fecharModalDisponibilidade();
                    }}
                    entradaInicial={intervaloSelecionado.entrada}
                    saidaInicial={intervaloSelecionado.saida}
                    residenciaInicial={quartoParaReserva.residencia}
                    quartoInicial={quartoParaReserva.nome}
                />
            )}

            {quartoEmDisponibilidade && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold" style={{ color: "#1A4A5E" }}>
                                    Conferir disponibilidade
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {quartoEmDisponibilidade.nome} · {quartoEmDisponibilidade.residencia}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharModalDisponibilidade}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Selecione um intervalo para verificar se o quarto fica disponível.
                        </p>

                        <AvailabilityCalendar
                            residenciaInicial={quartoEmDisponibilidade.residencia}
                            quartoInicial={quartoEmDisponibilidade.nome}
                            onRangeSelect={(entrada, saida) => setIntervaloSelecionado({ entrada, saida })}
                        />

                        {intervaloSelecionado && (
                            <div className="mt-4 rounded-2xl border border-[#E8F0F3] bg-[#F8FBFC] p-4 flex flex-col gap-3">
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: "#1A4A5E" }}>
                                        Intervalo selecionado
                                    </p>
                                    <p className="text-sm text-gray-600">Entrada: {intervaloSelecionado.entrada}</p>
                                    <p className="text-sm text-gray-600">Saída: {intervaloSelecionado.saida}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={abrirModalReserva}
                                    className="self-start rounded-xl px-4 py-2 text-sm font-semibold text-white cursor-pointer"
                                    style={{ backgroundColor: "#1A4A5E" }}
                                >
                                    Agendar Reserva
                                </button>
                            </div>
                        )}
                    </div>
                </div>
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