package com.marau.hospedagens.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Propriedade/imovel cadastrado no sistema (ex: Casa Praiana, Pousada do Mato).
 * Possui varios quartos.
 */
@Entity
@Table(name = "residencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Residencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String endereco;

    private String cep;

    private String telefone;

    private String email;

    @Builder.Default
    @Column(nullable = false)
    private String cor = "#1A4A5E";

    @OneToMany(mappedBy = "residencia", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Quarto> quartos = new ArrayList<>();
}
