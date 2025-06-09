package com.banking.transaction.service;

import com.banking.transaction.domain.entity.Transaction;
import com.banking.transaction.event.TransactionEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for publishing transaction-related events to Kafka.
 * Implements event-driven architecture patterns.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisherService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TRANSACTION_EVENTS_TOPIC = "transaction-events";

    /**
     * Publishes transaction created event.
     */
    public void publishTransactionCreated(Transaction transaction) {
        publishEvent("TRANSACTION_CREATED", transaction);
    }

    /**
     * Publishes transaction processing event.
     */
    public void publishTransactionProcessing(Transaction transaction) {
        publishEvent("TRANSACTION_PROCESSING", transaction);
    }

    /**
     * Publishes transaction completed event.
     */
    public void publishTransactionCompleted(Transaction transaction) {
        publishEvent("TRANSACTION_COMPLETED", transaction);
    }

    /**
     * Publishes transaction failed event.
     */
    public void publishTransactionFailed(Transaction transaction) {
        publishEvent("TRANSACTION_FAILED", transaction);
    }

    /**
     * Publishes transaction cancelled event.
     */
    public void publishTransactionCancelled(Transaction transaction) {
        publishEvent("TRANSACTION_CANCELLED", transaction);
    }

    /**
     * Publishes transaction reversed event.
     */
    public void publishTransactionReversed(Transaction transaction) {
        publishEvent("TRANSACTION_REVERSED", transaction);
    }

    private void publishEvent(String eventType, Transaction transaction) {
        try {
            TransactionEvent event = TransactionEvent.builder()
                    .eventType(eventType)
                    .transactionId(transaction.getId().toString())
                    .reference(transaction.getReference().getValue())
                    .type(transaction.getType().name())
                    .status(transaction.getStatus().name())
                    .amount(transaction.getAmount().getAmount())
                    .currency(transaction.getAmount().getCurrency())
                    .sourceAccountId(transaction.getSourceAccountId() != null ? transaction.getSourceAccountId().toString() : null)
                    .targetAccountId(transaction.getTargetAccountId() != null ? transaction.getTargetAccountId().toString() : null)
                    .description(transaction.getDescription())
                    .externalReference(transaction.getExternalReference())
                    .timestamp(transaction.getUpdatedAt())
                    .build();

            String eventJson = objectMapper.writeValueAsString(event);
            
            kafkaTemplate.send(TRANSACTION_EVENTS_TOPIC, transaction.getId().toString(), eventJson);
            
            log.info("Published event: {} for transaction: {}", eventType, transaction.getReference());
            
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize transaction event for transaction: {}", transaction.getId(), e);
        } catch (Exception e) {
            log.error("Failed to publish transaction event for transaction: {}", transaction.getId(), e);
        }
    }
} 