package com.banking.account.domain.entity;

/**
 * Enumeration representing different statuses of bank accounts.
 */
public enum AccountStatus {
    PENDING("Pending Activation"),
    ACTIVE("Active"),
    SUSPENDED("Suspended"),
    CLOSED("Closed"),
    FROZEN("Frozen");
    
    private final String displayName;
    
    AccountStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
} 