package com.marau.hospedagens.dto;

/**
 * Linha da tabela de Clientes. "ultimaHospedagem" e "statusTipo" sao
 * derivados dos alugueis do cliente (ATIVO / RESERVA dd/MM / data).
 */
public record ClienteResponse(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        String endereco,
        String ultimaHospedagem,
        String statusTipo
) {
}
