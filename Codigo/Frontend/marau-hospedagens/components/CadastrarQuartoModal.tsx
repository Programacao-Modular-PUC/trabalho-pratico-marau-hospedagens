"use client";

import { useState } from "react";

type Adicional = { id: number; nome: string; valor: string };

type Props = {
    onClose: () => void;
    onConfirm: () => void;
};

const BRAND = "#1A4A5E";

const residencias = ["Casa da Praia", "Pousada do Mato"];

function StepIndicator({ step }: { step: number }) {
    const steps = ["Identificação", "Valor & Adicionais"];
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
                            <span className="text-xs mt-1 font-medium whitespace-nowrap" style={{ color: isActive ? BRAND : "#9ca3af" }}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className="w-24 h-0.5 mb-4 mx-1 transition-all"
                                style={{ backgroundColor: isDone ? BRAND : "#e5e7eb" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function CadastrarQuartoModal({ onClose, onConfirm }: Props) {
    const [step, setStep] = useState(1);

    // Step 1
    const [residencia, setResidencia] = useState("");
    const [nomeQuarto, setNomeQuarto] = useState("");
    const [tipo, setTipo] = useState<"Solteiro" | "Casal" | "">("");

    // Step 2
    const [valorBase, setValorBase] = useState("");
    const [adicionais, setAdicionais] = useState<Adicional[]>([]);
    const [nextId, setNextId] = useState(1);

    const totalDiaria = adicionais.reduce(
        (acc, a) => acc + (parseFloat(a.valor) || 0),
        parseFloat(valorBase) || 0
    );

    const descricaoCalculo = () => {
        if (!valorBase) return "";
        let desc = `Valor base: R$${valorBase}`;
        adicionais.forEach((a) => {
            if (a.nome && a.valor) desc += ` + ${a.nome}: R$${a.valor}`;
        });
        desc += ` = R$${totalDiaria.toFixed(0)}/diária`;
        return desc;
    };

    const adicionarAdicional = () => {
        setAdicionais((prev) => [...prev, { id: nextId, nome: "", valor: "" }]);
        setNextId((n) => n + 1);
    };

    const removerAdicional = (id: number) =>
        setAdicionais((prev) => prev.filter((a) => a.id !== id));

    const atualizarAdicional = (id: number, field: "nome" | "valor", value: string) =>
        setAdicionais((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

    const step1Valido = residencia !== "" && nomeQuarto.trim() !== "" && tipo !== "";
    const step2Valido = valorBase !== "" && parseFloat(valorBase) > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold" style={{ color: BRAND }}>Cadastrar Quarto</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Corpo */}
                <div className="px-6 py-6">
                    <StepIndicator step={step} />

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Residência</label>
                                <button
                                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm bg-white relative cursor-pointer w-full border-2"
                                    style={{ color: residencia ? BRAND : "#9ca3af", borderColor: residencia ? BRAND : "#e5e7eb" }}
                                >
                                    <select
                                        value={residencia}
                                        onChange={(e) => setResidencia(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                    >
                                        <option value="">Selecione a residência</option>
                                        {residencias.map((r) => <option key={r}>{r}</option>)}
                                    </select>
                                    <span className="flex-1 text-left">{residencia || "Selecione a residência"}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Nome do quarto</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Quarto 01"
                                    value={nomeQuarto}
                                    onChange={(e) => setNomeQuarto(e.target.value)}
                                    autoFocus
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                    style={{ borderColor: nomeQuarto ? BRAND : "#e5e7eb" }}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-2 block">Tipo</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["Solteiro", "Casal"] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTipo(t)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all"
                                            style={{
                                                borderColor: tipo === t ? BRAND : "#e5e7eb",
                                                backgroundColor: tipo === t ? "#E8F0F3" : "white",
                                                color: tipo === t ? BRAND : "#6b7280",
                                            }}
                                        >
                                            {t === "Solteiro" ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            )}
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Valor base da diária (R$)</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 110"
                                    value={valorBase}
                                    onChange={(e) => setValorBase(e.target.value)}
                                    autoFocus
                                    min={0}
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                    style={{ borderColor: valorBase ? BRAND : "#e5e7eb" }}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-600">Adicionais</label>
                                    <button
                                        onClick={adicionarAdicional}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                        style={{ backgroundColor: "#E8F0F3", color: BRAND }}
                                    >
                                        + Adicionar
                                    </button>
                                </div>

                                {adicionais.length === 0 && (
                                    <p className="text-xs text-gray-400 py-2">Nenhum adicional cadastrado.</p>
                                )}

                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                                    {adicionais.map((a) => (
                                        <div key={a.id} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nome (ex: Ar-Condicionado)"
                                                value={a.nome}
                                                onChange={(e) => atualizarAdicional(a.id, "nome", e.target.value)}
                                                className="flex-1 border-2 rounded-xl px-3 py-2 text-sm outline-none"
                                                style={{ borderColor: a.nome ? BRAND : "#e5e7eb" }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="R$"
                                                value={a.valor}
                                                onChange={(e) => atualizarAdicional(a.id, "valor", e.target.value)}
                                                min={0}
                                                className="w-20 border-2 rounded-xl px-3 py-2 text-sm outline-none"
                                                style={{ borderColor: a.valor ? BRAND : "#e5e7eb" }}
                                            />
                                            <button
                                                onClick={() => removerAdicional(a.id)}
                                                className="text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            {valorBase && (
                                <div className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ backgroundColor: "#E8F0F3" }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Total da diária</span>
                                        <span className="text-lg font-bold" style={{ color: BRAND }}>R$ {totalDiaria.toFixed(0)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{descricaoCalculo()}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={() => step === 1 ? onClose() : setStep(step - 1)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all"
                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                    >
                        {step === 1 ? "Cancelar" : "Voltar"}
                    </button>
                    <button
                        onClick={() => step < 2 ? setStep(step + 1) : onConfirm()}
                        disabled={step === 1 ? !step1Valido : !step2Valido}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        {step === 2 ? "Cadastrar Quarto" : "Próximo"}
                    </button>
                </div>
            </div>
        </div>
    );
}