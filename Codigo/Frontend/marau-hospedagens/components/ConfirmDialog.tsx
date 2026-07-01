"use client";

const BRAND = "#1A4A5E";

type Props = {
    titulo: string;
    mensagem: string;
    confirmLabel?: string;
    cancelLabel?: string;
    enviando?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
                                          titulo,
                                          mensagem,
                                          confirmLabel = "Sim, excluir",
                                          cancelLabel = "Cancelar",
                                          enviando = false,
                                          onConfirm,
                                          onCancel,
                                      }: Props) {
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
                <div className="px-6 py-6 flex flex-col items-center text-center gap-3">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#FEF3F2" }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="text-base font-bold" style={{ color: BRAND }}>{titulo}</h2>
                    <p className="text-sm text-gray-500">{mensagem}</p>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        disabled={enviando}
                        className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all disabled:opacity-40"
                        style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={enviando}
                        className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all disabled:opacity-60"
                        style={{ backgroundColor: "#EF4444" }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#dc2626"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EF4444"; }}
                    >
                        {enviando ? "Excluindo..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}