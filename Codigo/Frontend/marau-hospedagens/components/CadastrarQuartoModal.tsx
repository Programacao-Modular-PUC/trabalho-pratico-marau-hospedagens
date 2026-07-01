"use client";

import { useState, useEffect } from "react";
import { api, ApiError, type Residencia, type Comodidade } from "@/lib/api";

type Props = {
    residencias: Residencia[];
    onClose: () => void;
    onConfirm: () => void;
};

const BRAND = "#1A4A5E";

type TipoQuarto = "Individual" | "Duplo" | "Familia" | "";

function StepIndicator({ step }: { step: number }) {
    const steps = ["Identificação", "Configuração", "Valor & Adicionais"];
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
                                className="w-16 h-0.5 mb-4 mx-1 transition-all"
                                style={{ backgroundColor: isDone ? BRAND : "#e5e7eb" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{label}</label>
            {children}
        </div>
    );
}

function SelectEstilizado({ value, onChange, options, placeholder }: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
}) {
    return (
        <button
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm bg-white relative cursor-pointer w-full border-2"
            style={{ color: value ? BRAND : "#9ca3af", borderColor: value ? BRAND : "#e5e7eb" }}
        >
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
            >
                <option value="">{placeholder}</option>
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <span className="flex-1 text-left">{value || placeholder}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    );
}

function BotaoOpcao({ label, ativo, onClick, descricao }: {
    label: string;
    ativo: boolean;
    onClick: () => void;
    descricao?: string;
}) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all"
            style={{
                borderColor: ativo ? BRAND : "#e5e7eb",
                backgroundColor: ativo ? "#E8F0F3" : "white",
                color: ativo ? BRAND : "#6b7280",
            }}
        >
            {label}
            {descricao && <span className="text-[10px] font-normal opacity-60">{descricao}</span>}
        </button>
    );
}

