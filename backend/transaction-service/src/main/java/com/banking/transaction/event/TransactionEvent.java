package com.banking.transaction.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Event class for transaction-related events published to Kafka.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEvent {
    
    private String eventType;
    private String transactionId;
    private String reference;
    private String type;
    private String status;
    private BigDecimal amount;
    private String currency;
    private String sourceAccountId;
    private String targetAccountId;
    private String description;
    private String externalReference;
    private String userId;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
} 