package com.marau.hospedagens.util;

import com.marau.hospedagens.exception.CapacidadeExcedidaException;
import com.marau.hospedagens.model.enums.TipoQuarto;

/**
 * Regras de capacidade máxima de hóspedes por tipo de quarto.
 * <ul>
 * <li>Individual: 1 hóspede por cama solteiro (mínimo 1 cama).</li>
 * <li>Duplo: 2 hóspedes, ou 3 com berço.</li>
 * <li>Família: solteiro = 1, casal/queen/king = 2 hóspedes por cama.</li>
 * </ul>
 */
public final class CapacidadeHospedesRules {

    private CapacidadeHospedesRules() {
    }

    public record ConfiguracaoCapacidade(
            int numCamas,
            boolean temBerco,
            int camasSolteiro,
            int camasCasal,
            int camasQueenKing) {

        public static ConfiguracaoCapacidade individual(
                int numCamas) {
            return new ConfiguracaoCapacidade(
                    numCamas,
                    false,
                    0,
                    0,
                    0);
        }

        public static ConfiguracaoCapacidade duplo(
                boolean temBerco) {
            return new ConfiguracaoCapacidade(
                    0,
                    temBerco,
                    0,
                    0,
                    0);
        }

        public static ConfiguracaoCapacidade familia(
                int camasSolteiro,
                int camasCasal,
                int camasQueenKing) {
            return new ConfiguracaoCapacidade(
                    0,
                    false,
                    camasSolteiro,
                    camasCasal,
                    camasQueenKing);
        }
    }

    public static int calcularMaxima(
            TipoQuarto tipo,
            ConfiguracaoCapacidade config) {

        return switch (tipo) {

            case INDIVIDUAL ->
                calcularIndividual(
                        config.numCamas());

            case DUPLO ->
                BercoRules.capacidadeDuplo(
                        config.temBerco());

            case FAMILIA ->
                calcularFamilia(
                        config.camasSolteiro(),
                        config.camasCasal(),
                        config.camasQueenKing());
        };
    }

    public static int calcularIndividual(
            int numCamas) {
        return Math.max(0, numCamas);
    }

    public static int calcularFamilia(
            int camasSolteiro,
            int camasCasal,
            int camasQueenKing) {

        return (camasSolteiro * 1)
                + (camasCasal * 2)
                + (camasQueenKing * 2);
    }

    public static void validarConfiguracao(
            TipoQuarto tipo,
            ConfiguracaoCapacidade config) {

        switch (tipo) {

            case INDIVIDUAL -> {

                if (config.numCamas() < 1) {
                    throw new CapacidadeExcedidaException(
                            "Quarto individual deve ter ao menos 1 cama");
                }
            }

            case DUPLO ->
                BercoRules.validar(
                        tipo,
                        config.temBerco());

            case FAMILIA -> {

                int capacidade = calcularFamilia(
                        config.camasSolteiro(),
                        config.camasCasal(),
                        config.camasQueenKing());

                if (capacidade <= 0) {

                    throw new CapacidadeExcedidaException(
                            "Quarto família deve ter ao menos 1 cama");
                }
            }
        }
    }

    public static void validarNumeroHospedes(
            int numeroHospedes,
            int capacidadeMaxima) {

        if (numeroHospedes <= 0) {

            throw new CapacidadeExcedidaException(
                    "O número de hóspedes deve ser positivo");
        }

        if (numeroHospedes > capacidadeMaxima) {

            throw new CapacidadeExcedidaException(
                    "Número de hóspedes (" +
                            numeroHospedes +
                            ") excede a capacidade máxima (" +
                            capacidadeMaxima +
                            ")");
        }
    }

    public static boolean hospedesDentroDoLimite(
            int numeroHospedes,
            int capacidadeMaxima) {

        return numeroHospedes > 0
                && numeroHospedes <= capacidadeMaxima;
    }
}