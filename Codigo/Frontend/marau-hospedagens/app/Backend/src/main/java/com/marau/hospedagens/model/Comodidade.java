package com.marau.hospedagens.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Catalogo de comodidades que podem ser adicionadas a um quarto
 * (ex: Ar-Condicionado = R$ 10,00 / Hidromassagem = R$ 30,00).
 * O preco da comodidade e somado ao valor base do quarto.
 */
@Entity
@Table(name = "comodidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comodidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;
}
