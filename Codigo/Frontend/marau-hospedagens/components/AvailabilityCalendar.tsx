"use client";

import { useState, useEffect, useCallback } from "react";
import { api, type Residencia, type Quarto, type Aluguel } from "@/lib/api";

type Props = {
    onRangeSelect?: (entrada: string, saida: string) => void;
    onResidenciaChange?: (v: string) => void;
    onQuartoChange?: (v: string) => void;
    residenciaInicial?: string;
    quartoInicial?: string;
};

function buildCalendar(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
}

function toDateObj(year: number, month: number, day: number) {
    return new Date(year, month, day);
}

function formatarData(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatarLabel(year: number, month: number, day: number): string {
    return new Date(year, month, day).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// Backend retorna "dd/MM HH:mm" (sem ano). Assumimos o ano corrente do calendário
// exibido — limitação conhecida enquanto o back não devolver o ano nessa listagem.
function parseDiaMes(dataStr: string): { dia: number; mes: number } | null {
    const [dataParte] = dataStr.split(" ");
    if (!dataParte) return null;
    const [d, m] = dataParte.split("/").map(Number);
    if (!d || !m) return null;
    return { dia: d, mes: m - 1 };
}

/** Marca como ocupado todo dia entre entrada e saída (exclusive na saída, já que dia de saída pode receber novo hóspede à tarde). */
function diasOcupadosNoMes(aluguel: Aluguel, mesAtual: number): number[] {
    const entrada = parseDiaMes(aluguel.entrada);
    const saida = parseDiaMes(aluguel.saida);
    if (!entrada || !saida) return [];
    const dias: number[] = [];
    if (entrada.mes === mesAtual) {
        const fimNoMes = saida.mes === mesAtual ? saida.dia : 31;
        for (let d = entrada.dia; d < fimNoMes; d++) dias.push(d);
        if (saida.mes !== mesAtual) {
            for (let d = entrada.dia; d <= 31; d++) if (!dias.includes(d)) dias.push(d);
        }
    } else if (saida.mes === mesAtual) {
        for (let d = 1; d < saida.dia; d++) dias.push(d);
    }
    return dias;
}

const dayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const BRAND = "#1A4A5E";

function SelectCalendario({ label, value, options, onChange, disabled }: {
    label: string; value: string; options: string[];
    onChange: (v: string) => void; disabled?: boolean;
}) {
    const placeholder = disabled ? "Sem opções" : label;

    return (
        <button
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm relative cursor-pointer"
            style={{ color: value ? BRAND : "#6b7280", opacity: disabled ? 0.5 : 1 }}
        >
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                disabled={disabled}
            >
                {!value && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <span>{value || placeholder}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    );
}

export default function AvailabilityCalendar({ onRangeSelect, onResidenciaChange, onQuartoChange, residenciaInicial, quartoInicial }: Props) {
    const now = new Date();
    const [mes, setMes] = useState(now.getMonth());
    const [ano, setAno] = useState(now.getFullYear());
    const [residenciaSelecionada, setResidenciaSelecionada] = useState("");
    const [quartoSelecionado, setQuartoSelecionado] = useState("");

    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [hover, setHover] = useState<Date | null>(null);

    const [residencias, setResidencias] = useState<Residencia[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [alugueis, setAlugueis] = useState<Aluguel[]>([]);

    useEffect(() => {
        api.residencias.listar().then(setResidencias).catch(() => {});
        api.quartos.listar().then(setQuartos).catch(() => {});
    }, []);

    useEffect(() => {
        if (residenciaInicial) setResidenciaSelecionada(residenciaInicial);
        if (quartoInicial) setQuartoSelecionado(quartoInicial);
    }, [residenciaInicial, quartoInicial]);

    const quartoAtualObj = quartos.find(
        (q) => q.residencia === residenciaSelecionada && q.nome === quartoSelecionado
    );

    const carregarOcupacao = useCallback(() => {
        if (!quartoAtualObj) {
            setAlugueis([]);
            return;
        }
        api.alugueis.listar(residenciaSelecionada)
            .then((lista) => setAlugueis(lista.filter((a) =>
                a.quartoId === quartoAtualObj.id && (a.status === "reserva" || a.status === "ocupado")
            )))
            .catch(() => setAlugueis([]));
    }, [quartoAtualObj, residenciaSelecionada]);

    useEffect(() => {
        void (async () => {
            carregarOcupacao();
        })();
    }, [carregarOcupacao]);

    const todayDay = now.getDate();
    const isCurrentMonth = mes === now.getMonth() && ano === now.getFullYear();

    useEffect(() => {
        if (mes > 11) { queueMicrotask(() => { setMes(0); setAno((a) => a + 1); }); }
        if (mes < 0)  { queueMicrotask(() => { setMes(11); setAno((a) => a - 1); }); }
    }, [mes]);

    function handleResidencia(v: string) {
        setResidenciaSelecionada(v);
        setQuartoSelecionado("");
        setDataInicio(null);
        setDataFim(null);
        onResidenciaChange?.(v);
        onQuartoChange?.("");
    }

    function handleQuarto(v: string) {
        setQuartoSelecionado(v);
        setDataInicio(null);
        setDataFim(null);
        onQuartoChange?.(v);
    }

    const residenciasNomes = residencias.map((r) => r.nome);
    const quartosDisponiveis = quartos
        .filter((q) => q.residencia === residenciaSelecionada)
        .map((q) => q.nome);

    const diasOcupados = alugueis.flatMap((a) => diasOcupadosNoMes(a, mes));
    const occupiedSet = new Set<number>(diasOcupados);

    function hasOccupiedBetween(start: Date, end: Date): boolean {
        const s = start < end ? start : end;
        const e = start < end ? end : start;
        const cur = new Date(s);
        cur.setDate(cur.getDate() + 1);
        while (cur < e) {
            if (cur.getMonth() === mes && cur.getFullYear() === ano) {
                if (occupiedSet.has(cur.getDate())) return true;
            }
            cur.setDate(cur.getDate() + 1);
        }
        return false;
    }

    function handleDayClick(day: number) {
        if (!quartoSelecionado) return;
        if (occupiedSet.has(day)) return;

        const clicked = toDateObj(ano, mes, day);

        if (dataFim || !dataInicio || clicked < dataInicio) {
            setDataInicio(clicked);
            setDataFim(null);
            return;
        }

        if (clicked.getTime() === dataInicio.getTime()) {
            setDataFim(clicked);
            onRangeSelect?.(
                formatarData(ano, mes, day),
                formatarData(ano, mes, day)
            );
            return;
        }

        if (hasOccupiedBetween(dataInicio, clicked)) {
            setDataInicio(clicked);
            setDataFim(null);
            return;
        }

        setDataFim(clicked);
        onRangeSelect?.(
            formatarData(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate()),
            formatarData(ano, mes, day)
        );
    }

    function getDayStyle(day: number): {
        bg: string; text: string; roundLeft: boolean; roundRight: boolean; isRange: boolean;
    } {
        const date = toDateObj(ano, mes, day);
        const hoverEnd = hover ?? dataFim;
        const rangeEnd = dataFim ?? hoverEnd;

        const isStart = dataInicio?.getTime() === date.getTime();
        const isEnd = rangeEnd?.getTime() === date.getTime();
        const isBetween = dataInicio && rangeEnd &&
            date > (dataInicio < rangeEnd ? dataInicio : rangeEnd) &&
            date < (dataInicio < rangeEnd ? rangeEnd : dataInicio);

        if (occupiedSet.has(day)) return { bg: "", text: "", roundLeft: false, roundRight: false, isRange: false };
        if (isStart || isEnd) return { bg: BRAND, text: "white", roundLeft: isStart, roundRight: isEnd, isRange: true };
        if (isBetween) return { bg: "#E8F0F3", text: BRAND, roundLeft: false, roundRight: false, isRange: true };

        return { bg: "", text: "", roundLeft: false, roundRight: false, isRange: false };
    }

    const mesNome = new Date(ano, mes, 1).toLocaleString("pt-BR", { month: "long" });
    const cells = buildCalendar(ano, mes);

    const diarias = dataInicio && dataFim
        ? Math.max(1, Math.round(Math.abs(dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1)
        : null;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <SelectCalendario label="Residência" value={residenciaSelecionada} options={residenciasNomes} onChange={handleResidencia} />
                <SelectCalendario label="Quarto" value={quartoSelecionado} options={quartosDisponiveis} onChange={handleQuarto} disabled={!residenciaSelecionada} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4 w-full">

                <div className="flex items-center justify-between px-2">
                    <button onClick={() => setMes((m) => m - 1)} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <div className="text-sm font-semibold tracking-widest uppercase" style={{ color: BRAND }}>
                        {mesNome} {ano}
                    </div>
                    <button onClick={() => setMes((m) => m + 1)} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-[11px] text-gray-400 text-center font-semibold">
                    {dayLabels.map((d) => <div key={d}>{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-0">
                    {cells.map((day, idx) => {
                        if (!day) return <div key={idx} className="h-11" />;

                        const isOccupied = occupiedSet.has(day);
                        const isToday = isCurrentMonth && day === todayDay;
                        const canClick = !!quartoSelecionado && !isOccupied;
                        const style = quartoSelecionado ? getDayStyle(day) : { bg: "", text: "", roundLeft: false, roundRight: false, isRange: false };

                        const isSelected = style.bg === BRAND;
                        const isInRange = style.isRange && !isSelected;

                        return (
                            <div
                                key={idx}
                                className="h-11 flex items-center justify-center relative"
                                style={{
                                    backgroundColor: isInRange ? "#E8F0F3" : "transparent",
                                    borderRadius: style.roundLeft ? "8px 0 0 8px" : style.roundRight ? "0 8px 8px 0" : "0",
                                }}
                                onMouseEnter={() => {
                                    if (quartoSelecionado && dataInicio && !dataFim && !isOccupied)
                                        setHover(toDateObj(ano, mes, day));
                                }}
                                onMouseLeave={() => setHover(null)}
                            >
                                <div
                                    onClick={() => canClick && handleDayClick(day)}
                                    className={`
                                        w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all select-none
                                        ${canClick ? "cursor-pointer" : ""}
                                        ${isOccupied ? "bg-red-100 text-red-400 cursor-not-allowed w-full h-full" : "w-full h-full"}
                                        ${isSelected ? "text-white font-bold" : ""}
                                        ${!isOccupied && !isSelected && canClick ? "hover:bg-gray-100" : ""}
                                        ${!quartoSelecionado && !isOccupied ? "opacity-50" : ""}
                                    `}
                                    style={{
                                        backgroundColor: isSelected
                                            ? BRAND
                                            : undefined,
                                        color: isSelected
                                            ? "white"
                                            : isInRange
                                                ? BRAND
                                                : isToday
                                                    ? BRAND
                                                    : undefined,
                                        outline: undefined,
                                        outlineOffset: undefined,
                                        fontWeight: isToday && !isSelected ? 800 : isSelected ? 700 : undefined,
                                        fontSize: isToday && !isSelected ? "1.1rem" : undefined,
                                    }}
                                    title={
                                        !quartoSelecionado ? "Selecione um quarto primeiro" :
                                            isOccupied ? "Data ocupada" :
                                                !dataInicio ? "Clique para selecionar a entrada" :
                                                    !dataFim ? "Clique para selecionar a saída" : ""
                                    }
                                >
                                    {day}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Selecionado
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "#E8F0F3" }} /> Período
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-red-100 inline-block" /> Ocupado
                    </span>
                </div>

                <div className="text-xs text-center -mt-1" style={{ color: BRAND }}>
                    {!residenciaSelecionada || !quartoSelecionado ? (
                        <span className="text-gray-400">
                            {!residenciaSelecionada
                                ? "Selecione uma residência e um quarto para ver a disponibilidade"
                                : "Selecione um quarto para ver a disponibilidade"}
                        </span>
                    ) : !dataInicio ? (
                        "Clique em um dia para selecionar a entrada"
                    ) : !dataFim ? (
                        <>Entrada: <strong>{formatarLabel(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate())}</strong> · Agora selecione a saída</>
                    ) : (
                        <>
                            <strong>{formatarLabel(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate())}</strong>
                            {" → "}
                            <strong>{formatarLabel(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate())}</strong>
                            {" · "}
                            {diarias} diária{diarias !== 1 ? "s" : ""}
                            <button
                                onClick={() => { setDataInicio(null); setDataFim(null); }}
                                className="ml-3 underline cursor-pointer"
                                style={{ color: "#6b7280" }}
                            >
                                Limpar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}