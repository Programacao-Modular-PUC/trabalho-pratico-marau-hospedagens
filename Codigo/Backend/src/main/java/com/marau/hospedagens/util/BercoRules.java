package com.marau.hospedagens.util;

import com.marau.hospedagens.model.enums.TipoQuarto;

import java.math.BigDecimal;

/**
 * Regras de berço para quartos duplos.
 * <ul>
 *   <li>Berço só é permitido em quartos do tipo {@link TipoQuarto#DUPLO}.</li>
 *   <li>Quarto duplo sem berço: capacidade de 2 hóspedes.</li>
 *   <li>Quarto duplo com berço: capacidade de 3 (2 adultos + 1 berço).</li>
 *   <li>A taxa do berço é somada ao valor base quando informada.</li>
 * </ul>
 */
public final class BercoRules {

    private static final int CAPACIDADE_DUPLO_SEM_BERCO = 2;
    private static final int CAPACIDADE_DUPLO_COM_BERCO = 3;

    private BercoRules() {
    }

    public static boolean bercoPermitido(TipoQuarto tipo) {
        return tipo == TipoQuarto.DUPLO;
    }

    public static void validar(TipoQuarto tipo, boolean temBerco) {
        if (temBerco && !bercoPermitido(tipo)) {
            throw new IllegalArgumentException(
                    "Berço não é permitido em quartos do tipo " + tipo.getLabel()
            );
        }
    }

    public static int capacidadeDuplo(boolean temBerco) {
        return temBerco ? CAPACIDADE_DUPLO_COM_BERCO : CAPACIDADE_DUPLO_SEM_BERCO;
    }

    public static String descricaoCapacidadeDuplo(boolean temBerco) {
        return temBerco ? "2 adultos + 1 berço" : "2 hóspedes";
    }

    public static BigDecimal calcularTaxa(TipoQuarto tipo, boolean temBerco, BigDecimal valorBerco) {
        validar(tipo, temBerco);
        if (tipo == TipoQuarto.DUPLO && temBerco && valorBerco != null) {
            return valorBerco;
        }
        return BigDecimal.ZERO;
    }
}
