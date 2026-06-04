"use client";

type StatusAluguel = "ocupado" | "reserva" | "concluido";

type Aluguel = {
    id: number;
    cliente: string;
    quarto: string;
    entrada: string;
    saida: string;
    diarias: number;
    valorFinal: string;
    status: StatusAluguel;
};

type Residencia = {
    id: number;
    nome: string;
    endereco: string;
    cor: string;
};

type Props = {
    residencia: Residencia;
    onClose: () => void;
};

const BRAND = "#1A4A5E";

// Mock — substituir por fetch da API quando o back estiver pronto
const historicoPorResidencia: Record<number, Aluguel[]> = {
    1: [
        { id: 1, cliente: "Ana Lima",    quarto: "Qto 02", entrada: "17/04 12:00", saida: "21/04 12:00", diarias: 4, valorFinal: "R$ 800,00", status: "ocupado" },
        { id: 2, cliente: "João Santos", quarto: "Qto 01", entrada: "12/04 12:00", saida: "16/04 12:00", diarias: 4, valorFinal: "R$ 480,00", status: "concluido" },
    ],
    2: [
        { id: 3, cliente: "Marina Faria",  quarto: "Qto 01", entrada: "20/04 12:00", saida: "25/04 12:00", diarias: 5, valorFinal: "R$ 475,00", status: "reserva" },
        { id: 4, cliente: "Carlos Mendes", quarto: "Qto 02", entrada: "10/04 12:00", saida: "14/04 12:00", diarias: 4, valorFinal: "R$ 360,00", status: "concluido" },
    ],
};

function StatusBadge({ status }: { status: StatusAluguel }) {
    const map: Record<StatusAluguel, { label: string; bg: string; color: string }> = {
        ocupado:   { label: "OCUPADO",   bg: "#dcfce7", color: "#16a34a" },
        reserva:   { label: "RESERVA",   bg: "#dbeafe", color: "#2563eb" },
        concluido: { label: "CONCLUÍDO", bg: "#f3f4f6", color: "#6b7280" },
    };
    const s = map[status];
    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ backgroundColor: s.bg, color: s.color }}
        >
            {s.label}
        </span>
    );
}

export default function HistoricoResidenciaModal({ residencia: r, onClose }: Props) {
    const historico = historicoPorResidencia[r.id] ?? [];

    const totalValor = historico.reduce((acc, a) => {
        const num = parseFloat(a.valorFinal.replace("R$ ", "").replace(",", "."));
        return acc + (isNaN(num) ? 0 : num);
    }, 0);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">

                {/* Header colorido da residência */}
                <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: r.cor }}>
                    <div>
                        <h2 className="text-lg font-bold text-white">{r.nome}</h2>
                        <p className="text-white/70 text-xs mt-0.5">{r.endereco}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white cursor-pointer transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Resumo */}
                <div className="px-6 py-4 grid grid-cols-3 gap-4 border-b border-gray-100" style={{ backgroundColor: "#FAF5EE" }}>
                    <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Total de registros</p>
                        <p className="text-sm font-medium text-gray-700">{historico.length} estadia{historico.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Ativos / Reservas</p>
                        <p className="text-sm font-medium text-gray-700">
                            {historico.filter(a => a.status === "ocupado" || a.status === "reserva").length} em andamento
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Total arrecadado</p>
                        <p className="text-sm font-medium text-gray-700">
                            R$ {totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Lista */}
                <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Histórico de Estadias</h3>

                    {historico.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma estadia registrada.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {historico.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {a.cliente} · {a.quarto}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {a.entrada} → {a.saida} · {a.diarias} diária{a.diarias !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold" style={{ color: BRAND }}>
                                            {a.valorFinal}
                                        </span>
                                        <StatusBadge status={a.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-colors"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND; }}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}