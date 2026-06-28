package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.ClienteRequest;
import com.marau.hospedagens.dto.ClienteResponse;
import com.marau.hospedagens.dto.HistoricoClienteResponse;
import com.marau.hospedagens.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tela "Clientes".
 * - GET    /api/clientes              -> tabela de clientes (status derivado)
 * - GET    /api/clientes/{id}/historico -> botão "Ver" (HistoricoClienteModal)
 * - POST   /api/clientes              -> botão "Novo Cliente"
 * - PUT    /api/clientes/{id}          -> edição
 * - DELETE /api/clientes/{id}          -> remoção
 */
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClienteResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ClienteResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @GetMapping("/{id}/historico")
    public HistoricoClienteResponse historico(@PathVariable Long id) {
        return service.historico(id);
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> criar(@Valid @RequestBody ClienteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(req));
    }

    @PutMapping("/{id}")
    public ClienteResponse atualizar(@PathVariable Long id,
                                     @Valid @RequestBody ClienteRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
