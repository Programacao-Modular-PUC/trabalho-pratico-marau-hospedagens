package com.marau.hospedagens.dto;

/** Forma de pagamento opcional ao gerar o recibo (default: Dinheiro). */
public record GerarReciboRequest(
        String formaPagamento
) {
}
