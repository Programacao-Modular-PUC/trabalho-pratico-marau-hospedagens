"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const recibo = {
    numero: "0037",
    emitidoEm: "17/04/2025 às 12:00",
    hospede: {
        nome: "Ana Lima",
        cpf: "032.456.789-01",
        email: "ana.lima@email.com",
    },
    acomodacao: {
        nome: "Casa da Praia · Quarto 02 (Casal)",
        endereco: "Rua das Amendoeiras, 42 · Barra Grande, Maraú – BA",
    },
    entrada: "17/04/2025",
    entradaHora: "12:00",
    saida: "21/04/2025",
    saidaHora: "12:00",
    diarias: 4,
    itens: [
        { label: "Valor base (casal):", valor: "R$ 160,00/dia" },
        { label: "+ Ar-condicionado:", valor: "R$ 10,00/dia" },
        { label: "+ Hidromassagem:", valor: "R$ 30,00/dia" },
        { label: "Valor da diária (final):", valor: "R$ 200,00/dia" },
    ],
    totalFinal: "R$ 800,00",
};

function LinhaInfo({ label, valor }: { label: string; valor: string }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-200 last:border-b-0">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-bold" style={{ color: "#1A4A5E" }}>{valor}</span>
        </div>
    );
}

const IconPrint = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

const IconEmail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

