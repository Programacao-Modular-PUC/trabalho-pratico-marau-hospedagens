package com.marau.hospedagens.model.enums;

public enum StatusQuarto {
    DISPONIVEL("Disponivel"),
    OCUPADO("Ocupado");

    private final String label;

    StatusQuarto(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static StatusQuarto fromLabel(String value) {
        if (value == null) return DISPONIVEL;
        for (StatusQuarto s : values()) {
            if (s.name().equalsIgnoreCase(value) || s.label.equalsIgnoreCase(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status de quarto invalido: " + value);
    }
}
