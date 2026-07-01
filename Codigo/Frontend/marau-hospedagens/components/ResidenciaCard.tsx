"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HistoricoResidenciaModal from "@/components/HistoricoResidenciaModal";
import CadastrarResidenciaModal from "@/components/CadastrarResidenciaModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { api, ApiError, type Residencia, type ResidenciaRequest } from "@/lib/api";

const BRAND = "#1A4A5E";

type Props = {
    r: Residencia;
    onChanged: () => void;
};

export default function ResidenciaCard({ r, onChanged }: Props) {
    const router = useRouter();
    const [modalHistorico, setModalHistorico] = useState(false);
    const [modalEdicao, setModalEdicao] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);

    async function handleSalvarEdicao(req: ResidenciaRequest) {
        await api.residencias.atualizar(r.id, req);
        setModalEdicao(false);
        onChanged();
    }

    async function handleExcluir() {
        setExcluindo(true);
        setErroExclusao(null);
        try {
            await api.residencias.deletar(r.id);
            setConfirmandoExclusao(false);
            onChanged();
        } catch (e) {
            // Erros 500 aqui costumam ser violação de chave estrangeira (quartos
            // com aluguéis vinculados) — o backend ainda não devolve uma
            // mensagem amigável pra esse caso específico.
            const msg = e instanceof ApiError && e.status !== 500
                ? e.message
                : "Não é possível excluir: essa residência tem quartos com aluguéis vinculados.";
            setErroExclusao(msg);
            setConfirmandoExclusao(false);
        } finally {
            setExcluindo(false);
        }
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header colorido */}
                <div className="px-6 py-5" style={{ backgroundColor: r.cor }}>
                    <h2 className="text-xl font-bold text-white">{r.nome}</h2>
                    <p className="text-white/80 text-sm mt-0.5">{r.endereco}</p>
                </div>

                {/* Corpo */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {/* Infos */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div>
                            <span className="font-semibold text-gray-700">CEP: </span>
                            <span className="text-gray-500">{r.cep}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Telefone: </span>
                            <span className="text-gray-500">{r.telefone}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Email: </span>
                            <span className="text-gray-500">{r.email}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Quartos: </span>
                            <span className="text-gray-500">{r.totalQuartos}</span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2">
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium text-white" style={{ backgroundColor: BRAND }}>
                            {r.disponiveis} disponíveis
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-[#F4EADC]">
                            {r.ocupados} ocupado{r.ocupados !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {erroExclusao && (
                        <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                            {erroExclusao}
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                        <button
                            onClick={() => router.push(`/quartos?residencia=${encodeURIComponent(r.nome)}`)}
                            className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                            style={{ borderColor: BRAND, color: BRAND }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = BRAND; }}
                        >
                            Ver Quartos
                        </button>
                        <button
                            onClick={() => setModalHistorico(true)}
                            className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                            style={{ borderColor: BRAND, color: BRAND }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = BRAND; }}
                        >
                            Histórico
                        </button>
                        <button
                            onClick={() => setModalEdicao(true)}
                            title="Editar"
                            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 transition-colors cursor-pointer"
                            style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setConfirmandoExclusao(true)}
                            title="Excluir"
                            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 transition-colors cursor-pointer"
                            style={{ borderColor: "#EF4444", color: "#EF4444" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EF4444"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {modalHistorico && (
                <HistoricoResidenciaModal
                    residencia={{ id: r.id, nome: r.nome, endereco: r.endereco, cor: r.cor }}
                    onClose={() => setModalHistorico(false)}
                />
            )}

            {modalEdicao && (
                <CadastrarResidenciaModal
                    residenciaEditando={r}
                    onClose={() => setModalEdicao(false)}
                    onConfirm={handleSalvarEdicao}
                />
            )}

            {confirmandoExclusao && (
                <ConfirmDialog
                    titulo="Excluir residência?"
                    mensagem={`Isso vai remover "${r.nome}" e todos os seus quartos permanentemente.`}
                    enviando={excluindo}
                    onConfirm={handleExcluir}
                    onCancel={() => { setConfirmandoExclusao(false); setErroExclusao(null); }}
                />
            )}
        </>
    );
}