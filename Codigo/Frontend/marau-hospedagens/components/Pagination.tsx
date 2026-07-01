"use client";

const BRAND = "#1A4A5E";

type Props = {
    paginaAtual: number;
    totalPaginas: number;
    totalItens: number;
    itensPorPagina: number;
    onMudarPagina: (pagina: number) => void;
};

export default function Pagination({ paginaAtual, totalPaginas, totalItens, itensPorPagina, onMudarPagina }: Props) {
    if (totalPaginas <= 1) return null;

    const inicio = (paginaAtual - 1) * itensPorPagina + 1;
    const fim = Math.min(paginaAtual * itensPorPagina, totalItens);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
                Mostrando {inicio}–{fim} de {totalItens}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onMudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                >
                    Anterior
                </button>
                <span className="text-sm font-medium px-2" style={{ color: BRAND }}>
                    Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                    onClick={() => onMudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}