package com.marau.hospedagens.model.enums;

public enum TipoQuarto {
    INDIVIDUAL("Individual"),
    DUPLO("Duplo"),
    FAMILIA("Familia");

    private final String label;

    TipoQuarto(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static TipoQuarto fromLabel(String value) {
        if (value == null) return null;
        for (TipoQuarto t : values()) {
            if (t.name().equalsIgnoreCase(value) || t.label.equalsIgnoreCase(value)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo de quarto invalido: " + value);
    }
}
