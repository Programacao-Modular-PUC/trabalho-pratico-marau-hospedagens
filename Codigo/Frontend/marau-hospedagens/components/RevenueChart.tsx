"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { api } from "@/lib/api";

const BAR_COLOR = "#3C8FAD";

function parseValorBRL(v: string): number {
    const num = parseFloat(v.replace("R$", "").trim().replace(/\./g, "").replace(",", "."));
    return isNaN(num) ? 0 : num;
}

function formatarCompacto(v: number): string {
    return `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

// Backend não devolve o ano no campo "entrada" (só "dd/MM HH:mm"), então
// agrupamos só pelo mês — mesma limitação já conhecida do calendário de
// disponibilidade. Para os dados de exemplo (poucos meses) isso não
// atrapalha a leitura do gráfico.
function mesChave(entrada: string): string {
    const [, m] = entrada.split(" ")[0].split("/");
    return m;
}

const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function RevenueChart() {
    const [dados, setDados] = useState<{ mes: string; valor: number }[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api.alugueis.listar()
            .then((lista) => {
                const concluidos = lista.filter((a) => a.status === "concluido");
                const totals = new Map<string, number>();
                concluidos.forEach((a) => {
                    const chave = mesChave(a.entrada);
                    totals.set(chave, (totals.get(chave) ?? 0) + parseValorBRL(a.valorFinal));
                });
                const ordenado = Array.from(totals.entries())
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([mesNum, valor]) => ({ mes: nomesMeses[Number(mesNum) - 1], valor }));
                setDados(ordenado);
            })
            .catch(() => setDados([]))
            .finally(() => setCarregando(false));
    }, []);

    if (carregando) {
        return <p className="text-sm text-gray-400">Carregando...</p>;
    }

    if (dados.length === 0) {
        return <p className="text-sm text-gray-400">Nenhuma hospedagem concluída ainda.</p>;
    }

    return (
        <div style={{ width: "100%", height: "100%", minHeight: 0 }}>
            <ResponsiveContainer>
                <BarChart data={dados} margin={{ top: 24, right: 8, left: 8, bottom: 0 }}>
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                        formatter={(value) => {
                            const n = Array.isArray(value) ? Number(value[0]) : Number(value);
                            return [`R$ ${(isNaN(n) ? 0 : n).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Receita"];
                        }}
                        cursor={{ fill: "#E8F0F3" }}
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Bar dataKey="valor" fill={BAR_COLOR} radius={[4, 4, 0, 0]}>
                        <LabelList
                            dataKey="valor"
                            position="top"
                            formatter={(v: unknown) => formatarCompacto(typeof v === "number" ? v : Number(v) || 0)}
                            style={{ fill: BAR_COLOR, fontSize: 12, fontWeight: 600 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}