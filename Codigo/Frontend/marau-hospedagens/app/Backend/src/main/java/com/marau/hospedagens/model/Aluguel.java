package com.marau.hospedagens.model;

import com.marau.hospedagens.model.enums.StatusAluguel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Estadia ou reserva. Liga um cliente a um quarto (e, atraves dele, a uma
 * residencia) durante um periodo. O preco da diaria e "congelado" no momento
 * da reserva para nao mudar caso o quarto seja reajustado depois.
 */
@Entity
@Table(name = "alugueis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quarto_id", nullable = false)
    private Quarto quarto;

    @Column(nullable = false)
    private LocalDateTime entrada;

    @Column(nullable = false)
    private LocalDateTime saida;

    @Column(nullable = false)
    private Integer diarias;

    @Column(name = "preco_diaria", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoDiaria;

    @Column(name = "valor_final", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorFinal;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private StatusAluguel status = StatusAluguel.RESERVA;

    @OneToOne(mappedBy = "aluguel", cascade = CascadeType.ALL, orphanRemoval = true)
    private Recibo recibo;
}
