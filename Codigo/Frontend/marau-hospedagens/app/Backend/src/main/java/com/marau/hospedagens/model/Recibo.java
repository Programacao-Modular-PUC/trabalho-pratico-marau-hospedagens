package com.marau.hospedagens.model;

import com.marau.hospedagens.model.enums.FormaPagamento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Recibo de hospedagem emitido a partir de um aluguel concluido.
 * O detalhamento (itens) e o total sao um snapshot do momento da emissao.
 */
@Entity
@Table(name = "recibos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recibo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluguel_id", nullable = false, unique = true)
    private Aluguel aluguel;

    @Column(name = "emitido_em", nullable = false)
    private LocalDateTime emitidoEm;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "forma_pagamento", nullable = false)
    private FormaPagamento formaPagamento = FormaPagamento.DINHEIRO;

    @ElementCollection
    @CollectionTable(name = "recibo_itens", joinColumns = @JoinColumn(name = "recibo_id"))
    @Builder.Default
    private List<ItemRecibo> itens = new ArrayList<>();

    @Column(name = "total_final", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalFinal;
}
