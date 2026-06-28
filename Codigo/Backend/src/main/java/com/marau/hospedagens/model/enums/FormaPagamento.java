package com.marau.hospedagens.model.enums;

import java.text.Normalizer;

public enum FormaPagamento {
    DINHEIRO("Dinheiro"),
    CARTAO_CREDITO("Cartao de Credito"),
    CARTAO_DEBITO("Cartao de Debito"),
    PIX("PIX"),
    TRANSFERENCIA("Transferencia");

    private final String label;

    FormaPagamento(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * Resolve a forma de pagamento a partir do nome do enum ou do rótulo da tela.
     * A comparação ignora maiúsculas/minúsculas e acentos, então tanto
     * "Cartao de Credito" quanto "Cartão de Crédito" (enviado pelo select do
     * frontend) são aceitos. Valor nulo retorna DINHEIRO (padrão da tela).
     */
    public static FormaPagamento fromLabel(String value) {
        if (value == null || value.isBlank()) return DINHEIRO;
        String alvo = normalizar(value);
        for (FormaPagamento f : values()) {
            if (normalizar(f.name()).equals(alvo) || normalizar(f.label).equals(alvo)) {
                return f;
            }
        }
        throw new IllegalArgumentException("Forma de pagamento invalida: " + value);
    }

    private static String normalizar(String s) {
        String semAcento = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return semAcento.trim().toLowerCase();
    }
}
