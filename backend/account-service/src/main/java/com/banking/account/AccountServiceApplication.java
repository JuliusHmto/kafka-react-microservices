package com.banking.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main application class for the Banking Account Service.
 * 
 * This service demonstrates:
 * - Event-driven architecture with Kafka
 * - Domain-driven design principles
 * - CQRS pattern implementation
 * - Enterprise design patterns
 */
@SpringBootApplication
@EnableKafka
@EnableCaching
@EnableAsync
@EnableTransactionManagement
public class AccountServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }
} 