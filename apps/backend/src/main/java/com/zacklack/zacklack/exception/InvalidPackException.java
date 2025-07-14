package com.zacklack.zacklack.exception;

/**
 * Thrown when an uploaded resource pack ZIP is invalid (e.g., missing pack.mcmeta).
 */
public class InvalidPackException extends RuntimeException {
    public InvalidPackException(String message) {
        super(message);
    }
}
