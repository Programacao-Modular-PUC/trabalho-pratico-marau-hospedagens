package com.marau.hospedagens.model;

import com.marau.hospedagens.model.enums.TipoQuarto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("Calculo de diaria por tipo de quarto")
class QuartoTest {

    private static final Comodidade AR_CONDICIONADO = Comodidade.builder()
            .nome("Ar-Condicionado")
            .preco(new BigDecimal("10.00"))
            .build();

    private static final Comodidade HIDROMASSAGEM = Comodidade.builder()
            .nome("Hidromassagem")
            .preco(new BigDecimal("30.00"))
            .build();

    @Test
    @DisplayName("Quarto individual: valor base sem comodidades")
    void individual_apenasValorBase() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("95.00"))
                .build();

        assertEquals(0, new BigDecimal("95.00").compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Quarto individual: valor base + uma comodidade")
    void individual_comUmaComodidade() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("80.00"))
                .comodidades(Set.of(AR_CONDICIONADO))
                .build();

        assertEquals(0, new BigDecimal("90.00").compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Quarto individual: valor base + comodidade (dados de exemplo Casa Praiana Qto 01)")
    void individual_casaPraianaQto01() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("110.00"))
                .comodidades(Set.of(AR_CONDICIONADO))
                .build();

        assertEquals(0, new BigDecimal("120.00").compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Quarto duplo: valor base + multiplas comodidades (dados de exemplo Casa Praiana Qto 02)")
    void duplo_casaPraianaQto02() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.DUPLO)
                .valorBase(new BigDecimal("160.00"))
                .comodidades(Set.of(AR_CONDICIONADO, HIDROMASSAGEM))
                .build();

        assertEquals(0, new BigDecimal("200.00").compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Quarto duplo: valor base sem comodidades")
    void duplo_apenasValorBase() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.DUPLO)
                .valorBase(new BigDecimal("160.00"))
                .build();

        assertEquals(0, new BigDecimal("160.00").compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Quarto familia: valor base + comodidades")
    void familia_comComodidades() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.FAMILIA)
                .valorBase(new BigDecimal("250.00"))
                .comodidades(Set.of(AR_CONDICIONADO, HIDROMASSAGEM))
                .build();

        assertEquals(0, new BigDecimal("290.00").compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Quarto familia: valor base sem comodidades")
    void familia_apenasValorBase() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.FAMILIA)
                .valorBase(new BigDecimal("220.00"))
                .build();

        assertEquals(0, new BigDecimal("220.00").compareTo(quarto.getPreco()));
    }

    @ParameterizedTest
    @EnumSource(TipoQuarto.class)
    @DisplayName("Todos os tipos: valor base nulo retorna zero")
    void todosTipos_valorBaseNulo_retornaZero(TipoQuarto tipo) {
        Quarto quarto = Quarto.builder()
                .tipo(tipo)
                .valorBase(null)
                .build();

        assertEquals(0, BigDecimal.ZERO.compareTo(quarto.getPreco()));
    }

    @Test
    @DisplayName("Comodidade com preco nulo e ignorada no calculo")
    void comodidadeComPrecoNulo_ignorada() {
        Comodidade comPrecoNulo = Comodidade.builder()
                .nome("Wi-Fi")
                .preco(null)
                .build();

        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("100.00"))
                .comodidades(Set.of(AR_CONDICIONADO, comPrecoNulo))
                .build();

        assertEquals(0, new BigDecimal("110.00").compareTo(quarto.getPreco()));
    }
}
