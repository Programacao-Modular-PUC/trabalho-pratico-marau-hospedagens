package com.marau.hospedagens.util;

import com.marau.hospedagens.model.enums.TipoQuarto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Limites de hóspedes")
class CapacidadeHospedesRulesTest {

    @Test
    @DisplayName("Quarto individual: 1 cama suporta 1 hóspede")
    void individual_umaCama_retornaUm() {
        assertEquals(1, CapacidadeHospedesRules.calcularIndividual(1));
    }

    @Test
    @DisplayName("Quarto individual: cada cama solteiro adiciona 1 hóspede")
    void individual_tresCamas_retornaTres() {
        assertEquals(3, CapacidadeHospedesRules.calcularIndividual(3));
    }

    @Test
    @DisplayName("Quarto individual: zero camas retorna capacidade zero")
    void individual_zeroCamas_retornaZero() {
        assertEquals(0, CapacidadeHospedesRules.calcularIndividual(0));
    }

    @Test
    @DisplayName("Quarto individual sem camas suficientes é inválido")
    void validarConfiguracao_individualSemCamas_lancaExcecao() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> CapacidadeHospedesRules.validarConfiguracao(
                        TipoQuarto.INDIVIDUAL,
                        CapacidadeHospedesRules.ConfiguracaoCapacidade.individual(0)
                )
        );

        assertEquals("Quarto individual deve ter ao menos 1 cama", ex.getMessage());
    }

    @Test
    @DisplayName("Quarto duplo sem berço suporta 2 hóspedes")
    void calcularMaxima_duploSemBerço_retornaDois() {
        int capacidade = CapacidadeHospedesRules.calcularMaxima(
                TipoQuarto.DUPLO,
                CapacidadeHospedesRules.ConfiguracaoCapacidade.duplo(false)
        );

        assertEquals(2, capacidade);
    }

    @Test
    @DisplayName("Quarto duplo com berço suporta 3 hóspedes")
    void calcularMaxima_duploComBerço_retornaTres() {
        int capacidade = CapacidadeHospedesRules.calcularMaxima(
                TipoQuarto.DUPLO,
                CapacidadeHospedesRules.ConfiguracaoCapacidade.duplo(true)
        );

        assertEquals(3, capacidade);
    }

    static Stream<Arguments> cenariosFamilia() {
        return Stream.of(
                Arguments.of(2, 0, 0, 2),
                Arguments.of(0, 1, 0, 2),
                Arguments.of(0, 0, 1, 2),
                Arguments.of(1, 1, 1, 5),
                Arguments.of(2, 2, 1, 8)
        );
    }

    @ParameterizedTest(name = "solteiro={0}, casal={1}, queen/king={2} -> {3} hóspedes")
    @MethodSource("cenariosFamilia")
    @DisplayName("Quarto família: capacidade conforme composição de camas")
    void calcularFamilia_composicaoDeCamas(int solteiro, int casal, int queenKing, int esperado) {
        assertEquals(esperado, CapacidadeHospedesRules.calcularFamilia(solteiro, casal, queenKing));
    }

    @Test
    @DisplayName("Quarto família sem camas é inválido")
    void validarConfiguracao_familiaSemCamas_lancaExcecao() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> CapacidadeHospedesRules.validarConfiguracao(
                        TipoQuarto.FAMILIA,
                        CapacidadeHospedesRules.ConfiguracaoCapacidade.familia(0, 0, 0)
                )
        );

        assertEquals("Quarto família deve ter ao menos 1 cama", ex.getMessage());
    }

    @Test
    @DisplayName("Número de hóspedes dentro do limite é aceito")
    void validarNumeroHospedes_dentroDoLimite_naoLancaExcecao() {
        CapacidadeHospedesRules.validarNumeroHospedes(2, 3);
    }

    @Test
    @DisplayName("Número de hóspedes no limite exato é aceito")
    void validarNumeroHospedes_noLimiteExato_naoLancaExcecao() {
        CapacidadeHospedesRules.validarNumeroHospedes(3, 3);
    }

    @Test
    @DisplayName("Número de hóspedes acima da capacidade é rejeitado")
    void validarNumeroHospedes_acimaDoLimite_lancaExcecao() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> CapacidadeHospedesRules.validarNumeroHospedes(4, 3)
        );

        assertEquals("Número de hóspedes (4) excede a capacidade máxima (3)", ex.getMessage());
    }

    @ParameterizedTest
    @ValueSource(ints = {0, -1})
    @DisplayName("Número de hóspedes zero ou negativo é rejeitado")
    void validarNumeroHospedes_naoPositivo_lancaExcecao(int numeroHospedes) {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> CapacidadeHospedesRules.validarNumeroHospedes(numeroHospedes, 3)
        );

        assertEquals("O número de hóspedes deve ser positivo", ex.getMessage());
    }

    @Test
    @DisplayName("Verificação de limite retorna true quando hóspedes cabem")
    void hospedesDentroDoLimite_quandoValido_retornaTrue() {
        assertTrue(CapacidadeHospedesRules.hospedesDentroDoLimite(2, 3));
        assertTrue(CapacidadeHospedesRules.hospedesDentroDoLimite(3, 3));
    }

    @Test
    @DisplayName("Verificação de limite retorna false quando excede ou é inválido")
    void hospedesDentroDoLimite_quandoInvalido_retornaFalse() {
        assertFalse(CapacidadeHospedesRules.hospedesDentroDoLimite(4, 3));
        assertFalse(CapacidadeHospedesRules.hospedesDentroDoLimite(0, 3));
        assertFalse(CapacidadeHospedesRules.hospedesDentroDoLimite(-1, 3));
    }

    @Test
    @DisplayName("Capacidade máxima integrada para quarto individual")
    void calcularMaxima_individual_usaNumeroDeCamas() {
        int capacidade = CapacidadeHospedesRules.calcularMaxima(
                TipoQuarto.INDIVIDUAL,
                CapacidadeHospedesRules.ConfiguracaoCapacidade.individual(2)
        );

        assertEquals(2, capacidade);
    }

    @Test
    @DisplayName("Capacidade máxima integrada para quarto família")
    void calcularMaxima_familia_usaComposicaoDeCamas() {
        int capacidade = CapacidadeHospedesRules.calcularMaxima(
                TipoQuarto.FAMILIA,
                CapacidadeHospedesRules.ConfiguracaoCapacidade.familia(1, 2, 0)
        );

        assertEquals(5, capacidade);
    }
}
