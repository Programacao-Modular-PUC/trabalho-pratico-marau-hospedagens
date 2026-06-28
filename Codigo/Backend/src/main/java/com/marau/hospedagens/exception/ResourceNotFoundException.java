package com.marau.hospedagens.exception;

/**
 * Lancada quando um recurso solicitado (cliente, quarto, etc.) nao existe.
 * Resulta em HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException of(String recurso, Object id) {
        return new ResourceNotFoundException(recurso + " nao encontrado(a) para o id: " + id);
    }
}
