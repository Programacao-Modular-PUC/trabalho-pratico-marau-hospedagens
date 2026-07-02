package com.marau.hospedagens.util;

import com.marau.hospedagens.exception.RecursoNaoPermitidoException;
import com.marau.hospedagens.model.enums.TipoQuarto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Regras de berço")
class BercoRulesTest {

    @Test
    @DisplayName("Berço só é permitido em quarto duplo")
    void bercoPermitido_apenasDuplo() {
        assertFalse(BercoRules.bercoPermitido(TipoQuarto.INDIVIDUAL));
        assertTrue(BercoRules.bercoPermitido(TipoQuarto.DUPLO));
        assertFalse(BercoRules.bercoPermitido(TipoQuarto.FAMILIA));
    }

    @ParameterizedTest
    @EnumSource(value = TipoQuarto.class, names = { "INDIVIDUAL", "FAMILIA" })
    @DisplayName("Quarto individual e família não podem ter berço")
    void validar_tipoSemBerçoComBerço_lancaExcecao(
            TipoQuarto tipo) {

        RecursoNaoPermitidoException ex = assertThrows(
                RecursoNaoPermitidoException.class,
                () -> BercoRules.validar(
                        tipo,
                        true));

        assertEquals(
                "Berço não é permitido em quartos do tipo "
                        + tipo.getLabel(),
                ex.getMessage());
    }

    @ParameterizedTest
    @EnumSource(TipoQuarto.class)
    @DisplayName("Quarto sem berço é válido em qualquer tipo")
    void validar_semBerço_naoLancaExcecao(
            TipoQuarto tipo) {
        BercoRules.validar(tipo, false);
    }

    @Test
    @DisplayName("Quarto duplo com berço é válido")
    void validar_duploComBerço_naoLancaExcecao() {
        BercoRules.validar(
                TipoQuarto.DUPLO,
                true);
    }

    @Test
    @DisplayName("Quarto duplo sem berço tem capacidade para 2 hóspedes")
    void capacidadeDuplo_semBerço_retornaDois() {
        assertEquals(
                2,
                BercoRules.capacidadeDuplo(false));
    }

    @Test
    @DisplayName("Quarto duplo com berço tem capacidade para 3 (2 adultos + 1 berço)")
    void capacidadeDuplo_comBerço_retornaTres() {
        assertEquals(
                3,
                BercoRules.capacidadeDuplo(true));
    }

    @Test
    @DisplayName("Descrição de capacidade sem berço")
    void descricaoCapacidadeDuplo_semBerço() {
        assertEquals(
                "2 hóspedes",
                BercoRules.descricaoCapacidadeDuplo(false));
    }

    @Test
    @DisplayName("Descrição de capacidade com berço")
    void descricaoCapacidadeDuplo_comBerço() {
        assertEquals(
                "2 adultos + 1 berço",
                BercoRules.descricaoCapacidadeDuplo(true));
    }

    @Test
    @DisplayName("Quarto duplo com berço aplica taxa informada")
    void calcularTaxa_duploComBerço_retornaValor() {

        BigDecimal taxa = BercoRules.calcularTaxa(
                TipoQuarto.DUPLO,
                true,
                new BigDecimal("20.00"));

        assertEquals(
                0,
                new BigDecimal("20.00")
                        .compareTo(taxa));
    }

    @Test
    @DisplayName("Quarto duplo sem berço não aplica taxa")
    void calcularTaxa_duploSemBerço_retornaZero() {

        BigDecimal taxa = BercoRules.calcularTaxa(
                TipoQuarto.DUPLO,
                false,
                new BigDecimal("20.00"));

        assertEquals(
                0,
                BigDecimal.ZERO.compareTo(taxa));
    }

    @Test
    @DisplayName("Quarto duplo com berço e valor nulo retorna zero")
    void calcularTaxa_duploComBerçoValorNulo_retornaZero() {

        BigDecimal taxa = BercoRules.calcularTaxa(
                TipoQuarto.DUPLO,
                true,
                null);

        assertEquals(
                0,
                BigDecimal.ZERO.compareTo(taxa));
    }

    @ParameterizedTest
    @EnumSource(value = TipoQuarto.class, names = { "INDIVIDUAL", "FAMILIA" })
    @DisplayName("Tipos que não permitem berço rejeitam taxa com berço")
    void calcularTaxa_tipoSemBerçoComBerço_lancaExcecao(
            TipoQuarto tipo) {

        assertThrows(
                RecursoNaoPermitidoException.class,
                () -> BercoRules.calcularTaxa(
                        tipo,
                        true,
                        new BigDecimal("20.00")));
    }

    @ParameterizedTest
    @EnumSource(value = TipoQuarto.class, names = { "INDIVIDUAL", "FAMILIA" })
    @DisplayName("Tipos que não permitem berço retornam zero quando não há berço")
    void calcularTaxa_tipoSemBerçoSemBerço_retornaZero(
            TipoQuarto tipo) {

        BigDecimal taxa = BercoRules.calcularTaxa(
                tipo,
                false,
                new BigDecimal("20.00"));

        assertEquals(
                0,
                BigDecimal.ZERO.compareTo(taxa));
    }
}