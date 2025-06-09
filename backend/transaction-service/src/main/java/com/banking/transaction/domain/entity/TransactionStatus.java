package com.banking.transaction.domain.entity;

/**
 * Enumeration of transaction statuses.
 */
public enum TransactionStatus {
    PENDING("Pending"),
    PROCESSING("Processing"),
    COMPLETED("Completed"),
    FAILED("Failed"),
    CANCELLED("Cancelled"),
    REVERSED("Reversed");
    
    private final String displayName;
    
    TransactionStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isFinal() {
        return this == COMPLETED || this == FAILED || this == CANCELLED || this == REVERSED;
    }
    
    public boolean isSuccessful() {
        return this == COMPLETED;
    }
    
    public boolean canBeProcessed() {
        return this == PENDING;
    }
} 