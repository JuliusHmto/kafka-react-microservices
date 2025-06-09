package com.banking.account.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

/**
 * Database configuration for proper UUID handling and batch processing
 */
@Configuration
@EnableTransactionManagement
public class DatabaseConfig {
    
    @PostConstruct
    public void init() {
        // Set default timezone to UTC for consistent timestamp handling
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
} 