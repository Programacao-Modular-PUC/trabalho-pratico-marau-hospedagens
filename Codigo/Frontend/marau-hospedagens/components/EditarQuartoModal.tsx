"use client";

import { useState, useEffect } from "react";
import { api, ApiError, type Quarto, type Comodidade } from "@/lib/api";

type Props = {
    quarto: Quarto;
    onClose: () => void;
    onConfirm: () => void;
};

const BRAND = "#1A4A5E";

export default function EditarQuartoModal({ quarto, onClose, onConfirm }: Props) {
    const [nome, setNome] = useState(quarto.nome);
    const [tipo, setTipo] = useState<"Individual" | "Duplo" | "Familia">(quarto.tipo);
    const [valorBase, setValorBase] = useState(String(quarto.valorBase));

    const [comodidadesCatalogo, setComodidadesCatalogo] = useState<Comodidade[]>([]);
    useEffect(() => {
        api.comodidades.listar().then(setComodidadesCatalogo).catch(() => {});
    }, []);
    const comodidadeAr = comodidadesCatalogo.find((c) => c.nome.toLowerCase().includes("ar"));
    const comodidadeHidro = comodidadesCatalogo.find((c) => c.nome.toLowerCase().includes("hidro"));

    const [possuiAR, setPossuiAR] = useState(quarto.comodidades.some((c) => c.nome.toLowerCase().includes("ar")));
    const [possuiHidro, setPossuiHidro] = useState(quarto.comodidades.some((c) => c.nome.toLowerCase().includes("hidro")));

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const valido = nome.trim() !== "" && valorBase !== "" && parseFloat(valorBase) > 0;

    const totalDiaria = () => {
        let total = parseFloat(valorBase) || 0;
        if (possuiAR) total += comodidadeAr?.preco ?? 0;
        if (possuiHidro) total += comodidadeHidro?.preco ?? 0;
        return total;
    };

    async function handleSalvar() {
        setErro(null);
        setEnviando(true);
        try {
            const comodidadeIds: number[] = [];
            if (possuiAR && comodidadeAr) comodidadeIds.push(comodidadeAr.id);
            if (possuiHidro && comodidadeHidro) comodidadeIds.push(comodidadeHidro.id);

            await api.quartos.atualizar(quarto.id, {
                nome,
                tipo,
                valorBase: parseFloat(valorBase) || 0,
                residenciaId: quarto.residenciaId,
                cor: quarto.cor,
                comodidadeIds,
            });
            onConfirm();
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao salvar alterações do quarto.");
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: BRAND }}>Editar Quarto</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{quarto.residencia}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Corpo */}
                <div className="px-6 py-6 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Nome do quarto</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            autoFocus
                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                            style={{ borderColor: nome ? BRAND : "#e5e7eb" }}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Tipo de quarto</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(["Individual", "Duplo", "Familia"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTipo(t)}
                                    className="px-3 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all"
                                    style={{
                                        borderColor: tipo === t ? BRAND : "#e5e7eb",
                                        backgroundColor: tipo === t ? "#E8F0F3" : "white",
                                        color: tipo === t ? BRAND : "#6b7280",
                                    }}
                                >
                                    {t === "Familia" ? "Família" : t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Valor base da diária (R$)</label>
                        <input
                            type="number"
                            value={valorBase}
                            onChange={(e) => setValorBase(e.target.value)}
                            min={0}
                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                            style={{ borderColor: valorBase ? BRAND : "#e5e7eb" }}
                        />
                    </div>

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
                        {comodidadeAr && <span className="text-sm text-gray-500">{comodidadeAr.precoFormatado}/dia</span>}
                    </div>

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
                        {comodidadeHidro && <span className="text-sm text-gray-500">{comodidadeHidro.precoFormatado}/dia</span>}
                    </div>

                    {valorBase && (
                        <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#E8F0F3" }}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Total da diária</span>
                                <span className="text-lg font-bold" style={{ color: BRAND }}>R$ {totalDiaria().toFixed(0)}</span>
                            </div>
                        </div>
                    )}

                    {erro && (
                        <div className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                            {erro}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all"
                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        disabled={!valido || enviando}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        {enviando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </div>
        </div>
    );
}