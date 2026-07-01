"use client";

import { useState, useEffect, useMemo } from "react";
import { api, ApiError, type Residencia, type Quarto, type Cliente } from "@/lib/api";

type Props = {
    onClose: () => void;
    onConfirm: () => void;
    entradaInicial?: string;
    saidaInicial?: string;
    residenciaInicial?: string;
    quartoInicial?: string;
};

const BRAND = "#1A4A5E";

function StepIndicator({ step }: { step: number }) {
    const steps = ["Acomodação", "Hóspede", "Confirmação"];
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((label, i) => {
                const num = i + 1;
                const isActive = num === step;
                const isDone = num < step;
                return (
                    <div key={label} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                                style={{
                                    backgroundColor: isActive || isDone ? BRAND : "#e5e7eb",
                                    color: isActive || isDone ? "white" : "#9ca3af",
                                }}
                            >
                                {isDone ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : num}
                            </div>
                            <span className="text-xs mt-1 font-medium" style={{ color: isActive ? BRAND : "#9ca3af" }}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className="w-20 h-0.5 mb-4 mx-1 transition-all"
                                style={{ backgroundColor: isDone ? BRAND : "#e5e7eb" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function NovaReservaModal({ onClose, onConfirm, entradaInicial, saidaInicial, residenciaInicial, quartoInicial }: Props) {
    const [step, setStep] = useState(1);

    const [residencias, setResidencias] = useState<Residencia[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        api.residencias.listar().then(setResidencias).catch(() => {});
        api.quartos.listar().then(setQuartos).catch(() => {});
        api.clientes.listar().then(setClientes).catch(() => {});
    }, []);

    const [residencia, setResidencia] = useState(residenciaInicial ?? "");
    const [quarto, setQuarto] = useState(quartoInicial ?? "");
    const [entrada, setEntrada] = useState(entradaInicial ?? "");
    const [saida, setSaida] = useState(saidaInicial ?? "");
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [busca, setBusca] = useState("");
    const [pagamento, setPagamento] = useState("Dinheiro");

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const quartosDisponiveis = useMemo(
        () => quartos.filter((q) => q.residencia === residencia),
        [quartos, residencia]
    );
    const quartoSelecionado = quartosDisponiveis.find((q) => q.nome === quarto);

    const clienteFiltrado = clientes.filter((c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cpf.includes(busca)
    );
    const clienteSelecionado = clientes.find((c) => c.id === clienteId);

    const diarias = entrada && saida
        ? Math.max(0, Math.ceil((new Date(saida).getTime() - new Date(entrada).getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    async function handleConfirmar() {
        if (!quartoSelecionado || !clienteId || !entrada || !saida) return;
        setErro(null);
        setEnviando(true);
        try {
            await api.alugueis.criar({
                clienteId,
                quartoId: quartoSelecionado.id,
                entrada: `${entrada}T12:00:00`,
                saida: `${saida}T12:00:00`,
                status: "Reserva",
            });
            onConfirm();
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao criar a reserva.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold" style={{ color: BRAND }}>Nova Reserva</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-6">
                    <StepIndicator step={step} />

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Residência</label>
                                <select
                                    value={residencia}
                                    onChange={(e) => { setResidencia(e.target.value); setQuarto(""); }}
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                                    style={{ borderColor: residencia ? BRAND : "#e5e7eb", color: residencia ? BRAND : "#9ca3af" }}
                                >
                                    <option value="">Selecione a residência</option>
                                    {residencias.map((r) => (
                                        <option key={r.id} value={r.nome}>{r.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Quarto</label>
                                <select
                                    value={quarto}
                                    onChange={(e) => setQuarto(e.target.value)}
                                    disabled={!residencia}
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer disabled:opacity-40"
                                    style={{ borderColor: quarto ? BRAND : "#e5e7eb", color: quarto ? BRAND : "#9ca3af" }}
                                >
                                    <option value="">Selecione o quarto</option>
                                    {quartosDisponiveis.map((q) => (
                                        <option key={q.id} value={q.nome}>{q.nome} — {q.precoFormatado}/dia</option>
                                    ))}
                                </select>

                                {quartoSelecionado && (
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        {quartoSelecionado.comodidades.length > 0 ? (
                                            quartoSelecionado.comodidades.map((c) => (
                                                <span
                                                    key={c.nome}
                                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{ backgroundColor: "#E8F0F3", color: BRAND }}
                                                >
                                                    ✓ {c.nome}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">Sem comodidades extras</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Entrada</label>
                                    <input
                                        type="date"
                                        value={entrada}
                                        onChange={(e) => setEntrada(e.target.value)}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                                        style={{ borderColor: entrada ? BRAND : "#e5e7eb" }}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Saída</label>
                                    <input
                                        type="date"
                                        value={saida}
                                        onChange={(e) => setSaida(e.target.value)}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                                        style={{ borderColor: saida ? BRAND : "#e5e7eb" }}
                                    />
                                </div>
                            </div>

                            {diarias > 0 && (
                                <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "#E8F0F3", color: BRAND }}>
                                    {diarias} diária{diarias > 1 ? "s" : ""} selecionada{diarias > 1 ? "s" : ""}
                                    {quartoSelecionado && ` · Total estimado: R$ ${(quartoSelecionado.preco * diarias).toFixed(2)}`}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Buscar cliente</label>
                                <input
                                    type="text"
                                    placeholder="Nome ou CPF..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                    style={{ borderColor: "#e5e7eb" }}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
                                {clienteFiltrado.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">Nenhum cliente encontrado.</p>
                                )}
                                {clienteFiltrado.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setClienteId(c.id)}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left cursor-pointer transition-all"
                                        style={{
                                            borderColor: clienteId === c.id ? BRAND : "#e5e7eb",
                                            backgroundColor: clienteId === c.id ? "#E8F0F3" : "white",
                                        }}
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">{c.nome}</div>
                                            <div className="text-xs text-gray-400">{c.cpf}</div>
                                        </div>
                                        {clienteId === c.id && (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: "#FAF5EE" }}>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Acomodação</p>
                                    <p className="font-semibold text-gray-800">{residencia} · {quarto}</p>
                                    <p className="text-sm text-gray-500">{entrada} → {saida} · {diarias} diária{diarias > 1 ? "s" : ""}</p>
                                    {quartoSelecionado && quartoSelecionado.comodidades.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {quartoSelecionado.comodidades.map((c) => (
                                                <span key={c.nome} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#E8F0F3", color: BRAND }}>
                                                    {c.nome}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="h-px bg-gray-200" />
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Hóspede</p>
                                    <p className="font-semibold text-gray-800">{clienteSelecionado?.nome}</p>
                                    <p className="text-sm text-gray-500">{clienteSelecionado?.cpf}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Forma de pagamento</label>
                                <select
                                    value={pagamento}
                                    onChange={(e) => setPagamento(e.target.value)}
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                                    style={{ borderColor: BRAND, color: BRAND }}
                                >
                                    <option>Dinheiro</option>
                                    <option>Cartão de Crédito</option>
                                    <option>Cartão de Débito</option>
                                    <option>PIX</option>
                                    <option>Transferência</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    A forma de pagamento é definida na tela de recibo, após a hospedagem ser concluída.
                                </p>
                            </div>

                            {erro && (
                                <div className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                                    {erro}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-between px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={() => step === 1 ? onClose() : setStep(step - 1)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all"
                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e5e7eb";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#6b7280";
                        }}
                    >
                        {step === 1 ? "Cancelar" : "Voltar"}
                    </button>
                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : handleConfirmar()}
                        disabled={
                            (step === 1 && (!residencia || !quarto || !entrada || !saida)) ||
                            (step === 2 && !clienteId) ||
                            enviando
                        }
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        {step === 3 ? (enviando ? "Confirmando..." : "Confirmar Reserva") : "Próximo"}
                    </button>
                </div>
            </div>
        </div>
    );
}