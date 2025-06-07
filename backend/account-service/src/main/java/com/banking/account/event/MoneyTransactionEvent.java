package com.banking.account.event;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Event published when money is deposited or withdrawn
 */
public class MoneyTransactionEvent extends AccountEvent {
    
    public enum TransactionType {
        DEPOSIT, WITHDRAWAL
    }
    
    private TransactionType transactionType;
    private BigDecimal amount;
    private String currency;
    private BigDecimal balanceAfter;
    private String description;
    
    public MoneyTransactionEvent() {
        super();
    }
    
    public MoneyTransactionEvent(UUID accountId, UUID userId, TransactionType transactionType,
                               BigDecimal amount, String currency, BigDecimal balanceAfter, String description) {
        super(transactionType == TransactionType.DEPOSIT ? "MONEY_DEPOSITED" : "MONEY_WITHDRAWN", accountId, userId);
        this.transactionType = transactionType;
        this.amount = amount;
        this.currency = currency;
        this.balanceAfter = balanceAfter;
        this.description = description;
    }
    
    // Getters and Setters
    public TransactionType getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }
    
    public void setBalanceAfter(BigDecimal balanceAfter) {
        this.balanceAfter = balanceAfter;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    @Override
    public String toString() {
        return "MoneyTransactionEvent{" +
                "transactionType=" + transactionType +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", balanceAfter=" + balanceAfter +
                ", description='" + description + '\'' +
                "} " + super.toString();
    }
} 