"use client";

import { useState, useEffect } from "react";

type Props = {
    onClose: () => void;
    onConfirm: () => void;
    entradaInicial?: string;
    saidaInicial?: string;
    residenciaInicial?: string;
    quartoInicial?: string;
};

const residencias = [
    {
        id: 1,
        nome: "Casa Praiana",
        quartos: [
            { nome: "Quarto 01 (Solteiro)", comodidades: ["Ar-Condicionado"] },
            { nome: "Quarto 02 (Casal)", comodidades: ["Ar-Condicionado", "Hidromassagem"] },
            { nome: "Quarto 03 (Casal)", comodidades: [] },
        ],
    },
    {
        id: 2,
        nome: "Pousada do Mato",
        quartos: [
            { nome: "Quarto 01 (Casal)", comodidades: ["Ar-Condicionado", "Hidromassagem"] },
            { nome: "Quarto 02 (Solteiro)", comodidades: ["Ar-Condicionado"] },
        ],
    },
];

const clientes = [
    { id: 1, nome: "Ana Lima", cpf: "032.456.789-01" },
    { id: 2, nome: "João Santos", cpf: "045.678.912-23" },
    { id: 3, nome: "Carlos Mendes", cpf: "078.901.234-56" },
    { id: 4, nome: "Marina Faria", cpf: "089.123.456-78" },
];

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

// ✅ FIX: saidaInicial agora é desestruturado corretamente
export default function NovaReservaModal({ onClose, onConfirm, entradaInicial, saidaInicial, residenciaInicial, quartoInicial }: Props) {
    const [step, setStep] = useState(1);
    const [residencia, setResidencia] = useState(residenciaInicial ?? "");
    const [quarto, setQuarto] = useState(quartoInicial ?? "");
    const [entrada, setEntrada] = useState(entradaInicial ?? "");
    const [saida, setSaida] = useState(saidaInicial ?? "");
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [busca, setBusca] = useState("");
    const [pagamento, setPagamento] = useState("Dinheiro");

    const residenciaSelecionada = residencias.find((r) => r.nome === residencia);
    const quartosDisponiveis = residenciaSelecionada?.quartos ?? [];
    const quartoSelecionado = quartosDisponiveis.find((q) => q.nome === quarto);

    const clienteFiltrado = clientes.filter((c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cpf.includes(busca)
    );
    const clienteSelecionado = clientes.find((c) => c.id === clienteId);

    const diarias = entrada && saida
        ? Math.max(0, Math.ceil((new Date(saida).getTime() - new Date(entrada).getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

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
                                        <option key={q.nome} value={q.nome}>{q.nome}</option>
                                    ))}
                                </select>

                                {quartoSelecionado && (
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        {quartoSelecionado.comodidades.length > 0 ? (
                                            quartoSelecionado.comodidades.map((c) => (
                                                <span
                                                    key={c}
                                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{ backgroundColor: "#E8F0F3", color: BRAND }}
                                                >
                                                    ✓ {c}
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
                            <button className="text-sm font-semibold cursor-pointer underline text-center" style={{ color: BRAND }}>
                                + Cadastrar novo cliente
                            </button>
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
                                                <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#E8F0F3", color: BRAND }}>
                                                    {c}
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
                            </div>
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
                        onClick={() => step < 3 ? setStep(step + 1) : onConfirm()}
                        disabled={
                            (step === 1 && (!residencia || !quarto || !entrada || !saida)) ||
                            (step === 2 && !clienteId)
                        }
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        {step === 3 ? "Confirmar Reserva" : "Próximo"}
                    </button>
                </div>
            </div>
        </div>
    );
}