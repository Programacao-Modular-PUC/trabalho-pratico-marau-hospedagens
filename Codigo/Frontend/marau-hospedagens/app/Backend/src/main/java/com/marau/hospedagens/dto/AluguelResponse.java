package com.marau.hospedagens.dto;

/**
 * Linha das tabelas da tela de Alugueis e Reservas.
 * "acaoLabel" = "Recibo" quando concluido, senao "Ver".
 */
public record AluguelResponse(
        Long id,
        Long clienteId,
        String cliente,
        Long residenciaId,
        String residencia,
        Long quartoId,
        String quarto,
        String entrada,
        String saida,
        int diarias,
        String valorFinal,
        String status,
        String acaoLabel
) {
}
