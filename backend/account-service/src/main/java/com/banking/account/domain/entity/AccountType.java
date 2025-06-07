package com.banking.account.domain.entity;

/**
 * Enumeration representing different types of bank accounts.
 */
public enum AccountType {
    CHECKING("Checking Account"),
    SAVINGS("Savings Account"),
    BUSINESS("Business Account"),
    JOINT("Joint Account"),
    STUDENT("Student Account"),
    PREMIUM("Premium Account");
    
    private final String displayName;
    
    AccountType(String displayName) {
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