package com.marau.hospedagens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record ComodidadeRequest(
        @NotBlank(message = "O nome e obrigatorio") String nome,
        @NotNull(message = "O preco e obrigatorio")
        @PositiveOrZero(message = "O preco nao pode ser negativo") BigDecimal preco
) {
}
