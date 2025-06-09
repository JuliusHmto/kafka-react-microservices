package com.banking.transaction.domain.valueobject;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a transaction reference number.
 * Used for unique identification and tracking of transactions.
 */
@Embeddable
public class TransactionReference {
    
    @NotNull
    private String value;
    
    protected TransactionReference() {
        // JPA requires default constructor
    }
    
    public TransactionReference(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction reference cannot be null or empty");
        }
        this.value = value.trim();
    }
    
    public static TransactionReference generate() {
        return new TransactionReference("TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
    }
    
    public static TransactionReference of(String value) {
        return new TransactionReference(value);
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransactionReference that = (TransactionReference) o;
        return Objects.equals(value, that.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return value;
    }
} 