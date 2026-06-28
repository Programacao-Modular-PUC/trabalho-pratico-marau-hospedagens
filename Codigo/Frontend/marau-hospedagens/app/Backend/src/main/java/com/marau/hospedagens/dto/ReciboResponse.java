package com.marau.hospedagens.dto;

import java.util.List;

/** Espelha exatamente o objeto consumido pela tela de Recibo. */
public record ReciboResponse(
        Long id,
        Long aluguelId,
        String numero,
        String emitidoEm,
        Hospede hospede,
        Acomodacao acomodacao,
        String entrada,
        String entradaHora,
        String saida,
        String saidaHora,
        int diarias,
        List<Item> itens,
        String totalFinal,
        String formaPagamento
) {
    public record Hospede(String nome, String cpf, String email) {
    }

    public record Acomodacao(String nome, String endereco) {
    }

    public record Item(String label, String valor) {
    }
}
