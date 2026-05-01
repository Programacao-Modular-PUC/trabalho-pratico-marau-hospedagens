type PageHeaderProps = {
    titulo: string;
    subtitulo?: string;
    botao?: {
        label: string;
        onClick: () => void;
    };
};

export default function PageHeader({ titulo, subtitulo, botao }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A4A5E]">{titulo}</h1>
                    {subtitulo && (
                        <p className="text-sm text-[#71858F] mt-0.5">{subtitulo}</p>
                    )}
                </div>
                {botao && (
                    <button
                        onClick={botao.onClick}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        style={{ backgroundColor: "#1A4A5E" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#15394d")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1A4A5E")}
                    >
                        + {botao.label}
                    </button>
                )}
            </div>
            <div className="h-0.5 mt-4" style={{ backgroundColor: "#E5D3BA" }} />
        </div>
    );
}