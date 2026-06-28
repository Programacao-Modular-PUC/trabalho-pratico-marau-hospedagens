package com.marau.hospedagens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

/** Payload do botao "Cadastrar Quarto" (CadastrarQuartoModal). */
public record QuartoRequest(
        @NotBlank(message = "O nome e obrigatorio") String nome,
        @NotBlank(message = "O tipo e obrigatorio") String tipo,
        @NotNull(message = "O valor base e obrigatorio")
        @Positive(message = "O valor base deve ser positivo") BigDecimal valorBase,
        String status,
        String cor,
        @NotNull(message = "A residencia e obrigatoria") Long residenciaId,
        List<Long> comodidadeIds
) {
}
