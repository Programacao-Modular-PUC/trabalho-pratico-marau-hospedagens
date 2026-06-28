package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.ResidenciaRequest;
import com.marau.hospedagens.dto.ResidenciaResponse;
import com.marau.hospedagens.service.ResidenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tela "Residências".
 * - GET    /api/residencias        -> grade de ResidenciaCard
 * - POST   /api/residencias        -> botão "Cadastrar Residência"
 * - PUT    /api/residencias/{id}    -> edição
 * - DELETE /api/residencias/{id}    -> remoção
 */
@RestController
@RequestMapping("/api/residencias")
public class ResidenciaController {

    private final ResidenciaService service;

    public ResidenciaController(ResidenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<ResidenciaResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResidenciaResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public ResponseEntity<ResidenciaResponse> criar(@Valid @RequestBody ResidenciaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public ResidenciaResponse atualizar(@PathVariable Long id,
                                        @Valid @RequestBody ResidenciaRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
