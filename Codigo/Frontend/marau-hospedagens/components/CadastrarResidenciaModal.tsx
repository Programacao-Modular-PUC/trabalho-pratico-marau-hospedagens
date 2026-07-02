"use client";

import { useEffect, useState } from "react";
import { ApiError, type Residencia, type ResidenciaRequest } from "@/lib/api";

type Props = {
    onClose: () => void;
    onConfirm: (req: ResidenciaRequest) => Promise<void>;
    residenciaInicial?: Residencia;
};

const BRAND = "#1A4A5E";

const coresDisponiveis = [
    { label: "Azul Escuro", value: "#1A4A5E" },
    { label: "Terracota", value: "#B85C38" },
    { label: "Verde", value: "#47977B" },
    { label: "Roxo", value: "#6B5EA8" },
    { label: "Cinza", value: "#4B5563" },
    { label: "Dourado", value: "#B07D2E" },
];

function StepIndicator({ step }: { step: number }) {
    const steps = ["Identificação", "Localização & Contato"];
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

export default function CadastrarResidenciaModal({ onClose, onConfirm, residenciaInicial }: Props) {
    const [step, setStep] = useState(1);

    // Step 1
    const [nome, setNome] = useState("");
    const [cor, setCor] = useState(coresDisponiveis[0].value);

    // Step 2
    const [endereco, setEndereco] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cep, setCep] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (residenciaInicial) {
            setNome(residenciaInicial.nome ?? "");
            setCor(residenciaInicial.cor ?? coresDisponiveis[0].value);
            setEndereco(residenciaInicial.endereco?.split(",")[0] ?? "");
            setNumero(residenciaInicial.endereco?.match(/,(.*?)·/)?.[1]?.trim() ?? "");
            setBairro(residenciaInicial.endereco?.split("·")[1]?.trim() ?? "");
            setCep(residenciaInicial.cep ?? "");
            setTelefone(residenciaInicial.telefone ?? "");
            setEmail(residenciaInicial.email ?? "");
        }
    }, [residenciaInicial]);

    const step1Valido = nome.trim() !== "";
    const step2Valido = endereco.trim() !== "" && numero.trim() !== "" && bairro.trim() !== "" && cep.trim() !== "" && telefone.trim() !== "" && email.trim() !== "";

    const handleConfirmar = async () => {
        setErro(null);
        setEnviando(true);
        try {
            await onConfirm({
                nome,
                // O backend guarda endereço em um único campo; juntamos rua + número + bairro.
                endereco: `${endereco}, ${numero} · ${bairro}`,
                cep,
                telefone,
                email,
                cor,
            });
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao cadastrar residência.");
        } finally {
            setEnviando(false);
        }
    };

    const formatarCep = (v: string) => {
        const nums = v.replace(/\D/g, "").slice(0, 8);
        return nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums;
    };

    const formatarTelefone = (v: string) => {
        const nums = v.replace(/\D/g, "").slice(0, 11);
        if (nums.length <= 10) return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold" style={{ color: BRAND }}>{residenciaInicial ? "Editar Residência" : "Cadastrar Residência"}</h2>
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

                        {/* Step 1 — Identificação */}
                        {step === 1 && (
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Nome da residência</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Casa Praiana"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        autoFocus
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        style={{ borderColor: nome ? BRAND : "#e5e7eb" }}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-3 block">Cor do card</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {coresDisponiveis.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => setCor(c.value)}
                                                title={c.label}
                                                className="w-9 h-9 rounded-full cursor-pointer transition-all"
                                                style={{
                                                    backgroundColor: c.value,
                                                    outline: cor === c.value ? `3px solid ${c.value}` : "3px solid transparent",
                                                    outlineOffset: "3px",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Preview do card */}
                                {nome && (
                                    <div
                                        className="rounded-xl px-5 py-4 mt-1 transition-all"
                                        style={{ backgroundColor: cor }}
                                    >
                                        <p className="text-white font-bold text-base">{nome}</p>
                                        <p className="text-white/60 text-xs mt-0.5">Maraú · Bahia</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2 — Localização & Contato */}
                        {step === 2 && (
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-[1fr_80px] gap-3">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Endereço</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Rua das Amendoeiras"
                                            value={endereco}
                                            onChange={(e) => setEndereco(e.target.value)}
                                            autoFocus
                                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                            style={{ borderColor: endereco ? BRAND : "#e5e7eb" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Número</label>
                                        <input
                                            type="text"
                                            placeholder="42"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                            style={{ borderColor: numero ? BRAND : "#e5e7eb" }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Bairro</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Barra Grande"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value)}
                                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                            style={{ borderColor: bairro ? BRAND : "#e5e7eb" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">CEP</label>
                                        <input
                                            type="text"
                                            placeholder="45520-000"
                                            value={cep}
                                            onChange={(e) => setCep(formatarCep(e.target.value))}
                                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                            style={{ borderColor: cep ? BRAND : "#e5e7eb" }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Telefone</label>
                                    <input
                                        type="text"
                                        placeholder="(73) 98876-1234"
                                        value={telefone}
                                        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        style={{ borderColor: telefone ? BRAND : "#e5e7eb" }}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Ex: casapraiana@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        style={{ borderColor: email ? BRAND : "#e5e7eb" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {erro && (
                        <div className="mx-6 mb-3 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                            {erro}
                        </div>
                    )}

                    {/* Footer */}
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
                            onClick={() => step < 2 ? setStep(step + 1) : handleConfirmar()}
                            disabled={(step === 1 ? !step1Valido : !step2Valido) || enviando}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: BRAND }}
                            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                        >
                            {step === 2 ? (enviando ? (residenciaInicial ? "Salvando..." : "Cadastrando...") : (residenciaInicial ? "Salvar Alterações" : "Cadastrar Residência")) : "Próximo"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}