package com.banking.account.client;

import com.banking.account.dto.CreateTransactionRequest;
import com.banking.account.dto.TransactionDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Client for communicating with the Transaction Service.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceClient {

    private final RestTemplate restTemplate;

    @Value("${transaction-service.url:http://localhost:8081}")
    private String transactionServiceUrl;

    /**
     * Creates a transaction record in the transaction service.
     */
    public TransactionDto createTransaction(CreateTransactionRequest request) {
        try {
            log.info("Creating transaction record: type={}, amount={}, account={}", 
                    request.getType(), request.getAmount(), request.getSourceAccountId());
            log.debug("Transaction service URL: {}", transactionServiceUrl);

            String url = transactionServiceUrl + "/api/transactions";
            log.debug("Making POST request to: {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<CreateTransactionRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<TransactionDto> response = restTemplate.postForEntity(url, entity, TransactionDto.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Transaction record created successfully: {}", response.getBody().getReference());
                return response.getBody();
            } else {
                log.error("Failed to create transaction record. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to create transaction record");
            }
            
        } catch (Exception e) {
            log.error("Error creating transaction record - URL: {}, Error: {}", 
                transactionServiceUrl + "/api/transactions", e.getMessage(), e);
            
            // Check if this is a connection error
            if (e.getMessage().contains("Connection refused") || e.getMessage().contains("ConnectException")) {
                log.error("Cannot connect to transaction service at {}. Is the service running?", transactionServiceUrl);
            }
            
            // Don't fail the main transaction if transaction service is down
            // This is a non-critical operation for logging purposes
            log.warn("Transaction service call failed, continuing without transaction record");
            return null;
        }
    }

    /**
     * Tests connectivity to the transaction service.
     */
    public boolean isTransactionServiceAvailable() {
        try {
            log.info("Testing connectivity to transaction service at: {}", transactionServiceUrl);
            
            // Try to make a simple GET request to check if service is up
            // Even if it returns 405, it means the service is reachable
            String url = transactionServiceUrl + "/api/transactions";
            restTemplate.getForEntity(url, String.class);
            
            return true;
        } catch (Exception e) {
            if (e.getMessage().contains("405")) {
                // Method not allowed is actually good - service is reachable
                log.info("Transaction service is reachable (got 405 Method Not Allowed as expected)");
                return true;
            }
            
            log.error("Transaction service is not available: {}", e.getMessage());
            return false;
        }
    }
} 