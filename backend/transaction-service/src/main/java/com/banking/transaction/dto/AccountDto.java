package com.banking.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for account data from account service.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {

    private UUID id;
    private String accountNumber;
    private UUID userId;
    private String accountType;
    private String status;
    private BigDecimal balance;
    private String currency;
    private BigDecimal availableBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 