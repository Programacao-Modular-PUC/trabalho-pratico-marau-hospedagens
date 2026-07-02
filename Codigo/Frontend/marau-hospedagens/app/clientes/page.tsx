"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import NovoClienteModal from "@/components/NovoClienteModal";
import HistoricoClienteModal from "@/components/HistoricoClienteModal";
import { api, ApiError, type Cliente } from "@/lib/api";

function StatusBadge({ tipo, label }: { tipo: Cliente["statusTipo"]; label: string }) {
    const styles = {
        ativo:   { backgroundColor: "#dcfce7", color: "#16a34a" },
        data:    { backgroundColor: "#f3f4f6", color: "#6b7280" },
        reserva: { backgroundColor: "#dbeafe", color: "#2563eb" },
    };

    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={styles[tipo]}
        >
      {label}
    </span>
    );
}

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
                <p className="text-white font-semibold text-sm">Cliente cadastrado!</p>
                <p className="text-white/70 text-xs">O cliente foi registrado com sucesso.</p>
            </div>
        </div>
    );
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            setClientes(await api.clientes.listar());
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao carregar clientes.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await carregar();
        })();
    }, [carregar]);

    async function handleCadastrado() {
        setModalAberto(false);
        setClienteEditando(null);
        setShowToast(true);
        await carregar();
    }

    async function handleExcluir(id: number) {
        if (!window.confirm("Deseja realmente excluir este cliente?")) return;
        await api.clientes.deletar(id);
        await carregar();
    }

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {showToast && <Toast onDone={() => setShowToast(false)} />}

            <PageHeader
                titulo="Clientes"
                subtitulo="Cadastro e autenticação de hóspedes"
                botao={{ label: "Novo Cliente", onClick: () => { setClienteEditando(null); setModalAberto(true); } }}
            />

            {erro && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                    {erro}
                </div>
            )}

            {carregando ? (
                <p className="text-sm text-gray-400">Carregando clientes...</p>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Cabeçalho da tabela */}
                    <div
                        className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_auto] px-6 py-4 text-xs font-bold tracking-widest uppercase text-white"
                        style={{ backgroundColor: "#1A4A5E" }}
                    >
                        <span>Nome</span>
                        <span>CPF</span>
                        <span>E-mail</span>
                        <span>Telefone</span>
                        <span>Endereço</span>
                        <span>Última Hospedagem</span>
                        <span>Ações</span>
                    </div>

                    {clientes.length === 0 ? (
                        <p className="text-sm text-gray-400 px-6 py-6">Nenhum cliente cadastrado ainda.</p>
                    ) : (
                        clientes.map((c, i) => (
                            <div
                                key={c.id}
                                className={`grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_auto] px-6 py-4 items-center text-sm text-gray-600 border-b border-gray-100 transition-colors hover:bg-gray-50
                  ${i === clientes.length - 1 ? "border-b-0" : ""}`}
                            >
                                <span className="font-semibold text-gray-800">{c.nome}</span>
                                <span>{c.cpf}</span>
                                <span>{c.email}</span>
                                <span>{c.telefone}</span>
                                <span>{c.endereco}</span>
                                <span>
                  <StatusBadge tipo={c.statusTipo} label={c.ultimaHospedagem} />
                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setClienteSelecionadoId(c.id)}
                                        className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                                        style={{ borderColor: "#1A4A5E", color: "#1A4A5E" }}
                                    >
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => { setClienteEditando(c); setModalAberto(true); }}
                                        className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                                        style={{ borderColor: "#F59E0B", color: "#F59E0B" }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => void handleExcluir(c.id)}
                                        className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                                        style={{ borderColor: "#EF4444", color: "#EF4444" }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {modalAberto && (
                <NovoClienteModal
                    onClose={() => { setModalAberto(false); setClienteEditando(null); }}
                    onConfirm={handleCadastrado}
                    clienteInicial={clienteEditando ?? undefined}
                />
            )}
            {clienteSelecionadoId !== null && (
                <HistoricoClienteModal
                    clienteId={clienteSelecionadoId}
                    onClose={() => setClienteSelecionadoId(null)}
                />
            )}
        </div>
    );
}