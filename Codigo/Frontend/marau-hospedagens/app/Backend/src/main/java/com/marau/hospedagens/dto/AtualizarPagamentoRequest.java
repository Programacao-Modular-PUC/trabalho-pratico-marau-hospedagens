package com.marau.hospedagens.dto;

import jakarta.validation.constraints.NotBlank;

/** Atualiza a forma de pagamento exibida no recibo (select da tela). */
public record AtualizarPagamentoRequest(
        @NotBlank(message = "A forma de pagamento e obrigatoria") String formaPagamento
) {
}
