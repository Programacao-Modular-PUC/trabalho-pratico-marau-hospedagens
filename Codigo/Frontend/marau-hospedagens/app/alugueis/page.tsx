"use client";

import PageHeader from "@/components/PageHeader";

type StatusAluguel = "ocupado" | "reserva" | "concluido";

type Aluguel = {
    id: number;
    cliente: string;
    residenciaQuarto: string;
    entrada: string;
    saida: string;
    diarias: number;
    valorFinal: string;
    status: StatusAluguel;
    acaoLabel: string;
    acaoCor?: string;
};

const alugueis: Aluguel[] = [
    {
        id: 1,
        cliente: "Ana Lima",
        residenciaQuarto: "Casa da Praia / Qto 02",
        entrada: "17/04 12:00",
        saida: "21/04 12:00",
        diarias: 4,
        valorFinal: "R$ 800,00",
        status: "ocupado",
        acaoLabel: "Ver",
    },
    {
        id: 2,
        cliente: "Marina Faria",
        residenciaQuarto: "Pousada do Mato / Qto 01",
        entrada: "20/04 12:00",
        saida: "25/04 12:00",
        diarias: 5,
        valorFinal: "R$ 475,00",
        status: "reserva",
        acaoLabel: "Ver",
    },
    {
        id: 3,
        cliente: "João Santos",
        residenciaQuarto: "Casa da Praia / Qto 01",
        entrada: "12/04 12:00",
        saida: "16/04 12:00",
        diarias: 4,
        valorFinal: "R$ 480,00",
        status: "concluido",
        acaoLabel: "Recibo",
    },
];

const COLS = "1.4fr 1.8fr 1fr 1fr 0.6fr 1fr 1fr 0.6fr";

function StatusBadge({ status }: { status: StatusAluguel }) {
    const map = {
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

export default function AlugueisPage() {
    return (
        <div className="px-10 py-8">
            <PageHeader
                titulo="Aluguéis e Reservas"
                subtitulo="Registro de estadias e reservas futuras"
                botao={{ label: "Nova Reserva", onClick: () => {} }}
            />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Cabeçalho */}
                <div
                    className="grid px-6 py-4 text-xs font-bold tracking-widest uppercase text-white"
                    style={{ backgroundColor: "#1A4A5E", gridTemplateColumns: COLS }}
                >
                    <span>Cliente</span>
                    <span>Residência / Quarto</span>
                    <span>Entrada</span>
                    <span>Saída</span>
                    <span>Diárias</span>
                    <span>Valor Final</span>
                    <span>Status</span>
                    <span>Ações</span>
                </div>

                {/* Linhas */}
                {alugueis.map((a, i) => (
                    <div
                        key={a.id}
                        className={`grid px-6 py-4 items-center text-sm text-gray-600 border-b border-gray-100 hover:bg-gray-50 transition-colors
              ${i === alugueis.length - 1 ? "border-b-0" : ""}`}
                        style={{ gridTemplateColumns: COLS }}
                    >
                        <span className="font-semibold text-gray-800">{a.cliente}</span>
                        <span>{a.residenciaQuarto}</span>
                        <span>{a.entrada}</span>
                        <span>{a.saida}</span>
                        <span>{a.diarias}</span>
                        <span className="font-semibold text-gray-800">{a.valorFinal}</span>
                        <span><StatusBadge status={a.status} /></span>
                        <button
                            className="px-4 py-1.5 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
                            style={{ borderColor: "#1A4A5E", color: "#1A4A5E" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#1A4A5E";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#1A4A5E";
                            }}
                        >
                            {a.acaoLabel}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}