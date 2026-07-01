"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import HistoryTimeline, { type HistoryEntry } from "@/components/HistoryTimeline";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import NovaReservaModal from "@/components/NovaReservaModal";
import { api, ApiError, type DashboardResumo } from "@/lib/api";

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
            style={{ backgroundColor: "#1A4A5E", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-16px)" }}
        >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <div>
                <p className="text-white font-semibold text-sm">Reserva confirmada!</p>
                <p className="text-white/70 text-xs">A reserva foi registrada com sucesso.</p>
            </div>
        </div>
    );
}

function getMesAtual() {
    return new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" });
}

// Extrai um número de "R$ 4.820,50" -> 4820.5
function parseValorBRL(v: string): number {
    const num = parseFloat(v.replace("R$", "").trim().replace(/\./g, "").replace(",", "."));
    return isNaN(num) ? 0 : num;
}

export default function DashboardPage() {
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [entradaInicial, setEntradaInicial] = useState<string | undefined>();
    const [saidaInicial, setSaidaInicial] = useState<string | undefined>();
    const [residenciaInicial, setResidenciaInicial] = useState("");
    const [quartoInicial, setQuartoInicial] = useState("");

    const [resumo, setResumo] = useState<DashboardResumo | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const subtitulo = `Dados Referentes: ${getMesAtual().replace(/^\w/, (c) => c.toUpperCase())}`;

    const carregarResumo = useCallback(async () => {
        try {
            setResumo(await api.dashboard.resumo());
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao carregar o painel.");
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await carregarResumo();
        })();
    }, [carregarResumo, refreshKey]);

    const history: HistoryEntry[] = (resumo?.ultimasReservas ?? []).map((a) => ({
        id: a.id,
        date: a.entrada.split(" ")[0] ?? "",
        time: a.entrada.split(" ")[1] ?? "",
        text: `${a.cliente} · ${a.residencia} · ${a.quarto} (${a.status.toUpperCase()})`,
    }));

    function handleRangeSelect(entrada: string, saida: string) {
        setEntradaInicial(entrada);
        setSaidaInicial(saida);
        setModalAberto(true);
    }

    function handleFecharModal() {
        setModalAberto(false);
        setEntradaInicial(undefined);
        setSaidaInicial(undefined);
        setResidenciaInicial("");
        setQuartoInicial("");
    }

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Painel Geral"
                subtitulo={subtitulo}
                botao={{ label: "Nova Reserva", onClick: () => setModalAberto(true) }}
            />

            {erro && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                    {erro}
                </div>
            )}

            <div className="grid grid-cols-4 gap-4 mb-8">
                <MetricCard label="Residências"      value={resumo?.totalResidencias ?? 0}    sub="cadastradas"    borderColor="#1C4B60" valueColor="#1C4B60" />
                <MetricCard label="Quartos Ocupados" value={resumo?.quartosOcupados ?? 0}    sub={`de ${resumo?.totalQuartos ?? 0} no total`} borderColor="#C23E23" valueColor="#C23E23" />
                <MetricCard label="Receita do Mês"   value={resumo ? parseValorBRL(resumo.receitaTotal) : 0} sub={`${resumo?.estadiasConcluidas ?? 0} aluguéis`}    borderColor="#47977B" valueColor="#47977B" prefix="R$ " decimals={2} />
                <MetricCard label="Clientes"         value={resumo?.totalClientes ?? 0}   sub="cadastrados"    borderColor="#4EA3B8" valueColor="#38bdf8" />
            </div>

            <div className="grid grid-cols-[600px_1fr] gap-16">
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-3">Disponibilidade</h2>
                    <AvailabilityCalendar onRangeSelect={handleRangeSelect}
                                          onResidenciaChange={setResidenciaInicial}
                                          onQuartoChange={setQuartoInicial}/>
                </div>
                <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Últimas Reservas</h2>
                    {history.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma reserva registrada ainda.</p>
                    ) : (
                        <HistoryTimeline entries={history} />
                    )}
                </div>
            </div>

            {modalAberto && (
                <NovaReservaModal
                    entradaInicial={entradaInicial}
                    saidaInicial={saidaInicial}
                    residenciaInicial={residenciaInicial}
                    quartoInicial={quartoInicial}
                    onClose={handleFecharModal}
                    onConfirm={() => {
                        handleFecharModal();
                        setShowToast(true);
                        setRefreshKey((k) => k + 1);
                    }}
                />
            )}
        </div>
    );
}