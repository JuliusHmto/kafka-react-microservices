package com.banking.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for transaction responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {

    private UUID id;
    private String reference;
    private String type;
    private String status;
    private BigDecimal amount;
    private String currency;
    private UUID sourceAccountId;
    private UUID targetAccountId;
    private String description;
    private String externalReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime processedAt;
    private String failureReason;
} 