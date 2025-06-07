package com.banking.account.dto;

import com.banking.account.domain.entity.AccountType;
import javax.validation.constraints.NotNull;
import java.util.UUID;

/**
 * Request DTO for creating a new bank account
 */
public class CreateAccountRequest {
    
    @NotNull(message = "User ID is required")
    private UUID userId;
    
    @NotNull(message = "Account type is required")
    private AccountType accountType;
    
    // Constructors
    public CreateAccountRequest() {}
    
    public CreateAccountRequest(UUID userId, AccountType accountType) {
        this.userId = userId;
        this.accountType = accountType;
    }
    
    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public AccountType getAccountType() {
        return accountType;
    }
    
    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
} 