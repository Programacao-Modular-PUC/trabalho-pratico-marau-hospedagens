package com.marau.hospedagens.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.math.BigDecimal;

/**
 * Linha do detalhamento de valores de um recibo (ex: "Valor base (Solteiro)" = 110,00).
 * E um snapshot, gerado no momento da emissao do recibo.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemRecibo {

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "valor", precision = 10, scale = 2)
    private BigDecimal valor;

    /** Indica se o valor e por diaria (sufixo "/dia" na exibicao). */
    @Column(name = "por_diaria")
    private boolean porDiaria;
}
