package com.banking.account.service;

import com.banking.account.event.AccountEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for publishing banking events to Kafka
 */
@Service
public class EventPublisherService {
    
    private static final Logger logger = LoggerFactory.getLogger(EventPublisherService.class);
    
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
    // Kafka topics
    private static final String ACCOUNT_EVENTS_TOPIC = "banking.account.events";
    private static final String TRANSACTION_EVENTS_TOPIC = "banking.transaction.events";
    private static final String FRAUD_DETECTION_TOPIC = "banking.fraud.detection";
    
    @Autowired
    public EventPublisherService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Publish account-related events
     */
    public void publishAccountEvent(AccountEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            
            kafkaTemplate.send(ACCOUNT_EVENTS_TOPIC, event.getAccountId().toString(), eventJson)
                    .addCallback(
                            result -> logger.info("Successfully published event: {} to topic: {}", 
                                    event.getEventType(), ACCOUNT_EVENTS_TOPIC),
                            failure -> logger.error("Failed to publish event: {} to topic: {}. Error: {}", 
                                    event.getEventType(), ACCOUNT_EVENTS_TOPIC, failure.getMessage())
                    );
            
            logger.info("Publishing event: {}", event);
            
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize event: {}", event, e);
        }
    }
    
    /**
     * Publish transaction events for fraud detection
     */
    public void publishTransactionForFraudDetection(AccountEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            
            kafkaTemplate.send(FRAUD_DETECTION_TOPIC, event.getAccountId().toString(), eventJson)
                    .addCallback(
                            result -> logger.info("Successfully sent transaction for fraud detection: {}", 
                                    event.getEventType()),
                            failure -> logger.error("Failed to send transaction for fraud detection: {}. Error: {}", 
                                    event.getEventType(), failure.getMessage())
                    );
            
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize transaction event for fraud detection: {}", event, e);
        }
    }
    
    /**
     * Publish to transaction events topic
     */
    public void publishTransactionEvent(AccountEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            
            kafkaTemplate.send(TRANSACTION_EVENTS_TOPIC, event.getAccountId().toString(), eventJson)
                    .addCallback(
                            result -> logger.info("Successfully published transaction event: {}", 
                                    event.getEventType()),
                            failure -> logger.error("Failed to publish transaction event: {}. Error: {}", 
                                    event.getEventType(), failure.getMessage())
                    );
            
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize transaction event: {}", event, e);
        }
    }
} 