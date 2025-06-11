package com.banking.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Request DTO for creating transactions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull(message = "Transaction type is required")
    @Size(min = 1, max = 50, message = "Transaction type must be between 1 and 50 characters")
    private String type;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String currency = "USD";

    @NotNull(message = "Source account ID is required")
    private UUID sourceAccountId;

    private UUID targetAccountId;

    @NotNull(message = "User ID is required")
    private UUID userId;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 100, message = "External reference cannot exceed 100 characters")
    private String externalReference;
} 