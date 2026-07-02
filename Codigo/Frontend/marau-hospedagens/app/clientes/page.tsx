"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import NovoClienteModal from "@/components/NovoClienteModal";
import HistoricoClienteModal from "@/components/HistoricoClienteModal";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { api, ApiError, type Cliente } from "@/lib/api";

const BRAND = "#1A4A5E";
const ITENS_POR_PAGINA = 10;
const CLIENTES_COLS = "1fr 1fr 1.5fr 1fr 1fr 1fr 180px";

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

function Toast({ mensagem, onDone }: { mensagem: string; onDone: () => void }) {
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
                <p className="text-white font-semibold text-sm">{mensagem}</p>
            </div>
        </div>
    );
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
    const [clienteExcluindo, setClienteExcluindo] = useState<Cliente | null>(null);
    const [excluindo, setExcluindo] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);

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
        const editando = !!clienteEditando;
        setModalAberto(false);
        setClienteEditando(null);
        setToastMsg(editando ? "Cliente atualizado!" : "Cliente cadastrado!");
        carregar();
    }

    async function handleExcluir() {
        if (!clienteExcluindo) return;
        setExcluindo(true);
        setErro(null);
        try {
            await api.clientes.deletar(clienteExcluindo.id);
            setClienteExcluindo(null);
            setToastMsg("Cliente excluído!");
            carregar();
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao excluir cliente.");
            setClienteExcluindo(null);
        } finally {
            setExcluindo(false);
        }
    }

    const clientesFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return clientes;
        const termoNumerico = termo.replace(/\D/g, "");
        return clientes.filter((c) =>
            c.nome.toLowerCase().includes(termo) ||
            (termoNumerico !== "" && c.cpf.replace(/\D/g, "").includes(termoNumerico))
        );
    }, [clientes, busca]);

    // Volta pra primeira página sempre que a busca ou a lista mudarem.
    useEffect(() => {
        setPagina(1);
    }, [busca, clientes.length]);

    const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA));
    const clientesPagina = clientesFiltrados.slice(
        (pagina - 1) * ITENS_POR_PAGINA,
        pagina * ITENS_POR_PAGINA
    );

    return (
        <div className="flex-1 px-10 py-8 overflow-auto">
            {toastMsg && <Toast mensagem={toastMsg} onDone={() => setToastMsg(null)} />}

            <PageHeader
                titulo="Clientes"
                subtitulo="Cadastro e autenticação de hóspedes"
                botao={{ label: "Novo Cliente", onClick: () => setModalAberto(true) }}
            />

            {erro && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                    {erro}
                </div>
            )}

            {/* Busca */}
            <div className="mb-6 relative">
                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nome ou CPF..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full max-w-md border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none bg-white shadow-sm"
                    style={{ borderColor: busca ? BRAND : undefined }}
                />
            </div>

            {carregando ? (
                <p className="text-sm text-gray-400">Carregando clientes...</p>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Cabeçalho da tabela */}
                    <div
                        className="grid px-6 py-4 text-xs font-bold tracking-widest uppercase text-white"
                        style={{ backgroundColor: BRAND, gridTemplateColumns: CLIENTES_COLS }}
                    >
                        <span>Nome</span>
                        <span>CPF</span>
                        <span>E-mail</span>
                        <span>Telefone</span>
                        <span>Endereço</span>
                        <span>Última Hospedagem</span>
                        <span className="text-center">Ações</span>
                    </div>

                    {clientesPagina.length === 0 ? (
                        <p className="text-sm text-gray-400 px-6 py-6">
                            {clientes.length === 0
                                ? "Nenhum cliente cadastrado ainda."
                                : "Nenhum cliente encontrado para essa busca."}
                        </p>
                    ) : (
                        clientesPagina.map((c, i) => (
                            <div
                                key={c.id}
                                className={`grid px-6 py-4 items-center text-sm text-gray-600 border-b border-gray-100 transition-colors hover:bg-gray-50
                  ${i === clientesPagina.length - 1 ? "border-b-0" : ""}`}
                                style={{ gridTemplateColumns: CLIENTES_COLS }}
                            >
                                <span className="font-semibold text-gray-800 truncate" title={c.nome}>{c.nome}</span>
                                <span className="truncate" title={c.cpf}>{c.cpf}</span>
                                <span className="truncate" title={c.email}>{c.email}</span>
                                <span className="truncate" title={c.telefone}>{c.telefone}</span>
                                <span className="truncate" title={c.endereco}>{c.endereco}</span>
                                <div className="flex justify-center">
                                    <StatusBadge tipo={c.statusTipo} label={c.ultimaHospedagem} />
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setClienteSelecionadoId(c.id)}
                                        title="Ver histórico"
                                        className="px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors cursor-pointer"
                                        style={{ borderColor: BRAND, color: BRAND }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = BRAND; }}
                                    >
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => setClienteEditando(c)}
                                        title="Editar"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-colors cursor-pointer"
                                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setClienteExcluindo(c)}
                                        title="Excluir"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-colors cursor-pointer"
                                        style={{ borderColor: "#EF4444", color: "#EF4444" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EF4444"; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <Pagination
                        paginaAtual={pagina}
                        totalPaginas={totalPaginas}
                        totalItens={clientesFiltrados.length}
                        itensPorPagina={ITENS_POR_PAGINA}
                        onMudarPagina={setPagina}
                    />
                </div>
            )}

            {(modalAberto || clienteEditando) && (
                <NovoClienteModal
                    clienteEditando={clienteEditando ?? undefined}
                    onClose={() => { setModalAberto(false); setClienteEditando(null); }}
                    onConfirm={handleCadastrado}
                />
            )}
            {clienteSelecionadoId !== null && (
                <HistoricoClienteModal
                    clienteId={clienteSelecionadoId}
                    onClose={() => setClienteSelecionadoId(null)}
                />
            )}
            {clienteExcluindo && (
                <ConfirmDialog
                    titulo="Excluir cliente?"
                    mensagem={`Isso vai remover "${clienteExcluindo.nome}" e todo o histórico de hospedagens dele permanentemente.`}
                    enviando={excluindo}
                    onConfirm={handleExcluir}
                    onCancel={() => setClienteExcluindo(null)}
                />
            )}
        </div>
    );
}