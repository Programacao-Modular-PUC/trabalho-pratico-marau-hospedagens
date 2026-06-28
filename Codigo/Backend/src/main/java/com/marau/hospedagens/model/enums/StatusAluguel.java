package com.marau.hospedagens.model.enums;

public enum StatusAluguel {
    RESERVA("Reserva"),
    OCUPADO("Ocupado"),
    CONCLUIDO("Concluido");

    private final String label;

    StatusAluguel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static StatusAluguel fromLabel(String value) {
        if (value == null) return RESERVA;
        for (StatusAluguel s : values()) {
            if (s.name().equalsIgnoreCase(value) || s.label.equalsIgnoreCase(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status de aluguel invalido: " + value);
    }
}
