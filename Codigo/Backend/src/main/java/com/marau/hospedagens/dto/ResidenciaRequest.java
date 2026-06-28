package com.marau.hospedagens.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Payload do botao "Cadastrar Residencia" (CadastrarResidenciaModal). */
public record ResidenciaRequest(
        @NotBlank(message = "O nome e obrigatorio") String nome,
        String endereco,
        String cep,
        String telefone,
        @Email(message = "E-mail invalido") String email,
        String cor
) {
}
