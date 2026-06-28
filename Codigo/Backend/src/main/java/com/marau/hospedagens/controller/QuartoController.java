package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.QuartoRequest;
import com.marau.hospedagens.dto.QuartoResponse;
import com.marau.hospedagens.service.QuartoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tela "Quartos".
 * - GET    /api/quartos?residencia=&tipo=  -> grade de QuartoCard com os filtros
 *                                             (Residência / Todos·Individual·Duplo·Familia)
 * - POST   /api/quartos                    -> botão "Cadastrar Quarto"
 * - PUT    /api/quartos/{id}                -> edição
 * - DELETE /api/quartos/{id}                -> remoção
 */
@RestController
@RequestMapping("/api/quartos")
public class QuartoController {

    private final QuartoService service;

    public QuartoController(QuartoService service) {
        this.service = service;
    }

    @GetMapping
    public List<QuartoResponse> listar(
            @RequestParam(required = false) String residencia,
            @RequestParam(required = false) String tipo) {
        return service.listar(residencia, tipo);
    }

    @GetMapping("/{id}")
    public QuartoResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<QuartoResponse> criar(@Valid @RequestBody QuartoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public QuartoResponse atualizar(@PathVariable Long id,
                                    @Valid @RequestBody QuartoRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
