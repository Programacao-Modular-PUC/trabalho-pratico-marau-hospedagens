package com.marau.hospedagens.util;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

/**
 * Formatacao monetaria no padrao brasileiro (ex: R$ 1.234,56).
 */
public final class CurrencyUtil {

    private CurrencyUtil() {
    }

    private static DecimalFormat formatter() {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols();
        symbols.setGroupingSeparator('.');
        symbols.setDecimalSeparator(',');
        return new DecimalFormat("#,##0.00", symbols);
    }

    public static String formatBRL(BigDecimal value) {
        if (value == null) {
            value = BigDecimal.ZERO;
        }
        return "R$ " + formatter().format(value);
    }

    /** Versao com sufixo de diaria (ex: R$ 120,00/dia). */
    public static String formatBRLPorDia(BigDecimal value) {
        return formatBRL(value) + "/dia";
    }
}
