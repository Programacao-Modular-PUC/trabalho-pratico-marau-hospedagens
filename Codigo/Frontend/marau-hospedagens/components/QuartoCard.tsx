type Comodidade = {
    nome: string;
    inclusa: boolean;
};

type Quarto = {
    id: number;
    nome: string;
    residencia: string;
    preco: number;
    status: "disponivel" | "ocupado";
    comodidades: Comodidade[];
    descricao: string;
    cor: string;
};

export default function QuartoCard({ q }: { q: Quarto }) {
    const disponivel = q.status === "disponivel";

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-5" style={{ backgroundColor: q.cor }}>
                <p className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-1">
                    {q.nome} · {q.residencia}
                </p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">R$ {q.preco}</span>
                    <span className="text-white/80 text-sm mb-1">/dia</span>
                </div>
            </div>

            {/* Corpo */}
            <div className="px-6 py-5 flex flex-col gap-4 flex-1 justify-between">
                {/* Status */}
                <span
                    className="self-start px-3 py-1 rounded-full text-xs font-semibold"
                    style={
                        disponivel
                            ? { backgroundColor: "#dcfce7", color: "#16a34a" }
                            : { backgroundColor: "#fee2e2", color: "#dc2626" }
                    }
                >
          {disponivel ? "DISPONÍVEL" : "OCUPADO"}
        </span>

                {/* Comodidades */}
                <div className="flex flex-wrap gap-2">
                    {q.comodidades.map((c) => (
                        <span
                            key={c.nome}
                            className="px-4 py-1.5 rounded-full text-sm font-medium"
                            style={
                                c.inclusa
                                    ? { backgroundColor: "#1A4A5E", color: "white" }
                                    : { backgroundColor: "#FAF5EE", color: "#9ca3af" }
                            }
                        >
                        {c.nome}
                        </span>
                    ))}
                </div>

                {/* Descrição */}
                <p className="text-sm text-gray-400">{q.descricao}</p>

                {/* Botão Reserva */}
                <div className="flex justify-end pt-1">
                    <button
                        className="px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-colors cursor-pointer"
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
                        Conferir Datas
                    </button>
                </div>
            </div>
        </div>
    );
}