export default function ReciboPage() {
    const [pagamento, setPagamento] = useState("Dinheiro");

    const handleImprimir = () => {
        const janela = window.open("", "_blank");
        if (!janela) return;

        janela.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Recibo Nº ${recibo.numero} - ${recibo.hospede.nome}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #000; background: white; padding: 40px; font-size: 13px; }
        
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 24px; }
        .header img { width: 120px; margin-bottom: 12px; filter: grayscale(100%); }
        .header h2 { font-size: 20px; font-weight: 700; }
        .header p { font-size: 12px; color: #444; margin-top: 4px; }

        .bloco { border: 1px solid #ccc; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px; }
        .bloco-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #666; margin-bottom: 6px; }
        .bloco-nome { font-weight: 700; font-size: 14px; }
        .bloco-sub { font-size: 12px; color: #444; margin-top: 2px; }

        .linhas { margin-bottom: 16px; }
        .linha { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ccc; }
        .linha:last-child { border-bottom: none; }
        .linha-label { color: #555; }
        .linha-valor { font-weight: 700; }

        .total { display: flex; justify-content: space-between; border: 2px solid #000; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px; }
        .total span { font-weight: 600; font-size: 14px; }
        .total strong { font-size: 18px; font-weight: 700; }

        .pagamento { display: flex; justify-content: space-between; border: 1px solid #ccc; border-radius: 4px; padding: 10px 16px; margin-bottom: 32px; }
        .pagamento span { color: #555; }
        .pagamento strong { font-weight: 700; }

        .assinaturas { display: flex; justify-content: space-between; margin-top: 48px; }
        .assinatura { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .linha-assinatura { width: 200px; border-bottom: 1px solid #000; }
        .assinatura span { font-size: 11px; color: #555; }

        .rodape { text-align: center; margin-top: 32px; font-size: 11px; color: #999; border-top: 1px solid #ccc; padding-top: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${window.location.origin}/logo-marau.png" alt="Maraú Hospedagens" />
        <h2>Recibo de Hospedagem</h2>
        <p>Maraú Hospedagens · Recibo Nº ${recibo.numero}</p>
        <p>Emitido em ${recibo.emitidoEm}</p>
      </div>

      <div class="bloco">
        <div class="bloco-label">Hóspede</div>
        <div class="bloco-nome">${recibo.hospede.nome}</div>
        <div class="bloco-sub">CPF: ${recibo.hospede.cpf} · ${recibo.hospede.email}</div>
      </div>

      <div class="bloco">
        <div class="bloco-label">Acomodação</div>
        <div class="bloco-nome">${recibo.acomodacao.nome}</div>
        <div class="bloco-sub">${recibo.acomodacao.endereco}</div>
      </div>

      <div class="linhas">
        <div class="linha"><span class="linha-label">Data e horário de entrada:</span><span class="linha-valor">${recibo.entrada} · ${recibo.entradaHora}</span></div>
        <div class="linha"><span class="linha-label">Data e horário de saída:</span><span class="linha-valor">${recibo.saida} · ${recibo.saidaHora}</span></div>
        <div class="linha"><span class="linha-label">Número de diárias:</span><span class="linha-valor">${recibo.diarias} diárias</span></div>
        ${recibo.itens.map(item => `
          <div class="linha"><span class="linha-label">${item.label}</span><span class="linha-valor">${item.valor}</span></div>
        `).join("")}
      </div>

      <div class="total">
        <span>Valor Total:</span>
        <strong>${recibo.totalFinal}</strong>
      </div>

      <div class="pagamento">
        <span>Forma de pagamento:</span>
        <strong>${pagamento}</strong>
      </div>

      <div class="assinaturas">
        <div class="assinatura">
          <div class="linha-assinatura"></div>
          <span>Assinatura do Responsável</span>
        </div>
        <div class="assinatura">
          <div class="linha-assinatura"></div>
          <span>Assinatura do Cliente</span>
        </div>
      </div>

      <div class="rodape">Maraú Hospedagens · Documento gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
    </body>
    </html>
  `);

        janela.document.close();
        janela.focus();
        setTimeout(() => {
            janela.print();
            janela.close();
        }, 500);
    };

    return (
        <div className="px-10 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Recibo de Hospedagem</h1>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors cursor-pointer"
                        style={{ borderColor: "#1A4A5E", color: "#1A4A5E" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1A4A5E"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1A4A5E"; }}
                        onClick={handleImprimir}
                    >
                        <IconPrint /> Imprimir
                    </button>
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer"
                        style={{ backgroundColor: "#1A4A5E" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15394d"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1A4A5E"; }}
                    >
                        <IconEmail /> Enviar por Email
                    </button>
                </div>
            </div>

            {/* Linha separadora */}
            <div className="h-0.5 mb-6" style={{ backgroundColor: "#E5D3BA" }} />

            {/* Select de pagamento */}
            <div className="flex items-center gap-3 mb-6">
                <label className="text-sm font-semibold text-gray-600">Forma de pagamento:</label>
                <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 bg-white shadow-sm relative cursor-pointer">
                    <select
                        value={pagamento}
                        onChange={(e) => setPagamento(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    >
                        <option>Dinheiro</option>
                        <option>Cartão de Crédito</option>
                        <option>Cartão de Débito</option>
                        <option>PIX</option>
                        <option>Transferência</option>
                    </select>
                    {pagamento}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            {/* Card do recibo */}
            <div id="recibo-print-wrapper">
                <div id="recibo-print" className="max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden">

                    {/* Header escuro */}
                    <div className="flex flex-col items-center py-8 px-6 text-center" style={{ backgroundColor: "#164152" }}>
                        <img
                            src="/logo-recibo.png"
                            alt="Maraú Hospedagens"
                            style={{ width: "140px", height: "auto", marginBottom: "16px" }}
                        />
                        <h2 className="text-2xl font-bold text-white">Recibo de Hospedagem</h2>
                        <p className="text-white/60 text-sm mt-1">Maraú Hospedagens · Recibo Nº {recibo.numero}</p>
                        <p className="text-white/60 text-sm">Emitido em {recibo.emitidoEm}</p>
                    </div>

                    {/* Corpo */}
                    <div className="p-6 flex flex-col gap-4">

                        {/* Hóspede */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: "#FAF5EE" }}>
                            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Hóspede</p>
                            <p className="font-bold text-gray-800">{recibo.hospede.nome}</p>
                            <p className="text-sm text-gray-500">CPF: {recibo.hospede.cpf} · {recibo.hospede.email}</p>
                        </div>

                        {/* Acomodação */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: "#FAF5EE" }}>
                            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Acomodação</p>
                            <p className="font-bold text-gray-800">{recibo.acomodacao.nome}</p>
                            <p className="text-sm text-gray-500">{recibo.acomodacao.endereco}</p>
                        </div>

                        {/* Datas e valores */}
                        <div className="flex flex-col">
                            <LinhaInfo label="Data e horário de entrada:" valor={`${recibo.entrada} · ${recibo.entradaHora}`} />
                            <LinhaInfo label="Data e horário de saída:" valor={`${recibo.saida} · ${recibo.saidaHora}`} />
                            <LinhaInfo label="Número de diárias:" valor={`${recibo.diarias} diárias`} />
                            {recibo.itens.map((item) => (
                                <LinhaInfo key={item.label} label={item.label} valor={item.valor} />
                            ))}
                        </div>

                        {/* Total */}
                        <div
                            className="flex justify-between items-center px-5 py-4 rounded-xl"
                            style={{ backgroundColor: "#1A4A5E" }}
                        >
                            <span className="text-white font-semibold">Valor Total:</span>
                            <span className="text-white text-xl font-bold">{recibo.totalFinal}</span>
                        </div>

                        {/* Forma de pagamento */}
                        <div className="flex justify-between items-center px-5 py-3 rounded-xl border-2" style={{ borderColor: "#E5D3BA" }}>
                            <span className="text-sm text-gray-400 font-medium">Forma de pagamento:</span>
                            <span className="text-sm font-bold" style={{ color: "#1A4A5E" }}>{pagamento}</span>
                        </div>

                        {/* Assinaturas */}
                        <div className="flex justify-between items-end mt-8 pt-6 border-t border-dashed border-gray-200">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-48 border-b-2 border-gray-300" />
                                <span className="text-xs text-gray-400">Assinatura do Responsável</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-48 border-b-2 border-gray-300" />
                                <span className="text-xs text-gray-400">Assinatura do Cliente</span>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
    );
}