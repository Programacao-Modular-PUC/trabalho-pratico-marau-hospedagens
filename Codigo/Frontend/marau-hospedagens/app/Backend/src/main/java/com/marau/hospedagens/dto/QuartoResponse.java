package com.marau.hospedagens.dto;

import java.math.BigDecimal;
import java.util.List;

/** Espelha o objeto consumido por QuartoCard no frontend. */
public record QuartoResponse(
        Long id,
        String nome,
        String tipo,
        Long residenciaId,
        String residencia,
        BigDecimal valorBase,
        BigDecimal preco,
        String precoFormatado,
        String status,
        List<ComodidadeQuarto> comodidades,
        String descricao,
        String cor
) {
    /** Comodidade no formato esperado pelo card: { nome, inclusa }. */
    public record ComodidadeQuarto(String nome, boolean inclusa) {
    }
}
