package com.marau.hospedagens.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Payload do botao "Novo Cliente" (NovoClienteModal). */
public record ClienteRequest(
        @NotBlank(message = "O nome e obrigatorio") String nome,
        @NotBlank(message = "O CPF e obrigatorio") String cpf,
        @Email(message = "E-mail invalido") String email,
        String telefone,
        String endereco
) {
}
