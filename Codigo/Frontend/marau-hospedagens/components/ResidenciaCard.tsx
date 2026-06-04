"use client";

import { useRouter } from "next/navigation";

type Residencia = {
    id: number;
    nome: string;
    endereco: string;
    cep: string;
    telefone: string;
    email: string;
    totalQuartos: number;
    disponiveis: number;
    ocupados: number;
    cor: string;
};

export default function ResidenciaCard({ r }: { r: Residencia }) {
    const router = useRouter();

    return (
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
          <span className="px-4 py-1.5 rounded-full text-sm font-medium text-white" style={{ backgroundColor: "#1A4A5E" }}>
            {r.disponiveis} disponíveis
          </span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-[#F4EADC]">
            {r.ocupados} ocupado{r.ocupados !== 1 ? "s" : ""}
          </span>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-2 pt-1">
                    <button
                        onClick={() => router.push(`/quartos?residencia=${encodeURIComponent(r.nome)}`)}
                        className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
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
                        Ver Quartos
                    </button>
                    <button
                        className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer"
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
                        Histórico
                    </button>
                </div>
            </div>
        </div>
    );
}