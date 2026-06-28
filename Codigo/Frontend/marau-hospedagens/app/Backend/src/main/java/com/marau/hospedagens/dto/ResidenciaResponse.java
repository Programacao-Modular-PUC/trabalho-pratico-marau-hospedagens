package com.marau.hospedagens.dto;

/** Representa um card da tela de Residencias, com contadores calculados. */
public record ResidenciaResponse(
        Long id,
        String nome,
        String endereco,
        String cep,
        String telefone,
        String email,
        String cor,
        int totalQuartos,
        int disponiveis,
        int ocupados
) {
}
