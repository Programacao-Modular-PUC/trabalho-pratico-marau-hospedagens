package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.ComodidadeRequest;
import com.marau.hospedagens.dto.ComodidadeResponse;
import com.marau.hospedagens.service.ComodidadeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Catálogo de comodidades (Ar-Condicionado, Hidromassagem, ...).
 * Alimenta os checkboxes do modal "Cadastrar Quarto" e o cálculo do preço.
 * - GET    /api/comodidades        -> lista para o formulário
 * - POST   /api/comodidades        -> cadastrar nova comodidade
 * - PUT    /api/comodidades/{id}    -> edição
 * - DELETE /api/comodidades/{id}    -> remoção
 */
@RestController
@RequestMapping("/api/comodidades")
public class ComodidadeController {

    private final ComodidadeService service;

    public ComodidadeController(ComodidadeService service) {
        this.service = service;
    }

    @GetMapping
    public List<ComodidadeResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ComodidadeResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<ComodidadeResponse> criar(@Valid @RequestBody ComodidadeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public ComodidadeResponse atualizar(@PathVariable Long id,
                                        @Valid @RequestBody ComodidadeRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
