package com.marau.hospedagens.dto;

import jakarta.validation.constraints.NotBlank;

/** Troca de status do aluguel (RESERVA -> OCUPADO -> CONCLUIDO). */
public record AtualizarStatusRequest(
        @NotBlank(message = "O status e obrigatorio") String status
) {
}
