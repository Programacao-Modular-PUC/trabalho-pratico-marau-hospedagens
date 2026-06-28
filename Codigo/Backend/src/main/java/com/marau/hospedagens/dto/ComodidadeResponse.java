package com.marau.hospedagens.dto;

import java.math.BigDecimal;

public record ComodidadeResponse(
        Long id,
        String nome,
        BigDecimal preco,
        String precoFormatado
) {
}
