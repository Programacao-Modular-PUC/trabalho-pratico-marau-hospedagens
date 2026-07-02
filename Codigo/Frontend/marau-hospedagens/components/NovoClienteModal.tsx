"use client";

import { useEffect, useState } from "react";
import { api, ApiError, type Cliente, type ClienteRequest } from "@/lib/api";

type Props = {
    onClose: () => void;
    onConfirm: (req?: ClienteRequest) => void;
    clienteInicial?: Cliente;
};

const BRAND = "#1A4A5E";

export default function NovoClienteModal({ onClose, onConfirm, clienteInicial }: Props) {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    const formatarCpf = (v: string) => {
        const nums = v.replace(/\D/g, "").slice(0, 11);
        if (nums.length <= 3) return nums;
        if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
        if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
        return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
    };

    const formatarTelefone = (v: string) => {
        const nums = v.replace(/\D/g, "").slice(0, 11);
        if (nums.length <= 10) return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    };

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (clienteInicial) {
            setNome(clienteInicial.nome ?? "");
            setCpf(clienteInicial.cpf ?? "");
            setEmail(clienteInicial.email ?? "");
            setTelefone(clienteInicial.telefone ?? "");
            setEndereco(clienteInicial.endereco ?? "");
            setCidade(clienteInicial.endereco?.split(",")[1]?.trim() ?? "");
            setEstado(clienteInicial.endereco?.split("-")[1]?.trim() ?? "");
        }
    }, [clienteInicial]);

    const valido =
        nome.trim() !== "" &&
        cpf.length === 14 &&
        email.trim() !== "" &&
        telefone.trim() !== "" &&
        endereco.trim() !== "" &&
        cidade.trim() !== "" &&
        estado.trim() !== "";

    async function handleCadastrar() {
        setErro(null);
        setEnviando(true);
        try {
            const req: ClienteRequest = {
                nome,
                cpf,
                email,
                telefone,
                endereco: `${endereco}${cidade ? `, ${cidade}` : ""}${estado ? ` - ${estado}` : ""}`,
            };
            if (clienteInicial) {
                await api.clientes.atualizar(clienteInicial.id, req);
            } else {
                await api.clientes.criar(req);
            }
            onConfirm(req);
        } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Erro ao cadastrar cliente.");
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
                    <h2 className="text-lg font-bold" style={{ color: BRAND }}>{clienteInicial ? "Editar Cliente" : "Novo Cliente"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Corpo */}
                <div className="px-6 py-6 flex flex-col gap-4">

                    {/* Nome */}
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Nome completo</label>
                        <input
                            type="text"
                            placeholder="Ex: Ana Lima"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            autoFocus
                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                            style={{ borderColor: nome ? BRAND : "#e5e7eb" }}
                        />
                    </div>

                    {/* CPF */}
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">CPF</label>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={(e) => setCpf(formatarCpf(e.target.value))}
                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                            style={{ borderColor: cpf ? BRAND : "#e5e7eb" }}
                        />
                    </div>

                    {/* Email e Telefone */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">E-mail</label>
                            <input
                                type="email"
                                placeholder="ana@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                style={{ borderColor: email ? BRAND : "#e5e7eb" }}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Telefone</label>
                            <input
                                type="text"
                                placeholder="(11) 98765-4321"
                                value={telefone}
                                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                style={{ borderColor: telefone ? BRAND : "#e5e7eb" }}
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Endereço</label>
                        <input
                            type="text"
                            placeholder="Ex: Rua das Flores, 123"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                            style={{ borderColor: endereco ? BRAND : "#e5e7eb" }}
                        />
                    </div>

                    {/* Cidade e Estado */}
                    <div className="grid grid-cols-[1fr_80px] gap-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Cidade</label>
                            <input
                                type="text"
                                placeholder="Ex: São Paulo"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                style={{ borderColor: cidade ? BRAND : "#e5e7eb" }}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Estado</label>
                            <input
                                type="text"
                                placeholder="SP"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                                className="w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none"
                                style={{ borderColor: estado ? BRAND : "#e5e7eb" }}
                            />
                        </div>
                    </div>
                </div>

                {erro && (
                    <div className="mx-6 mb-3 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#FEF3F2", color: "#B91C1C" }}>
                        {erro}
                    </div>
                )}

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
                        onClick={handleCadastrar}
                        disabled={!valido || enviando}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        {enviando ? (clienteInicial ? "Salvando..." : "Cadastrando...") : (clienteInicial ? "Salvar Alterações" : "Cadastrar Cliente")}
                    </button>
                </div>
            </div>
        </div>
    );
}