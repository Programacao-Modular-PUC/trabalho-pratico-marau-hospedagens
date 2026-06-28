package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.AtualizarPagamentoRequest;
import com.marau.hospedagens.dto.ReciboResponse;
import com.marau.hospedagens.service.ReciboService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Tela "Recibo de Hospedagem" (/recibo?id=ALUGUEL).
 *
 * - GET   /api/alugueis/{aluguelId}/recibo  -> botão "Recibo": busca o recibo
 *                                              do aluguel ou gera um novo
 * - GET   /api/recibos/{id}                  -> consulta direta por id do recibo
 * - PATCH /api/recibos/{id}/pagamento        -> select "Forma de pagamento"
 * - POST  /api/recibos/{id}/enviar-email     -> botão "Enviar por Email"
 */
@RestController
public class ReciboController {

    private final ReciboService service;

    public ReciboController(ReciboService service) {
        this.service = service;
    }

    @GetMapping("/api/alugueis/{aluguelId}/recibo")
    public ReciboResponse obterPorAluguel(
            @PathVariable Long aluguelId,
            @RequestParam(required = false) String formaPagamento) {
        return service.obterOuGerarPorAluguel(aluguelId, formaPagamento);
    }

    @GetMapping("/api/recibos/{id}")
    public ReciboResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PatchMapping("/api/recibos/{id}/pagamento")
    public ReciboResponse atualizarPagamento(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarPagamentoRequest req) {
        return service.atualizarPagamento(id, req.formaPagamento());
    }

    @PostMapping("/api/recibos/{id}/enviar-email")
    public ResponseEntity<Void> enviarEmail(@PathVariable Long id) {
        service.enviarPorEmail(id);
        return ResponseEntity.noContent().build();
    }
}
