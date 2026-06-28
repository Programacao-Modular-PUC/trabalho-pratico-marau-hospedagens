package com.marau.hospedagens.controller;

import com.marau.hospedagens.dto.DashboardResponse;
import com.marau.hospedagens.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tela inicial "Dashboard".
 * - GET /api/dashboard -> indicadores (cards) + últimas reservas.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardResponse resumo() {
        return service.resumo();
    }
}
