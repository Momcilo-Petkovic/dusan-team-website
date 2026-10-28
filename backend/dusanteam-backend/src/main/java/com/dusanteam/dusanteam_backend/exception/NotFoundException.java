package com.dusanteam.dusanteam_backend.exception;

/** Thrown when a requested record doesn't exist. Mapped to HTTP 404. */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
