package com.marau.hospedagens.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Formatadores de data/hora usados nas telas e no recibo.
 */
public final class DateUtil {

    private DateUtil() {
    }

    /** Ex: 17/04 12:00  (usado nas tabelas de alugueis). */
    public static final DateTimeFormatter TABELA = DateTimeFormatter.ofPattern("dd/MM HH:mm");

    /** Ex: 17/04/2025  (data do recibo). */
    public static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /** Ex: 12:00  (hora do recibo). */
    public static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("HH:mm");

    /** Ex: 16/04/2025 as 08:45  (emissao do recibo). */
    public static final DateTimeFormatter EMISSAO = DateTimeFormatter.ofPattern("dd/MM/yyyy 'as' HH:mm");

    public static String tabela(LocalDateTime dt) {
        return dt == null ? "" : dt.format(TABELA);
    }

    public static String data(LocalDateTime dt) {
        return dt == null ? "" : dt.format(DATA);
    }

    public static String hora(LocalDateTime dt) {
        return dt == null ? "" : dt.format(HORA);
    }

    public static String emissao(LocalDateTime dt) {
        return dt == null ? "" : dt.format(EMISSAO);
    }
}
