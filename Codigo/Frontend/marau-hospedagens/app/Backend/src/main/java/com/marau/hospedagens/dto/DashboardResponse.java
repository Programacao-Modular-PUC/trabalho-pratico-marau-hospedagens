package com.marau.hospedagens.dto;

import java.util.List;

/** Indicadores e listas exibidos no Dashboard. */
public record DashboardResponse(
        long totalResidencias,
        long totalQuartos,
        long quartosDisponiveis,
        long quartosOcupados,
        long totalClientes,
        long reservasAtivas,
        long estadiasEmAndamento,
        long estadiasConcluidas,
        String receitaTotal,
        String receitaTotalReservas,
        List<AluguelResponse> ultimasReservas
) {
}