export default function CadastrarQuartoModal({ residencias, onClose, onConfirm }: Props) {
    const [step, setStep] = useState(1);

    const [comodidadesCatalogo, setComodidadesCatalogo] = useState<Comodidade[]>([]);
    useEffect(() => {
        api.comodidades.listar().then(setComodidadesCatalogo).catch(() => {});
    }, []);
    const comodidadeAr = comodidadesCatalogo.find((c) => c.nome.toLowerCase().includes("ar"));
    const comodidadeHidro = comodidadesCatalogo.find((c) => c.nome.toLowerCase().includes("hidro"));

    // Step 1 — Identificação
    const [residenciaId, setResidenciaId] = useState<number | null>(null);
    const [nomeQuarto, setNomeQuarto] = useState("");
    const [tipo, setTipo] = useState<TipoQuarto>("");

    // Step 2 — Configuração por tipo (usada para compor o valor base, o back não guarda esses detalhes)
    // Individual
    const [numCamas, setNumCamas] = useState(1);
    const [adicionalPorCama, setAdicionalPorCama] = useState("");

    // Duplo
    const [tipoCama, setTipoCama] = useState<"casal" | "queen" | "king" | "">("");
    const [temBerco, setTemBerco] = useState(false);
    const [valorBerco, setValorBerco] = useState("");
    const [adicionalCama, setAdicionalCama] = useState("");

    // Família
    const [camasSolteiro, setCamasSolteiro] = useState(0);
    const [camasCasal, setCamasCasal] = useState(0);
    const [camasQueenKing, setCamasQueenKing] = useState(0);
    const [numAmbientes, setNumAmbientes] = useState(1);
    const [percentualHospede, setPercentualHospede] = useState("");
    const [descontoGrupo, setDescontoGrupo] = useState("");

    // Step 3 — Valor & Adicionais
    const [valorBase, setValorBase] = useState("");
    const [possuiAR, setPossuiAR] = useState(false);
    const [possuiHidro, setPossuiHidro] = useState(false);

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // Adicionais estruturais (cama extra, berço) somados ao valor base — o back só
    // sabe calcular preço = valorBase + comodidades (Ar/Hidro), então embutimos aqui.
    const adicionalEstrutural = () => {
        let total = 0;
        if (tipo === "Individual" && numCamas > 1) total += (numCamas - 1) * (parseFloat(adicionalPorCama) || 0);
        if (tipo === "Duplo") total += parseFloat(adicionalCama) || 0;
        if (temBerco && tipo === "Duplo") total += parseFloat(valorBerco) || 0;
        return total;
    };

    const totalDiaria = () => {
        let total = (parseFloat(valorBase) || 0) + adicionalEstrutural();
        if (possuiAR) total += comodidadeAr?.preco ?? 0;
        if (possuiHidro) total += comodidadeHidro?.preco ?? 0;
        return total;
    };

    const capacidadeMaxima = () => {
        if (tipo === "Individual") return numCamas;
        if (tipo === "Duplo") return temBerco ? 3 : 2;
        if (tipo === "Familia") return (camasSolteiro * 1) + (camasCasal * 2) + (camasQueenKing * 2);
        return 0;
    };

    const step1Valido = residenciaId !== null && nomeQuarto.trim() !== "" && tipo !== "";

    const step2Valido = () => {
        if (tipo === "Individual") return numCamas >= 1;
        if (tipo === "Duplo") return tipoCama !== "";
        if (tipo === "Familia") return (camasSolteiro + camasCasal + camasQueenKing) > 0;
        return false;
    };

    const step3Valido = valorBase !== "" && parseFloat(valorBase) > 0;

    async function handleCadastrar() {
        if (!residenciaId || !tipo) return;
        setErro(null);
        setEnviando(true);
        try {
            const comodidadeIds: number[] = [];
            if (possuiAR && comodidadeAr) comodidadeIds.push(comodidadeAr.id);
            if (possuiHidro && comodidadeHidro) comodidadeIds.push(comodidadeHidro.id);

            await api.quartos.criar({
                nome: nomeQuarto,
                tipo,
                // valor base já inclui os adicionais estruturais (cama extra, berço);
                // Ar-Condicionado e Hidromassagem entram como comodidades reais do catálogo.
                valorBase: (parseFloat(valorBase) || 0) + adicionalEstrutural(),
                residenciaId,
                comodidadeIds,
                cor: residencias.find((r) => r.id === residenciaId)?.cor,
            });
            onConfirm();
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao cadastrar quarto.");
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
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                    <StepIndicator step={step} />

                    {/* ── Step 1 — Identificação ── */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <Campo label="Residência">
                                <SelectEstilizado
                                    value={residencias.find((r) => r.id === residenciaId)?.nome ?? ""}
                                    onChange={(nome) => setResidenciaId(residencias.find((r) => r.nome === nome)?.id ?? null)}
                                    options={residencias.map((r) => r.nome)}
                                    placeholder="Selecione a residência"
                                />
                            </Campo>

                            <Campo label="Nome do quarto">
                                <input
                                    type="text"
                                    placeholder="Ex: Quarto 01"
                                    value={nomeQuarto}
                                    onChange={(e) => setNomeQuarto(e.target.value)}
                                    autoFocus
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                    style={{ borderColor: nomeQuarto ? BRAND : "#e5e7eb" }}
                                />
                            </Campo>

                            <Campo label="Tipo de quarto">
                                <div className="grid grid-cols-3 gap-3">
                                    <BotaoOpcao
                                        label="Individual"
                                        descricao="1+ camas solteiro"
                                        ativo={tipo === "Individual"}
                                        onClick={() => setTipo("Individual")}
                                    />
                                    <BotaoOpcao
                                        label="Duplo"
                                        descricao="Casal / Queen / King"
                                        ativo={tipo === "Duplo"}
                                        onClick={() => setTipo("Duplo")}
                                    />
                                    <BotaoOpcao
                                        label="Família"
                                        descricao="Mix de camas"
                                        ativo={tipo === "Familia"}
                                        onClick={() => setTipo("Familia")}
                                    />
                                </div>
                            </Campo>
                        </div>
                    )}

                    {/* ── Step 2 — Configuração ── */}
                    {step === 2 && tipo === "Individual" && (
                        <div className="flex flex-col gap-4">
                            <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "#E8F0F3", color: BRAND }}>
                                Quarto Individual — sem berço permitido
                            </div>

                            <Campo label="Número de camas solteiro">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setNumCamas((n) => Math.max(1, n - 1))}
                                        className="w-9 h-9 rounded-xl border-2 flex items-center justify-center cursor-pointer font-bold text-lg"
                                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                                    >−</button>
                                    <span className="text-xl font-bold w-8 text-center" style={{ color: BRAND }}>{numCamas}</span>
                                    <button
                                        onClick={() => setNumCamas((n) => n + 1)}
                                        className="w-9 h-9 rounded-xl border-2 flex items-center justify-center cursor-pointer font-bold text-lg"
                                        style={{ borderColor: BRAND, color: BRAND }}
                                    >+</button>
                                    <span className="text-sm text-gray-500">cama{numCamas > 1 ? "s" : ""} · {numCamas} hóspede{numCamas > 1 ? "s" : ""} máx.</span>
                                </div>
                            </Campo>

                            {numCamas > 1 && (
                                <Campo label="Adicional por cama extra (R$)">
                                    <input
                                        type="number"
                                        placeholder="Ex: 20"
                                        value={adicionalPorCama}
                                        onChange={(e) => setAdicionalPorCama(e.target.value)}
                                        min={0}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        style={{ borderColor: adicionalPorCama ? BRAND : "#e5e7eb" }}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Apenas a partir da 2ª cama</p>
                                </Campo>
                            )}
                        </div>
                    )}

                    {step === 2 && tipo === "Duplo" && (
                        <div className="flex flex-col gap-4">
                            <Campo label="Tipo de cama">
                                <div className="grid grid-cols-3 gap-3">
                                    {(["casal", "queen", "king"] as const).map((t) => (
                                        <BotaoOpcao
                                            key={t}
                                            label={t.charAt(0).toUpperCase() + t.slice(1)}
                                            ativo={tipoCama === t}
                                            onClick={() => setTipoCama(t)}
                                        />
                                    ))}
                                </div>
                            </Campo>

                            <Campo label="Adicional pelo tipo de cama (R$)">
                                <input
                                    type="number"
                                    placeholder="Ex: 30"
                                    value={adicionalCama}
                                    onChange={(e) => setAdicionalCama(e.target.value)}
                                    min={0}
                                    className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                    style={{ borderColor: adicionalCama ? BRAND : "#e5e7eb" }}
                                />
                            </Campo>

                            <Campo label="Berço">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setTemBerco(!temBerco)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all"
                                        style={{
                                            borderColor: temBerco ? BRAND : "#e5e7eb",
                                            backgroundColor: temBerco ? "#E8F0F3" : "white",
                                            color: temBerco ? BRAND : "#6b7280",
                                        }}
                                    >
                                        {temBerco ? "✓ Com berço" : "Sem berço"}
                                    </button>
                                    {temBerco && (
                                        <span className="text-sm text-gray-500">Taxa extra de R$</span>
                                    )}
                                    {temBerco && (
                                        <input
                                            type="number"
                                            placeholder="Ex: 20"
                                            value={valorBerco}
                                            onChange={(e) => setValorBerco(e.target.value)}
                                            min={0}
                                            className="w-24 border-2 rounded-xl px-3 py-2 text-sm outline-none"
                                            style={{ borderColor: valorBerco ? BRAND : "#e5e7eb" }}
                                        />
                                    )}
                                </div>
                            </Campo>

                            <div className="text-sm text-gray-500 px-1">
                                Capacidade: {temBerco ? "2 adultos + 1 berço" : "2 hóspedes"}
                            </div>
                        </div>
                    )}

                    {step === 2 && tipo === "Familia" && (
                        <div className="flex flex-col gap-4">
                            <Campo label="Composição de camas">
                                {[
                                    { label: "Camas solteiro", value: camasSolteiro, set: setCamasSolteiro },
                                    { label: "Camas casal", value: camasCasal, set: setCamasCasal },
                                    { label: "Camas queen/king", value: camasQueenKing, set: setCamasQueenKing },
                                ].map(({ label, value, set }) => (
                                    <div key={label} className="flex items-center justify-between py-2">
                                        <span className="text-sm text-gray-600">{label}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => set((n) => Math.max(0, n - 1))}
                                                className="w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer font-bold"
                                                style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                                            >−</button>
                                            <span className="w-6 text-center font-bold" style={{ color: BRAND }}>{value}</span>
                                            <button
                                                onClick={() => set((n) => n + 1)}
                                                className="w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer font-bold"
                                                style={{ borderColor: BRAND, color: BRAND }}
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                                {capacidadeMaxima() > 0 && (
                                    <div className="mt-2 text-sm font-medium" style={{ color: BRAND }}>
                                        Capacidade máxima: {capacidadeMaxima()} hóspedes
                                    </div>
                                )}
                            </Campo>

                            <Campo label="Número de ambientes">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setNumAmbientes((n) => Math.max(1, n - 1))}
                                        className="w-9 h-9 rounded-xl border-2 flex items-center justify-center cursor-pointer font-bold text-lg"
                                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                                    >−</button>
                                    <span className="text-xl font-bold w-8 text-center" style={{ color: BRAND }}>{numAmbientes}</span>
                                    <button
                                        onClick={() => setNumAmbientes((n) => n + 1)}
                                        className="w-9 h-9 rounded-xl border-2 flex items-center justify-center cursor-pointer font-bold text-lg"
                                        style={{ borderColor: BRAND, color: BRAND }}
                                    >+</button>
                                    <span className="text-sm text-gray-500">ambiente{numAmbientes > 1 ? "s" : ""}</span>
                                </div>
                            </Campo>

                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="% adicional por hóspede">
                                    <input
                                        type="number"
                                        placeholder="Ex: 10"
                                        value={percentualHospede}
                                        onChange={(e) => setPercentualHospede(e.target.value)}
                                        min={0}
                                        max={100}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        style={{ borderColor: percentualHospede ? BRAND : "#e5e7eb" }}
                                    />
                                </Campo>
                                <Campo label="% desconto grupo">
                                    <input
                                        type="number"
                                        placeholder="Ex: 15"
                                        value={descontoGrupo}
                                        onChange={(e) => setDescontoGrupo(e.target.value)}
                                        min={0}
                                        max={100}
                                        className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        style={{ borderColor: descontoGrupo ? BRAND : "#e5e7eb" }}
                                    />
                                </Campo>
                            </div>
                            <p className="text-xs text-gray-400 -mt-2">
                                O sistema ainda não aplica esses percentuais automaticamente por hóspede — use o valor base abaixo já com o ajuste desejado.
                            </p>
                        </div>
                    )}

                    {/* ── Step 3 — Valor & Adicionais ── */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <Campo label="Valor base da diária (R$)">
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
                            </Campo>

                            {/* Ar-condicionado */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setPossuiAR(!possuiAR)}
                                    disabled={!comodidadeAr}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{
                                        borderColor: possuiAR ? BRAND : "#e5e7eb",
                                        backgroundColor: possuiAR ? "#E8F0F3" : "white",
                                        color: possuiAR ? BRAND : "#6b7280",
                                    }}
                                >
                                    {possuiAR ? "✓" : "+"} Ar-Condicionado
                                </button>
                                {comodidadeAr && (
                                    <span className="text-sm text-gray-500">{comodidadeAr.precoFormatado}/dia</span>
                                )}
                            </div>

                            {/* Hidromassagem */}
                            {tipo !== "Individual" && (
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setPossuiHidro(!possuiHidro)}
                                        disabled={!comodidadeHidro}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{
                                            borderColor: possuiHidro ? BRAND : "#e5e7eb",
                                            backgroundColor: possuiHidro ? "#E8F0F3" : "white",
                                            color: possuiHidro ? BRAND : "#6b7280",
                                        }}
                                    >
                                        {possuiHidro ? "✓" : "+"} Hidromassagem
                                    </button>
                                    {comodidadeHidro && (
                                        <span className="text-sm text-gray-500">{comodidadeHidro.precoFormatado}/dia</span>
                                    )}
                                </div>
                            )}

                            {/* Preview total */}
                            {valorBase && (
                                <div className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ backgroundColor: "#E8F0F3" }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Total da diária</span>
                                        <span className="text-lg font-bold" style={{ color: BRAND }}>R$ {totalDiaria().toFixed(0)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Capacidade: {capacidadeMaxima()} hóspede{capacidadeMaxima() !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            )}

                            {erro && (
                                <div className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                                    {erro}
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
                        onClick={() => step < 3 ? setStep(step + 1) : handleCadastrar()}
                        disabled={(step === 1 ? !step1Valido : step === 2 ? !step2Valido() : !step3Valido) || enviando}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        {step === 3 ? (enviando ? "Cadastrando..." : "Cadastrar Quarto") : "Próximo"}
                    </button>
                </div>
            </div>
        </div>
    );
}