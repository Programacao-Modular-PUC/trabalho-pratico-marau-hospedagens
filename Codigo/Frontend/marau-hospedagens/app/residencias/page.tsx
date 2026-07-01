"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import ResidenciaCard from "@/components/ResidenciaCard";
import CadastrarResidenciaModal from "@/components/CadastrarResidenciaModal";
import { api, ApiError, type Residencia, type ResidenciaRequest } from "@/lib/api";

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
                <p className="text-white font-semibold text-sm">Residência cadastrada!</p>
                <p className="text-white/70 text-xs">A residência foi registrada com sucesso.</p>
            </div>
        </div>
    );
}

export default function ResidenciasPage() {
    const [residencias, setResidencias] = useState<Residencia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            setResidencias(await api.residencias.listar());
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao carregar residências.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await carregar();
        })();
    }, [carregar]);

    async function handleCadastrar(req: ResidenciaRequest) {
        await api.residencias.criar(req);
        setModalAberto(false);
        setShowToast(true);
        carregar();
    }

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Residências"
                subtitulo="Gerencie as propriedades cadastradas no sistema"
                botao={{ label: "Cadastrar Residência", onClick: () => setModalAberto(true) }}
            />

            {erro && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                    {erro}
                </div>
            )}

            {carregando ? (
                <p className="text-sm text-gray-400">Carregando residências...</p>
            ) : residencias.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhuma residência cadastrada ainda.</p>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {residencias.map((r) => (
                        <ResidenciaCard key={r.id} r={r} />
                    ))}
                </div>
            )}

            {modalAberto && (
                <CadastrarResidenciaModal
                    onClose={() => setModalAberto(false)}
                    onConfirm={handleCadastrar}
                />
            )}
        </div>
    );
}