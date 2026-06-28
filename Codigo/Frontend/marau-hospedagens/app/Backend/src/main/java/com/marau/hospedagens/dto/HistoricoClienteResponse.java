package com.marau.hospedagens.dto;

import java.util.List;

/** Resposta do botao "Ver" do cliente (HistoricoClienteModal). */
public record HistoricoClienteResponse(
        ClienteResponse cliente,
        List<AluguelResponse> historico
) {
}
