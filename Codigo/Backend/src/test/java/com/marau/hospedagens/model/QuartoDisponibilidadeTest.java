package com.marau.hospedagens.model;

import com.marau.hospedagens.model.enums.StatusQuarto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("Disponibilidade do quarto")
class QuartoDisponibilidadeTest {

    @Test
    @DisplayName("Quarto novo inicia como disponível")
    void novoQuarto_iniciaComoDisponivel() {
        Quarto quarto = Quarto.builder().build();

        assertEquals(StatusQuarto.DISPONIVEL, quarto.getStatus());
    }

    @Test
    @DisplayName("Quarto pode ser marcado como ocupado")
    void quartoMarcadoComoOcupado_retornaStatusOcupado() {
        Quarto quarto = Quarto.builder()
                .status(StatusQuarto.OCUPADO)
                .build();

        assertEquals(StatusQuarto.OCUPADO, quarto.getStatus());
    }

    @Test
    @DisplayName("Quarto pode ser liberado para disponibilidade")
    void quartoLiberado_retornaStatusDisponivel() {
        Quarto quarto = Quarto.builder()
                .status(StatusQuarto.DISPONIVEL)
                .build();

        assertEquals(StatusQuarto.DISPONIVEL, quarto.getStatus());
    }

    @Test
    @DisplayName("Conversão por label para status disponível")
    void fromLabel_disponivel_retornaDisponivel() {
        assertEquals(StatusQuarto.DISPONIVEL, StatusQuarto.fromLabel("Disponivel"));
    }

    @Test
    @DisplayName("Conversão por label para status ocupado")
    void fromLabel_ocupado_retornaOcupado() {
        assertEquals(StatusQuarto.OCUPADO, StatusQuarto.fromLabel("Ocupado"));
    }

    @Test
    @DisplayName("Conversão com valor inválido lança exceção")
    void fromLabel_valorInvalido_lancaExcecao() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> StatusQuarto.fromLabel("Indisponível")
        );

        assertEquals("Status de quarto invalido: Indisponível", ex.getMessage());
    }
}
