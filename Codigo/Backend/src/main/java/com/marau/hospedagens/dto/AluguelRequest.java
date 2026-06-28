package com.marau.hospedagens.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/** Criacao/edicao de uma estadia ou reserva. */
public record AluguelRequest(
        @NotNull(message = "O cliente e obrigatorio") Long clienteId,
        @NotNull(message = "O quarto e obrigatorio") Long quartoId,
        @NotNull(message = "A data de entrada e obrigatoria") LocalDateTime entrada,
        @NotNull(message = "A data de saida e obrigatoria") LocalDateTime saida,
        String status
) {
}
