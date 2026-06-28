package com.marau.hospedagens.model;

import com.marau.hospedagens.model.enums.StatusQuarto;
import com.marau.hospedagens.model.enums.TipoQuarto;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Quarto pertencente a uma residencia. O preco final da diaria e
 * calculado como valorBase + soma dos precos das comodidades.
 */
@Entity
@Table(name = "quartos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quarto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoQuarto tipo;

    @Column(name = "valor_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorBase;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private StatusQuarto status = StatusQuarto.DISPONIVEL;

    @Builder.Default
    @Column(nullable = false)
    private String cor = "#1A4A5E";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "residencia_id", nullable = false)
    private Residencia residencia;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "quarto_comodidades",
            joinColumns = @JoinColumn(name = "quarto_id"),
            inverseJoinColumns = @JoinColumn(name = "comodidade_id")
    )
    @Builder.Default
    private Set<Comodidade> comodidades = new HashSet<>();

    /** Preco final da diaria = valor base + comodidades. */
    @Transient
    public BigDecimal getPreco() {
        BigDecimal total = (valorBase == null) ? BigDecimal.ZERO : valorBase;
        if (comodidades != null) {
            for (Comodidade c : comodidades) {
                if (c.getPreco() != null) {
                    total = total.add(c.getPreco());
                }
            }
        }
        return total;
    }
}
