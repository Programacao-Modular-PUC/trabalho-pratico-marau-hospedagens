package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.AluguelRequest;
import com.marau.hospedagens.dto.AluguelResponse;
import com.marau.hospedagens.dto.AtualizarStatusRequest;
import com.marau.hospedagens.service.AluguelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tela "Aluguéis e Reservas".
 * - GET    /api/alugueis?residencia=  -> tabelas agrupadas por residência
 * - GET    /api/alugueis/{id}          -> botão "Ver" (DetalhesReservaModal)
 * - POST   /api/alugueis               -> nova reserva/estadia
 * - PUT    /api/alugueis/{id}          -> edição
 * - PATCH  /api/alugueis/{id}/status   -> avança RESERVA -> OCUPADO -> CONCLUIDO
 * - DELETE /api/alugueis/{id}          -> botão "Cancelar" (handleCancelar)
 */
@RestController
@RequestMapping("/api/alugueis")
public class AluguelController {

    private final AluguelService service;

    public AluguelController(AluguelService service) {
        this.service = service;
    }

    @GetMapping
    public List<AluguelResponse> listar(@RequestParam(required = false) String residencia) {
        return service.listar(residencia);
    }

    @GetMapping("/{id}")
    public AluguelResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<AluguelResponse> criar(@Valid @RequestBody AluguelRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public AluguelResponse atualizar(@PathVariable Long id,
                                     @Valid @RequestBody AluguelRequest req) {
        return service.atualizar(id, req);
    }

    @PatchMapping("/{id}/status")
    public AluguelResponse atualizarStatus(@PathVariable Long id,
                                           @Valid @RequestBody AtualizarStatusRequest req) {
        return service.atualizarStatus(id, req.status());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        service.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}
