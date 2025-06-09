package com.banking.transaction.domain.entity;

/**
 * Enumeration of transaction types supported by the system.
 */
public enum TransactionType {
    DEPOSIT("Deposit"),
    WITHDRAWAL("Withdrawal"),
    TRANSFER("Transfer"),
    PAYMENT("Payment"),
    REFUND("Refund"),
    FEE("Fee"),
    INTEREST("Interest"),
    ADJUSTMENT("Adjustment");
    
    private final String displayName;
    
    TransactionType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isDebit() {
        return this == WITHDRAWAL || this == TRANSFER || this == PAYMENT || this == FEE;
    }
    
    public boolean isCredit() {
        return this == DEPOSIT || this == REFUND || this == INTEREST;
    }
} 