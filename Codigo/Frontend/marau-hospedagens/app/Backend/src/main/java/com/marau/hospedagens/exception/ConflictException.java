package com.marau.hospedagens.exception;

/**
 * Lancada em conflitos de regra de negocio (ex: CPF ja cadastrado).
 * Resulta em HTTP 409.
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
