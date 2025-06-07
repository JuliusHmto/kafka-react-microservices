package com.banking.account.event;

import com.banking.account.domain.entity.AccountType;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Event published when a new account is created
 */
public class AccountCreatedEvent extends AccountEvent {
    
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal initialBalance;
    private String currency;
    
    public AccountCreatedEvent() {
        super();
    }
    
    public AccountCreatedEvent(UUID accountId, UUID userId, String accountNumber, 
                              AccountType accountType, BigDecimal initialBalance, String currency) {
        super("ACCOUNT_CREATED", accountId, userId);
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
        this.currency = currency;
    }
    
    // Getters and Setters
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    public AccountType getAccountType() {
        return accountType;
    }
    
    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
    
    public BigDecimal getInitialBalance() {
        return initialBalance;
    }
    
    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    @Override
    public String toString() {
        return "AccountCreatedEvent{" +
                "accountNumber='" + accountNumber + '\'' +
                ", accountType=" + accountType +
                ", initialBalance=" + initialBalance +
                ", currency='" + currency + '\'' +
                "} " + super.toString();
    }
} 